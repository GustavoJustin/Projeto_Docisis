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

describe("Módulo de Relatórios", () => {
  let tokenAdmin;

  beforeAll(async () => {
    // Intercepta a validação do cargo no banco
    if (CargosRepository && CargosRepository.buscarCargoId) {
      jest.spyOn(CargosRepository, "buscarCargoId").mockResolvedValue({
        id_cargos: 1,
        nome_cargo: "Administrador"
      });
    }

    tokenAdmin = jwt.sign(
      {
        id: 1,
        id_usuario: 1,
        id_funcionario: 1,
        cpf: "12369027800",
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

  test("TC-ENT-01 — Validar informações geradas pelo relatório", async () => {
    const response = await request(app)
      .get("/relatorios/gerar")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .query({
        dataInicio: "01-09-2026",
        dataFim: "01-10-2026",
        data_inicio: "01-09-2026",
        data_fim: "01-10-2026"
      });

    console.log("Status Relatório:", response.status);
    console.log("Corpo Relatório:", response.body);

    expect(response.status).toBe(200);
  });
});