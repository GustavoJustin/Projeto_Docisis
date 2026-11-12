jest.mock("../repositories/FuncionariosRepository", () => ({
  buscarFuncionarioId: jest.fn(),
}));

process.env.JWT_SECRET = "session-photo-test-secret";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const FuncionariosRepository = require("../repositories/FuncionariosRepository");
const app = require("../app");

describe("GET /sessao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the authenticated employee profile including its saved photo", async () => {
    const funcionario = {
      id_funcionario: 8,
      id_cargos: 2,
      nome: "Maria Oliveira",
      email: "maria@example.com",
      foto: "data:image/jpeg;base64,aGVsbG8=",
      nome_cargo: "Funcionário",
    };
    FuncionariosRepository.buscarFuncionarioId.mockResolvedValue(funcionario);
    const token = jwt.sign(
      { id_funcionario: funcionario.id_funcionario },
      process.env.JWT_SECRET,
    );

    const response = await request(app)
      .get("/sessao")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.funcionario).toEqual(funcionario);
    expect(FuncionariosRepository.buscarFuncionarioId).toHaveBeenCalledWith(8);
  });
});
