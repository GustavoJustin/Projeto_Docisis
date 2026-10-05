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

describe("Módulo de Fornecedores", () => {
  let tokenAdmin;

  beforeAll(async () => {
    // 1. Pré-condição: Token do gestor autenticado
    tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "admin@docisis.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("TC-FORNE-01 — Cadastrar um novo fornecedor", async () => {
    const timestamp = Date.now().toString().slice(-4);
    const novoFornecedor = {
      nome: "Distribuidora de Doces Ltda",
      nome_fornecedor: "Distribuidora de Doces Ltda",
      nomeFornecedor: "Distribuidora de Doces Ltda",
      cnpj: `123456780001${timestamp}`,
      cnpj_fornecedor: `123456780001${timestamp}`
    };

    const response = await request(app)
      .post("/fornecedores")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(novoFornecedor);

    console.log("Status TC-FORNE-01:", response.status);
    console.log("Corpo TC-FORNE-01:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucesso", true);
  });
});