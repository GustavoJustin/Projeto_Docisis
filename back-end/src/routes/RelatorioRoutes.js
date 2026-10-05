const express = require('express')
const router = express.Router()
const RelatorioController = require('../controller/RelatorioController')

// ⚠️ A rota /gerar deve obrigatoriamente vir ANTES de /:id
router.get('/gerar', RelatorioController.gerarRelatorio || RelatorioController.listarRelatorios)

router.get('/', RelatorioController.listarRelatorios)
router.get('/:id', RelatorioController.buscarRelatorioId)
router.post('/', RelatorioController.cadastrarRelatorio)
router.put('/:id', RelatorioController.atualizarRelatorio)
router.delete('/:id', RelatorioController.deletarRelatorio)

module.exports = router