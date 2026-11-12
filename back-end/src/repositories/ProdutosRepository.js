const pool = require('../config/database')

class ProdutoRepository {
    async garantirColunasEstoque() {
        if (!this.preparacaoEstoque) {
            this.preparacaoEstoque = (async () => {
                const [colunas] = await pool.query('SHOW COLUMNS FROM tbl_produtos')
                const existentes = new Set(colunas.map((coluna) => coluna.Field))
                const idProduto = colunas.find((coluna) => coluna.Field === 'id_produtos')
                this.idAutoIncrement =
                    String(idProduto?.Extra).toLowerCase().includes('auto_increment')
                const colunaImagem = colunas.find((coluna) => coluna.Field === 'imagem')
                const definicoes = {
                    id_fornecedor: 'INT NULL',
                    marca: 'VARCHAR(100) NULL',
                    lote: 'VARCHAR(30) NULL',
                    tipo: 'VARCHAR(100) NULL',
                    validade: 'DATE NULL',
                    nome_insumo: 'VARCHAR(200) NULL',
                    descricao: 'TEXT NULL',
                    categoria: 'VARCHAR(100) NULL',
                    preco: 'VARCHAR(50) NULL',
                    quantidade: 'DECIMAL(12,2) NOT NULL DEFAULT 0',
                    estoque_maximo: 'DECIMAL(12,2) NOT NULL DEFAULT 1',
                    unidade: "VARCHAR(10) NOT NULL DEFAULT 'un'",
                    imagem: 'MEDIUMTEXT NULL',
                    data_chegada: 'DATE NULL',
                    ativo: 'TINYINT(1) NOT NULL DEFAULT 1',
                }

                for (const [coluna, definicao] of Object.entries(definicoes)) {
                    if (!existentes.has(coluna)) {
                        await pool.query(
                            `ALTER TABLE tbl_produtos ADD COLUMN \`${coluna}\` ${definicao}`,
                        )
                    }
                }
                if (colunaImagem && !String(colunaImagem.Type).toLowerCase().includes('mediumtext')) {
                    await pool.query(
                        'ALTER TABLE tbl_produtos MODIFY COLUMN imagem MEDIUMTEXT NULL',
                    )
                }
                await pool.query(`
                    CREATE TABLE IF NOT EXISTS tbl_mov_ajuste_estoque (
                        id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
                        id_produtos INT NOT NULL,
                        nome_produto VARCHAR(200) NOT NULL,
                        usuario VARCHAR(200) NOT NULL DEFAULT 'Sistema',
                        tipo VARCHAR(10) NOT NULL,
                        quantidade_anterior DECIMAL(12,2) NOT NULL,
                        quantidade_nova DECIMAL(12,2) NOT NULL,
                        quantidade DECIMAL(12,2) NOT NULL,
                        unidade VARCHAR(10) NOT NULL DEFAULT 'un',
                        descricao TEXT NULL,
                        data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_mov_ajuste_produto (id_produtos),
                        INDEX idx_mov_ajuste_data (data_hora)
                    )
                `)
                const [colunasMovimentacao] = await pool.query(
                    'SHOW COLUMNS FROM tbl_mov_ajuste_estoque',
                )
                if (!colunasMovimentacao.some((coluna) => coluna.Field === 'unidade')) {
                    await pool.query(
                        "ALTER TABLE tbl_mov_ajuste_estoque ADD COLUMN unidade VARCHAR(10) NOT NULL DEFAULT 'un'",
                    )
                }
            })().catch((erro) => {
                this.preparacaoEstoque = null
                throw erro
            })
        }
        await this.preparacaoEstoque
    }

    async listarProduto() {
        await this.garantirColunasEstoque()
        const [rows] = await pool.query(
            'SELECT * FROM tbl_produtos WHERE ativo = 1 ORDER BY id_produtos',
        )
        return rows
    }

    async buscarProdutoId(id) {
        await this.garantirColunasEstoque()
        const [rows] = await pool.query(
            'SELECT * FROM tbl_produtos WHERE id_produtos = ? AND ativo = 1',
            [id],
        )
        return rows[0]
    }

    async cadastrarProduto(dadosDoProduto) {
        await this.garantirColunasEstoque()
        if (!this.idAutoIncrement) {
            return this.cadastrarProdutoComIdGerado(dadosDoProduto)
        }
        const [resultado] = await pool.query('INSERT INTO tbl_produtos SET ?', [dadosDoProduto])
        return resultado.insertId
    }

