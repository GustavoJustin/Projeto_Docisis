jest.mock("../config/database", () => ({
  query: jest.fn(),
  getConnection: jest.fn(),
}));

const pool = require("../config/database");
const ProdutoRepository = require("./ProdutosRepository");

const stockColumns = [
  "id_fornecedor",
  "marca",
  "lote",
  "tipo",
  "validade",
  "nome_insumo",
  "descricao",
  "categoria",
  "preco",
  "quantidade",
  "estoque_maximo",
  "unidade",
  "imagem",
  "data_chegada",
  "ativo",
].map((Field) => ({ Field, Type: Field === "imagem" ? "mediumtext" : "varchar(200)" }));
stockColumns.unshift({
  Field: "id_produtos",
  Type: "int",
  Key: "PRI",
  Extra: "auto_increment",
});

describe("ProdutosRepository stock schema", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ProdutoRepository.preparacaoEstoque = null;
    ProdutoRepository.idAutoIncrement = undefined;
  });

  test("migrates missing inventory columns before listing database products", async () => {
    pool.query.mockImplementation(async (sql) => {
      if (sql === "SHOW COLUMNS FROM tbl_produtos") {
        return [[
          { Field: "id_produtos", Type: "int", Key: "PRI", Extra: "" },
        ], []];
      }
      if (sql === "SHOW COLUMNS FROM tbl_mov_ajuste_estoque") {
        return [[{ Field: "unidade" }], []];
      }
      if (sql === "SELECT * FROM tbl_produtos WHERE ativo = 1 ORDER BY id_produtos") {
        return [[], []];
      }
      return [{}, []];
    });

    await ProdutoRepository.listarProduto();

    expect(pool.query).toHaveBeenCalledWith(
      "ALTER TABLE tbl_produtos ADD COLUMN `quantidade` DECIMAL(12,2) NOT NULL DEFAULT 0",
    );
    expect(pool.query).toHaveBeenCalledWith(
      "ALTER TABLE tbl_produtos ADD COLUMN `id_fornecedor` INT NULL",
    );
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM tbl_produtos WHERE ativo = 1 ORDER BY id_produtos",
    );
  });

  test("soft deletes products to preserve stock movement references", async () => {
    pool.query.mockImplementation(async (sql) => {
      if (sql === "SHOW COLUMNS FROM tbl_produtos") return [stockColumns, []];
      if (sql === "SHOW COLUMNS FROM tbl_mov_ajuste_estoque") {
        return [[{ Field: "unidade" }], []];
      }
      if (sql === "UPDATE tbl_produtos SET ativo = 0 WHERE id_produtos = ?") {
        return [{ affectedRows: 1 }, []];
      }
      return [{}, []];
    });

    await expect(ProdutoRepository.deletarProduto(9)).resolves.toBe(true);
    expect(pool.query).toHaveBeenLastCalledWith(
      "UPDATE tbl_produtos SET ativo = 0 WHERE id_produtos = ?",
      [9],
    );
  });

  test("generates IDs under a database lock when the legacy primary key is not auto-increment", async () => {
    const connection = {
      query: jest.fn()
        .mockResolvedValueOnce([[{ adquirido: 1 }], []])
        .mockResolvedValueOnce([[{ proximoId: 8 }], []])
        .mockResolvedValueOnce([{ insertId: 0 }, []])
        .mockResolvedValueOnce([[{ liberado: 1 }], []]),
      release: jest.fn(),
    };
    pool.getConnection.mockResolvedValue(connection);
    ProdutoRepository.preparacaoEstoque = Promise.resolve();
    ProdutoRepository.idAutoIncrement = false;

    await expect(
      ProdutoRepository.cadastrarProduto({ marca: "Açúcar" }),
    ).resolves.toBe(8);
    expect(connection.query).toHaveBeenCalledWith(
      "INSERT INTO tbl_produtos SET ?",
      [{ marca: "Açúcar", id_produtos: 8 }],
    );
    expect(connection.release).toHaveBeenCalled();
  });

  test("updates stock and records its movement in one transaction", async () => {
    const connection = {
      beginTransaction: jest.fn().mockResolvedValue(),
      query: jest.fn()
        .mockResolvedValueOnce([[
          {
            id_produtos: 5,
            nome_insumo: "Farinha",
            quantidade: "8.00",
            estoque_maximo: "10.00",
            unidade: "kg",
            ativo: 1,
          },
        ], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []])
        .mockResolvedValueOnce([{ insertId: 31 }, []]),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    };
    pool.getConnection.mockResolvedValue(connection);
    ProdutoRepository.preparacaoEstoque = Promise.resolve();

    await expect(
      ProdutoRepository.registrarAjusteEstoque(5, 1, "Reposição", "Ana"),
    ).resolves.toMatchObject({ quantidade: 9, movimentacao: 31 });
    expect(connection.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM tbl_produtos WHERE id_produtos = ? AND ativo = 1 FOR UPDATE",
      [5],
    );
    expect(connection.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining("INSERT INTO tbl_mov_ajuste_estoque"),
      [5, "Farinha", "Ana", "ENTRADA", 8, 9, 1, "kg", "Reposição"],
    );
    expect(connection.commit).toHaveBeenCalled();
    expect(connection.rollback).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();
  });

  test("rejects stock adjustments above the configured maximum", async () => {
    const connection = {
      beginTransaction: jest.fn().mockResolvedValue(),
      query: jest.fn().mockResolvedValueOnce([[
        {
          id_produtos: 5,
          nome_insumo: "Farinha",
          quantidade: "10.00",
          estoque_maximo: "10.00",
          unidade: "kg",
          ativo: 1,
        },
      ], []]),
      commit: jest.fn(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    };
    pool.getConnection.mockResolvedValue(connection);
    ProdutoRepository.preparacaoEstoque = Promise.resolve();

    await expect(
      ProdutoRepository.registrarAjusteEstoque(5, 1, "", "Ana"),
    ).rejects.toMatchObject({ status: 400 });
    expect(connection.rollback).toHaveBeenCalled();
    expect(connection.commit).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();
  });

  test("allows reductions for products already above the configured maximum", async () => {
    const connection = {
      beginTransaction: jest.fn().mockResolvedValue(),
      query: jest.fn()
        .mockResolvedValueOnce([[
          {
            id_produtos: 5,
            nome_insumo: "Farinha",
            quantidade: "12.00",
            estoque_maximo: "10.00",
            unidade: "kg",
            ativo: 1,
          },
        ], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []])
        .mockResolvedValueOnce([{ insertId: 32 }, []]),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    };
    pool.getConnection.mockResolvedValue(connection);
    ProdutoRepository.preparacaoEstoque = Promise.resolve();

    await expect(
      ProdutoRepository.registrarAjusteEstoque(5, -1, "Correção", "Ana"),
    ).resolves.toMatchObject({ quantidade: 11 });
    expect(connection.commit).toHaveBeenCalled();
    expect(connection.rollback).not.toHaveBeenCalled();
  });

  test("updates the stock maximum atomically without creating a quantity movement", async () => {
    const connection = {
      beginTransaction: jest.fn().mockResolvedValue(),
      query: jest.fn()
        .mockResolvedValueOnce([[
          {
            id_produtos: 5,
            nome_insumo: "Farinha",
            quantidade: "8.00",
            estoque_maximo: "10.00",
            unidade: "kg",
            ativo: 1,
          },
        ], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []]),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      release: jest.fn(),
    };
    pool.getConnection.mockResolvedValue(connection);
    ProdutoRepository.preparacaoEstoque = Promise.resolve();

    await expect(
      ProdutoRepository.registrarAjusteEstoque(5, 0, "", "Ana", 15),
    ).resolves.toMatchObject({ quantidade: 8, maximo: 15, movimentacao: null });
    expect(connection.query).toHaveBeenNthCalledWith(
      2,
      "UPDATE tbl_produtos SET quantidade = ?, estoque_maximo = ? WHERE id_produtos = ?",
      [8, 15, 5],
    );
    expect(connection.query).toHaveBeenCalledTimes(2);
    expect(connection.commit).toHaveBeenCalled();
  });
});
