jest.mock("../repositories/CargosRepository", () => ({
  garantirCargoFuncionario: jest.fn(),
  listarCargo: jest.fn(),
}));

const CargosRepository = require("../repositories/CargosRepository");
const CargosService = require("./CargosService");

describe("CargosService.listarCargo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ensures the employee role exists before listing roles", async () => {
    const cargos = [
      { id_cargos: 1, nome_cargo: "Administrador" },
      { id_cargos: 2, nome_cargo: "Funcionário" },
    ];
    CargosRepository.garantirCargoFuncionario.mockResolvedValue(cargos[1]);
    CargosRepository.listarCargo.mockResolvedValue(cargos);

    await expect(CargosService.listarCargo()).resolves.toEqual({
      sucesso: true,
      dados: cargos,
      total: 2,
    });

    expect(CargosRepository.garantirCargoFuncionario).toHaveBeenCalledTimes(1);
    expect(CargosRepository.listarCargo).toHaveBeenCalledTimes(1);
    expect(CargosRepository.garantirCargoFuncionario.mock.invocationCallOrder[0])
      .toBeLessThan(CargosRepository.listarCargo.mock.invocationCallOrder[0]);
  });
});
