const PedidoService = require('../services/PedidoService')
 
class PedidoController {
    async listarPedido(req, res) {
        try {
            const resultado = await PedidoService.listarPedido()
            res.json(resultado)
 
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarPedidoId(req, res) {
        try {
            const resultado = await PedidoService.buscarPedidoPorId(req.params.id);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            });
        }
    }

    async cadastrarPedido(req, res) {
        try {
            console.log(req.body);
            console.log(req.file); // Para você ver a imagem chegando no terminal

            const dadosPedido= {
                ...req.body,
                imagem: req.file ? req.file.filename : null // Salva o nome do arquivo se ele existir
            };

            const resultado = await PedidoService.cadastrarPedido(dadosPedido);
            res.status(201).json(resultado);
        } catch (erro) {
            console.error("Erro ao cadastrar pedido:", erro);
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || erro.message || "Erro ao cadastrar pedido",
                erro: erro.stack
            });
        }
    }



    async atualizarPedido(req, res) {
        try {
            const resultado = await PedidoService.atualizarPedido(req.params.id, req.body);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            });
        }
    }

    async deletarPedido(req, res) {
        try {
            const resultado = await PedidoService.deletarPedido(req.params.id);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            });
        }
    }
}
 

module.exports = new PedidoController()