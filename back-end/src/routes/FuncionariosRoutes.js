const express = require('express')
const router = express.Router()
const FuncionariosController = require('../controller/FuncionariosController')

router.get('/', FuncionariosController.listarFuncionarios)
router.get('/:id', FuncionariosController.buscarFuncionarioId)
router.post('/', FuncionariosController.cadastrarFuncionario)
router.put('/:id', FuncionariosController.atualizarFuncionario)
router.delete('/:id', FuncionariosController.deletarFuncionario)

module.exports = router