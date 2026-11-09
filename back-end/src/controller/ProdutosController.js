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

    async estoqueBaixo(req, res) {
        try {
            const resultado = await (ProdutoService.estoqueBaixo 
                ? ProdutoService.estoqueBaixo() 
                : ProdutoService.buscarEstoqueBaixo 
                ? ProdutoService.buscarEstoqueBaixo() 
                : ProdutoService.listarProdutos())
                
            res.json(resultado)
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async listarMovimentacoesEstoque(req, res) {
        try {
            const resultado = await ProdutoService.listarMovimentacoesEstoque()
            res.json(resultado)
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
            })
        }
    }

    async registrarAjusteEstoque(req, res) {
        try {
            const resultado = await ProdutoService.registrarAjusteEstoque(
                req.params.id,
                req.body,
                req.funcionario,
            )
            res.status(201).json(resultado)
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || erro.message || "Erro interno no servidor",
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
            const resultado = await ProdutoService.cadastrarProduto(req.body, req.funcionario)
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
            const resultado = await ProdutoService.atualizarProduto(req.params.id, req.body, req.funcionario)
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
            const resultado = await ProdutoService.deletarProduto(req.params.id, req.funcionario)
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