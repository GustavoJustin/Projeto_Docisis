require("dotenv").config();

process.env.JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_para_testes";
process.env.DB_HOST = process.env.DB_HOST || "localhost";
process.env.DB_USER = process.env.DB_USER || "root";
process.env.DB_PASSWORD = process.env.DB_PASSWORD || "root";
process.env.DB_NAME = process.env.DB_NAME || "db_docisis";
process.env.DB_PORT = process.env.DB_PORT || 3306;

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const CargosRepository = require("../repositories/CargosRepository");

describe("Módulo de Entradas no Estoque", () => {
  let tokenAdmin;

  beforeAll(async () => {
    // Mock do cargo de Administrador no repositório
    jest.spyOn(CargosRepository, "buscarCargoId").mockResolvedValue({
      id_cargos: 1,
      nome_cargo: "Administrador"
    });

    tokenAdmin = jwt.sign(
      {
        id_funcionario: 1,
        cpf: "12369027800",
        cpf_funcionario: "12369027800",
        email: "admin@docisis.com",
        id_cargos: 1
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("TC-ENT-01 — Adicionar movimentação de recurso no estoque", async () => {
    const novaEntrada = {
      id_nota_fiscal: 934321,
      nota_fiscal: 934321,
      id_produto: 1,
      cpf: "12369027800",
      cpf_funcionario: "12369027800",
      cpfFuncionario: "12369027800",
      quantidade: 50,
      horario: "07:00",
      horario_entrada: "07:00",
      preco: 12.50,
      preco_unitario: 12.50
    };

    const response = await request(app)
      .post("/entradas")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(novaEntrada);

    console.log("Status TC-ENT-01:", response.status);
    console.log("Corpo TC-ENT-01:", response.body);

    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty("sucesso", true);
  });
});