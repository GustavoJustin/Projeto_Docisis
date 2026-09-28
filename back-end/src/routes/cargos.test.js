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

describe("Módulo de Cargos", () => {
  let tokenAdmin;

  beforeAll(async () => {
    // 1. Pré-condição: Token de gestor autenticado
    tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "admin@docisis.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 2. Pré-condição: Cadastrar funcionário com o cargo para teste de filtro
    const timestamp = Date.now().toString().slice(-6);
    await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nome: "Maria Confeiteira",
        cpf: `15${timestamp}`,
        id_cargos: 2,
        email: `confeiteira.${timestamp}@docisis.com`,
        senha: "SenhaValida123"
      });
  });

  test("TC-CARG-01 — Consulta de funcionários por cargos", async () => {
    const response = await request(app)
      .get("/funcionarios")
      .query({ cargo: "confeiteira" })
      .set("Authorization", `Bearer ${tokenAdmin}`);

    console.log("Status TC-CARG-01:", response.status);
    console.log("Corpo TC-CARG-01:", response.body);

    expect(response.status).toBe(200);
  });
});