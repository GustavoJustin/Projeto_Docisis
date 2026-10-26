const pool = require('../config/database')

class FuncionarioRepository {
    async prepararSchemaAutenticacao() {
        const [colunas] = await pool.query('SHOW COLUMNS FROM tbl_funcionarios')
        const nomesColunas = new Set(colunas.map((coluna) => coluna.Field))
        const alteracoes = []

        if (!nomesColunas.has('id_funcionario')) {
            alteracoes.push(
                'ADD COLUMN id_funcionario INT NOT NULL AUTO_INCREMENT UNIQUE FIRST',
            )
        }
        if (!nomesColunas.has('senha')) {
            alteracoes.push('ADD COLUMN senha VARCHAR(255) NULL')
        }
        if (alteracoes.length > 0) {
            await pool.query(
                `ALTER TABLE tbl_funcionarios ${alteracoes.join(', ')}`,
            )
        }

        const [indices] = await pool.query('SHOW INDEX FROM tbl_funcionarios')
        const indicesPorNome = new Map()
        for (const indice of indices) {
            const grupo = indicesPorNome.get(indice.Key_name) || {
                unico: indice.Non_unique === 0,
                colunas: [],
            }
            grupo.colunas.push(indice.Column_name)
            indicesPorNome.set(indice.Key_name, grupo)
        }

        const indiceNaoUnicoCargo = [...indicesPorNome.values()].some(
            (indice) =>
                !indice.unico &&
                indice.colunas.length === 1 &&
                indice.colunas[0] === 'id_cargos',
        )
        const indiceUnicoCargo = [...indicesPorNome.entries()].find(
            ([nome, indice]) =>
                nome !== 'PRIMARY' &&
                indice.unico &&
                indice.colunas.length === 1 &&
                indice.colunas[0] === 'id_cargos',
        )

        if (indiceUnicoCargo && !indiceNaoUnicoCargo) {
            await pool.query(
                'ALTER TABLE tbl_funcionarios ADD INDEX idx_tbl_funcionarios_id_cargos (id_cargos)',
            )
        }

        if (indiceUnicoCargo) {
            const nomeSeguro = `\`${indiceUnicoCargo[0].replace(/`/g, '``')}\``
            await pool.query(
                `ALTER TABLE tbl_funcionarios DROP INDEX ${nomeSeguro}`,
            )
        }

        await this.prepararSchemaCpf()
    }

    async prepararSchemaCpf() {
        const [colunasCpf] = await pool.query(`
            SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND COLUMN_NAME = 'cpf'
        `)
        const colunasAlvo = new Map(
            colunasCpf.map((coluna) => [
                `${coluna.TABLE_NAME}.${coluna.COLUMN_NAME}`,
                coluna,
            ]),
        )
        if (!colunasAlvo.has('tbl_funcionarios.cpf')) {
            throw new Error('A coluna tbl_funcionarios.cpf não existe no banco.')
        }

        const precisaConverter = (coluna) =>
            !['char', 'varchar'].includes(coluna.DATA_TYPE.toLowerCase()) ||
            Number(coluna.CHARACTER_MAXIMUM_LENGTH) < 11
        if (![...colunasAlvo.values()].some(precisaConverter)) return

        const [chavesEstrangeiras] = await pool.query(`
            SELECT k.TABLE_NAME, k.CONSTRAINT_NAME, k.COLUMN_NAME,
                   k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME,
                   k.ORDINAL_POSITION, r.UPDATE_RULE, r.DELETE_RULE
            FROM information_schema.KEY_COLUMN_USAGE k
            JOIN information_schema.REFERENTIAL_CONSTRAINTS r
              ON r.CONSTRAINT_SCHEMA = k.CONSTRAINT_SCHEMA
             AND r.TABLE_NAME = k.TABLE_NAME
             AND r.CONSTRAINT_NAME = k.CONSTRAINT_NAME
            WHERE k.CONSTRAINT_SCHEMA = DATABASE()
              AND k.REFERENCED_TABLE_NAME IS NOT NULL
        `)

        const chaveColuna = (tabela, coluna) => `${tabela}.${coluna}`
        let houveAlteracao
        do {
            houveAlteracao = false
            for (const chave of chavesEstrangeiras) {
                const origem = chaveColuna(chave.TABLE_NAME, chave.COLUMN_NAME)
                const destino = chaveColuna(
                    chave.REFERENCED_TABLE_NAME,
                    chave.REFERENCED_COLUMN_NAME,
                )
                if (colunasAlvo.has(origem) && !colunasAlvo.has(destino)) {
                    colunasAlvo.set(destino, {
                        TABLE_NAME: chave.REFERENCED_TABLE_NAME,
                        COLUMN_NAME: chave.REFERENCED_COLUMN_NAME,
                    })
                    houveAlteracao = true
                } else if (colunasAlvo.has(destino) && !colunasAlvo.has(origem)) {
                    colunasAlvo.set(origem, {
                        TABLE_NAME: chave.TABLE_NAME,
                        COLUMN_NAME: chave.COLUMN_NAME,
                    })
                    houveAlteracao = true
                }
            }
        } while (houveAlteracao)

        const chavesParaAlterar = [...colunasAlvo.values()]
        const filtrosColunas = chavesParaAlterar
            .map(() => '(TABLE_NAME = ? AND COLUMN_NAME = ?)')
            .join(' OR ')
        const parametrosColunas = chavesParaAlterar.flatMap((coluna) => [
            coluna.TABLE_NAME,
            coluna.COLUMN_NAME,
        ])
        const [definicoes] = await pool.query(
            `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH,
                    IS_NULLABLE, COLUMN_DEFAULT
             FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND (${filtrosColunas})`,
            parametrosColunas,
        )
        for (const definicao of definicoes) {
            colunasAlvo.set(
                chaveColuna(definicao.TABLE_NAME, definicao.COLUMN_NAME),
                definicao,
            )
        }
        if (colunasAlvo.size !== definicoes.length) {
            throw new Error('Não foi possível localizar todas as colunas relacionadas ao CPF.')
        }

        const chavesEstrangeirasAfetadas = new Map()
        for (const chave of chavesEstrangeiras) {
            if (
                colunasAlvo.has(chaveColuna(chave.TABLE_NAME, chave.COLUMN_NAME)) ||
                colunasAlvo.has(
                    chaveColuna(
                        chave.REFERENCED_TABLE_NAME,
                        chave.REFERENCED_COLUMN_NAME,
                    ),
                )
            ) {
                const id = `${chave.TABLE_NAME}.${chave.CONSTRAINT_NAME}`
                const grupo = chavesEstrangeirasAfetadas.get(id) || {
                    tabela: chave.TABLE_NAME,
                    nome: chave.CONSTRAINT_NAME,
                    tabelaReferenciada: chave.REFERENCED_TABLE_NAME,
                    updateRule: chave.UPDATE_RULE,
                    deleteRule: chave.DELETE_RULE,
                    colunas: [],
                    referenciadas: [],
                }
                grupo.colunas[chave.ORDINAL_POSITION - 1] = chave.COLUMN_NAME
                grupo.referenciadas[chave.ORDINAL_POSITION - 1] =
                    chave.REFERENCED_COLUMN_NAME
                chavesEstrangeirasAfetadas.set(id, grupo)
            }
        }

        const citar = (identificador) =>
            `\`${String(identificador).replace(/`/g, '``')}\``
        const [bancos] = await pool.query(`
            SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
            FROM information_schema.SCHEMATA
            WHERE SCHEMA_NAME = DATABASE()
        `)
        const charset = bancos[0]?.DEFAULT_CHARACTER_SET_NAME
        const collation = bancos[0]?.DEFAULT_COLLATION_NAME
        if (
            !charset ||
            !collation ||
            !/^[a-zA-Z0-9_]+$/.test(charset) ||
            !/^[a-zA-Z0-9_]+$/.test(collation)
        ) {
            throw new Error('Não foi possível identificar a codificação do banco.')
        }

        const regraReferencial = (regra) => {
            const regrasAceitas = ['CASCADE', 'SET NULL', 'NO ACTION', 'RESTRICT']
            if (!regrasAceitas.includes(regra)) {
                throw new Error(`Regra de chave estrangeira não suportada: ${regra}`)
            }
            return regra
        }
        for (const chave of chavesEstrangeirasAfetadas.values()) {
            if (
                chave.colunas.some((coluna) => coluna === undefined) ||
                chave.referenciadas.some((coluna) => coluna === undefined)
            ) {
                throw new Error(`A chave estrangeira ${chave.nome} está incompleta.`)
            }
            regraReferencial(chave.updateRule)
            regraReferencial(chave.deleteRule)
        }

        for (const chave of chavesEstrangeirasAfetadas.values()) {
            await pool.query(
                `ALTER TABLE ${citar(chave.tabela)} DROP FOREIGN KEY ${citar(chave.nome)}`,
            )
        }

        for (const definicao of definicoes) {
            const nullable = definicao.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'
            const padrao =
                definicao.COLUMN_DEFAULT === null
                    ? ''
                    : ` DEFAULT '${String(definicao.COLUMN_DEFAULT).replace(/'/g, "''")}'`
            await pool.query(
                `ALTER TABLE ${citar(definicao.TABLE_NAME)} MODIFY COLUMN ${citar(definicao.COLUMN_NAME)} VARCHAR(11) CHARACTER SET ${charset} COLLATE ${collation} ${nullable}${padrao}`,
            )
        }

        for (const chave of chavesEstrangeirasAfetadas.values()) {
            const colunas = chave.colunas.map(citar).join(', ')
            const referenciadas = chave.referenciadas.map(citar).join(', ')
            await pool.query(
                `ALTER TABLE ${citar(chave.tabela)} ADD CONSTRAINT ${citar(chave.nome)} FOREIGN KEY (${colunas}) REFERENCES ${citar(chave.tabelaReferenciada)} (${referenciadas}) ON UPDATE ${regraReferencial(chave.updateRule)} ON DELETE ${regraReferencial(chave.deleteRule)}`,
            )
        }
    }

    async listarFuncionario() {
        const [rows] = await pool.query(`
            SELECT f.id_funcionario, f.id_cargos, f.cpf, f.nome, f.email,
                   c.nome_cargo
            FROM tbl_funcionarios f
            JOIN tbl_cargos c ON c.id_cargos = f.id_cargos
            ORDER BY f.id_funcionario
        `)
        return rows
    }

    async buscarFuncionarioId(id) {
        const [rows] = await pool.query(`
            SELECT f.id_funcionario, f.id_cargos, f.cpf, f.nome, f.email,
                   c.nome_cargo
            FROM tbl_funcionarios f
            JOIN tbl_cargos c ON c.id_cargos = f.id_cargos
            WHERE f.id_funcionario = ?
        `, [id])
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