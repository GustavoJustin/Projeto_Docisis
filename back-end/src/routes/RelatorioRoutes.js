const express = require('express')
const router = express.Router()
const RelatorioController = require('../controller/RelatorioController')

router.get('/', RelatorioController.listarRelatorios)
router.get('/:id', RelatorioController.buscarRelatorioId)
router.post('/', RelatorioController.cadastrarRelatorio)
router.put('/:id', RelatorioController.atualizarRelatorio)
router.delete('/:id', RelatorioController.deletarRelatorio)

module.exports = router