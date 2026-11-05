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
        const id_nota_fiscal = Number(dados.id_nota_fiscal || dados.nota_fiscal || dados.id_nota)
        const id_produtos = Number(dados.id_produtos || dados.id_produto)
        let id_funcionario = Number(dados.id_funcionario)
        if(!id_funcionario) {
            const cpf = dados.cpf || dados.cpf_funcionario || dados.cpfFuncionario
            const funcionario = cpf ? await EntradaRepository.buscarFuncionarioPorCpf(cpf) : null
            id_funcionario = Number(funcionario?.id_funcionario || 0)
        }
        const quantidade = Number(dados.quantidade)
        const preco = Number(dados.preco || 0)
        if(!id_nota_fiscal || !id_produtos || !id_funcionario || !quantidade) {
            throw { status: 400, mensagem: "Nota fiscal, produto, usuário e quantidade são obrigatórios" }
        }
        const horario = dados.data_hora || dados.horario
        const dataHora = horario && /^\d{2}:\d{2}/.test(String(horario))
            ? `${new Date().toISOString().slice(0, 10)} ${horario}:00`
            : horario || new Date()
        const novaEntrada = {
            id_nota_fiscal,
            id_produtos,
            id_funcionario,
            data_hora: dataHora,
            quantidade,
            preco
        }
        const resultado = await EntradaRepository.cadastrarEntrada(novaEntrada)
        return { sucesso: true, mensagem: "Entrada registrada", resultado }
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