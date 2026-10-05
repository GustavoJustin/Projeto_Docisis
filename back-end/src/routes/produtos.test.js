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

describe("Módulo de Produtos", () => {
  let tokenAdmin;

  beforeAll(async () => {
    // 1. Pré-condição: Token do gestor/responsável por estoque autenticado
    tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "admin@docisis.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("TC-PROD-01 — Checar produtos com estoque baixo", async () => {
    const response = await request(app)
      .get("/produtos/estoque-baixo")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    console.log("Status TC-PROD-01:", response.status);
    console.log("Corpo TC-PROD-01:", response.body);

    expect(response.status).toBe(200);
  });

  test("TC-PROD-02 — Registrar Novo produto no sistema", async () => {
    const novoProduto = {
      marca: "nestle",
      nome_fornecedor: "distribuidoras de doces ltda",
      nomeFornecedor: "distribuidoras de doces ltda",
      fornecedor: "distribuidoras de doces ltda",
      lote: "12026-10b",
      tipo: "chocolate em pó 70%",
      nome: "chocolate em pó 70%",
      validade: "2027-04-04",
      id_fornecedor: 1,
      quantidade: 20,
      quantidade_minima: 5
    };

    const response = await request(app)
      .post("/produtos")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(novoProduto);

    console.log("Status TC-PROD-02:", response.status);
    console.log("Corpo TC-PROD-02:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucesso", true);
  });
});