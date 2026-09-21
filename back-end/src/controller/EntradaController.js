const EntradaService = require('../services/EntradaService')

class EntradaController {
    async listarEntrada(req, res) {
        try {
            const resultado = await EntradaService.listarEntrada()
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarEntradaId(req, res) {
        try {
            const resultado = await EntradaService.buscarEntradaId(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async cadastrarEntrada (req, res) {
        try {
            const resultado = await EntradaService.cadastrarEntrada(req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async atualizarEntrada(req, res) {
        try {
            const resultado = await EntradaService.atualizarEntrada(req.params.id, req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async deletarEntrada(req, res) {
        try {
            const resultado = await EntradaService.deletarEntrada(req.params.id)
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

module.exports = new EntradaController()