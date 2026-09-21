const pool = require('../config/database')

class CargosRepository {
    async listarCargo() {
        const [rows] = await pool.query('SELECT * FROM tbl_cargos')
        return rows
    }

   async buscarCargoId(id) {
    const [rows] = await pool.query('SELECT * FROM tbl_cargos WHERE id_cargos = ?', [id])
    return rows[0]
}

    async cadastrarCargo(dadosDoCargo) {
        const [resultado] = await pool.query('INSERT INTO tbl_cargos SET ?', [dadosDoCargo])
        return resultado.insertId
    }

    async atualizarCargo(id, dadosDoCargo) {
        const camposCargo = []
        const dadoCargo = []

        for(const [key, value] of Object.entries(dadosDoCargo)) {
            camposCargo.push(`${key} = ?`)
            dadoCargo.push(value)
        }

        if(camposCargo.length == 0) return null

        dadoCargo.push(id)

        const query = `UPDATE tbl_cargos SET ${camposCargo.join(',')} WHERE id_cargos = ?`

        const [resultado] = await pool.query(query, dadoCargo)

        return resultado.affectedRows
    }

    async deletarCargo(id) {
        await pool.query('DELETE FROM tbl_cargos WHERE id_cargos = ?', [id])
        return true
    }
}

module.exports = new CargosRepository()