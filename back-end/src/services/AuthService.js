// Onde a regra de login mora: confere email/senha e devolve um token JWT.
const AuthRepository = require("../repositories/AuthRepository");
const CargosRepository = require("../repositories/CargosRepository");
const FuncionarioService = require("./FuncionarioService");
const bcrypt = require("bcryptjs"); // compara a senha digitada com o hash salvo no banco
const jwt = require("jsonwebtoken"); // gera e assina o token

class AuthService {
  async buscarContatoAdministrador() {
    return {
      sucesso: true,
      contato: {
        nome: process.env.ADMIN_CONTACT_NAME || "Geraldo",
        email: process.env.ADMIN_CONTACT_EMAIL || "geraldo_adm@docisis.com",
        telefone: process.env.ADMIN_CONTACT_PHONE || "11223459067",
        instagram: process.env.ADMIN_CONTACT_INSTAGRAM || "",
      },
    };
  }

  async cadastrarFuncionarioPublico(dados) {
    const nome = String(dados.nome || "").trim();
    const cpf = String(dados.cpf || "").replace(/\D/g, "");
    const email = String(dados.email || "").trim();
    const senha = String(dados.senha || "");

    if (!nome || !cpf || !email || !senha) {
      throw {
        status: 400,
        mensagem: "Preencha nome, CPF, e-mail e senha.",
      };
    }
    if (cpf.length !== 11) {
      throw { status: 400, mensagem: "Informe um CPF com 11 dígitos." };
    }
    if (senha.trim().length < 6) {
      throw {
        status: 400,
        mensagem: "A senha precisa ter pelo menos 6 caracteres.",
      };
    }

    let cargos;
    try {
      cargos = await CargosRepository.listarCargo();
    } catch {
      throw {
        status: 503,
        mensagem:
          "Banco de dados indisponível. Configure o arquivo back-end/.env antes de criar contas.",
      };
    }
    const cargoFuncionario = cargos.find((cargo) =>
      cargo.nome_cargo
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes("funcion"),
    );

    if (!cargoFuncionario) {
      throw {
        status: 503,
        mensagem:
          "O cargo Funcionário precisa estar cadastrado para criar uma conta.",
      };
    }

    return FuncionarioService.cadastrarFuncionario({
      ...dados,
      nome,
      cpf,
      email,
      senha,
      id_cargos: cargoFuncionario.id_cargos,
    });
  }

  async login(dados) {
    const { email, senha } = dados;

    if (!email || !senha) {
      throw { status: 400, mensagem: "Email e senha são obrigatórios" };
    }

    const funcionario = await AuthRepository.buscarPorEmail(email.trim());

    // Mesma mensagem tanto pra "email não existe" quanto pra "senha errada" -
    // de propósito, pra não dar dica pra quem tá tentando adivinhar um email válido
    if (!funcionario || !funcionario.senha) {
      throw { status: 401, mensagem: "Email ou senha inválidos" };
    }

    // bcrypt.compare faz o hash da senha digitada e compara com o hash salvo
    // (nunca descriptografa o hash - hash não tem volta)
    const senhaConfere = await bcrypt.compare(senha, funcionario.senha);

    if (!senhaConfere) {
      throw { status: 401, mensagem: "Email ou senha inválidos" };
    }

    // O token carrega só o essencial pra identificar quem tá logado.
    // NUNCA bota a senha (nem o hash) aqui dentro - o token não é criptografado,
    // só assinado, então qualquer um consegue decodificar e ler o conteúdo.
    const token = jwt.sign(
      {
        id_funcionario: funcionario.id_funcionario,
        id_cargos: funcionario.id_cargos,
        nome: funcionario.nome,
        email: funcionario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }, // depois de 8h o funcionário precisa logar de novo
    );

    return {
      sucesso: true,
      mensagem: "Login realizado com sucesso",
      token,
      funcionario: {
        id_funcionario: funcionario.id_funcionario,
        nome: funcionario.nome,
        email: funcionario.email,
        id_cargos: funcionario.id_cargos,
      },
    };
  }
}

module.exports = new AuthService();
