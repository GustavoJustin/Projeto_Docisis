
const AuthService = require('../services/AuthService')

class AuthController {
    async login(req, res) {
        try {
            const resultado = await AuthService.login(req.body)
            res.json(resultado)

        } catch (erro) {
            res.status(erro.status || 500).json({
                sucesso: false,
                mensagem: erro.mensagem || "Erro interno do servidor",
                erro: erro.stack || erro
            })
        }
    }
}

module.exports = new AuthController()