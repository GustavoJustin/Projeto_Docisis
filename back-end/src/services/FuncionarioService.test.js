jest.mock("../repositories/FuncionariosRepository", () => ({
  cadastrarFuncionario: jest.fn(),
}));

const FuncionariosRepository = require("../repositories/FuncionariosRepository");
const FuncionarioService = require("./FuncionarioService");

describe("FuncionarioService.cadastrarFuncionario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    FuncionariosRepository.cadastrarFuncionario.mockResolvedValue(1);
  });

  test("normalizes a formatted CPF and stores it as 11 digits", async () => {
    await FuncionarioService.cadastrarFuncionario({
      cpf: "123.456.789-99",
      id_cargos: 1,
      nome: "Admin",
      email: "admin@gmail.com",
      senha: "123456",
    });

    expect(FuncionariosRepository.cadastrarFuncionario).toHaveBeenCalledWith(
      expect.objectContaining({ cpf: "12345678999" }),
    );
  });

  test("rejects CPF values that do not contain 11 digits", async () => {
    await expect(
      FuncionarioService.cadastrarFuncionario({
        cpf: "1234567899",
        id_cargos: 1,
        nome: "Admin",
        email: "admin@gmail.com",
        senha: "123456",
      }),
    ).rejects.toMatchObject({
      status: 400,
      mensagem: "Informe um CPF com 11 dígitos",
    });
    expect(FuncionariosRepository.cadastrarFuncionario).not.toHaveBeenCalled();
  });
});
