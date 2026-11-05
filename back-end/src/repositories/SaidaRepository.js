const pool = require('../config/database')

class SaidaRepository {
    async buscarFuncionarioPorCpf(cpf) {
        const [rows] = await pool.query('SELECT id_funcionario FROM tbl_funcionarios WHERE cpf = ?', [String(cpf).replace(/\D/g, '')])
        return rows[0]
    }

    async listarSaida() {
        const [rows] = await pool.query(`
            SELECT m.*, p.nome_item, p.marca, COALESCE(p.nome_item, p.marca) AS produto,
                   f.nome AS usuario_nome, f.cpf
            FROM tbl_mov_saida m
            LEFT JOIN tbl_produtos p ON p.id_produtos = m.id_produtos
            LEFT JOIN tbl_funcionarios f ON f.id_funcionario = m.id_funcionario
            ORDER BY m.data_hora DESC
        `)
        return rows
    }

    async buscarSaidaId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_mov_saida WHERE id_mov_saida = ?', [id])
        return rows[0]
    }

    async cadastrarSaida(dadosDaSaida) {
        const [resultado] = await pool.query('INSERT INTO tbl_mov_saida SET ?', [dadosDaSaida])
        return resultado.insertId
    }

    async atualizarSaida(id, dadosDaSaida) {
        const camposSaida = []
        const dadoSaida = []

        for(const [key, value] of Object.entries(dadosDaSaida)) {
            camposSaida.push(`${key} = ?`)
            dadoSaida.push(value)
        }

        if(camposSaida.length == 0) return null

        dadoSaida.push(id)

        const query = `UPDATE tbl_mov_saida SET ${camposSaida.join(',')} WHERE id_mov_saida = ?`

        const [resultado] = await pool.query(query, dadoSaida)

        return resultado.affectedRows
    }

    async deletarSaida(id) {
        await pool.query('DELETE FROM tbl_mov_saida WHERE id_mov_saida = ?', [id])
        return true
    }
}

module.exports = new SaidaRepository()