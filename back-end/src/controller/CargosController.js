const CargosService = require('../services/CargosService')

class CargosController {
    async listarCargos(req, res) {
        try {
            const resultado = await CargosService.listarCargo()
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarCargoId(req, res) {
        try {
            const resultado = await CargosService.buscarCargoId(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async cadastrarCargo(req, res) {
        try {
            const resultado = await CargosService.cadastrarCargo(req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async atualizarCargo(req, res) {
        try {
            const resultado = await CargosService.atualizarCargo(req.params.id, req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json ({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async deletarCargo(req, res) {
        try {
            const resultado = await CargosService.deletarCargo(req.params.id)
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

module.exports = new CargosController()