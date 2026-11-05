const express = require('express')
const router = express.Router()
const ProdutoController = require('../controller/ProdutosController')

router.get('/', ProdutoController.listarProdutos)
router.get('/estoque-baixo', ProdutoController.estoqueBaixo)
router.get('/movimentacoes', ProdutoController.listarMovimentacoesEstoque)
router.post('/:id/movimentacoes', ProdutoController.registrarAjusteEstoque)
router.get('/:id', ProdutoController.buscarProdutosId)
router.post('/', ProdutoController.cadastrarProduto)
router.put('/:id', ProdutoController.atualizarProduto)
router.delete('/:id', ProdutoController.deletarProduto)

module.exports = router