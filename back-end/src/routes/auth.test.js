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

describe("Módulo de Autenticação — Login", () => {
  const usuarioTeste = {
    nome: "Atendente Teste",
    cpf: "88877766655",
    id_cargos: 1,
    email: "atendente@docisis.com",
    senha: "SenhaValida123"
  };

  beforeAll(async () => {
    const tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "daniel@gmail.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(usuarioTeste);
  });

  test("TC-AUTH-02 — Login com credenciais válidas", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: usuarioTeste.email,
        senha: usuarioTeste.senha
      });

    expect(response.status).toBe(200);
  });

  test("TC-AUTH-03 — Login com senha incorreta", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: usuarioTeste.email,
        senha: "SenhaIncorreta"
      });

    expect(response.status).toBe(401);
  });

  test("TC-AUTH-04 — Login com e-mail inexistente", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "naoexiste@vetcare.com",
        senha: "Qualquer123"
      });

    expect(response.status).toBe(401);
  });
});