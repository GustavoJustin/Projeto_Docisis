const pool = require('../config/database')

class EstoqueRepository {
    async listarEstoque() {
        const [rows] = await pool.query('SELECT * FROM tbl_estoque')
        return rows
    }

    async buscarEstoqueId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_estoque WHERE id_produtos = ?', [id])
        return rows[0]
    }

    async cadastrarEstoque(dadosDoEstoque) {
        const [resultado] = await pool.query('INSERT INTO tbl_estoque SET ?', [dadosDoEstoque])
        return resultado.insertId
    }

    async atualizarEstoque(id, dadosDoEstoque) {
        const camposEstoque = []
        const dadoEstoque = []

        for(const [key, value] of Object.entries(dadosDoEstoque)) {
            camposEstoque.push(`${key} = ?`)
            dadoEstoque.push(value)
        }

        if(camposEstoque.length == 0) return null

        dadoEstoque.push(id)

        const query = `UPDATE tbl_estoque SET ${camposEstoque.join(',')} WHERE id_produtos = ?`

        const [resultado] = await pool.query(query, dadoEstoque)

        return resultado.affectedRows
    }

    async deletarEstoque(id) {
        await pool.query('DELETE FROM tbl_estoque WHERE id_produtos = ?', [id])
        return true
    }
}

module.exports = new EstoqueRepository()