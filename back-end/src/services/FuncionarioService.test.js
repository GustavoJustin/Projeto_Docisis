jest.mock("../repositories/FuncionariosRepository", () => ({
  cadastrarFuncionario: jest.fn(),
  buscarFuncionarioId: jest.fn(),
  listarFuncionario: jest.fn(),
  deletarFuncionario: jest.fn(),
  atualizarFotoPerfil: jest.fn(),
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

  test("stores an optional profile photo with the new employee", async () => {
    const foto = "data:image/jpeg;base64,aGVsbG8=";
    await FuncionarioService.cadastrarFuncionario({
      cpf: "12345678999",
      id_cargos: 1,
      nome: "Funcionário",
      email: "funcionario@example.com",
      senha: "123456",
      foto,
    });

    expect(FuncionariosRepository.cadastrarFuncionario).toHaveBeenCalledWith(
      expect.objectContaining({ foto }),
    );
  });
});

describe("FuncionarioService.deletarFuncionario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("blocks deletion of the last administrator", async () => {
    FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
      id_funcionario: 1,
      nome_cargo: "Administrador",
    });
    FuncionariosRepository.listarFuncionario.mockResolvedValue([
      { id_funcionario: 1, nome_cargo: "Administrador" },
    ]);

    await expect(FuncionarioService.deletarFuncionario(1)).rejects.toMatchObject({
      status: 409,
      mensagem: "Não é possível excluir o último administrador cadastrado.",
    });
    expect(FuncionariosRepository.deletarFuncionario).not.toHaveBeenCalled();
  });

  test("allows deletion of an administrator when another administrator remains", async () => {
    FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
      id_funcionario: 1,
      nome_cargo: "Administrador",
    });
    FuncionariosRepository.listarFuncionario.mockResolvedValue([
      { id_funcionario: 1, nome_cargo: "Administrador" },
      { id_funcionario: 2, nome_cargo: "Administrador" },
    ]);

    await expect(FuncionarioService.deletarFuncionario(1)).resolves.toEqual({
      sucesso: true,
      mensagem: "Funcionario apagado",
    });
    expect(FuncionariosRepository.deletarFuncionario).toHaveBeenCalledWith(1);
  });
});

describe("FuncionarioService.atualizarFotoPerfil", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("updates the authenticated user's profile photo", async () => {
    const foto = "data:image/jpeg;base64,aGVsbG8=";
    FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
      id_funcionario: 5,
    });

    await expect(FuncionarioService.atualizarFotoPerfil(5, foto)).resolves.toEqual({
      sucesso: true,
      mensagem: "Foto de perfil atualizada.",
    });
    expect(FuncionariosRepository.atualizarFotoPerfil).toHaveBeenCalledWith(5, foto);
  });

  test("rejects invalid profile photo data", async () => {
    await expect(FuncionarioService.atualizarFotoPerfil(5, "not-an-image")).rejects
      .toMatchObject({ status: 400 });
    expect(FuncionariosRepository.atualizarFotoPerfil).not.toHaveBeenCalled();
  });
});
