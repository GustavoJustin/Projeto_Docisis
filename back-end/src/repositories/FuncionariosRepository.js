const pool = require('../config/database')

class FuncionarioRepository {
    async listarFuncionario() {
        const [rows] = await pool.query('SELECT * FROM tbl_funcionarios')
        return rows
    }

    async buscarFuncionarioId(id) {
        const [rows] = await pool.query('SELECT * FROM tbl_funcionarios WHERE id_funcionario = ?', [id])
        return rows[0]
    }

    async cadastrarFuncionario(dadosDoFuncionario) {
        const [resultado] = await pool.query('INSERT INTO tbl_funcionarios SET ?', [dadosDoFuncionario])
        return resultado.insertId
    }

    async atualizarFuncionario(id, dadosDoFuncionario) {
        const camposFuncionario = []
        const dadoFuncionario = []

        for(const [key, value] of Object.entries(dadosDoFuncionario)) {
            camposFuncionario.push(`${key} = ?`)
            dadoFuncionario.push(value)
        }

        if(camposFuncionario.length == 0) return null

        dadoFuncionario.push(id)

        const query = `UPDATE tbl_funcionarios SET ${camposFuncionario.join(',')} WHERE id_funcionario = ?`

        const [resultado] = await pool.query(query, dadoFuncionario)

        return resultado.affectedRows
    }

    async deletarFuncionario(id) {
        await pool.query('DELETE FROM tbl_funcionarios WHERE id_funcionario = ?', [id])
        return true
    }
}

module.exports = new FuncionarioRepository()