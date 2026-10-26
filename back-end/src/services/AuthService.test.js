jest.mock("../repositories/AuthRepository", () => ({
  buscarPorEmail: jest.fn(),
}));
jest.mock("../repositories/CargosRepository", () => ({
  garantirCargoFuncionario: jest.fn(),
}));
jest.mock("./FuncionarioService", () => ({
  cadastrarFuncionario: jest.fn(),
}));

const AuthRepository = require("../repositories/AuthRepository");
const CargosRepository = require("../repositories/CargosRepository");
const FuncionarioService = require("./FuncionarioService");
const AuthService = require("./AuthService");
const bcrypt = require("bcryptjs");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "auth-service-test-secret";
  });

  test("creates the employee role when registering a public employee", async () => {
    CargosRepository.garantirCargoFuncionario.mockResolvedValue({
      id_cargos: 2,
      nome_cargo: "Funcionário",
    });
    FuncionarioService.cadastrarFuncionario.mockResolvedValue({
      sucesso: true,
      resultado: 15,
    });

    const resultado = await AuthService.cadastrarFuncionarioPublico({
      nome: "  Maria Oliveira ",
      cpf: "123.456.789-01",
      email: " Maria@Email.com ",
      senha: "Senha123",
    });

    expect(CargosRepository.garantirCargoFuncionario).toHaveBeenCalledTimes(1);
    expect(FuncionarioService.cadastrarFuncionario).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "Maria Oliveira",
        cpf: "12345678901",
        email: "maria@email.com",
        id_cargos: 2,
      }),
    );
    expect(resultado).toEqual({ sucesso: true, resultado: 15 });
  });

  test("logs in using a case-insensitive email match", async () => {
    const senha = await bcrypt.hash("Senha123", 4);
    AuthRepository.buscarPorEmail.mockResolvedValue({
      id_funcionario: 7,
      id_cargos: 2,
      nome: "Maria Oliveira",
      email: "maria@email.com",
      senha,
    });

    const resultado = await AuthService.login({
      email: " Maria@Email.com ",
      senha: "Senha123",
    });

    expect(AuthRepository.buscarPorEmail).toHaveBeenCalledWith("maria@email.com");
    expect(resultado.token).toEqual(expect.any(String));
    expect(resultado.funcionario.email).toBe("maria@email.com");
  });
});
