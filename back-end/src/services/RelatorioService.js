const RelatorioRepository = require('../repositories/RelatorioRepository')

class RelatorioService {
    async listarRelatorios() {
        const relatorios = await RelatorioRepository.listarRelatorio()

        return {
            sucesso: true,
            dados: relatorios,
            total: relatorios.length
        }
    }

    async buscarRelatorioId(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const relatorio = await RelatorioRepository.buscarRelatorioId(id)

        if(!relatorio) {
            throw {
                status: 404,
                mensagem: "Relatorio não encontrado"
            }
        }

        return {
            sucesso: true,
            dados: relatorio
        }
    }

    async cadastrarRelatorio(dados) {
        const {entrada, estoque, fornecedor, funcionario, notaFiscal, pedido, produto, saida} = dados

        const camposRecebidos = {entrada, estoque, fornecedor, funcionario, notaFiscal, pedido, produto, saida}

        const temAlgumCampo = Object.values(camposRecebidos).some(valor => valor !== undefined)

        if(!temAlgumCampo) {
            throw {
                status: 400,
                mensagem: "Envie ao menos um dos campos: entrada, estoque, fornecedor, funcionario, notaFiscal, pedido, produto ou saida"
            }
        }

        for(const [campo, valor] of Object.entries(camposRecebidos)) {
            if(valor !== undefined && (typeof valor != "number" || valor <= 0)) {
                throw {
                    status: 400,
                    mensagem: `O campo ${campo} deve ser um número positivo`
                }
            }
        }

        const novoRelatorio = {}

        for(const [campo, valor] of Object.entries(camposRecebidos)) {
            if(valor !== undefined) novoRelatorio[campo] = valor
        }

        const resultado = await RelatorioRepository.cadastrarRelatorio(novoRelatorio)

        return {
            sucesso: true,
            mensagem: "Sucesso ao cadastrar",
            resultado
        }
    }

    async atualizarRelatorio(id, dados) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const relatorio = await RelatorioRepository.buscarRelatorioId(id)

        if(!relatorio) {
            throw {
                status: 404,
                mensagem: "Relatorio não encontrado"
            }
        }

        const {entrada, estoque, fornecedor, funcionario, notaFiscal, pedido, produto, saida} = dados

        const camposRecebidos = {entrada, estoque, fornecedor, funcionario, notaFiscal, pedido, produto, saida}

        for(const [campo, valor] of Object.entries(camposRecebidos)) {
            if(valor !== undefined && (typeof valor != "number" || valor <= 0)) {
                throw {
                    status: 400,
                    mensagem: `O campo ${campo} deve ser um número positivo`
                }
            }
        }

        const relatorioAtualizado = {}

        for(const [campo, valor] of Object.entries(camposRecebidos)) {
            if(valor !== undefined) relatorioAtualizado[campo] = valor
        }

        if(Object.keys(relatorioAtualizado).length == 0) {
            throw {
                status: 400,
                mensagem: "Nenhum dado válido enviado para a atualização"
            }
        }

        await RelatorioRepository.atualizarRelatorio(id, relatorioAtualizado)

        return {
            sucesso: true,
            mensagem: "Relatorio atualizado"
        }
    }

    async deletarRelatorio(id) {
        if(!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: "Id inválido"
            }
        }

        const relatorio = await RelatorioRepository.buscarRelatorioId(id)

        if(!relatorio) {
            throw {
                status: 404,
                mensagem: "Relatorio não encontrado"
            }
        }

        await RelatorioRepository.deletarRelatorio(id)

        return {
            sucesso: true,
            mensagem: "Relatorio apagado"
        }
    }
}

module.exports = new RelatorioService()