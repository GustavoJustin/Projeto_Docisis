const CargosRepository = require('../repositories/CargosRepository')

class CargoService {
    async listarCargo() {
        const cargos = await CargosRepository.listarCargo()

        return {
            sucesso: true,
            dados: cargos,
            total: cargos.length
        }
    }

    async buscarCargoId(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const cargo = await CargosRepository.buscarCargoId(id)

        if(!cargo) {
            throw {
                status: 404,
                mensagem: "Pedido não encontrado"
            }
        }

        return {
            sucesso: true,
            dados: cargo[0]
        }
    }

    async cadastrarCargo(dados) {
        const {nivel_acesso_1, nivel_acesso_2, nome_cargo, departamento, jornada} = dados

        if(!nivel_acesso_1 || !nivel_acesso_2 || !jornada) {
            throw {
                status: 400,
                mensagem: "O campo nivel de acesso 1 e 2 e jornada são obrigatórios"
            }
        }

        if(typeof nivel_acesso_1 != "number" || nivel_acesso_1 <= 0) {
            throw {
                status: 400,
                mensagem: "Nivel de acesso 1 deve ser um número positivo"
            }
        }

        if(typeof nivel_acesso_2 != "number" || nivel_acesso_2 <= 0) {
            throw {
                status: 400,
                mensagem: "Nivel de acesso 2 deve ser um número positivo"
            }
        }

        const novoCargo = {
            nivel_acesso_1, 
            nivel_acesso_2,
            nome_cargo: nome_cargo.trim(),
            departamento: departamento.trim(),
            jornada: jornada.trim()
        }

        const resultado = await CargosRepository.cadastrarCargo(novoCargo)

        return {
            sucesso: true,
            mensagem: "Sucesso ao cadastrar",
            resultado
        }
    }

    async atualizarCargo(id, dados) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const cargo = await CargosRepository.buscarCargoId(id)

        if(!cargo) {
            throw {
                status: 404,
                mensagem: "Cargo não encontrado"
            }
        }

        const cargoAtualizado = {}
        const {nivel_acesso_1, nivel_acesso_2, nome_cargo, departamento, jornada} = dados

        if(nivel_acesso_1 != undefined) {
            if(typeof nivel_acesso_1 != "number" || nivel_acesso_1 <= 0) {
                throw {
                    status: 400,
                    mensagem: "O nivel de acesso 1 deve ser um número positivo"
                }
            }

            cargoAtualizado.nivel_acesso_1 = nivel_acesso_1
        }

        if(nivel_acesso_2 != undefined) {
            if(typeof nivel_acesso_2 != "number" || nivel_acesso_2 <= 0) {
                throw {
                    status: 400,
                    mensagem: "O nivel de acesso 2 deve ser um número positivo"
                }
            }

            cargoAtualizado.nivel_acesso_2 = nivel_acesso_2
        }

        if(nome_cargo != undefined && nome_cargo.trim() != "") cargoAtualizado.nome_cargo = nome_cargo.trim()
        if(departamento != undefined && departamento.trim() != "") cargoAtualizado.departamento = departamento.trim()
        if(jornada != undefined && jornada.trim() != "") cargoAtualizado.jornada = jornada.trim()

        if(Object.keys(cargoAtualizado).length == 0) {
            throw {
                status: 400,
                mensagem: "Nenhum dado válido enviado para a atualização"
            }
        }

        await CargosRepository.atualizarCargo(id, cargoAtualizado)

        return {
            sucesso: true,
            mensagem: "Cargo atualizado"
        }
    }

    async deletarCargo(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const cargo = await CargosRepository.buscarCargoId(id)

        if(!cargo) {
            throw {
                status: 404,
                mensagem: "Cargo não encontrado"
            }
        }

        await CargosRepository.deletarCargo(id)

        return {
            sucesso: true,
            mensagem: "Cargo apagado"
        }
    }
}

module.exports = new CargoService()