const PedidoService = require('../services/PedidoService')

class PedidoController {
    async listarPedidos(req, res) {
        try {
            const resultado = await PedidoService.listarProduto()
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarPedidoId(req, res) {
        try {
            const resultado = await PedidoService.buscarPedidoId(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async cadastrarPedido(req, res) {
        try {
            const resultado = await PedidoService.cadastrarPedido(req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async atualizarPedido(req, res) {
        try {
            const resultado = await PedidoService.atualizarPedido(req.params.id, req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async deletarPedido(req, res) {
        try {
            const resultado = await PedidoService.deletarPedido(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }
}

module.exports = new PedidoController()