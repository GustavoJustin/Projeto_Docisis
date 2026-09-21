const express = require('express')
const router = express.Router()
const EstoqueController = require('../controller/EstoqueController')

router.get('/', EstoqueController.listarEstoques)
router.get('/:id', EstoqueController.buscarEstoqueId)
router.post('/', EstoqueController.cadastrarEstoque)
router.put('/:id', EstoqueController.atualizarEstoque)
router.delete('/:id', EstoqueController.deletarEstoque)

module.exports = router