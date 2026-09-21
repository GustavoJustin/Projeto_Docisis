const pool = require('../config/database')

class ProdutoRepository {
    async listarProduto() {
        const [rows] = await pool.query('SELECT * FROM tbl_produtos')
        return rows
    }

    async buscarProdutoId(id) {
    const [rows] = await pool.query('SELECT * FROM tbl_produtos WHERE id_produtos = ?', [id])
    return rows[0]
}

    async cadastrarProduto(dadosDoProduto) {
        const [resultado] = await pool.query('INSERT INTO tbl_produtos SET ?', [dadosDoProduto])
        return resultado.insertId
    }

    async atualizarProduto(id, dadosDoProduto) {
        const camposProduto = []
        const dadoProduto = []

        for(const [key, value] of Object.entries(dadosDoProduto)) {
            camposProduto.push(`${key} = ?`)
            dadoProduto.push(value)
        }

        if(camposProduto.length == 0) return null

        dadoProduto.push(id)

        const query = `UPDATE tbl_produtos SET ${camposProduto.join(',')} WHERE id_produtos = ?`

        const [resultado] = await pool.query(query, dadoProduto)

        return resultado.affectedRows
    }

    async deletarProduto(id) {
        await pool.query('DELETE FROM tbl_produtos WHERE id_produtos = ?', [id])
        return true
    }
}

module.exports = new ProdutoRepository()