const FuncionarioRepository = require('../repositories/FuncionariosRepository')
const CargosRepository = require('../repositories/CargosRepository')
const HistoricoContaRepository = require('../repositories/HistoricoContaRepository')
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

    async cadastrarFuncionario(dados, administrador) {
        const {cpf: cpfInformado, id_cargos, nome, email, senha, foto} = dados
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
        if(foto !== undefined && foto !== null && foto !== "" &&
            (typeof foto !== "string" ||
                foto.length > 1500000 ||
                !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(foto))) {
            throw { status: 400, mensagem: "A foto de perfil é inválida ou muito grande." }
        }

        // JWT: nunca guarda a senha como o funcionário digitou - só o hash dela.
        // O "10" é o "custo" do hash (quanto maior, mais lento e mais seguro; 10 é o padrão de mercado)
        const senhaHash = await bcrypt.hash(senha, 10)

        const cargo = await CargosRepository.buscarCargoId(id_cargos)
        const ehAdministrador = String(cargo?.nome_cargo || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes('admin')

        const novoFuncionario = {
            cpf,
            id_cargos,
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senhaHash, // JWT: salva o hash, não a senha crua
            pode_cadastrar_funcionarios: ehAdministrador && dados.pode_cadastrar_funcionarios === true ? 1 : 0,
            ...(foto ? { foto } : {})
        }

        const resultado = await FuncionarioRepository.cadastrarFuncionario(novoFuncionario)
        try {
            await HistoricoContaRepository.registrarAcaoConta({
                acao: 'criacao',
                id_administrador: administrador?.id_funcionario,
                nome_administrador: administrador?.nome,
                id_funcionario: resultado,
                nome_funcionario: novoFuncionario.nome,
                email_funcionario: novoFuncionario.email,
            })
        } catch (erro) {
            console.error('A conta foi criada, mas não foi possível registrar a ação no histórico:', erro)
            throw {
                status: 500,
                mensagem: 'A conta foi criada, mas não foi possível registrar a criação no histórico. Avise o administrador do sistema.',
            }
        }

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

    async redefinirSenha(id, senha) {
        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw { status: 400, mensagem: "Id inválido" }
        }
        if (typeof senha !== "string" || senha.trim().length < 6) {
            throw { status: 400, mensagem: "A nova senha deve ter no mínimo 6 caracteres" }
        }

        const funcionario = await FuncionarioRepository.buscarFuncionarioId(id)
        if (!funcionario) {
            throw { status: 404, mensagem: "Funcionario não encontrado" }
        }

        const senhaHash = await bcrypt.hash(senha, 10)
        await FuncionarioRepository.atualizarFuncionario(id, { senha: senhaHash })
        return { sucesso: true, mensagem: "Senha redefinida com sucesso." }
    }

    async atualizarFotoPerfil(id, foto) {
        if(!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw { status: 400, mensagem: "Id inválido" }
        }
        if(typeof foto !== "string" ||
            foto.length > 1500000 ||
            !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(foto)) {
            throw { status: 400, mensagem: "A foto de perfil é inválida ou muito grande." }
        }

        const funcionario = await FuncionarioRepository.buscarFuncionarioId(id)
        if(!funcionario) {
            throw { status: 404, mensagem: "Funcionario não encontrado" }
        }

        await FuncionarioRepository.atualizarFotoPerfil(id, foto)
        return { sucesso: true, mensagem: "Foto de perfil atualizada." }
    }

    async atualizarPerfil(id, dados) {
        if(!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const nome = typeof dados?.nome === "string" ? dados.nome.trim() : ""
        const email = typeof dados?.email === "string" ? dados.email.trim().toLowerCase() : ""
        if(!nome) {
            throw { status: 400, mensagem: "Informe um nome válido." }
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw { status: 400, mensagem: "Informe um e-mail válido." }
        }

        const funcionario = await FuncionarioRepository.buscarFuncionarioId(id)
        if(!funcionario) {
            throw { status: 404, mensagem: "Funcionario não encontrado" }
        }

        try {
            await FuncionarioRepository.atualizarFuncionario(id, { nome, email })
        } catch (erro) {
            if(erro.code === "ER_DUP_ENTRY") {
                throw { status: 409, mensagem: "Este e-mail já está sendo usado por outra conta." }
            }
            throw erro
        }

        return {
            sucesso: true,
            mensagem: "Perfil atualizado.",
            dados: await FuncionarioRepository.buscarFuncionarioId(id),
        }
    }

    async deletarFuncionario(id, administrador) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const funcionario = await FuncionarioRepository.buscarFuncionarioId(id)

        if(!funcionario) {
            throw { status: 404, mensagem: "Funcionario não encontrado" }
        }

        const ehAdministrador = (nomeCargo) => String(nomeCargo || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes('admin')
        if(ehAdministrador(funcionario.nome_cargo)) {
            const funcionarios = await FuncionarioRepository.listarFuncionario()
            const outrosAdministradores = funcionarios.filter((item) => {
                return ehAdministrador(item.nome_cargo) &&
                    String(item.id_funcionario) !== String(id)
            })
            if(outrosAdministradores.length === 0) {
                throw {
                    status: 409,
                    mensagem: "Não é possível excluir o último administrador cadastrado.",
                }
            }
        }

        await FuncionarioRepository.deletarFuncionario(id)
        try {
            await HistoricoContaRepository.registrarAcaoConta({
                acao: 'remocao',
                id_administrador: administrador?.id_funcionario,
                nome_administrador: administrador?.nome,
                id_funcionario: funcionario.id_funcionario,
                nome_funcionario: funcionario.nome,
                email_funcionario: funcionario.email,
            })
        } catch (erro) {
            console.error('A conta foi removida, mas não foi possível registrar a ação no histórico:', erro)
            throw {
                status: 500,
                mensagem: 'A conta foi removida, mas não foi possível registrar a remoção no histórico. Avise o administrador do sistema.',
            }
        }

        return { sucesso: true, mensagem: "Funcionario apagado" }
    }
}

module.exports = new FuncionarioService()