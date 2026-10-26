jest.mock("../config/database", () => ({
  query: jest.fn(),
}));

const pool = require("../config/database");
const CargosRepository = require("./CargosRepository");

describe("CargosRepository.garantirCargoAdministrador", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uses the next cargo ID when the database does not auto-increment it", async () => {
    pool.query
      .mockResolvedValueOnce([[], []])
      .mockResolvedValueOnce([[{ Extra: "" }], []])
      .mockResolvedValueOnce([[{ proximo_id: 4 }], []])
      .mockResolvedValueOnce([{}, []])
      .mockResolvedValueOnce([[{ id_cargos: 4, nome_cargo: "Administrador" }], []]);

    const cargo = await CargosRepository.garantirCargoAdministrador();

    expect(pool.query.mock.calls[3][0]).toContain("id_cargos");
    expect(pool.query.mock.calls[3][1]).toEqual([
      4,
      "Administrador",
      "Administração",
    ]);
    expect(cargo).toEqual({ id_cargos: 4, nome_cargo: "Administrador" });
  });

  test("does not create a duplicate administrator role", async () => {
    const existente = { id_cargos: 2, nome_cargo: "Administrador" };
    pool.query.mockResolvedValueOnce([[existente], []]);

    const cargo = await CargosRepository.garantirCargoAdministrador();

    expect(cargo).toEqual(existente);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
