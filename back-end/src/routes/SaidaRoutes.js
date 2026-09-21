const express = require('express')
const router = express.Router()
const SaidaController = require('../controller/SaidaController')

router.get('/', SaidaController.listarSaidas)
router.get('/:id', SaidaController.buscarSaidaId)
router.post('/', SaidaController.cadastrarSaida)
router.put('/:id', SaidaController.atualizarSaida)
router.delete('/:id', SaidaController.deletarSaida)

module.exports = router
