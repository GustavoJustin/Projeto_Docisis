const NotaFiscalService = require('../services/NotaFiscalService')
 
class NotaFiscalController {
    async listarNotaFiscal(req, res) {
        try {
            const resultado = await NotaFiscalService.listarNotaFiscal()
            res.json(resultado)
 
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno no servidor",
                erro: erro.stack || erro
            })
        }
    }

    async buscarNotaFiscalId(req, res) {
        try {
            const resultado = await NotaFiscalService.buscarNotaFiscalId(req.params.id);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            });
        }
    }

    async cadastrarNotaFiscal(req, res) {
        try {
            console.log(req.body);
            console.log(req.file); // Para você ver a imagem chegando no terminal

            const dadosNotaFiscal= {
                ...req.body,
                imagem: req.file ? req.file.filename : null // Salva o nome do arquivo se ele existir
            };

            const resultado = await NotaFiscalService.cadastrarNotaFiscal(dadosNotaFiscal);
            res.status(201).json(resultado);
        } catch (erro) {
            console.error("Erro ao cadastrar Nota Fiscal:", erro);
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || erro.message || "Erro ao cadastrar Nota Fiscal",
                erro: erro.stack
            });
        }
    }



    async atualizarNotaFiscal(req, res) {
        try {
            const resultado = await NotaFiscalService.atualizarNotaFiscal(req.params.id, req.body);
            res.json(resultado);
        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            });
        }
    }

    async deletarNotaFiscal(req, res) {
        try {
            const resultado = await NotaFiscalService.deletarNotaFiscal(req.params.id);
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
 

module.exports = new NotaFiscalController()