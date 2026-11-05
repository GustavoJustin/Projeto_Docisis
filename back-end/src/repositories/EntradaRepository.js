const pool = require('../config/database')

class EntradaRepository {
    async buscarFuncionarioPorCpf(cpf) {
        const [rows] = await pool.query('SELECT id_funcionario FROM tbl_funcionarios WHERE cpf = ?', [String(cpf).replace(/\D/g, '')])
        return rows[0]
    }

    async listarEntrada() {
        const [rows] = await pool.query(`
            SELECT m.*, p.nome_item, p.marca, COALESCE(p.nome_item, p.marca) AS produto,
                   f.nome AS usuario_nome, f.cpf
            FROM tbl_mov_entrada m
            LEFT JOIN tbl_produtos p ON p.id_produtos = m.id_produtos
            LEFT JOIN tbl_funcionarios f ON f.id_funcionario = m.id_funcionario
            ORDER BY m.data_hora DESC
        `)
        return rows
    }

    async buscarEntradaId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_mov_entrada WHERE id_mov_entrada = ?', [id])
        return rows[0]
    }

    async cadastrarEntrada(dadosDaEntrada) {
        const [resultado] = await pool.query('INSERT INTO tbl_mov_entrada SET ?', [dadosDaEntrada])
        return resultado.insertId
    }

    async atualizarEntrada(id, dadosDaEntrada) {
        const camposEntrada = []
        const dadoEntrada = []

        for(const [key, value] of Object.entries(dadosDaEntrada)) {
            camposEntrada.push(`${key} = ?`)
            dadoEntrada.push(value)
        }

        if(camposEntrada.length == 0) return null

        dadoEntrada.push(id)

        const query = `UPDATE tbl_mov_entrada SET ${camposEntrada.join(',')} WHERE id_mov_entrada = ?`

        const [resultado] = await pool.query(query, dadoEntrada)

        return resultado.affectedRows
    }

    async deletarEntrada(id) {
        await pool.query('DELETE FROM tbl_mov_entrada WHERE id_mov_entrada = ?', [id])
        return true
    }
}

module.exports = new EntradaRepository()