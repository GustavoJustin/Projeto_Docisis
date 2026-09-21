const ProdutoService = require('../services/ProdutosService')

class ProdutosController {
    async listarProdutos(req, res) {
        try {
            const resultado = await ProdutoService.listarProdutos()
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarProdutosId(req, res) {
        try {
            const resultado = await ProdutoService.buscarProdutosId(req.params.id)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async cadastrarProduto(req, res) {
        try {
            const resultado = await ProdutoService.cadastrarProduto(req.body)
            res.status(201).json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async atualizarProduto(req, res) {
        try {
            const resultado = await ProdutoService.atualizarProduto(req.params.id, req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }

    async deletarProduto(req, res) {
        try {
            const resultado = await ProdutoService.deletarProduto(req.params.id)
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

module.exports = new ProdutosController()