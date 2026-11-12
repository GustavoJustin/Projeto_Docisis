const ChamadoRepository = require("../repositories/ChamadoRepository");
const HistoricoContaRepository = require("../repositories/HistoricoContaRepository");

function mapearChamado(chamado) {
  return {
    id: String(chamado.id_chamado),
    id_funcionario: chamado.id_funcionario,
    solicitanteNome: chamado.solicitante_nome || null,
    descricao: chamado.descricao,
    criadoEm: new Date(chamado.criado_em).toISOString(),
    id_responsavel: chamado.id_responsavel,
    responsavelNome: chamado.responsavel_nome || null,
    status: chamado.status || "aberto",
    assumidoEm: chamado.assumido_em
      ? new Date(chamado.assumido_em).toISOString()
      : null,
    concluidoEm: chamado.concluido_em
      ? new Date(chamado.concluido_em).toISOString()
      : null,
  };
}

function validarId(id) {
  if (!/^\d+$/.test(String(id)) || Number(id) <= 0) {
    throw { status: 400, mensagem: "Identificador do chamado inválido." };
  }
  return Number(id);
}

function validarFuncionarioId(funcionarioId) {
  if (!Number.isInteger(Number(funcionarioId)) || Number(funcionarioId) <= 0) {
    throw { status: 401, mensagem: "Não foi possível identificar a conta autenticada." };
  }
  return Number(funcionarioId);
}

class ChamadoService {
  async listarChamados() {
    const chamados = await ChamadoRepository.listarChamados();
    return {
      sucesso: true,
      dados: chamados.map(mapearChamado),
      total: chamados.length,
    };
  }

  async listarHistoricoChamados() {
    const [chamados, acoesContas] = await Promise.all([
      ChamadoRepository.listarHistoricoChamados(),
      HistoricoContaRepository.listarAcoesContas(),
    ]);
    const registrosChamados = chamados.map((chamado) => {
      const item = mapearChamado(chamado);
      return {
        id: `chamado-${item.id}`,
        tipo: "chamado",
        data: item.concluidoEm || item.assumidoEm || item.criadoEm,
        usuario: item.responsavelNome || item.solicitanteNome || "Funcionário não identificado",
        acao: `Chamado #${item.id}: ${item.descricao}`,
        status: item.status === "concluido"
          ? "CONCLUÍDO"
          : item.status === "em_resolucao"
            ? "EM RESOLUÇÃO"
            : "ABERTO",
      };
    });
    const registrosContas = acoesContas.map((acao) => ({
      id: `conta-${acao.id_historico}`,
      tipo: "conta",
      data: new Date(acao.ocorrido_em).toISOString(),
      usuario: acao.nome_administrador,
      acao: `${acao.acao === "criacao" ? "Criação" : "Remoção"} de conta: ${acao.nome_funcionario} (${acao.email_funcionario})`,
      status: acao.acao === "criacao" ? "CRIAÇÃO" : "REMOÇÃO",
    }));
    const dados = [...registrosChamados, ...registrosContas].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
    );
    return {
      sucesso: true,
      dados,
      total: dados.length,
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
      dados: mapearChamado(chamado),
    };
  }

  async assumirChamado(id, funcionarioId) {
    const chamadoId = validarId(id);
    const responsavelId = validarFuncionarioId(funcionarioId);
    let chamado = await ChamadoRepository.assumirChamado(
      chamadoId,
      responsavelId,
    );
    if (!chamado) {
      chamado = await ChamadoRepository.buscarChamadoId(chamadoId);
      if (!chamado) {
        throw { status: 404, mensagem: "O chamado não foi encontrado." };
      }
      if (
        chamado.status !== "em_resolucao" ||
        Number(chamado.id_responsavel) !== responsavelId
      ) {
        throw {
          status: 409,
          mensagem: chamado.status === "concluido"
            ? "Este chamado já foi concluído."
            : `Este chamado já está em resolução${chamado.responsavel_nome ? ` por ${chamado.responsavel_nome}` : ""}.`,
        };
      }
    }
    return {
      sucesso: true,
      mensagem: "Chamado vinculado à sua conta.",
      dados: mapearChamado(chamado),
    };
  }

  async concluirChamado(id, funcionarioId) {
    const chamadoId = validarId(id);
    const responsavelId = validarFuncionarioId(funcionarioId);
    let chamado = await ChamadoRepository.concluirChamado(
      chamadoId,
      responsavelId,
    );
    if (!chamado) {
      chamado = await ChamadoRepository.buscarChamadoId(chamadoId);
      if (!chamado) {
        throw { status: 404, mensagem: "O chamado não foi encontrado." };
      }
      if (chamado.status === "concluido" &&
          Number(chamado.id_responsavel) === responsavelId) {
        return {
          sucesso: true,
          mensagem: "Chamado já concluído.",
          dados: mapearChamado(chamado),
        };
      }
      if (Number(chamado.id_responsavel) !== responsavelId) {
        throw {
          status: 403,
          mensagem: "Somente o funcionário responsável pode concluir este chamado.",
        };
      }
      throw {
        status: 409,
        mensagem: "Assuma o chamado antes de marcá-lo como concluído.",
      };
    }
    return {
      sucesso: true,
      mensagem: "Chamado concluído e registrado no histórico.",
      dados: mapearChamado(chamado),
    };
  }
}

module.exports = new ChamadoService();
