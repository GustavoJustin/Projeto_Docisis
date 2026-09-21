const FornecedorService = require('../services/FornecedorService')

class FornecedoresController {
    async listarFornecedores(req, res) {
        try {
            const resultado = await FornecedorService.listarFornecedor()
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarFornecedorId(req, res) {
        try {
            const resultado = await FornecedorService.buscarFornecedorId(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async cadastrarFornecedor(req, res) {
        try {
            const resultado = await FornecedorService.cadastrarFornecedor(req.body)
            res.status(201).json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async atualizarFornecedor(req, res) {
        try {
            const resultado = await FornecedorService.atualizarFornecedor(req.params.id, req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async deletarFornecedor(req, res) {
        try {
            const resultado = await FornecedorService.deletarFornecedor(req.params.id)
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

module.exports = new FornecedoresController()