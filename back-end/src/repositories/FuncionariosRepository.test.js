jest.mock("../config/database", () => ({
  query: jest.fn(),
}));

const pool = require("../config/database");
const FuncionariosRepository = require("./FuncionariosRepository");

describe("FuncionariosRepository.prepararSchemaAutenticacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(FuncionariosRepository, "prepararSchemaCpf").mockResolvedValue();
  });

  describe("FuncionariosRepository photo support", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      FuncionariosRepository.preparacaoColunaFoto = null;
    });

    test("adds the photo column when listing employees on an old schema", async () => {
      const employees = [{ id_funcionario: 1, foto: "data:image/jpeg;base64,aGVsbG8=" }];
      pool.query
        .mockResolvedValueOnce([[], []])
        .mockResolvedValueOnce([{}, []])
        .mockResolvedValueOnce([{}, []])
        .mockResolvedValueOnce([employees, []]);

      await expect(FuncionariosRepository.listarFuncionario()).resolves.toEqual(employees);

      expect(pool.query.mock.calls[1][0]).toContain(
        "ADD COLUMN foto LONGTEXT NULL",
      );
      expect(pool.query.mock.calls[2][0]).toContain(
        "ADD COLUMN pode_cadastrar_funcionarios",
      );
      expect(pool.query.mock.calls[3][0]).toContain("f.foto");
    });

    test("updates an employee profile photo", async () => {
      const foto = "data:image/jpeg;base64,aGVsbG8=";
      pool.query
        .mockResolvedValueOnce([[
          { Field: "foto" },
          { Field: "pode_cadastrar_funcionarios" },
        ], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []]);

      await expect(FuncionariosRepository.atualizarFotoPerfil(5, foto)).resolves.toBe(1);
      expect(pool.query.mock.calls[1][0]).toContain("SET foto = ?");
      expect(pool.query.mock.calls[1][1]).toEqual([foto, 5]);
    });
  });

  test("adds login columns and replaces the unique role index without dropping the CPF primary key", async () => {
    pool.query
      .mockResolvedValueOnce([
        [
          { Field: "cpf" },
          { Field: "id_cargos" },
          { Field: "nome" },
          { Field: "email" },
        ],
        [],
      ])
      .mockResolvedValueOnce([{}, []])
      .mockResolvedValueOnce([
        [
          { Key_name: "PRIMARY", Column_name: "cpf", Non_unique: 0 },
          { Key_name: "cpf", Column_name: "cpf", Non_unique: 0 },
          { Key_name: "id_cargos", Column_name: "id_cargos", Non_unique: 0 },
        ],
        [],
      ])
      .mockResolvedValueOnce([{}, []])
      .mockResolvedValueOnce([{}, []]);

    await FuncionariosRepository.prepararSchemaAutenticacao();

    expect(pool.query.mock.calls[1][0]).toContain(
      "ADD COLUMN id_funcionario INT NOT NULL AUTO_INCREMENT UNIQUE FIRST",
    );
    expect(pool.query.mock.calls[1][0]).toContain(
      "ADD COLUMN senha VARCHAR(255) NULL",
    );
    expect(pool.query.mock.calls[1][0]).not.toContain("DROP PRIMARY KEY");
    expect(pool.query.mock.calls[3][0]).toContain(
      "ADD INDEX idx_tbl_funcionarios_id_cargos (id_cargos)",
    );
    expect(pool.query.mock.calls[4][0]).toContain("DROP INDEX `id_cargos`");
  });

  test("leaves an already compatible employee schema unchanged", async () => {
    pool.query
      .mockResolvedValueOnce([
        [
          { Field: "id_funcionario" },
          { Field: "id_cargos" },
          { Field: "cpf" },
          { Field: "nome" },
          { Field: "email" },
          { Field: "senha" },
        ],
        [],
      ])
      .mockResolvedValueOnce([
        [
          { Key_name: "PRIMARY", Column_name: "id_funcionario", Non_unique: 0 },
          { Key_name: "id_cargos", Column_name: "id_cargos", Non_unique: 1 },
        ],
        [],
      ]);

    await FuncionariosRepository.prepararSchemaAutenticacao();

    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  test("converts CPF columns and restores their foreign keys", async () => {
    FuncionariosRepository.prepararSchemaCpf.mockRestore();
    pool.query
      .mockResolvedValueOnce([
        [
          { TABLE_NAME: "tbl_funcionarios", COLUMN_NAME: "cpf", DATA_TYPE: "int" },
          { TABLE_NAME: "tbl_mov_entrada", COLUMN_NAME: "cpf", DATA_TYPE: "int" },
          { TABLE_NAME: "tbl_mov_saida", COLUMN_NAME: "cpf", DATA_TYPE: "int" },
        ],
        [],
      ])
      .mockResolvedValueOnce([
        [
          {
            TABLE_NAME: "tbl_mov_entrada",
            CONSTRAINT_NAME: "fk_cpf_mov_entrada",
            COLUMN_NAME: "cpf",
            REFERENCED_TABLE_NAME: "tbl_funcionarios",
            REFERENCED_COLUMN_NAME: "cpf",
            ORDINAL_POSITION: 1,
            UPDATE_RULE: "NO ACTION",
            DELETE_RULE: "NO ACTION",
          },
          {
            TABLE_NAME: "tbl_mov_saida",
            CONSTRAINT_NAME: "fk_cpf_mov_saida",
            COLUMN_NAME: "cpf",
            REFERENCED_TABLE_NAME: "tbl_funcionarios",
            REFERENCED_COLUMN_NAME: "cpf",
            ORDINAL_POSITION: 1,
            UPDATE_RULE: "NO ACTION",
            DELETE_RULE: "NO ACTION",
          },
        ],
        [],
      ])
      .mockResolvedValueOnce([
        [
          {
            TABLE_NAME: "tbl_funcionarios",
            COLUMN_NAME: "cpf",
            IS_NULLABLE: "NO",
            COLUMN_DEFAULT: null,
          },
          {
            TABLE_NAME: "tbl_mov_entrada",
            COLUMN_NAME: "cpf",
            IS_NULLABLE: "NO",
            COLUMN_DEFAULT: null,
          },
          {
            TABLE_NAME: "tbl_mov_saida",
            COLUMN_NAME: "cpf",
            IS_NULLABLE: "NO",
            COLUMN_DEFAULT: null,
          },
        ],
        [],
      ])
      .mockResolvedValueOnce([
        [
          {
            DEFAULT_CHARACTER_SET_NAME: "utf8mb4",
            DEFAULT_COLLATION_NAME: "utf8mb4_unicode_ci",
          },
        ],
        [],
      ])
      .mockResolvedValue([{}, []]);

    await FuncionariosRepository.prepararSchemaCpf();

    expect(pool.query.mock.calls[4][0]).toContain(
      "DROP FOREIGN KEY `fk_cpf_mov_entrada`",
    );
    expect(pool.query.mock.calls[5][0]).toContain(
      "DROP FOREIGN KEY `fk_cpf_mov_saida`",
    );
    expect(pool.query.mock.calls[6][0]).toContain("MODIFY COLUMN `cpf` VARCHAR(11)");
    expect(pool.query.mock.calls[9][0]).toContain(
      "ADD CONSTRAINT `fk_cpf_mov_entrada` FOREIGN KEY (`cpf`) REFERENCES `tbl_funcionarios` (`cpf`)",
    );
    expect(pool.query.mock.calls[10][0]).toContain(
      "ADD CONSTRAINT `fk_cpf_mov_saida` FOREIGN KEY (`cpf`) REFERENCES `tbl_funcionarios` (`cpf`)",
    );
    expect(pool.query).toHaveBeenCalledTimes(11);
  });

  test("does not alter CPF columns that already support 11 characters", async () => {
    FuncionariosRepository.prepararSchemaCpf.mockRestore();
    pool.query.mockResolvedValueOnce([
      [
        {
          TABLE_NAME: "tbl_funcionarios",
          COLUMN_NAME: "cpf",
          DATA_TYPE: "varchar",
          CHARACTER_MAXIMUM_LENGTH: 11,
        },
      ],
      [],
    ]);

    await FuncionariosRepository.prepararSchemaCpf();

    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
