const ChamadoRepository = require("../repositories/ChamadoRepository");

class ChamadoService {
  async listarChamados() {
    const chamados = await ChamadoRepository.listarChamados();
    return {
      sucesso: true,
      dados: chamados.map((chamado) => ({
        id: String(chamado.id_chamado),
        id_funcionario: chamado.id_funcionario,
        descricao: chamado.descricao,
        criadoEm: new Date(chamado.criado_em).toISOString(),
      })),
      total: chamados.length,
    };
  }

  async cadastrarChamado(dados, funcionarioId) {
    const descricao = String(dados?.descricao || "").trim();
    if (!descricao) {
      throw { status: 400, mensagem: "Descreva o chamado antes de enviar." };
    }
    if (descricao.length > 5000) {
      throw { status: 400, mensagem: "O chamado deve ter no máximo 5.000 caracteres." };
    }

    const chamado = await ChamadoRepository.cadastrarChamado({
      id_funcionario: funcionarioId || null,
      descricao,
    });
    return {
      sucesso: true,
      mensagem: "Chamado registrado com sucesso.",
      dados: {
        id: String(chamado.id_chamado),
        id_funcionario: chamado.id_funcionario,
        descricao: chamado.descricao,
        criadoEm: new Date(chamado.criado_em).toISOString(),
      },
    };
  }

  async deletarChamado(id) {
    if (!/^\d+$/.test(String(id)) || Number(id) <= 0) {
      throw { status: 400, mensagem: "Identificador do chamado inválido." };
    }
    const removido = await ChamadoRepository.deletarChamado(Number(id));
    if (!removido) {
      throw { status: 404, mensagem: "O chamado não foi encontrado." };
    }
    return { sucesso: true, mensagem: "Chamado removido com sucesso." };
  }
}

module.exports = new ChamadoService();
