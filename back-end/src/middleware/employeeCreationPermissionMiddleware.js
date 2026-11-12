const FuncionariosRepository = require("../repositories/FuncionariosRepository");

async function exigirPermissaoCriarFuncionarios(req, res, next) {
  try {
    const funcionario = await FuncionariosRepository.buscarFuncionarioId(
      req.funcionario?.id_funcionario,
    );
    if (!funcionario?.pode_cadastrar_funcionarios) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Sua conta não tem permissão para criar funcionários.",
      });
    }
    next();
  } catch (error) {
    console.error("Não foi possível validar a permissão de criação de funcionários:", error);
    res.status(500).json({
      sucesso: false,
      mensagem: "Não foi possível validar as permissões da conta.",
    });
  }
}

module.exports = exigirPermissaoCriarFuncionarios;
