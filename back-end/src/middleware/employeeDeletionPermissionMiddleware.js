const FuncionariosRepository = require("../repositories/FuncionariosRepository");

async function exigirPermissaoExcluirFuncionarios(req, res, next) {
  try {
    const funcionario = await FuncionariosRepository.buscarFuncionarioId(
      req.funcionario?.id_funcionario,
    );
    if (!funcionario?.pode_excluir_funcionarios) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Sua conta não tem permissão para remover funcionários.",
      });
    }
    next();
  } catch (error) {
    console.error("Não foi possível validar a permissão de exclusão de funcionários:", error);
    res.status(500).json({
      sucesso: false,
      mensagem: "Não foi possível validar as permissões da conta.",
    });
  }
}

module.exports = exigirPermissaoExcluirFuncionarios;
