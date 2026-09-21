const SaidaRepository = require('../repositories/SaidaRepository')

class SaidaService {
    async listarSaida() {
        const saidas = await SaidaRepository.listarSaida()

        return {
            sucesso: true,
            dados: saidas,
            total: saidas.length
        }
    }

    async buscarSaidaId(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const saida = await SaidaRepository.buscarSaidaId(id)

        if(!saida) {
            throw {
                status: 404,
                mensagem: "Saida não encontrada"
            }
        }

        return {
            sucesso: true,
            dados: saida
        }
    }

    async cadastrarSaida(dados) {
        const {id_pedido, cpf, horario, quantidade, preco} = dados

        if(!id_pedido || !cpf || !horario || !quantidade || !preco) {
            throw {
                status: 400,
                mensagem: "Id pedido, cpf, horario, quantidade e preco são obrigatórios"
            }
        }

        if(typeof id_pedido != "number" || id_pedido <= 0) {
            throw {
                status: 400,
                mensagem: "Id_pedido deve ser um número positivo"
            }
        }

        if(typeof cpf != "string" || cpf.trim() == "") {
            throw { status: 400, mensagem: "CPF é obrigatório" }
        }

        if(typeof horario != "string" || horario.trim() == "") {
            throw { status: 400, mensagem: "Horario é obrigatório" }
        }

        if(typeof quantidade != "number" || quantidade <= 0) {
            throw {
                status: 400,
                mensagem: "Quantidade deve ser um número positivo"
            }
        }

        if(typeof preco != "number" || preco <= 0) {
            throw {
                status: 400,
                mensagem: "Preço deve ser um número positivo"
            }
        }

        const novaSaida = {
            id_pedido,
            cpf,
            horario,
            quantidade,
            preco
        }

        const resultado = await SaidaRepository.cadastrarSaida(novaSaida)

        return {
            sucesso: true,
            mensagem: "Sucesso ao cadastrar",
            resultado
        }
    }

    async atualizarSaida(id, dados) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const saida = await SaidaRepository.buscarSaidaId(id)

        if(!saida) {
            throw {
                status: 404,
                mensagem: "Saida não encontrada"
            }
        }

        const saidaAtualizada = {}
        const {id_pedido, cpf, horario, quantidade, preco} = dados

        if(id_pedido != undefined) {
            if(typeof id_pedido != "number" || id_pedido <= 0) {
                throw {
                    status: 400,
                    mensagem: "O id pedido deve ser um número positivo"
                }
            }

            saidaAtualizada.id_pedido = id_pedido
        }

        if(cpf != undefined) {
            if(typeof cpf != "number" || cpf <= 0) {
                throw {
                    status: 400,
                    mensagem: "O cpf deve ser um número positivo"
                }
            }

            saidaAtualizada.cpf = cpf
        }

        if(horario != undefined) {
            if(typeof horario != "number" || horario <= 0) {
                throw {
                    status: 400,
                    mensagem: "O horario deve ser um número positivo"
                }
            }

            saidaAtualizada.horario = horario
        }

        if(quantidade != undefined) {
            if(typeof quantidade != "number" || quantidade <= 0) {
                throw {
                    status: 400,
                    mensagem: "A quantidade deve ser um número positivo"
                }
            }

            saidaAtualizada.quantidade = quantidade
        }

        if(preco != undefined) {
            if(typeof preco != "number" || preco <= 0) {
                throw {
                    status: 400,
                    mensagem: "O preço deve ser um número positivo"
                }
            }

            saidaAtualizada.preco = preco
        }

        if(Object.keys(saidaAtualizada).length == 0) {
            throw {
                status: 400,
                mensagem: "Nenhum dado válido enviado para a atualização"
            }
        }

        await SaidaRepository.atualizarSaida(id, saidaAtualizada)

        return {
            sucesso: true,
            mensagem: "Saida atualizada"
        }
    }

    async deletarSaida(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const saida = await SaidaRepository.buscarSaidaId(id)

        if(!saida) {
            throw {
                status: 404,
                mensagem: "Saida não encontrada"
            }
        }

        await SaidaRepository.deletarSaida(id)

        return {
            sucesso: true,
            mensagem: "Saida apagada"
        }
    }
}

module.exports = new SaidaService()