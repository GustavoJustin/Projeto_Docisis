jest.mock("../repositories/FuncionariosRepository", () => ({
  buscarFuncionarioId: jest.fn(),
}));

const FuncionariosRepository = require("../repositories/FuncionariosRepository");
const exigirPermissaoCriarFuncionarios = require("./employeeCreationPermissionMiddleware");
const exigirPermissaoExcluirFuncionarios = require("./employeeDeletionPermissionMiddleware");

describe("exigirPermissaoCriarFuncionarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("exigirPermissaoExcluirFuncionarios", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("allows an admin with the stored delete permission", async () => {
      FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
        pode_excluir_funcionarios: 1,
      });
      const req = { funcionario: { id_funcionario: 4 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await exigirPermissaoExcluirFuncionarios(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("rejects accounts without the stored delete permission", async () => {
      FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
        pode_excluir_funcionarios: 0,
      });
      const req = { funcionario: { id_funcionario: 4 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await exigirPermissaoExcluirFuncionarios(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  test("allows an admin with the stored permission", async () => {
    FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
      pode_cadastrar_funcionarios: 1,
    });
    const req = { funcionario: { id_funcionario: 4 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await exigirPermissaoCriarFuncionarios(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("rejects accounts without the stored permission", async () => {
    FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
      pode_cadastrar_funcionarios: 0,
    });
    const req = { funcionario: { id_funcionario: 4 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await exigirPermissaoCriarFuncionarios(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
