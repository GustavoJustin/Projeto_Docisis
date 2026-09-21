const pool = require('../config/database')

class PedidoRepository {
    async listarPedido() {
        const [rows] = await pool.query('SELECT * FROM tbl_pedido')
        return rows
    }

    async buscarPedidoId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_pedido WHERE id_pedido = ?', [id])
        return rows[0]
    }

    async cadastrarPedido(dadosDoPedido) {
        const [resultado] = await pool.query('INSERT INTO tbl_pedido SET ?', [dadosDoPedido])
        return resultado.insertId
    }

    async atualizarPedido(id, dadosDoPedido) {
        const camposPedido = []
        const dadoPedido = []

        for(const [key, value] of Object.entries(dadosDoPedido)) {
            camposPedido.push(`${key} = ?`)
            dadoPedido.push(value)
        }

        if(camposPedido.length == 0) return null

        dadoPedido.push(id)

        const query = `UPDATE tbl_pedido SET ${camposPedido.join(',')} WHERE id_pedido = ?`

        const [resultado] = await pool.query(query, dadoPedido)

        return resultado.affectedRows
    }

    async deletarPedido(id) {
        await pool.query('DELETE FROM tbl_pedido WHERE id_pedido = ?', [id])
        return true
    }
}

module.exports = new PedidoRepository()