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

describe("TC-AUTH-02 — Login com credenciais válidas", () => {
  const usuarioTeste = {
    nome: "Atendente Teste",
    cpf: "88877766655",
    id_cargos: 1,
    email: "atendente@docisis.com",
    senha: "SenhaValida123"
  };

  beforeAll(async () => {
    // 1. Gera token admin para permitir a criação do usuário no banco
    const tokenAdmin = jwt.sign(
      { id_funcionario: 1, email: "daniel@gmail.com", id_cargos: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 2. Garante que o atendente exista para poder testar o login
    await request(app)
      .post("/funcionarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(usuarioTeste);
  });

  test("deve realizar login com sucesso e retornar os tokens", async () => {
    const response = await request(app)
      .post("/login") // <--- Rota exata encontrada no index.js!
      .send({
        email: usuarioTeste.email,
        senha: usuarioTeste.senha
      });

    console.log("Status do Login:", response.status);
    console.log("Resposta do Login:", response.body);

    expect(response.status).toBe(200);
  });
});