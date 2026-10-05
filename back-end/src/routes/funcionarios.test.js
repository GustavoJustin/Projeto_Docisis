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

describe("Módulo de Funcionários", () => {
  let tokenAdmin;
  let idFuncionarioCriado;
  let idAdminCriado;

  beforeAll(async () => {
    // 1. Pré-condição: Token do gestor autenticado
    tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "admin@docisis.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 2. Pré-condição: Registo prévio de um funcionário para testes de busca e exclusão
    const timestampFunc = Date.now().toString().slice(-6);
    const resFunc = await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nome: "Funcionário Teste Exclusão",
        cpf: `10${timestampFunc}`,
        id_cargos: 2,
        email: `operacoes.${timestampFunc}@docisis.com`,
        senha: "SenhaValida123"
      });

    idFuncionarioCriado = resFunc.body.resultado;

    // 3. Pré-condição: Registo prévio de um administrador para consulta
    const timestampAdmin = Date.now().toString().slice(-6);
    const resAdmin = await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nome: "Administrador Consultado",
        cpf: `11${timestampAdmin}`,
        id_cargos: 1,
        email: `admin.busca.${timestampAdmin}@docisis.com`,
        senha: "SenhaValida123"
      });

    idAdminCriado = resAdmin.body.resultado;
  });

  test("TC-FUNC-01 — Cadastro de novos funcionários", async () => {
    const timestamp = Date.now().toString().slice(-6);
    const novoFuncionario = {
      nome: "Carlos Eduardo",
      cpf: `12${timestamp}`,
      id_cargos: 1,
      email: `carlos.${timestamp}@docisis.com`,
      senha: "SenhaValida123"
    };

    const response = await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(novoFuncionario);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucesso", true);
    expect(response.body).toHaveProperty("resultado");
  });

  test("TC-FUNC-02 — Acessar um funcionário específico e seus dados", async () => {
    const response = await request(app)
      .get(`/funcionarios/${idFuncionarioCriado}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
  });

  test("TC-FUNC-03 — Cadastrar um novo administrador", async () => {
    const timestamp = Date.now().toString().slice(-6);
    const novoAdmin = {
      nome: "Fernanda Admin",
      cpf: `13${timestamp}`,
      id_cargos: 1,
      email: `admin.${timestamp}@docisis.com`,
      senha: "SenhaValida123"
    };

    const response = await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(novoAdmin);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucesso", true);
    expect(response.body).toHaveProperty("resultado");
  });

  test("TC-FUNC-04 — Acessar um administrador específico e seus dados", async () => {
    const response = await request(app)
      .get(`/funcionarios/${idAdminCriado}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
  });

  test("TC-FUNC-05 — Exclusão de um funcionário existente", async () => {
    const response = await request(app)
      .delete(`/funcionarios/${idFuncionarioCriado}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    console.log("Status TC-FUNC-05:", response.status);
    console.log("Corpo TC-FUNC-05:", response.body);

    expect([200, 204]).toContain(response.status);
  });
});