const PedidoRepository = require('../repositories/PedidoRepository')

class PedidoService {
    async listarPedido() {
        const pedidos = await PedidoRepository.listarPedido()

        return {
            sucesso: true,
            dados: pedidos,
            total: pedidos.length
        }
    }

    async buscarPedidoId(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const pedido = await PedidoRepository.buscarPedidoId(id)

        if(!pedido) {
            throw { status: 404, mensagem: "Pedido não encontrado" }
        }

        return { sucesso: true, dados: pedido }
    }

    async cadastrarPedido(dados) {
        const {nome, produto} = dados

        if(!nome || !produto) {
            throw { status: 400, mensagem: "Nome e produto são obrigatórios" }
        }

        const novoPedido = {
            nome: nome.trim(),
            produto: produto.trim(),
        }

        const resultado = await PedidoRepository.cadastrarPedido(novoPedido)

        return { sucesso: true, mensagem: "Sucesso ao cadastrar", resultado }
    }

    async atualizarPedido(id, dados) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const pedido = await PedidoRepository.buscarPedidoId(id)

        if(!pedido) {
            throw { status: 404, mensagem: "Pedido não encontrado" }
        }

        const pedidoAtualizado = {}
        const {nome, produto} = dados

        if(nome !== undefined && nome.trim() != "") pedidoAtualizado.nome = nome.trim()

        if(produto !== undefined && produto.trim() != "") pedidoAtualizado.produto = produto.trim()

        if(Object.keys(pedidoAtualizado).length == 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para a atualização" }
        }

        await PedidoRepository.atualizarPedido(id, pedidoAtualizado)

        return { sucesso: true, mensagem: "Pedido atualizado" }
    }

    async deletarPedido(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const pedido = await PedidoRepository.buscarPedidoId(id)

        if(!pedido) {
            throw { status: 404, mensagem: "Pedido não encontrado" }
        }

        await PedidoRepository.deletarPedido(id)

        return { sucesso: true, mensagem: "Pedido apagado" }
    }
}

module.exports = new PedidoService()