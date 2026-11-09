jest.mock("../repositories/FuncionariosRepository", () => ({
  cadastrarFuncionario: jest.fn(),
  buscarFuncionarioId: jest.fn(),
  listarFuncionario: jest.fn(),
  deletarFuncionario: jest.fn(),
  atualizarFotoPerfil: jest.fn(),
  atualizarFuncionario: jest.fn(),
}));
jest.mock("../repositories/CargosRepository", () => ({
  buscarCargoId: jest.fn(),
}));
jest.mock("../repositories/HistoricoContaRepository", () => ({
  registrarAcaoConta: jest.fn(),
}));

const FuncionariosRepository = require("../repositories/FuncionariosRepository");
const CargosRepository = require("../repositories/CargosRepository");
const HistoricoContaRepository = require("../repositories/HistoricoContaRepository");
const FuncionarioService = require("./FuncionarioService");

describe("FuncionarioService.cadastrarFuncionario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    FuncionariosRepository.cadastrarFuncionario.mockResolvedValue(1);
    CargosRepository.buscarCargoId.mockResolvedValue({ nome_cargo: "Funcionário" });
    HistoricoContaRepository.registrarAcaoConta.mockResolvedValue();
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
    expect(HistoricoContaRepository.registrarAcaoConta).toHaveBeenCalledWith(
      expect.objectContaining({ acao: "criacao", email_funcionario: "admin@gmail.com" }),
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

  test("stores the create permission only for an explicitly authorized admin", async () => {
    CargosRepository.buscarCargoId.mockResolvedValue({ nome_cargo: "Administrador" });
    await FuncionarioService.cadastrarFuncionario({
      cpf: "12345678999",
      id_cargos: 1,
      nome: "Admin",
      email: "admin@example.com",
      senha: "123456",
      pode_cadastrar_funcionarios: true,
    });

    expect(FuncionariosRepository.cadastrarFuncionario).toHaveBeenCalledWith(
      expect.objectContaining({ pode_cadastrar_funcionarios: 1 }),
    );
  });

  test("does not grant employee accounts the permission to create employees", async () => {
    await FuncionarioService.cadastrarFuncionario({
      cpf: "12345678999",
      id_cargos: 1,
      nome: "Funcionário",
      email: "funcionario@example.com",
      senha: "123456",
      pode_cadastrar_funcionarios: true,
    });

    expect(FuncionariosRepository.cadastrarFuncionario).toHaveBeenCalledWith(
      expect.objectContaining({ pode_cadastrar_funcionarios: 0 }),
    );
  });
});

describe("FuncionarioService.deletarFuncionario", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HistoricoContaRepository.registrarAcaoConta.mockResolvedValue();
  });

  test("blocks deletion of the last administrator", async () => {
    FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({
      id_funcionario: 1,
      email: "admin@example.com",
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
      nome: "Admin",
      email: "admin@example.com",
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
    expect(HistoricoContaRepository.registrarAcaoConta).toHaveBeenCalledWith(
      expect.objectContaining({ acao: "remocao" }),
    );
  });
});

describe("FuncionarioService.atualizarFotoPerfil", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("FuncionarioService.redefinirSenha", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("stores only a new password hash", async () => {
      FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({ id_funcionario: 5 });

      await expect(FuncionarioService.redefinirSenha(5, "novaSenha123")).resolves.toEqual({
        sucesso: true,
        mensagem: "Senha redefinida com sucesso.",
      });
      const [, dadosAtualizados] = FuncionariosRepository.atualizarFuncionario.mock.calls[0];
      expect(dadosAtualizados.senha).not.toBe("novaSenha123");
      expect(dadosAtualizados.senha).toMatch(/^\$2[aby]\$/);
    });

    test("rejects passwords shorter than six characters", async () => {
      await expect(FuncionarioService.redefinirSenha(5, "123")).rejects.toMatchObject({
        status: 400,
      });
      expect(FuncionariosRepository.atualizarFuncionario).not.toHaveBeenCalled();
    });
  });

  describe("FuncionarioService.atualizarPerfil", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("persists the authenticated user's name and email and returns refreshed data", async () => {
      FuncionariosRepository.buscarFuncionarioId
        .mockResolvedValueOnce({ id_funcionario: 5 })
        .mockResolvedValueOnce({
          id_funcionario: 5,
          nome: "Nome Atualizado",
          email: "atualizado@example.com",
        });

      await expect(FuncionarioService.atualizarPerfil(5, {
        nome: " Nome Atualizado ",
        email: " ATUALIZADO@EXAMPLE.COM ",
      })).resolves.toMatchObject({
        sucesso: true,
        dados: { nome: "Nome Atualizado", email: "atualizado@example.com" },
      });
      expect(FuncionariosRepository.atualizarFuncionario).toHaveBeenCalledWith(5, {
        nome: "Nome Atualizado",
        email: "atualizado@example.com",
      });
    });

    test("rejects invalid names and emails without writing", async () => {
      await expect(FuncionarioService.atualizarPerfil(5, {
        nome: " ",
        email: "invalid",
      })).rejects.toMatchObject({ status: 400 });
      expect(FuncionariosRepository.atualizarFuncionario).not.toHaveBeenCalled();
    });

    test("reports duplicate email conflicts", async () => {
      FuncionariosRepository.buscarFuncionarioId.mockResolvedValue({ id_funcionario: 5 });
      FuncionariosRepository.atualizarFuncionario.mockRejectedValue({ code: "ER_DUP_ENTRY" });

      await expect(FuncionarioService.atualizarPerfil(5, {
        nome: "Nome",
        email: "duplicado@example.com",
      })).rejects.toMatchObject({ status: 409 });
    });
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
