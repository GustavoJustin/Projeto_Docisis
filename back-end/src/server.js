const express = require('express')
require('dotenv').config()

const routes = require('./routes/index')

const app = express()

app.use(express.json())

// JWT/FRONT: serve os arquivos estáticos (html, css, js) de dentro de "public".
// É o que permite o front chamar fetch('/api/login') sem precisar de CORS,
// porque front e back passam a responder na mesma origem/porta.
// Bota index.html, splash.html, estoqueInsumo.html, css/ e js/ dentro de uma
// pasta "public" na raiz do projeto (do lado de fora de src/, no mesmo nível de package.json).
app.use(express.static('public'))

app.use('/api', routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})