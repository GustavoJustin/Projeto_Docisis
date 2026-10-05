const CargosRepository = require("../repositories/CargosRepository");

function exigirAdministrador(req, res, next) {
  CargosRepository.buscarCargoId(req.funcionario.id_cargos)
    .then((cargo) => {
      const nomeCargo = (cargo?.nome_cargo || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      if (!nomeCargo.includes("admin")) {
        return res.status(403).json({
          sucesso: false,
          mensagem:
            "Apenas administradores podem acessar movimentações de entrada e saída",
        });
      }

      next();
    })
    .catch(() => {
      res.status(500).json({
        sucesso: false,
        mensagem: "Não foi possível validar as permissões da conta",
      });
    });
}

module.exports = exigirAdministrador;
