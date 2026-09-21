const pool = require('../config/database')

class EntradaRepository {
    async listarEntrada() {
        const [rows] = await pool.query('SELECT * FROM tbl_mov_entrada')
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