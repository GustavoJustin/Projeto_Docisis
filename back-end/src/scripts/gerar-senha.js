// Uso: node scripts/gerar-senha.js minhasenha123
// Ele imprime o hash — copia e cola num UPDATE tbl_funcionarios SET senha = '<hash>' WHERE ...
const bcrypt = require('bcryptjs')

const senha = process.argv[2]

if (!senha) {
    console.log('Uso: node scripts/gerar-senha.js <senha>')
    process.exit(1)
}

bcrypt.hash(senha, 10).then((hash) => {
    console.log(hash)
})