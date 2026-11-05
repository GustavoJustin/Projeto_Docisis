jest.mock("../repositories/ProdutosRepository", () => ({
  listarProduto: jest.fn(),
  buscarProdutoId: jest.fn(),
  cadastrarProduto: jest.fn(),
  atualizarProduto: jest.fn(),
  deletarProduto: jest.fn(),
  listarMovimentacoesEstoque: jest.fn(),
  registrarAjusteEstoque: jest.fn(),
}));

const ProdutoRepository = require("../repositories/ProdutosRepository");
const ProdutoService = require("./ProdutosService");

describe("ProdutosService inventory integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("maps database products to inventory cards", async () => {
    ProdutoRepository.listarProduto.mockResolvedValue([
      {
        id_produtos: 12,
        marca: "Açúcar",
        nome_insumo: "Açúcar Refinado",
        tipo: "Açúcares",
        categoria: "Açúcares",
        quantidade: "45.00",
        estoque_maximo: "50.00",
        unidade: "kg",
        preco: "R$ 4,20/kg",
        imagem: "https://example.com/acucar.png",
        data_chegada: new Date("2026-01-02T00:00:00.000Z"),
        validade: new Date("2027-01-02T00:00:00.000Z"),
      },
    ]);

    await expect(ProdutoService.listarProdutos()).resolves.toMatchObject({
      sucesso: true,
      total: 1,
      dados: [
        {
          id: 12,
          nome: "Açúcar Refinado",
          categoria: "Açúcares",
          quantidade: 45,
          maximo: 50,
          unidade: "kg",
          chegada: "2026-01-02",
          validade: "2027-01-02",
        },
      ],
    });
  });

  test("creates a stock product using the inventory fields", async () => {
    ProdutoRepository.cadastrarProduto.mockResolvedValue(17);

    const result = await ProdutoService.cadastrarProduto({
      nome: "Leite condensado",
      categoria: "Laticínios",
      preco: "R$ 7,50/un",
      quantidade: 12,
      maximo: 24,
      unidade: "un",
      chegada: "2026-11-01",
      validade: "2027-01-01",
      imagem: "https://example.com/leite.png",
      descricao: "Leite condensado integral",
    });

    expect(result).toMatchObject({ sucesso: true, resultado: 17 });
    expect(ProdutoRepository.cadastrarProduto).toHaveBeenCalledWith(
      expect.objectContaining({
        marca: "Leite condensado",
        nome_insumo: "Leite condensado",
        categoria: "Laticínios",
        descricao: "Leite condensado integral",
        quantidade: 12,
        estoque_maximo: 24,
        unidade: "un",
        data_chegada: "2026-11-01",
        validade: "2027-01-01",
      }),
    );
  });

  test("updates the database quantity and validates values", async () => {
    ProdutoRepository.buscarProdutoId.mockResolvedValue({
      id_produtos: 5,
      quantidade: 5,
      estoque_maximo: 10,
    });

    await expect(
      ProdutoService.atualizarProduto(5, { quantidade: 8 }),
    ).resolves.toMatchObject({ sucesso: true });
    expect(ProdutoRepository.atualizarProduto).toHaveBeenCalledWith(5, {
      quantidade: 8,
    });

    await expect(
      ProdutoService.atualizarProduto(5, { quantidade: -1 }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      ProdutoService.atualizarProduto(5, { quantidade: 11 }),
    ).rejects.toMatchObject({ status: 400 });
  });

  test("rejects a new product whose initial stock is greater than its maximum", async () => {
    await expect(
      ProdutoService.cadastrarProduto({
        nome: "Farinha",
        categoria: "Farinhas",
        quantidade: 74,
        maximo: 45,
      }),
    ).rejects.toMatchObject({ status: 400 });
    expect(ProdutoRepository.cadastrarProduto).not.toHaveBeenCalled();
  });

  test("records inventory adjustments with the logged-in user", async () => {
    ProdutoRepository.registrarAjusteEstoque.mockResolvedValue({
      id_produtos: 5,
      quantidade: 6,
      movimentacao: 21,
    });

    await expect(
      ProdutoService.registrarAjusteEstoque(
        5,
        { variacao: 1, descricao: "Reposição" },
        { email: "ana@example.com" },
      ),
    ).resolves.toMatchObject({ sucesso: true, dados: { movimentacao: 21 } });
    expect(ProdutoRepository.registrarAjusteEstoque).toHaveBeenCalledWith(
      5,
      1,
      "Reposição",
      "ana@example.com",
      undefined,
    );
  });

  test("accepts compressed local image data URLs", async () => {
    ProdutoRepository.cadastrarProduto.mockResolvedValue(18);
    await expect(
      ProdutoService.cadastrarProduto({
        nome: "Morango",
        categoria: "Laticínios",
        quantidade: 1,
        maximo: 4,
        imagem: "data:image/webp;base64,AA==",
      }),
    ).resolves.toMatchObject({ sucesso: true, resultado: 18 });
  });

  test("accepts a compressed JPEG data URL produced by local image selection", async () => {
    ProdutoRepository.cadastrarProduto.mockResolvedValue(19);
    await expect(
    ProdutoService.cadastrarProduto({
      nome: "Morango",
      categoria: "Frutas",
      quantidade: 1,
      maximo: 4,
      imagem: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
    }),
    ).resolves.toMatchObject({ sucesso: true, resultado: 19 });
  });

  test("allows changing only the stock maximum through the adjustment service", async () => {
    ProdutoRepository.registrarAjusteEstoque.mockResolvedValue({
    id_produtos: 5,
    quantidade: 6,
    maximo: 15,
    movimentacao: null,
    });

    await expect(
    ProdutoService.registrarAjusteEstoque(
      5,
      { variacao: 0, maximo: 15 },
      { nome: "Ana" },
    ),
    ).resolves.toMatchObject({ sucesso: true, dados: { maximo: 15 } });
    expect(ProdutoRepository.registrarAjusteEstoque).toHaveBeenCalledWith(
    5,
    0,
    "",
    "Ana",
    15,
    );
  });

  test("rejects an initial stock above the configured limit", async () => {
    await expect(
    ProdutoService.cadastrarProduto({
      nome: "Farinha",
      categoria: "Farinhas",
      quantidade: 31,
      maximo: 20,
    }),
    ).rejects.toMatchObject({
    status: 400,
    mensagem: "A quantidade atual não pode ultrapassar o estoque máximo.",
    });
  });

  test("archives database products when they are removed from inventory", async () => {
    ProdutoRepository.buscarProdutoId.mockResolvedValue({ id_produtos: 5 });

    await expect(ProdutoService.deletarProduto(5)).resolves.toMatchObject({
      sucesso: true,
    });
    expect(ProdutoRepository.deletarProduto).toHaveBeenCalledWith(5);
  });

  test("keeps the existing legacy product creation contract", async () => {
    ProdutoRepository.cadastrarProduto.mockResolvedValue(21);

    await ProdutoService.cadastrarProduto({
      marca: "Nestle",
      lote: "L-2026",
      tipo: "Chocolate",
      id_fornecedor: 1,
      nome: "Chocolate em pó",
    });

    expect(ProdutoRepository.cadastrarProduto).toHaveBeenCalledWith({
      marca: "Nestle",
      lote: "L-2026",
      tipo: "Chocolate",
      validade: null,
      id_fornecedor: 1,
    });
  });
});