    async cadastrarProdutoComIdGerado(dadosDoProduto) {
        const connection = await pool.getConnection()
        const nomeLock = 'docegestao_tbl_produtos_id_gen'
        let lockAdquirido = false

        try {
            const [locks] = await connection.query(
                'SELECT GET_LOCK(?, 10) AS adquirido',
                [nomeLock],
            )
            if (Number(locks[0]?.adquirido) !== 1) {
                throw new Error('Não foi possível reservar um ID para o novo produto.')
            }
            lockAdquirido = true

            const [rows] = await connection.query(
                'SELECT COALESCE(MAX(id_produtos), 0) + 1 AS proximoId FROM tbl_produtos',
            )
            const id = Number(rows[0]?.proximoId)
            if (!Number.isSafeInteger(id) || id < 1) {
                throw new Error('Não foi possível gerar um ID válido para o novo produto.')
            }
            await connection.query('INSERT INTO tbl_produtos SET ?', [
                { ...dadosDoProduto, id_produtos: id },
            ])
            return id
        } finally {
            try {
                if (lockAdquirido) {
                    await connection.query('SELECT RELEASE_LOCK(?)', [nomeLock])
                }
            } finally {
                connection.release()
            }
        }
    }

    async listarMovimentacoesEstoque() {
        await this.garantirColunasEstoque()
        const [rows] = await pool.query(
            `SELECT id_movimentacao, id_produtos, nome_produto, usuario, tipo,
                    quantidade_anterior, quantidade_nova, quantidade, unidade, descricao, data_hora
             FROM tbl_mov_ajuste_estoque
             ORDER BY data_hora DESC, id_movimentacao DESC`,
        )
        return rows
    }

    async registrarAjusteEstoque(id, variacao, descricao, usuario, maximoAtualizado) {
        await this.garantirColunasEstoque()
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()
            const [produtos] = await connection.query(
                'SELECT * FROM tbl_produtos WHERE id_produtos = ? AND ativo = 1 FOR UPDATE',
                [id],
            )
            const produto = produtos[0]
            if (!produto) {
                const erro = new Error('Produto não encontrado.')
                erro.status = 404
                throw erro
            }

            const anterior = Number(produto.quantidade) || 0
            const maximoAnterior = Number(produto.estoque_maximo) || 0
            const maximo = maximoAtualizado ?? maximoAnterior
            const novaQuantidade = anterior + variacao
            const excedeMaximo = novaQuantidade > maximo &&
                (anterior <= maximo || variacao >= 0)
            if (!Number.isInteger(novaQuantidade) || novaQuantidade < 0 || excedeMaximo ||
                (maximoAtualizado !== undefined && novaQuantidade > maximo)) {
                const erro = new Error(
                    !Number.isInteger(novaQuantidade)
                        ? 'A quantidade deve ser um número inteiro.'
                        : novaQuantidade > maximo
                        ? `A quantidade não pode ultrapassar o máximo de ${maximo} ${produto.unidade || 'un'}.`
                        : 'A quantidade não pode ser menor que zero.',
                )
                erro.status = 400
                throw erro
            }

            const alterouLimite = maximo !== maximoAnterior
            if (novaQuantidade === anterior && !alterouLimite) {
                await connection.commit()
                return {
                    id_produtos: Number(id),
                    nome: produto.nome_insumo || produto.marca || produto.tipo,
                    descricao: produto.descricao || produto.categoria || '',
                    quantidade: anterior,
                    maximo,
                    unidade: produto.unidade || 'un',
                    movimentacao: null,
                }
            }

            await connection.query(
                'UPDATE tbl_produtos SET quantidade = ?, estoque_maximo = ? WHERE id_produtos = ?',
                [novaQuantidade, maximo, id],
            )
            const nome = produto.nome_insumo || produto.marca || produto.tipo
            if (novaQuantidade === anterior) {
                await connection.commit()
                return {
                    id_produtos: Number(id),
                    nome,
                    descricao: produto.descricao || produto.categoria || '',
                    quantidade: anterior,
                    maximo,
                    unidade: produto.unidade || 'un',
                    movimentacao: null,
                }
            }

            const tipo = variacao > 0 ? 'ENTRADA' : 'SAÍDA'
            const quantidadeMovimentada = Math.abs(novaQuantidade - anterior)
            const [movimentacao] = await connection.query(
                `INSERT INTO tbl_mov_ajuste_estoque
                    (id_produtos, nome_produto, usuario, tipo, quantidade_anterior,
                     quantidade_nova, quantidade, unidade, descricao)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    nome,
                    usuario || 'Sistema',
                    tipo,
                    anterior,
                    novaQuantidade,
                    quantidadeMovimentada,
                    produto.unidade || 'un',
                    descricao || null,
                ],
            )
            await connection.commit()

            return {
                id_produtos: Number(id),
                nome,
                descricao: produto.descricao || produto.categoria || '',
                quantidade: novaQuantidade,
                maximo,
                unidade: produto.unidade || 'un',
                movimentacao: movimentacao.insertId,
            }
        } catch (erro) {
            await connection.rollback()
            throw erro
        } finally {
            connection.release()
        }
    }

    async atualizarProduto(id, dadosDoProduto) {
        await this.garantirColunasEstoque()
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
        await this.garantirColunasEstoque()
        await pool.query(
            'UPDATE tbl_produtos SET ativo = 0 WHERE id_produtos = ?',
            [id],
        )
        return true
    }
}

module.exports = new ProdutoRepository()