const FuncionarioRepository = require('../repositories/FuncionariosRepository')
const bcrypt = require('bcryptjs') // JWT: usado só pra transformar a senha em hash antes de salvar

class FuncionarioService {
    async listarFuncionario() {
        const funcionarios = await FuncionarioRepository.listarFuncionario()

        return {
            sucesso: true,
            dados: funcionarios,
            total: funcionarios.length
        }
    }

    async buscarFuncionarioId(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const funcionario = await FuncionarioRepository.buscarFuncionarioId(id)

        if(!funcionario) {
            throw { status: 404, mensagem: "Funcionario não encontrado" }
        }

        return { sucesso: true, dados: funcionario }
    }

    async cadastrarFuncionario(dados) {
        const {cpf: cpfInformado, id_cargos, nome, email, senha} = dados
        const cpf = String(cpfInformado || '').replace(/\D/g, '')

        if(!cpf || !id_cargos || !nome || !email || !senha) {
            throw { status: 400, mensagem: "CPF, id cargos, nome, email e senha são obrigatórios" } // JWT: senha adicionada na mensagem
        }

        if(cpf.length !== 11) {
            throw { status: 400, mensagem: "Informe um CPF com 11 dígitos" }
        }
        if(typeof id_cargos != "number" || id_cargos <= 0) {
            throw { status: 400, mensagem: "id cargos deve ser um número positivo" }
        }

        // JWT: validação simples de tamanho mínimo, antes de gastar tempo fazendo o hash
        if(typeof senha != "string" || senha.trim().length < 6) {
            throw { status: 400, mensagem: "Senha deve ter no mínimo 6 caracteres" }
        }

        // JWT: nunca guarda a senha como o funcionário digitou - só o hash dela.
        // O "10" é o "custo" do hash (quanto maior, mais lento e mais seguro; 10 é o padrão de mercado)
        const senhaHash = await bcrypt.hash(senha, 10)

        const novoFuncionario = {
            cpf,
            id_cargos,
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senhaHash // JWT: salva o hash, não a senha crua
        }

        const resultado = await FuncionarioRepository.cadastrarFuncionario(novoFuncionario)

        return { sucesso: true, mensagem: "Sucesso ao cadastrar", resultado }
    }

    async atualizarFuncionario(id, dados) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const funcionario = await FuncionarioRepository.buscarFuncionarioId(id)

        if(!funcionario) {
            throw { status: 404, mensagem: "Funcionario não encontrado" }
        }

        const funcionarioAtualizado = {}
        const {cpf: cpfInformado, id_cargos, nome, email, senha} = dados
        const cpf = cpfInformado === undefined
            ? undefined
            : String(cpfInformado).replace(/\D/g, '')

        if(cpf != undefined) {
            if(cpf.length !== 11) {
                throw { status: 400, mensagem: "Informe um CPF com 11 dígitos" }
            }
            funcionarioAtualizado.cpf = cpf
        }

        if(id_cargos != undefined) {
            if(typeof id_cargos != "number" || id_cargos <= 0) {
                throw { status: 400, mensagem: "O id cargos deve ser um número positivo" }
            }
            funcionarioAtualizado.id_cargos = id_cargos
        }

        if(nome !== undefined && nome.trim() != "") funcionarioAtualizado.nome = nome.trim()

        if(email !== undefined && email.trim() != "") funcionarioAtualizado.email = email.trim().toLowerCase()

        // JWT: troca de senha é opcional na atualização - só mexe se vier alguma coisa no campo
        if(senha !== undefined) {
            if(typeof senha != "string" || senha.trim().length < 6) {
                throw { status: 400, mensagem: "Senha deve ter no mínimo 6 caracteres" }
            }
            funcionarioAtualizado.senha = await bcrypt.hash(senha, 10)
        }

        if(Object.keys(funcionarioAtualizado).length == 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para a atualização" }
        }

        await FuncionarioRepository.atualizarFuncionario(id, funcionarioAtualizado)

        return { sucesso: true, mensagem: "Funcionario atualizado" }
    }

    async deletarFuncionario(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const funcionario = await FuncionarioRepository.buscarFuncionarioId(id)

        if(!funcionario) {
            throw { status: 404, mensagem: "Funcionario não encontrado" }
        }

        await FuncionarioRepository.deletarFuncionario(id)

        return { sucesso: true, mensagem: "Funcionario apagado" }
    }
}

module.exports = new FuncionarioService()