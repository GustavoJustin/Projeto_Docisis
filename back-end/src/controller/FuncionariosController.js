const FuncionarioService = require('../services/FuncionarioService')

class FuncionariosController {
    async listarFuncionarios(req, res) {
        try {
            const resultado = await FuncionarioService.listarFuncionario()
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarFuncionarioId(req, res) {
        try {
            const resultado = await FuncionarioService.buscarFuncionarioId(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async cadastrarFuncionario(req, res) {
        try {
            const resultado = await FuncionarioService.cadastrarFuncionario(req.body)
            res.status(201).json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async atualizarFuncionario(req, res) {
        try {
            const resultado = await FuncionarioService.atualizarFuncionario(req.params.id, req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async deletarFuncionario(req, res) {
        try {
            const resultado = await FuncionarioService.deletarFuncionario(req.params.id)
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

module.exports = new FuncionariosController()