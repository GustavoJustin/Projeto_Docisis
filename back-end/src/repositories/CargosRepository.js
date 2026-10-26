const pool = require('../config/database')

class CargosRepository {
    async garantirCargo(nomeCargo, departamento) {
        const [cargos] = await pool.query(
            'SELECT * FROM tbl_cargos WHERE LOWER(nome_cargo) LIKE ? ORDER BY id_cargos LIMIT 1',
            [`%${nomeCargo.toLowerCase()}%`],
        )
        if (cargos[0]) return cargos[0]

        const [colunas] = await pool.query("SHOW COLUMNS FROM tbl_cargos LIKE 'id_cargos'")
        const idAutoIncrement = colunas[0]?.Extra?.toLowerCase().includes('auto_increment')

        if (idAutoIncrement) {
            await pool.query(
                `INSERT INTO tbl_cargos (
                    nivel_acesso_1,
                    nivel_acesso_2,
                    nome_cargo,
                    departamento,
                    jornada
                ) VALUES (1, 1, ?, ?, '08:00:00')`,
                [nomeCargo, departamento],
            )
        } else {
            const [ids] = await pool.query(
                'SELECT COALESCE(MAX(id_cargos), 0) + 1 AS proximo_id FROM tbl_cargos',
            )
            await pool.query(
                `INSERT INTO tbl_cargos (
                    id_cargos,
                    nivel_acesso_1,
                    nivel_acesso_2,
                    nome_cargo,
                    departamento,
                    jornada
                ) VALUES (?, 1, 1, ?, ?, '08:00:00')`,
                [ids[0].proximo_id, nomeCargo, departamento],
            )
        }

        const [novoCargo] = await pool.query(
            'SELECT * FROM tbl_cargos WHERE LOWER(nome_cargo) = LOWER(?) ORDER BY id_cargos LIMIT 1',
            [nomeCargo],
        )
        return novoCargo[0]
    }

    async listarCargo() {
        const [rows] = await pool.query('SELECT * FROM tbl_cargos')
        return rows
    }

    async garantirCargoFuncionario() {
        return this.garantirCargo('Funcionário', 'Operação')
    }

    async garantirCargoAdministrador() {
        return this.garantirCargo('Administrador', 'Administração')
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