jest.mock("../config/database", () => ({
  query: jest.fn(),
}));

const pool = require("../config/database");
const HistoricoContaRepository = require("./HistoricoContaRepository");

describe("HistoricoContaRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HistoricoContaRepository.preparacaoTabela = null;
  });

  test("persists account actions with the administrator and account details", async () => {
    pool.query.mockResolvedValue([{}, []]);

    await HistoricoContaRepository.registrarAcaoConta({
      acao: "criacao",
      id_administrador: 4,
      nome_administrador: "Admin",
      id_funcionario: 15,
      nome_funcionario: "Maria",
      email_funcionario: "maria@example.com",
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query.mock.calls[0][0]).toContain("CREATE TABLE IF NOT EXISTS tbl_historico_contas");
    expect(pool.query.mock.calls[1][1]).toEqual([
      "criacao",
      4,
      "Admin",
      15,
      "Maria",
      "maria@example.com",
    ]);
  });

  test("lists persisted account actions newest first", async () => {
    const records = [{ id_historico: 8, acao: "remocao" }];
    pool.query
      .mockResolvedValueOnce([{}, []])
      .mockResolvedValueOnce([records, []]);

    await expect(HistoricoContaRepository.listarAcoesContas()).resolves.toBe(records);
    expect(pool.query.mock.calls[1][0]).toContain("ORDER BY ocorrido_em DESC, id_historico DESC");
  });
});
