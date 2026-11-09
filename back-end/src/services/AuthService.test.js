jest.mock("../repositories/AuthRepository", () => ({
  buscarPorEmail: jest.fn(),
}));
const AuthRepository = require("../repositories/AuthRepository");
const AuthService = require("./AuthService");
const bcrypt = require("bcryptjs");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "auth-service-test-secret";
  });

  test("logs in using a case-insensitive email match", async () => {
    const senha = await bcrypt.hash("Senha123", 4);
    AuthRepository.buscarPorEmail.mockResolvedValue({
      id_funcionario: 7,
      id_cargos: 2,
      nome: "Maria Oliveira",
      email: "maria@email.com",
      senha,
      foto: "data:image/jpeg;base64,aGVsbG8=",
      pode_cadastrar_funcionarios: 1,
    });

    const resultado = await AuthService.login({
      email: " Maria@Email.com ",
      senha: "Senha123",
    });

    expect(AuthRepository.buscarPorEmail).toHaveBeenCalledWith("maria@email.com");
    expect(resultado.token).toEqual(expect.any(String));
    expect(resultado.funcionario.email).toBe("maria@email.com");
    expect(resultado.funcionario.foto).toBe("data:image/jpeg;base64,aGVsbG8=");
    expect(resultado.funcionario.pode_cadastrar_funcionarios).toBe(1);
  });
});
