const EstoqueRepository = require('../repositories/EstoqueRepository')

class EstoqueService {
    async listarEstoque() {
        const estoque = await EstoqueRepository.listarEstoque()

        return {
            sucesso: true,
            dados: estoque,
            total: estoque.length
        }
    }

    async buscarEstoqueId(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const estoque = await EstoqueRepository.buscarEstoqueId(id)

        if(!estoque) {
            throw { status: 404, mensagem: "Estoque não encontrado" }
        }

        return { sucesso: true, dados: estoque }
    }

    async cadastrarEstoque(dados) {
        const {id_produtos, id_mov_entrada, id_mov_saida, localizacao_fisica, quantidade} = dados

        if(!id_produtos || !localizacao_fisica || !quantidade) {
            throw { status: 400, mensagem: "id produto, localizacao fisica e quantidade são obrigatórios" }
        }

        if(typeof id_produtos != "number" || id_produtos <= 0) {
            throw { status: 400, mensagem: "id produtos deve ser um número positivo" }
        }

        if(typeof id_mov_entrada != "number" || id_mov_entrada <= 0) {
            throw { status: 400, mensagem: "id mov entrada deve ser um número positivo" }
        }

        if(typeof id_mov_saida != "number" || id_mov_saida <= 0) {
            throw { status: 400, mensagem: "id mov saida deve ser um número positivo" }
        }

        if(typeof quantidade != "number" || quantidade <= 0) {
            throw { status: 400, mensagem: "Quantidade deve ser um número positivo" }
        }

        const novoEstoque = {
            id_produtos,
            id_mov_entrada,
            id_mov_saida,
            localizacao_fisica: localizacao_fisica.trim(),
            quantidade
        }

        const resultado = await EstoqueRepository.cadastrarEstoque(novoEstoque)

        return { sucesso: true, mensagem: "Sucesso ao cadastrar", resultado }
    }

    async atualizarEstoque(id, dados) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const estoque = await EstoqueRepository.buscarEstoqueId(id)

        if(!estoque) {
            throw { status: 404, mensagem: "Estoque não encontrado" }
        }

        const estoqueAtualizado = {}
        const {id_produtos, id_mov_entrada, id_mov_saida, localizacao_fisica, quantidade} = dados

        if(id_produtos != undefined) {
            if(typeof id_produtos != "number" || id_produtos <= 0) {
                throw { status: 400, mensagem: "O id produtos deve ser um número positivo" }
            }
            estoqueAtualizado.id_produtos = id_produtos
        }

        if(id_mov_entrada != undefined) {
            if(typeof id_mov_entrada != "number" || id_mov_entrada <= 0) {
                throw { status: 400, mensagem: "O id mov entrada deve ser um número positivo" }
            }
            estoqueAtualizado.id_mov_entrada = id_mov_entrada
        }

        if(id_mov_saida != undefined) {
            if(typeof id_mov_saida != "number" || id_mov_saida <= 0) {
                throw { status: 400, mensagem: "O id mov saida deve ser um número positivo" }
            }
            estoqueAtualizado.id_mov_saida = id_mov_saida
        }

        if(localizacao_fisica !== undefined && localizacao_fisica.trim() != "") estoqueAtualizado.localizacao_fisica = localizacao_fisica.trim()

        if(quantidade != undefined) {
            if(typeof quantidade != "number" || quantidade <= 0) {
                throw { status: 400, mensagem: "A quantidade deve ser um número positivo" }
            }
            estoqueAtualizado.quantidade = quantidade
        }

        if(Object.keys(estoqueAtualizado).length == 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para a atualização" }
        }

        await EstoqueRepository.atualizarEstoque(id, estoqueAtualizado)

        return { sucesso: true, mensagem: "Estoque atualizado" }
    }

    async deletarEstoque(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const estoque = await EstoqueRepository.buscarEstoqueId(id)

        if(!estoque) {
            throw { status: 404, mensagem: "Estoque não encontrado" }
        }

        await EstoqueRepository.deletarEstoque(id)

        return { sucesso: true, mensagem: "Estoque apagado" }
    }
}

module.exports = new EstoqueService()