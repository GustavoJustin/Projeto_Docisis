const express = require('express')
const router = express.Router()
const FornecedorController = require('../controller/FornecedorController')

router.get('/', FornecedorController.listarFornecedores)
router.get('/:id', FornecedorController.buscarFornecedorId)
router.post('/', FornecedorController.cadastrarFornecedor)
router.put('/:id', FornecedorController.atualizarFornecedor)
router.delete('/:id', FornecedorController.deletarFornecedor)

module.exports = router