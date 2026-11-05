const express = require("express");
const router = express.Router();
const autenticar = require("../middleware/authMiddleware"); // JWT: importa o middleware
const exigirAdministrador = require("../middleware/roleMiddleware");
const FuncionariosRepository = require("../repositories/FuncionariosRepository");

// JWT: rota de login fica de fora do "autenticar" — senão ninguém consegue nem logar
const AuthRoutes = require("./AuthRoutes");
router.use("/login", AuthRoutes);
router.get("/sessao", autenticar, async (req, res) => {
  try {
    const funcionario = await FuncionariosRepository.buscarFuncionarioId(
      req.funcionario.id_funcionario,
    );
    if (!funcionario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "A conta autenticada não foi encontrada.",
      });
    }
    res.json({
      sucesso: true,
      funcionario,
    });
  } catch (erro) {
    res
      .status(500)
      .json({
        sucesso: false,
        mensagem: "Não foi possível validar o cargo da conta",
      });
  }
});

// A partir daqui, todo router ganhou "autenticar" como segundo argumento do .use()
// Isso faz o Express rodar o middleware ANTES do router — se o token não for
// válido, a requisição nem chega nas rotas de produtos, cargos, etc.

const produtosRoutes = require("./ProdutosRoutes");
router.use("/produtos", autenticar, produtosRoutes); // JWT: protegido

const CargosRoutes = require("./CargosRoutes");
router.use("/cargos", autenticar, CargosRoutes); // JWT: protegido

const EntradaRoutes = require("./EntradaRoutes");
router.use("/entradas", autenticar, exigirAdministrador, EntradaRoutes);

const EstoqueRoutes = require("./EstoqueRoutes");
router.use("/estoque", autenticar, EstoqueRoutes); // JWT: protegido

const FornecedorRoutes = require("./FornecedorRoutes");
router.use("/fornecedores", autenticar, FornecedorRoutes); // JWT: protegido

const FuncionariosRoutes = require("./FuncionariosRoutes");
router.use("/funcionarios", autenticar, FuncionariosRoutes); // JWT: protegido

const NotaFiscalRoutes = require("./NotaFiscalRoutes");
router.use("/nota", autenticar, NotaFiscalRoutes); // JWT: protegido

const PedidoRoutes = require("./PedidoRoutes");
router.use("/pedidos", autenticar, PedidoRoutes); // JWT: protegido

const SaidaRoutes = require("./SaidaRoutes");
router.use("/saidas", autenticar, exigirAdministrador, SaidaRoutes);

const RelatorioRoutes = require("./RelatorioRoutes");
router.use("/relatorios", autenticar, RelatorioRoutes); // JWT: protegido

const ChamadoRoutes = require("./ChamadoRoutes");
router.use("/chamados", autenticar, ChamadoRoutes);

module.exports = router;
