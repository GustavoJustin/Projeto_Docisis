const RelatorioService = require('../services/RelatorioService')

class RelatorioController {
    async listarRelatorios(req, res) {
        try {
            const resultado = await RelatorioService.listarRelatorios()
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarRelatorioId(req, res) {
        try {
            const resultado = await RelatorioService.buscarRelatorioId(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async cadastrarRelatorio(req, res) {
        try {
            const resultado = await RelatorioService.cadastrarRelatorio(req.body)
            res.status(201).json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async atualizarRelatorio(req, res) {
        try {
            const resultado = await RelatorioService.atualizarRelatorio(req.params.id, req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async deletarRelatorio(req, res) {
        try {
            const resultado = await RelatorioService.deletarRelatorio(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }
}

module.exports = new RelatorioController()