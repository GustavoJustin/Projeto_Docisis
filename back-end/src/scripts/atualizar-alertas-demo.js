require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

const pool = require('../config/database')
const { alertScenarios } = require('./demo-seed-data')

const LOCK_NAME = 'docegestao-demo-alert-updates'

async function updateDemoAlerts() {
    const requiredConfig = ['DB_HOST', 'DB_USER', 'DB_NAME']
    const missingConfig = requiredConfig.filter((key) => !process.env[key])
    if (missingConfig.length) {
        throw new Error(`Configure as variáveis ${missingConfig.join(', ')} no arquivo .env.`)
    }

    const connection = await pool.getConnection()
    let lockAcquired = false
    let transactionStarted = false

    try {
        const [locks] = await connection.query('SELECT GET_LOCK(?, 10) AS acquired', [LOCK_NAME])
        if (Number(locks[0]?.acquired) !== 1) {
            throw new Error('Não foi possível reservar a atualização dos alertas de demonstração.')
        }
        lockAcquired = true

        await connection.beginTransaction()
        transactionStarted = true

        const lots = Object.keys(alertScenarios)
        const placeholders = lots.map(() => '?').join(', ')
        const [existing] = await connection.query(
            `SELECT lote FROM tbl_produtos WHERE lote IN (${placeholders}) FOR UPDATE`,
            lots,
        )
        const existingLots = new Set(existing.map((product) => product.lote))
        const missingLots = lots.filter((lot) => !existingLots.has(lot))
        if (missingLots.length) {
            throw new Error(`Não foram encontrados todos os produtos de demonstração: ${missingLots.join(', ')}.`)
        }

        for (const [lot, scenario] of Object.entries(alertScenarios)) {
            await connection.query(
                `UPDATE tbl_produtos
                 SET validade = ?, quantidade = ?, estoque_maximo = ?
                 WHERE lote = ?`,
                [scenario.validity, scenario.quantity, scenario.max, lot],
            )
        }

        await connection.commit()
        transactionStarted = false
        return lots.length
    } catch (error) {
        if (transactionStarted) await connection.rollback()
        throw error
    } finally {
        try {
            if (lockAcquired) await connection.query('SELECT RELEASE_LOCK(?)', [LOCK_NAME])
        } finally {
            connection.release()
        }
    }
}

if (require.main === module) {
    updateDemoAlerts()
        .then((count) => {
            console.log(`Alertas atualizados em ${count} produtos de demonstração.`)
        })
        .catch((error) => {
            console.error(`Não foi possível atualizar os alertas: ${error.message}`)
            process.exitCode = 1
        })
        .finally(async () => {
            await pool.end()
        })
}

module.exports = { updateDemoAlerts }
