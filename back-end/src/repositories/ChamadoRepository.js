const pool = require("../config/database");

class ChamadoRepository {
  async garantirTabela() {
    if (!this.preparacaoTabela) {
      this.preparacaoTabela = pool.query(`
        CREATE TABLE IF NOT EXISTS tbl_chamados (
          id_chamado INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          id_funcionario INT NULL,
          descricao TEXT NOT NULL,
          criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_tbl_chamados_criado_em (criado_em)
        )
      `).catch((erro) => {
        this.preparacaoTabela = null;
        throw erro;
      });
    }
    await this.preparacaoTabela;
  }

  async listarChamados() {
    await this.garantirTabela();
    const [rows] = await pool.query(`
      SELECT id_chamado, id_funcionario, descricao, criado_em
      FROM tbl_chamados
      ORDER BY criado_em DESC, id_chamado DESC
    `);
    return rows;
  }

  async cadastrarChamado(dados) {
    await this.garantirTabela();
    const [resultado] = await pool.query(
      "INSERT INTO tbl_chamados (id_funcionario, descricao) VALUES (?, ?)",
      [dados.id_funcionario, dados.descricao],
    );
    const [rows] = await pool.query(
      "SELECT id_chamado, id_funcionario, descricao, criado_em FROM tbl_chamados WHERE id_chamado = ?",
      [resultado.insertId],
    );
    return rows[0];
  }

  async deletarChamado(id) {
    await this.garantirTabela();
    const [resultado] = await pool.query(
      "DELETE FROM tbl_chamados WHERE id_chamado = ?",
      [id],
    );
    return resultado.affectedRows > 0;
  }
}

module.exports = new ChamadoRepository();
