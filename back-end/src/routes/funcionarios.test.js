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

  beforeAll(async () => {
    // 1. Pré-condição: Criação do token de gestor/administrador (id_cargos = 1)
    tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "admin@docisis.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 2. Pré-condição do TC-FUNC-02: Cria um funcionário e guarda seu ID para a busca
    const timestamp = Date.now().toString().slice(-8);
    const res = await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nome: "Funcionário Teste Busca",
        cpf: `777${timestamp}`,
        id_cargos: 1,
        email: `busca.${timestamp}@docisis.com`,
        senha: "SenhaValida123"
      });

    idFuncionarioCriado = res.body.resultado;
  });

  test("TC-FUNC-01 — Cadastro de novos funcionários", async () => {
    const timestamp = Date.now().toString().slice(-8);
    const cpfValido = `999${timestamp}`;

    const novoFuncionario = {
      nome: "Carlos Eduardo",
      cpf: cpfValido,
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
    // Usa o ID criado previamente na pré-condição
    const response = await request(app)
      .get(`/funcionarios/${idFuncionarioCriado}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    console.log("Status TC-FUNC-02:", response.status);
    console.log("Corpo TC-FUNC-02:", response.body);

    expect(response.status).toBe(200);
  });
});