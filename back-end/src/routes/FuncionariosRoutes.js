const express = require('express')
const router = express.Router()
const FuncionariosController = require('../controller/FuncionariosController')
const exigirAdministrador = require('../middleware/roleMiddleware')
const exigirPermissaoCriarFuncionarios = require('../middleware/employeeCreationPermissionMiddleware')
const exigirPermissaoExcluirFuncionarios = require('../middleware/employeeDeletionPermissionMiddleware')

router.get('/', exigirAdministrador, FuncionariosController.listarFuncionarios)
router.patch('/perfil', FuncionariosController.atualizarPerfil)
router.put('/perfil/foto', FuncionariosController.atualizarFotoPerfil)
router.get('/:id', exigirAdministrador, FuncionariosController.buscarFuncionarioId)
router.post('/', exigirAdministrador, exigirPermissaoCriarFuncionarios, FuncionariosController.cadastrarFuncionario)
router.patch('/:id/senha', exigirAdministrador, FuncionariosController.redefinirSenha)
router.put('/:id', exigirAdministrador, FuncionariosController.atualizarFuncionario)
router.delete('/:id', exigirAdministrador, exigirPermissaoExcluirFuncionarios, FuncionariosController.deletarFuncionario)

module.exports = router