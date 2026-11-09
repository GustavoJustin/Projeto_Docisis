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

  async listarHistoricoChamados(req, res) {
    try {
      res.json(await ChamadoService.listarHistoricoChamados());
    } catch (erro) {
      console.error("Não foi possível carregar o histórico de chamados:", erro);
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Não foi possível carregar o histórico de chamados.",
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

  async assumirChamado(req, res) {
    try {
      res.json(
        await ChamadoService.assumirChamado(
          req.params.id,
          req.funcionario?.id_funcionario,
        ),
      );
    } catch (erro) {
      console.error("Não foi possível assumir o chamado:", erro);
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Não foi possível assumir o chamado.",
      });
    }
  }

  async concluirChamado(req, res) {
    try {
      res.json(
        await ChamadoService.concluirChamado(
          req.params.id,
          req.funcionario?.id_funcionario,
        ),
      );
    } catch (erro) {
      console.error("Não foi possível concluir o chamado:", erro);
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Não foi possível concluir o chamado.",
      });
    }
  }
}

module.exports = new ChamadoController();
