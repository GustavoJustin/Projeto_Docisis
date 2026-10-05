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

describe("Módulo de Pedidos", () => {
  let tokenAdmin;

  beforeAll(async () => {
    // 1. Pré-condição: Token autenticado de gestor/estoque
    tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "admin@docisis.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("TC-PED-01 — Solicitação de recursos faltante", async () => {
    const solicitacaoPedido = {
      nome: "distribuidora de doces & ingredientes Ltda",
      fornecedor: "distribuidora de doces & ingredientes Ltda",
      nome_fornecedor: "distribuidora de doces & ingredientes Ltda",
      produto: "farinha de trigo especial",
      nome_produto: "farinha de trigo especial",
      id_fornecedor: 1,
      quantidade: 10
    };

    const response = await request(app)
      .post("/pedidos")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(solicitacaoPedido);

    console.log("Status TC-PED-01:", response.status);
    console.log("Corpo TC-PED-01:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucesso", true);
  });
});