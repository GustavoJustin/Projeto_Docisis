const express = require('express')
const router = express.Router()
const NotaFiscalController = require('../controller/NotaFiscalController')

router.get('/', NotaFiscalController.listarNotaFiscal)
router.get('/:id', NotaFiscalController.buscarNotaFiscalId)
router.post('/', NotaFiscalController.cadastrarNotaFiscal)
router.put('/:id', NotaFiscalController.atualizarNotaFiscal)
router.delete('/:id', NotaFiscalController.deletarNotaFiscal)

module.exports = router