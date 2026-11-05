jest.mock("../repositories/ChamadoRepository", () => ({
  listarChamados: jest.fn(),
  cadastrarChamado: jest.fn(),
  deletarChamado: jest.fn(),
}));

const ChamadoRepository = require("../repositories/ChamadoRepository");
const ChamadoService = require("./ChamadoService");

describe("ChamadoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  test("returns not found when deleting a call that does not exist", async () => {
    ChamadoRepository.deletarChamado.mockResolvedValue(false);

    await expect(ChamadoService.deletarChamado("12")).rejects.toMatchObject({
      status: 404,
    });
  });
});
