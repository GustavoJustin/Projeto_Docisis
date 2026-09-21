const pool = require('../config/database')

class FornecedorRepository {
    async listarFornecedor() {
        const [rows] = await pool.query('SELECT * FROM tbl_fornecedor')
        return rows
    }

    async buscarFornecedorId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_fornecedor WHERE id_fornecedor = ?', [id])
        return rows[0]
    }

    async cadastrarFornecedor(dadosDoFornecedor) {
        const [resultado] = await pool.query('INSERT INTO tbl_fornecedor SET ?', [dadosDoFornecedor])
        return resultado.insertId
    }

    async atualizarFornecedor(id, dadosDoFornecedor) {
        const camposFornecedor = []
        const dadoFornecedor = []

        for(const [key, value] of Object.entries(dadosDoFornecedor)) {
            camposFornecedor.push(`${key} = ?`)
            dadoFornecedor.push(value)
        }

        if(camposFornecedor.length == 0) return null

        dadoFornecedor.push(id)

        const query = `UPDATE tbl_fornecedor SET ${camposFornecedor.join(',')} WHERE id_fornecedor = ?`

        const [resultado] = await pool.query(query, dadoFornecedor)

        return resultado.affectedRows
    }

    async deletarFornecedor(id) {
        await pool.query('DELETE FROM tbl_fornecedor WHERE id_fornecedor = ?', [id])
        return true
    }
}

module.exports = new FornecedorRepository()