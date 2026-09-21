const express = require('express')
const router = express.Router()
const PedidoController = require ('../controller/PedidoController')

router.get('/', PedidoController.listarPedidos)
router.get('/:id', PedidoController.buscarPedidoId)
router.post('/', PedidoController.cadastrarPedido)
router.put('/:id', PedidoController.atualizarPedido)
router.delete('/:id', PedidoController.deletarPedido)

module.exports = router