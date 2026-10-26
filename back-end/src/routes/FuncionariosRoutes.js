const express = require('express')
const router = express.Router()
const FuncionariosController = require('../controller/FuncionariosController')
const exigirAdministrador = require('../middleware/roleMiddleware')

router.get('/', exigirAdministrador, FuncionariosController.listarFuncionarios)
router.get('/:id', exigirAdministrador, FuncionariosController.buscarFuncionarioId)
router.post('/', exigirAdministrador, FuncionariosController.cadastrarFuncionario)
router.put('/:id', exigirAdministrador, FuncionariosController.atualizarFuncionario)
router.delete('/:id', exigirAdministrador, FuncionariosController.deletarFuncionario)

module.exports = router