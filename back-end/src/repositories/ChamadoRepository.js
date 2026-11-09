const pool = require("../config/database");

class ChamadoRepository {
  async garantirTabela() {
    if (!this.preparacaoTabela) {
      this.preparacaoTabela = (async () => {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS tbl_chamados (
          id_chamado INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          id_funcionario INT NULL,
          descricao TEXT NOT NULL,
          criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          id_responsavel INT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'aberto',
          assumido_em DATETIME NULL,
          concluido_em DATETIME NULL,
          INDEX idx_tbl_chamados_criado_em (criado_em)
        )
        `);

        const [colunas] = await pool.query("SHOW COLUMNS FROM tbl_chamados");
        const existentes = new Set(colunas.map((coluna) => coluna.Field));
        const definicoes = {
          id_responsavel: "INT NULL",
          status: "VARCHAR(20) NOT NULL DEFAULT 'aberto'",
          assumido_em: "DATETIME NULL",
          concluido_em: "DATETIME NULL",
        };
        for (const [coluna, definicao] of Object.entries(definicoes)) {
          if (!existentes.has(coluna)) {
            await pool.query(
              `ALTER TABLE tbl_chamados ADD COLUMN \`${coluna}\` ${definicao}`,
            );
          }
        }
      })().catch((erro) => {
        this.preparacaoTabela = null;
        throw erro;
      });
    }
    await this.preparacaoTabela;
  }

  async listarChamados() {
    await this.garantirTabela();
    const [rows] = await pool.query(`
      SELECT c.id_chamado, c.id_funcionario, c.descricao, c.criado_em,
             c.id_responsavel, c.status, c.assumido_em, c.concluido_em,
             solicitante.nome AS solicitante_nome,
             responsavel.nome AS responsavel_nome
      FROM tbl_chamados c
      LEFT JOIN tbl_funcionarios solicitante
        ON solicitante.id_funcionario = c.id_funcionario
      LEFT JOIN tbl_funcionarios responsavel
        ON responsavel.id_funcionario = c.id_responsavel
      WHERE c.status <> 'concluido'
      ORDER BY c.criado_em DESC, c.id_chamado DESC
    `);
    return rows;
  }

  async listarHistoricoChamados() {
    await this.garantirTabela();
    const [rows] = await pool.query(`
      SELECT c.id_chamado, c.id_funcionario, c.descricao, c.criado_em,
             c.id_responsavel, c.status, c.assumido_em, c.concluido_em,
             solicitante.nome AS solicitante_nome,
             responsavel.nome AS responsavel_nome
      FROM tbl_chamados c
      LEFT JOIN tbl_funcionarios solicitante
        ON solicitante.id_funcionario = c.id_funcionario
      LEFT JOIN tbl_funcionarios responsavel
        ON responsavel.id_funcionario = c.id_responsavel
      ORDER BY COALESCE(c.concluido_em, c.assumido_em, c.criado_em) DESC,
               c.id_chamado DESC
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

  async buscarChamadoId(id) {
    await this.garantirTabela();
    const [rows] = await pool.query(`
      SELECT c.id_chamado, c.id_funcionario, c.descricao, c.criado_em,
             c.id_responsavel, c.status, c.assumido_em, c.concluido_em,
             solicitante.nome AS solicitante_nome,
             responsavel.nome AS responsavel_nome
      FROM tbl_chamados c
      LEFT JOIN tbl_funcionarios solicitante
        ON solicitante.id_funcionario = c.id_funcionario
      LEFT JOIN tbl_funcionarios responsavel
        ON responsavel.id_funcionario = c.id_responsavel
      WHERE c.id_chamado = ?
    `, [id]);
    return rows[0] || null;
  }

  async assumirChamado(id, funcionarioId) {
    await this.garantirTabela();
    const [resultado] = await pool.query(`
      UPDATE tbl_chamados
      SET id_responsavel = ?, status = 'em_resolucao',
          assumido_em = CURRENT_TIMESTAMP
      WHERE id_chamado = ? AND status = 'aberto'
    `, [funcionarioId, id]);
    return resultado.affectedRows > 0 ? this.buscarChamadoId(id) : null;
  }

  async concluirChamado(id, funcionarioId) {
    await this.garantirTabela();
    const [resultado] = await pool.query(`
      UPDATE tbl_chamados
      SET status = 'concluido', concluido_em = CURRENT_TIMESTAMP
      WHERE id_chamado = ? AND status = 'em_resolucao'
        AND id_responsavel = ?
    `, [id, funcionarioId]);
    return resultado.affectedRows > 0 ? this.buscarChamadoId(id) : null;
  }
}

module.exports = new ChamadoRepository();
