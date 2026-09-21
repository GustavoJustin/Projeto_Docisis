// Fica na frente de toda rota que exige login. Se o token não vier, não for
// válido ou tiver expirado, corta ali mesmo e a rota real nem chega a rodar.
const jwt = require('jsonwebtoken')

function autenticar(req, res, next) {
    // O front manda assim: Authorization: "Bearer eyJhbGciOi..."
    const authHeader = req.headers['authorization']

    if(!authHeader) {
        return res.status(401).json({ sucesso: false, mensagem: "Token não informado" })
    }

    const [tipo, token] = authHeader.split(' ')

    if(tipo !== 'Bearer' || !token) {
        return res.status(401).json({ sucesso: false, mensagem: "Token mal formatado" })
    }

    jwt.verify(token, process.env.JWT_SECRET, (erro, dadosDoToken) => {
        if(erro) {
            // Cai aqui tanto se o token for falso quanto se já tiver expirado (8h)
            return res.status(401).json({ sucesso: false, mensagem: "Token inválido ou expirado" })
        }

        // A partir daqui, qualquer controller/service da rota pode usar
        // req.funcionario.id_funcionario, req.funcionario.id_cargos, etc.
        req.funcionario = dadosDoToken
        next()
    })
}

module.exports = autenticar