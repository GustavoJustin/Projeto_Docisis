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

describe("TC-AUTH-01 — Cadastro de novos funcionários", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      {
        id_funcionario: 1,
        email: "daniel@gmail.com",
        id_cargos: 1
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  test("deve cadastrar um novo funcionario com sucesso", async () => {
    const timestamp = Date.now().toString().slice(-8);
    const cpfValido = `999${timestamp}`;

    const novoFuncionario = {
      nome: "Lucas Andrade",
      cpf: cpfValido,
      id_cargos: 1,
      email: `lucas.${timestamp}@gmail.com`,
      senha: "senhaSegura123"
    };

    const response = await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${token}`)
      .send(novoFuncionario);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("sucesso", true);
    expect(response.body).toHaveProperty("mensagem", "Sucesso ao cadastrar");
  });
});