const ProdutoRepository = require('../repositories/ProdutosRepository')

class ProdutoService {
    async listarProdutos() {
        const produtos = await ProdutoRepository.listarProduto()

        return {
            sucesso: true,
            dados: produtos,
            total: produtos.length
        }
    }

    async buscarProdutosId(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const produto = await ProdutoRepository.buscarProdutoId(id)

        if(!produto) {
            throw {
                status: 404,
                mensagem: "Produto não encontrado"
            }
        }

        return {
            sucesso: true,
            dados: produto
        }
    }

    async cadastrarProduto(dados) {
        const {marca, nome_fornecedor, lote, tipo, validade} = dados

        if(!marca || !lote || !tipo) {
            throw {
                status: 400,
                mensagem: "Marca, lote e tipo são obrigatórios"
            }
        }

        if(validade != undefined && isNaN(Date.parse(validade))) {
            throw {
                status: 400,
                mensagem: "A validade deve ser uma data válida"
            }
        }

        const novoProduto = {
            marca: marca.trim(),
            nome_fornecedor: (nome_fornecedor || '').trim(),
            lote: lote.trim(),
            tipo: tipo.trim(),
            validade
        }

        const resultado = await ProdutoRepository.cadastrarProduto(novoProduto)

        return {
            sucesso: true,
            mensagem: "Sucesso ao cadastrar",
            resultado
        }
    }

    async atualizarProduto(id, dados) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const produto = await ProdutoRepository.buscarProdutoId(id)

        if(!produto) {
            throw {
                status: 404,
                mensagem: "Produto não encontrado"
            }
        }

        const produtoAtualizado = {}
        const {marca, nome_fornecedor, lote, tipo, validade} = dados

        if(marca !== undefined && marca.trim() != "") produtoAtualizado.marca = marca.trim()

        if(nome_fornecedor !== undefined && nome_fornecedor.trim() != "") produtoAtualizado.nome_fornecedor = nome_fornecedor.trim()

        if(lote !== undefined && lote.trim() != "") produtoAtualizado.lote = lote.trim()

        if(tipo !== undefined && tipo.trim() != "") produtoAtualizado.tipo = tipo.trim()

        if(validade != undefined) {
            if(isNaN(Date.parse(validade))) {
                throw {
                    status: 400,
                    mensagem: "A validade deve ser uma data válida"
                }
            }

            produtoAtualizado.validade = validade
        }

        if(Object.keys(produtoAtualizado).length == 0) {
            throw {
                status: 400,
                mensagem: "Nenhum dado válido enviado para a atualização"
            }
        }

        await ProdutoRepository.atualizarProduto(id, produtoAtualizado)

        return {
            sucesso: true,
            mensagem: "Produto atualizado"
        }
    }

    async deletarProduto(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const produto = await ProdutoRepository.buscarProdutoId(id)

        if(!produto) {
            throw {
                status: 404,
                mensagem: "Produto não encontrado"
            }
        }

        await ProdutoRepository.deletarProduto(id)

        return {
            sucesso: true,
            mensagem: "Produto apagado"
        }
    }
}

module.exports = new ProdutoService()