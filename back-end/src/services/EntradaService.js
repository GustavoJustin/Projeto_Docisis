const EntradaRepository = require('../repositories/EntradaRepository')

class EntradaService {
    async listarEntrada() {
        const entradas = await EntradaRepository.listarEntrada()

        return {
            sucesso: true,
            dados: entradas,
            total: entradas.length
        }
    }

    async buscarEntradaId(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const entrada = await EntradaRepository.buscarEntradaId(id)

        if(!entrada) {
            throw { status: 404, mensagem: "Entrada não encontrada" }
        }

        return { sucesso: true, dados: entrada }
    }

    async cadastrarEntrada(dados) {
        const {id_nota_fiscal, cpf, horario, quantidade, preco} = dados

        if(!id_nota_fiscal || !cpf || !horario || !quantidade || !preco) {
            throw { status: 400, mensagem: "O campo id nota fiscal, cpf, horario, quantidade e preço são obrigatórios" }
        }

        if(typeof id_nota_fiscal != "number" || id_nota_fiscal <= 0) {
            throw { status: 400, mensagem: "Id nota fiscal deve ser um número positivo" }
        }

        if(typeof cpf != "string" || cpf.trim() == "") {
            throw { status: 400, mensagem: "CPF é obrigatório" }
        }

        if(typeof horario != "string" || horario.trim() == "") {
            throw { status: 400, mensagem: "Horario é obrigatório" }
        }

        if(typeof quantidade != "number" || quantidade <= 0) {
            throw { status: 400, mensagem: "Quantidade deve ser um número positivo" }
        }

        if(typeof preco != "number" || preco <= 0) {
            throw { status: 400, mensagem: "Preço deve ser um número positivo" }
        }

        const novaEntrada = {
            id_nota_fiscal,
            cpf,
            horario,
            quantidade,
            preco
        }

        const resultado = await EntradaRepository.cadastrarEntrada(novaEntrada)

        return { sucesso: true, mensagem: "Sucesso ao cadastrar", resultado }
    }

    async atualizarEntrada(id, dados) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const entrada = await EntradaRepository.buscarEntradaId(id)

        if(!entrada) {
            throw { status: 404, mensagem: "Entrada não encontrada" }
        }

        const entradaAtualizada = {}
        const {id_nota_fiscal, cpf, horario, quantidade, preco} = dados

        if(id_nota_fiscal != undefined) {
            if(typeof id_nota_fiscal != "number" || id_nota_fiscal <= 0) {
                throw { status: 400, mensagem: "O id nota fiscal deve ser um número positivo" }
            }
            entradaAtualizada.id_nota_fiscal = id_nota_fiscal
        }

        if(cpf != undefined) {
            if(typeof cpf != "number" || cpf <= 0) {
                throw { status: 400, mensagem: "O cpf deve ser um número positivo" }
            }
            entradaAtualizada.cpf = cpf
        }

        if(horario != undefined) {
            if(typeof horario != "number" || horario <= 0) {
                throw { status: 400, mensagem: "O horario deve ser um número positivo" }
            }
            entradaAtualizada.horario = horario
        }

        if(quantidade != undefined) {
            if(typeof quantidade != "number" || quantidade <= 0) {
                throw { status: 400, mensagem: "A quantidade deve ser um número positivo" }
            }
            entradaAtualizada.quantidade = quantidade
        }

        if(preco != undefined) {
            if(typeof preco != "number" || preco <= 0) {
                throw { status: 400, mensagem: "O preco deve ser um número positivo" }
            }
            entradaAtualizada.preco = preco
        }

        if(Object.keys(entradaAtualizada).length == 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para a atualização" }
        }

        await EntradaRepository.atualizarEntrada(id, entradaAtualizada)

        return { sucesso: true, mensagem: "Entrada atualizada" }
    }

    async deletarEntrada(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const entrada = await EntradaRepository.buscarEntradaId(id)

        if(!entrada) {
            throw { status: 404, mensagem: "Entrada não encontrada" }
        }

        await EntradaRepository.deletarEntrada(id)

        return { sucesso: true, mensagem: "Entrada apagada" }
    }
}

module.exports = new EntradaService()