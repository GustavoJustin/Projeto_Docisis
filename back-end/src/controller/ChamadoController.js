const ChamadoService = require("../services/ChamadoService");

class ChamadoController {
  async listarChamados(req, res) {
    try {
      res.json(await ChamadoService.listarChamados());
    } catch (erro) {
      console.error("Não foi possível carregar os chamados:", erro);
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Não foi possível carregar os chamados.",
      });
    }
  }

  async cadastrarChamado(req, res) {
    try {
      const resultado = await ChamadoService.cadastrarChamado(
        req.body,
        req.funcionario?.id_funcionario,
      );
      res.status(201).json(resultado);
    } catch (erro) {
      console.error("Não foi possível registrar o chamado:", erro);
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Não foi possível registrar o chamado.",
      });
    }
  }

  async deletarChamado(req, res) {
    try {
      res.json(await ChamadoService.deletarChamado(req.params.id));
    } catch (erro) {
      console.error("Não foi possível remover o chamado:", erro);
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Não foi possível remover o chamado.",
      });
    }
  }
}

module.exports = new ChamadoController();
