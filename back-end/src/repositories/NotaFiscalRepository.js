const pool = require('../config/database')

class NotaFiscalRepository {
    async listarNotaFiscal() {
        const [rows] = await pool.query('SELECT * FROM tbl_nota_fiscal')
        return rows
    }

    async buscarNotaFiscalId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_nota_fiscal WHERE id_nota_fiscal = ?', [id])
        return rows[0]
    }

    async cadastrarNotaFiscal(dadosDaNotaFiscal) {
        const [resultado] = await pool.query('INSERT INTO tbl_nota_fiscal SET ?', [dadosDaNotaFiscal])
        return resultado.insertId
    }

    async atualizarNotaFiscal(id, dadosDaNotaFiscal) {
        const camposNotaFiscal = []
        const dadoNotaFiscal = []

        for(const [key, value] of Object.entries(dadosDaNotaFiscal)) {
            camposNotaFiscal.push(`${key} = ?`)
            dadoNotaFiscal.push(value)
        }

        if(camposNotaFiscal.length == 0) return null

        dadoNotaFiscal.push(id)

        const query = `UPDATE tbl_nota_fiscal SET ${camposNotaFiscal.join(',')} WHERE id_nota_fiscal = ?`

        const [resultado] = await pool.query(query, dadoNotaFiscal)

        return resultado.affectedRows
    }

    async deletarNotaFiscal(id) {
        await pool.query('DELETE FROM tbl_nota_fiscal WHERE id_nota_fiscal = ?', [id])
        return true
    }
}

module.exports = new NotaFiscalRepository()