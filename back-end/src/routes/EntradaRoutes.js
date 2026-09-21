const express = require('express')
const router = express.Router()
const EntradaController = require('../controller/EntradaController')

router.get('/', EntradaController.listarEntrada)
router.get('/:id', EntradaController.buscarEntradaId)
router.post('/', EntradaController.cadastrarEntrada)
router.put('/:id', EntradaController.atualizarEntrada)
router.delete('/:id', EntradaController.deletarEntrada)

module.exports = router