require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

const bcrypt = require('bcryptjs')
const pool = require('../config/database')
const { suppliers, employees, products, alertScenarios } = require('./demo-seed-data')

const LOCK_NAME = 'docegestao-demo-seed'
const PRODUCT_COLUMNS = [
    'id_fornecedor',
    'marca',
    'lote',
    'tipo',
    'validade',
    'nome_insumo',
    'descricao',
    'categoria',
    'preco',
    'quantidade',
    'estoque_maximo',
    'unidade',
    'imagem',
    'data_chegada',
    'ativo',
]

async function ensureCargo(connection, name, department) {
    const [rows] = await connection.query(
        'SELECT id_cargos FROM tbl_cargos WHERE LOWER(nome_cargo) = LOWER(?) ORDER BY id_cargos LIMIT 1 FOR UPDATE',
        [name],
    )
    if (rows[0]) return Number(rows[0].id_cargos)

    const [result] = await connection.query(
        `INSERT INTO tbl_cargos
            (nivel_acesso_1, nivel_acesso_2, nome_cargo, departamento, jornada)
         VALUES (1, 1, ?, ?, '08:00:00')`,
        [name, department],
    )
    return result.insertId
}

async function ensureSupplier(connection, name) {
    const [rows] = await connection.query(
        'SELECT id_fornecedor FROM tbl_fornecedor WHERE nome_fornecedor = ? ORDER BY id_fornecedor LIMIT 1 FOR UPDATE',
        [name],
    )
    if (rows[0]) return Number(rows[0].id_fornecedor)

    const [result] = await connection.query(
        'INSERT INTO tbl_fornecedor (nome_fornecedor) VALUES (?)',
        [name],
    )
    return result.insertId
}

async function seedDemo() {
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
            throw new Error('Não foi possível reservar a carga de demonstração no banco.')
        }
        lockAcquired = true

        await connection.beginTransaction()
        transactionStarted = true

        const cargoIds = {
            Administrador: await ensureCargo(connection, 'Administrador', 'Administração'),
            'Funcionário': await ensureCargo(connection, 'Funcionário', 'Operação'),
        }
        const supplierIds = []
        for (const supplier of suppliers) {
            supplierIds.push(await ensureSupplier(connection, supplier))
        }

        let employeesInserted = 0
        let employeesSkipped = 0
        for (const [index, employee] of employees.entries()) {
            const [existing] = await connection.query(
                'SELECT id_funcionario FROM tbl_funcionarios WHERE email = ? OR cpf = ? LIMIT 1 FOR UPDATE',
                [employee.email, employee.cpf],
            )
            if (existing.length) {
                employeesSkipped += 1
                continue
            }

            const passwordHash = await bcrypt.hash(String(index + 1), 10)
            await connection.query(
                `INSERT INTO tbl_funcionarios
                    (id_cargos, cpf, nome, email, senha, foto,
                     pode_cadastrar_funcionarios, pode_excluir_funcionarios)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    cargoIds[employee.role],
                    employee.cpf,
                    employee.name,
                    employee.email,
                    passwordHash,
                    employee.photo,
                    employee.canCreateEmployees,
                    employee.canDeleteEmployees,
                ],
            )
            employeesInserted += 1
        }

        let productsInserted = 0
        let productsSkipped = 0
        for (const product of products) {
                const [existing] = await connection.query(
                'SELECT id_produtos FROM tbl_produtos WHERE lote = ? LIMIT 1 FOR UPDATE',
                [product[2]],
            )
            if (existing.length) {
                productsSkipped += 1
                continue
            }

            const row = [...product]
            row[0] = row[0] === null ? null : supplierIds[row[0] - 1]
            const values = Object.fromEntries(PRODUCT_COLUMNS.map((column, index) => [
                column,
                row[index],
            ]))
            await connection.query('INSERT INTO tbl_produtos SET ?', [values])
            productsInserted += 1
        }

        await connection.commit()
        transactionStarted = false

        return {
            suppliers: suppliers.length,
            employeesInserted,
            employeesSkipped,
            productsInserted,
            productsSkipped,
            alertScenarios: Object.keys(alertScenarios).length,
        }
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
    seedDemo()
        .then((result) => {
            console.log('Carga de demonstração concluída.')
            console.log(`Fornecedores verificados: ${result.suppliers}`)
            console.log(`Funcionários inseridos: ${result.employeesInserted}; ignorados: ${result.employeesSkipped}`)
            console.log(`Produtos inseridos: ${result.productsInserted}; ignorados: ${result.productsSkipped}`)
            console.log('Senhas de demonstração: números de 1 a 5, na ordem dos funcionários no arquivo.')
        })
        .catch((error) => {
            console.error(`Não foi possível carregar os dados de demonstração: ${error.message}`)
            process.exitCode = 1
        })
        .finally(async () => {
            await pool.end()
        })
}

module.exports = { seedDemo }
