const AuthService = require("../services/AuthService");

class AuthController {
  async contato(req, res) {
    try {
      const resultado = await AuthService.buscarContatoAdministrador();
      res.json(resultado);
    } catch (erro) {
      res.status(500).json({
        sucesso: false,
        mensagem: "Não foi possível consultar o contato do administrador",
      });
    }
  }

  async cadastrarFuncionarioPublico(req, res) {
    try {
      const resultado = await AuthService.cadastrarFuncionarioPublico(req.body);
      res.status(201).json(resultado);
    } catch (erro) {
      const status = erro.code === "ER_DUP_ENTRY" ? 409 : erro.status || 500;
      res.status(status).json({
        sucesso: false,
        mensagem:
          erro.code === "ER_DUP_ENTRY"
            ? "Já existe uma conta com este CPF ou e-mail."
            : erro.mensagem ||
              "Cadastro temporariamente indisponível. Verifique a configuração do banco de dados.",
      });
    }
  }

  async login(req, res) {
    try {
      const resultado = await AuthService.login(req.body);
      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }
}

module.exports = new AuthController();
