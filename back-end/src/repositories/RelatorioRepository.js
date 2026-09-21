const pool = require('../config/database')

const mapaColunas = {
    entrada: 'id_entrada',
    estoque: 'id_estoque',
    fornecedor: 'id_fornecedor',
    funcionario: 'id_funcionario',
    notaFiscal: 'id_nota_fiscal',
    pedido: 'id_pedido',
    produto: 'id_produto',
    saida: 'id_saida'
}

class RelatorioRepository {
    async listarRelatorio() {
        const [rows] = await pool.query('SELECT * FROM tbl_relatorios')
        return rows
    }

    async buscarRelatorioId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_relatorios WHERE id_relatorio = ?', [id])
        return rows[0]
    }

    async cadastrarRelatorio(dadosDoRelatorio) {
        const dadosMapeados = {}

        for(const [campo, valor] of Object.entries(dadosDoRelatorio)) {
            dadosMapeados[mapaColunas[campo]] = valor
        }

        const [resultado] = await pool.query('INSERT INTO tbl_relatorios SET ?', [dadosMapeados])
        return resultado.insertId
    }

    async atualizarRelatorio(id, dadosDoRelatorio) {
        const camposRelatorio = []
        const dadoRelatorio = []

        for(const [campo, valor] of Object.entries(dadosDoRelatorio)) {
            camposRelatorio.push(`${mapaColunas[campo]} = ?`)
            dadoRelatorio.push(valor)
        }

        if(camposRelatorio.length == 0) return null

        dadoRelatorio.push(id)

        const query = `UPDATE tbl_relatorios SET ${camposRelatorio.join(',')} WHERE id_relatorio = ?`

        const [resultado] = await pool.query(query, dadoRelatorio)

        return resultado.affectedRows
    }

    async deletarRelatorio(id) {
        await pool.query('DELETE FROM tbl_relatorios WHERE id_relatorio = ?', [id])
        return true
    }
}

module.exports = new RelatorioRepository()