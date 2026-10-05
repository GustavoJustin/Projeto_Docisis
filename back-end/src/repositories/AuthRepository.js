const pool = require("../config/database");

class AuthRepository {
  // Usado no login pra pegar o funcionário (com a senha em hash) pelo email
  async buscarPorEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM tbl_funcionarios WHERE email = ?",
      [email],
    );
    return rows[0];
  }

  async buscarContatoAdministrador() {
    const [rows] = await pool.query(`
            SELECT f.nome, f.email
            FROM tbl_funcionarios f
            JOIN tbl_cargos c ON c.id_cargos = f.id_cargos
            WHERE LOWER(c.nome_cargo) LIKE '%admin%'
            ORDER BY f.id_funcionario
            LIMIT 1
        `);
    return rows[0] || null;
  }
}

module.exports = new AuthRepository();
