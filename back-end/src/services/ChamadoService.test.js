jest.mock("../repositories/ChamadoRepository", () => ({
  listarChamados: jest.fn(),
  listarHistoricoChamados: jest.fn(),
  cadastrarChamado: jest.fn(),
  assumirChamado: jest.fn(),
  concluirChamado: jest.fn(),
  buscarChamadoId: jest.fn(),
}));
jest.mock("../repositories/HistoricoContaRepository", () => ({
  listarAcoesContas: jest.fn(),
}));

const ChamadoRepository = require("../repositories/ChamadoRepository");
const HistoricoContaRepository = require("../repositories/HistoricoContaRepository");
const ChamadoService = require("./ChamadoService");

describe("ChamadoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HistoricoContaRepository.listarAcoesContas.mockResolvedValue([]);
  });

  test("requires a non-empty description before creating a call", async () => {
    await expect(
      ChamadoService.cadastrarChamado({ descricao: "  " }, 4),
    ).rejects.toMatchObject({ status: 400 });
    expect(ChamadoRepository.cadastrarChamado).not.toHaveBeenCalled();
  });

  test("persists the trimmed description with the authenticated employee", async () => {
    const criadoEm = new Date("2026-11-05T16:00:00.000Z");
    ChamadoRepository.cadastrarChamado.mockResolvedValue({
      id_chamado: 12,
      id_funcionario: 4,
      descricao: "Preciso de suporte",
      criado_em: criadoEm,
    });

    await expect(
      ChamadoService.cadastrarChamado({ descricao: " Preciso de suporte " }, 4),
    ).resolves.toMatchObject({
      dados: {
        id: "12",
        id_funcionario: 4,
        descricao: "Preciso de suporte",
        criadoEm: criadoEm.toISOString(),
      },
    });
    expect(ChamadoRepository.cadastrarChamado).toHaveBeenCalledWith({
      id_funcionario: 4,
      descricao: "Preciso de suporte",
    });
  });

  test("links the authenticated employee when they assume an open call", async () => {
    const assumidoEm = new Date("2026-11-09T10:00:00.000Z");
    ChamadoRepository.assumirChamado.mockResolvedValue({
      id_chamado: 12,
      id_funcionario: 2,
      solicitante_nome: "Solicitante",
      descricao: "Preciso de suporte",
      criado_em: new Date("2026-11-09T09:00:00.000Z"),
      id_responsavel: 4,
      responsavel_nome: "Funcionário",
      status: "em_resolucao",
      assumido_em: assumidoEm,
    });

    await expect(
      ChamadoService.assumirChamado("12", 4),
    ).resolves.toMatchObject({
      dados: {
        id: "12",
        id_responsavel: 4,
        responsavelNome: "Funcionário",
        status: "em_resolucao",
        assumidoEm: assumidoEm.toISOString(),
      },
    });
    expect(ChamadoRepository.assumirChamado).toHaveBeenCalledWith(12, 4);
  });

  test("does not allow another employee to assume a call already in progress", async () => {
    ChamadoRepository.assumirChamado.mockResolvedValue(null);
    ChamadoRepository.buscarChamadoId.mockResolvedValue({
      id_chamado: 12,
      id_responsavel: 4,
      responsavel_nome: "Funcionário",
      status: "em_resolucao",
    });

    await expect(
      ChamadoService.assumirChamado("12", 5),
    ).rejects.toMatchObject({ status: 409 });
  });

  test("only the assigned employee can conclude a call", async () => {
    ChamadoRepository.concluirChamado.mockResolvedValue(null);
    ChamadoRepository.buscarChamadoId.mockResolvedValue({
      id_chamado: 12,
      id_responsavel: 4,
      status: "em_resolucao",
    });

    await expect(
      ChamadoService.concluirChamado("12", 5),
    ).rejects.toMatchObject({ status: 403 });
  });

  test("keeps a completed call in the administrative history", async () => {
    const concluidoEm = new Date("2026-11-09T11:00:00.000Z");
    ChamadoRepository.listarHistoricoChamados.mockResolvedValue([{
      id_chamado: 12,
      id_funcionario: 2,
      solicitante_nome: "Solicitante",
      descricao: "Preciso de suporte",
      criado_em: new Date("2026-11-09T09:00:00.000Z"),
      id_responsavel: 4,
      responsavel_nome: "Funcionário",
      status: "concluido",
      assumido_em: new Date("2026-11-09T10:00:00.000Z"),
      concluido_em: concluidoEm,
    }]);

    await expect(ChamadoService.listarHistoricoChamados()).resolves.toMatchObject({
      dados: [{
        id: "chamado-12",
        tipo: "chamado",
        status: "CONCLUÍDO",
        usuario: "Funcionário",
        data: concluidoEm.toISOString(),
      }],
    });
  });

  test("includes account creation and removal events in the administrative history", async () => {
    ChamadoRepository.listarHistoricoChamados.mockResolvedValue([]);
    HistoricoContaRepository.listarAcoesContas.mockResolvedValue([
      {
        id_historico: 3,
        acao: "remocao",
        nome_administrador: "Admin",
        nome_funcionario: "Ana",
        email_funcionario: "ana@example.com",
        ocorrido_em: new Date("2026-11-09T12:00:00.000Z"),
      },
      {
        id_historico: 2,
        acao: "criacao",
        nome_administrador: "Admin",
        nome_funcionario: "Bia",
        email_funcionario: "bia@example.com",
        ocorrido_em: new Date("2026-11-09T11:00:00.000Z"),
      },
    ]);

    await expect(ChamadoService.listarHistoricoChamados()).resolves.toMatchObject({
      dados: [
        {
          id: "conta-3",
          usuario: "Admin",
          acao: "Remoção de conta: Ana (ana@example.com)",
          status: "REMOÇÃO",
        },
        {
          id: "conta-2",
          usuario: "Admin",
          acao: "Criação de conta: Bia (bia@example.com)",
          status: "CRIAÇÃO",
        },
      ],
    });
  });
});
