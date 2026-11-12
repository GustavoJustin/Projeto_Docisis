const pool = require("../config/database");

class HistoricoContaRepository {
  async garantirTabela() {
    if (!this.preparacaoTabela) {
      this.preparacaoTabela = pool
        .query(`
          CREATE TABLE IF NOT EXISTS tbl_historico_contas (
            id_historico BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            acao VARCHAR(20) NOT NULL,
            id_administrador INT NULL,
            nome_administrador VARCHAR(255) NOT NULL,
            id_funcionario INT NULL,
            nome_funcionario VARCHAR(255) NOT NULL,
            email_funcionario VARCHAR(255) NOT NULL,
            ocorrido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_historico_contas_ocorrido_em (ocorrido_em)
          )
        `)
        .catch((error) => {
          this.preparacaoTabela = null;
          throw error;
        });
    }
    await this.preparacaoTabela;
  }

  async registrarAcaoConta(dados) {
    await this.garantirTabela();
    await pool.query(
      `INSERT INTO tbl_historico_contas
        (acao, id_administrador, nome_administrador, id_funcionario,
         nome_funcionario, email_funcionario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dados.acao,
        dados.id_administrador || null,
        dados.nome_administrador || "Administrador",
        dados.id_funcionario || null,
        dados.nome_funcionario,
        dados.email_funcionario,
      ],
    );
  }

  async listarAcoesContas() {
    await this.garantirTabela();
    const [rows] = await pool.query(`
      SELECT id_historico, acao, nome_administrador, nome_funcionario,
             email_funcionario, ocorrido_em
      FROM tbl_historico_contas
      ORDER BY ocorrido_em DESC, id_historico DESC
    `);
    return rows;
  }
}

module.exports = new HistoricoContaRepository();
