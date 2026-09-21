const NotaFiscalRepository = require('../repositories/NotaFiscalRepository')

class NotaFiscalService {
    async listarNotaFiscal() {
        const notafiscal = await NotaFiscalRepository.listarNotaFiscal()

        return {
            sucesso: true,
            dados: notafiscal,
            total: notafiscal.length
        }
    }

    async buscarNotaFiscalId(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const notafiscal = await NotaFiscalRepository.buscarNotaFiscalId(id)

        if(!notafiscal) {
            throw { status: 404, mensagem: "Nota fiscal não encontrada" }
        }

        return { sucesso: true, dados: notafiscal }
    }

    async cadastrarNotaFiscal(dados) {
        const {id_fornecedor, destinatario, remetente, servico, total, imposto} = dados

        if(!id_fornecedor || !destinatario || !remetente || !servico || !total || !imposto) {
            throw { status: 400, mensagem: "Id fornecedor, destinatario, remetente, servico, total e imposto são obrigatórios" }
        }

        if(typeof id_fornecedor != "number" || id_fornecedor <= 0) {
            throw { status: 400, mensagem: "id fornecedor deve ser um número positivo" }
        }

        if(typeof total != "number" || total <= 0) {
            throw { status: 400, mensagem: "Total deve ser um número positivo" }
        }

        if(typeof imposto != "number" || imposto <= 0) {
            throw { status: 400, mensagem: "Imposto deve ser um número positivo" }
        }

        const novaNotaFiscal = {
            id_fornecedor,
            destinatario: destinatario.trim(),
            remetente: remetente.trim(),
            servico: servico.trim(),
            total,
            imposto
        }

        const resultado = await NotaFiscalRepository.cadastrarNotaFiscal(novaNotaFiscal)

        return { sucesso: true, mensagem: "Sucesso ao cadastrar", resultado }
    }

    async atualizarNotaFiscal(id, dados) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const notafiscal = await NotaFiscalRepository.buscarNotaFiscalId(id)

        if(!notafiscal) {
            throw { status: 404, mensagem: "Nota fiscal não encontrada" }
        }

        const notafiscalAtualizado = {}
        const {id_fornecedor, destinatario, remetente, servico, total, imposto} = dados

        if(id_fornecedor != undefined) {
            if(typeof id_fornecedor != "number" || id_fornecedor <= 0) {
                throw { status: 400, mensagem: "O id fornecedor deve ser um número positivo" }
            }
            notafiscalAtualizado.id_fornecedor = id_fornecedor
        }

        if(destinatario !== undefined && destinatario.trim() != "") notafiscalAtualizado.destinatario = destinatario.trim()

        if(remetente !== undefined && remetente.trim() != "") notafiscalAtualizado.remetente = remetente.trim()

        if(servico !== undefined && servico.trim() != "") notafiscalAtualizado.servico = servico.trim()

        if(total != undefined) {
            if(typeof total != "number" || total <= 0) {
                throw { status: 400, mensagem: "O total deve ser um número positivo" }
            }
            notafiscalAtualizado.total = total
        }

        if(imposto != undefined) {
            if(typeof imposto != "number" || imposto <= 0) {
                throw { status: 400, mensagem: "O imposto deve ser um número positivo" }
            }
            notafiscalAtualizado.imposto = imposto
        }

        if(Object.keys(notafiscalAtualizado).length == 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para a atualização" }
        }

        await NotaFiscalRepository.atualizarNotaFiscal(id, notafiscalAtualizado)

        return { sucesso: true, mensagem: "Nota fiscal atualizada" }
    }

    async deletarNotaFiscal(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const notafiscal = await NotaFiscalRepository.buscarNotaFiscalId(id)

        if(!notafiscal) {
            throw { status: 404, mensagem: "Nota fiscal não encontrada" }
        }

        await NotaFiscalRepository.deletarNotaFiscal(id)

        return { sucesso: true, mensagem: "Nota fiscal apagada" }
    }
}

module.exports = new NotaFiscalService()