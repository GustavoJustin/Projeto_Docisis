const pool = require('../config/database')

class AuthRepository {
    // Usado no login pra pegar o funcionário (com a senha em hash) pelo email
    async buscarPorEmail(email) {
        const [rows] = await pool.query('SELECT * FROM tbl_funcionarios WHERE email = ?', [email])
        return rows[0]
    }
}

module.exports = new AuthRepository()