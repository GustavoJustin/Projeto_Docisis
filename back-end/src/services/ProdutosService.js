const ProdutoRepository = require('../repositories/ProdutosRepository')

function dataSomente(data) {
    if (!data) return ''
    if (data instanceof Date) return data.toISOString().slice(0, 10)
    return String(data).slice(0, 10)
}

function paraEstoque(produto) {
    return {
        ...produto,
        id: produto.id_produtos,
        nome: produto.nome_insumo || produto.marca || produto.tipo,
        categoria: produto.categoria || produto.tipo || 'Outros',
        descricao: produto.descricao || produto.categoria || produto.tipo || '',
        preco: produto.preco || '',
        quantidade: Number(produto.quantidade) || 0,
        maximo: Number(produto.estoque_maximo) || 1,
        unidade: produto.unidade || 'un',
        imagem: produto.imagem || '',
        chegada: dataSomente(produto.data_chegada),
        validade: dataSomente(produto.validade),
    }
}

function validarData(data, campo) {
    if (data === undefined || data === null || data === '') return null
    const dataTexto = String(data)
    const dataParseada = new Date(`${dataTexto}T00:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataTexto) ||
        Number.isNaN(dataParseada.getTime()) ||
        dataParseada.toISOString().slice(0, 10) !== dataTexto) {
        throw { status: 400, mensagem: `A data de ${campo} deve ser válida.` }
    }
    return data
}

function validarQuantidade(valor, campo, minimo = 0) {
    const quantidade = Number(valor)
    if (!Number.isInteger(quantidade) || quantidade < minimo) {
        throw { status: 400, mensagem: `${campo} deve ser um número inteiro maior ou igual a ${minimo}.` }
    }
    return quantidade
}

function validarUrlImagem(imagem) {
    if (imagem === undefined || imagem === null || imagem === '') return null
    if (typeof imagem !== 'string' || imagem.length > 1_500_000) {
        throw { status: 400, mensagem: 'A URL da imagem é inválida ou muito longa.' }
    }
    const dataUrl = imagem.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/i)
    if (dataUrl) {
        const conteudoBase64 = dataUrl[2]
        if (conteudoBase64.length % 4 === 1) {
            throw { status: 400, mensagem: 'O arquivo da imagem está inválido.' }
        }
        return imagem
    }
    let url
    try {
        url = new URL(imagem)
    } catch {
        throw { status: 400, mensagem: 'Informe uma URL válida para a imagem.' }
    }
    if (!['http:', 'https:'].includes(url.protocol)) {
        throw { status: 400, mensagem: 'A imagem deve usar uma URL HTTP ou HTTPS.' }
    }
    return imagem
}

class ProdutoService {
    async listarProdutos() {
        const produtos = await ProdutoRepository.listarProduto()

        return {
            sucesso: true,
            dados: produtos.map(paraEstoque),
            total: produtos.length
        }
    }

    async buscarProdutosId(id) {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const produto = await ProdutoRepository.buscarProdutoId(id)
        if (!produto) {
            throw { status: 404, mensagem: "Produto não encontrado" }
        }

        return { sucesso: true, dados: paraEstoque(produto) }
    }

    async cadastrarProduto(dados) {
        const { nome, categoria, descricao, unidade, quantidade, maximo, preco, imagem, chegada, validade } = dados

        const cadastroEstoque =
            categoria !== undefined ||
            maximo !== undefined ||
            unidade !== undefined ||
            imagem !== undefined ||
            preco !== undefined ||
            chegada !== undefined ||
            descricao !== undefined

        if (cadastroEstoque) {
            const nomeNormalizado = String(nome || '').trim()
            const categoriaNormalizada = String(categoria || '').trim()
            const unidadeNormalizada = String(unidade || 'un').trim()
            if (!nomeNormalizado || !categoriaNormalizada) {
                throw { status: 400, mensagem: "Nome e categoria são obrigatórios." }
            }
            if (nomeNormalizado.length > 200 || categoriaNormalizada.length > 100 ||
                unidadeNormalizada.length > 10) {
                throw { status: 400, mensagem: "Um ou mais campos excedem o tamanho permitido." }
            }
            const quantidadeAtual = validarQuantidade(quantidade, 'A quantidade')
            const quantidadeMaxima = validarQuantidade(maximo, 'O estoque máximo', 0.01)
            if (quantidadeAtual > quantidadeMaxima) {
                throw { status: 400, mensagem: 'A quantidade atual não pode ultrapassar o estoque máximo.' }
            }
            const dataChegada = validarData(chegada, 'chegada')
            const dataValidade = validarData(validade, 'validade')
            const imagemNormalizada = validarUrlImagem(imagem)
            const lote = `EST-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`.slice(0, 30)

            const produto = {
                marca: nomeNormalizado.slice(0, 100),
                lote,
                tipo: categoriaNormalizada,
                validade: dataValidade,
                nome_insumo: nomeNormalizado,
                categoria: categoriaNormalizada,
                descricao: String(descricao || '').trim().slice(0, 1000) || null,
                preco: String(preco || '').trim().slice(0, 50) || null,
                quantidade: quantidadeAtual,
                estoque_maximo: quantidadeMaxima,
                unidade: unidadeNormalizada,
                imagem: imagemNormalizada,
                data_chegada: dataChegada,
            }
            const resultado = await ProdutoRepository.cadastrarProduto(produto)
            return { sucesso: true, mensagem: "Produto cadastrado.", resultado }
        }

        const { marca, id_fornecedor, lote, tipo } = dados
        if (!marca || !lote || !tipo) {
            throw { status: 400, mensagem: "Marca, lote e tipo são obrigatórios" }
        }

        const validadeNormalizada = validarData(validade, 'validade')
        const produtoLegado = {
            marca: String(marca).trim(),
            lote: String(lote).trim(),
            tipo: String(tipo).trim(),
            validade: validadeNormalizada,
        }
        if (id_fornecedor !== undefined && id_fornecedor !== null && id_fornecedor !== '') {
            produtoLegado.id_fornecedor = Number(id_fornecedor)
        }

        const resultado = await ProdutoRepository.cadastrarProduto(produtoLegado)
        return { sucesso: true, mensagem: "Sucesso ao cadastrar", resultado }
    }

    async atualizarProduto(id, dados) {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const produto = await ProdutoRepository.buscarProdutoId(id)
        if (!produto) {
            throw { status: 404, mensagem: "Produto não encontrado" }
        }

        const atualizado = {}
        const camposTexto = [
            ['nome', 'nome_insumo', 200],
            ['categoria', 'categoria', 100],
            ['unidade', 'unidade', 10],
            ['preco', 'preco', 50],
            ['marca', 'marca', 100],
            ['lote', 'lote', 30],
            ['tipo', 'tipo', 100],
        ]
        for (const [entrada, coluna, limite] of camposTexto) {
            if (dados[entrada] === undefined) continue
            const valor = String(dados[entrada]).trim()
            if (!valor || valor.length > limite) {
                throw { status: 400, mensagem: `O campo ${entrada} é inválido.` }
            }
            atualizado[coluna] = valor
        }

        if (dados.quantidade !== undefined) {
            atualizado.quantidade = validarQuantidade(dados.quantidade, 'A quantidade')
        }
        if (dados.maximo !== undefined) {
            atualizado.estoque_maximo = validarQuantidade(dados.maximo, 'O estoque máximo', 0.01)
        }
        if (dados.descricao !== undefined) {
            const descricao = String(dados.descricao).trim()
            if (descricao.length > 1000) {
                throw { status: 400, mensagem: 'A descrição deve ter no máximo 1000 caracteres.' }
            }
            atualizado.descricao = descricao || null
        }
        const quantidadeAtualizada = atualizado.quantidade ?? (Number(produto.quantidade) || 0)
        const estoqueMaximo = atualizado.estoque_maximo ?? (Number(produto.estoque_maximo) || 0)
        if (quantidadeAtualizada > estoqueMaximo) {
            throw { status: 400, mensagem: `A quantidade não pode ultrapassar o máximo de ${estoqueMaximo} ${produto.unidade || 'un'}.` }
        }
        if (dados.validade !== undefined) {
            atualizado.validade = validarData(dados.validade, 'validade')
        }
        if (dados.chegada !== undefined) {
            atualizado.data_chegada = validarData(dados.chegada, 'chegada')
        }
        if (dados.imagem !== undefined) {
            atualizado.imagem = validarUrlImagem(dados.imagem)
        }

        if (Object.keys(atualizado).length === 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para a atualização" }
        }

        await ProdutoRepository.atualizarProduto(id, atualizado)
        return { sucesso: true, mensagem: "Produto atualizado" }
    }

    async listarMovimentacoesEstoque() {
        const movimentacoes = await ProdutoRepository.listarMovimentacoesEstoque()
        return {
            sucesso: true,
            dados: movimentacoes.map((movimentacao) => ({
                ...movimentacao,
                id_produtos: Number(movimentacao.id_produtos),
                quantidade_anterior: Number(movimentacao.quantidade_anterior),
                quantidade_nova: Number(movimentacao.quantidade_nova),
                quantidade: Number(movimentacao.quantidade),
            })),
            total: movimentacoes.length,
        }
    }

    async registrarAjusteEstoque(id, dados, funcionario) {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw { status: 400, mensagem: "Id inválido" }
        }
        const variacao = Number(dados.variacao)
        const maximo = dados.maximo === undefined
            ? undefined
            : validarQuantidade(dados.maximo, 'O estoque máximo', 1)
        if (!Number.isInteger(variacao) || (variacao === 0 && maximo === undefined)) {
            throw { status: 400, mensagem: 'A alteração da quantidade e o limite máximo devem ser números inteiros.' }
        }
        const descricao = String(dados.descricao || '').trim()
        if (descricao.length > 500) {
            throw { status: 400, mensagem: 'A descrição da movimentação deve ter no máximo 500 caracteres.' }
        }
        const resultado = await ProdutoRepository.registrarAjusteEstoque(
            Number(id),
            variacao,
            descricao,
            funcionario?.nome || funcionario?.email || 'Sistema',
            maximo,
        )
        return { sucesso: true, mensagem: 'Estoque atualizado.', dados: resultado }
    }

    async deletarProduto(id) {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const produto = await ProdutoRepository.buscarProdutoId(id)
        if (!produto) {
            throw { status: 404, mensagem: "Produto não encontrado" }
        }

        await ProdutoRepository.deletarProduto(id)
        return { sucesso: true, mensagem: "Produto apagado" }
    }
}

module.exports = new ProdutoService()
