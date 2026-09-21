const FornecedorRepository = require('../repositories/FornecedorRepository')

class FornecedorService {
    async listarFornecedor() {
        const fornecedores = await FornecedorRepository.listarFornecedor()

        return {
            sucesso: true,
            dados: fornecedores,
            total: fornecedores.length
        }
    }

    async buscarFornecedorId(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const fornecedor = await FornecedorRepository.buscarFornecedorId(id)

        if(!fornecedor) {
            throw { status: 404, mensagem: "Fornecedor não encontrado" }
        }

        return { sucesso: true, dados: fornecedor }
    }

    async cadastrarFornecedor(dados) {
        const {nome_fornecedor} = dados

        if(!nome_fornecedor) {
            throw { status: 400, mensagem: "Nome fornecedor é obrigatório" }
        }

        const novoFornecedor = {
            nome_fornecedor: nome_fornecedor.trim()
        }

        const resultado = await FornecedorRepository.cadastrarFornecedor(novoFornecedor)

        return { sucesso: true, mensagem: "Sucesso ao cadastrar", resultado }
    }

    async atualizarFornecedor(id, dados) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const fornecedor = await FornecedorRepository.buscarFornecedorId(id)

        if(!fornecedor) {
            throw { status: 404, mensagem: "Fornecedor não encontrado" }
        }

        const fornecedorAtualizado = {}
        const {nome_fornecedor} = dados

        if(nome_fornecedor !== undefined && nome_fornecedor.trim() != "") fornecedorAtualizado.nome_fornecedor = nome_fornecedor.trim()

        if(Object.keys(fornecedorAtualizado).length == 0) {
            throw { status: 400, mensagem: "Nenhum dado válido enviado para a atualização" }
        }

        await FornecedorRepository.atualizarFornecedor(id, fornecedorAtualizado)

        return { sucesso: true, mensagem: "Fornecedor atualizado" }
    }

    async deletarFornecedor(id) {
        if(!id || isNaN(id)) {
            throw { status: 400, mensagem: "Id inválido" }
        }

        const fornecedor = await FornecedorRepository.buscarFornecedorId(id)

        if(!fornecedor) {
            throw { status: 404, mensagem: "Fornecedor não encontrado" }
        }

        await FornecedorRepository.deletarFornecedor(id)

        return { sucesso: true, mensagem: "Fornecedor apagado" }
    }
}

module.exports = new FornecedorService()