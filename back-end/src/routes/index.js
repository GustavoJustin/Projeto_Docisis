const express = require('express')
const router = express.Router()
const autenticar = require('../middleware/authMiddleware') // JWT: importa o middleware

// JWT: rota de login fica de fora do "autenticar" — senão ninguém consegue nem logar
const AuthRoutes = require('./AuthRoutes')
router.use('/login', AuthRoutes)

// A partir daqui, todo router ganhou "autenticar" como segundo argumento do .use()
// Isso faz o Express rodar o middleware ANTES do router — se o token não for
// válido, a requisição nem chega nas rotas de produtos, cargos, etc.

const produtosRoutes = require('./ProdutosRoutes')
router.use('/produtos', autenticar, produtosRoutes) // JWT: protegido

const CargosRoutes = require('./CargosRoutes')
router.use('/cargos', autenticar, CargosRoutes) // JWT: protegido

const EntradaRoutes = require('./EntradaRoutes')
router.use('/entradas', autenticar, EntradaRoutes) // JWT: protegido

const EstoqueRoutes = require('./EstoqueRoutes')
router.use('/estoque', autenticar, EstoqueRoutes) // JWT: protegido

const FornecedorRoutes = require('./FornecedorRoutes')
router.use('/fornecedores', autenticar, FornecedorRoutes) // JWT: protegido

const FuncionariosRoutes = require('./FuncionariosRoutes')
router.use('/funcionarios', autenticar, FuncionariosRoutes) // JWT: protegido

const NotaFiscalRoutes = require('./NotaFiscalRoutes')
router.use('/nota', autenticar, NotaFiscalRoutes) // JWT: protegido

const PedidoRoutes = require('./PedidoRoutes')
router.use('/pedidos', autenticar, PedidoRoutes) // JWT: protegido

const SaidaRoutes = require('./SaidaRoutes')
router.use('/saidas', autenticar, SaidaRoutes) // JWT: protegido

const RelatorioRoutes = require('./RelatorioRoutes')
router.use('/relatorios', autenticar, RelatorioRoutes) // JWT: protegido

module.exports = router