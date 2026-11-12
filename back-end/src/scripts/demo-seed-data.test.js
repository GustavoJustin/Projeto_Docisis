const { suppliers, employees, products, alertScenarios } = require('./demo-seed-data')
const estoqueClassificacao = require('../../../front-end/src/script/estoque-classificacao')

describe('dados iniciais de demonstração', () => {
    test('contém os cinco fornecedores e funcionários fornecidos', () => {
        expect(suppliers).toHaveLength(5)
        expect(employees).toHaveLength(5)
        expect(new Set(employees.map((employee) => employee.email)).size).toBe(5)
    })

    test('contém os 35 produtos com lotes únicos e imagens em URL direta', () => {
        expect(products).toHaveLength(35)
        expect(new Set(products.map((product) => product[2])).size).toBe(35)
        for (const product of products) {
            expect(product[12]).toMatch(/^https:\/\/images\.unsplash\.com\//)
        }
    })

    test('distribui alertas e mantém alguns produtos sem alerta em 09/11/2026', () => {
        const statuses = products.map((product) => estoqueClassificacao.classificar({
            validade: product[4],
            quantidade: product[9],
            maximo: product[10],
        }, new Date(2026, 10, 9)).status)

        expect(Object.keys(alertScenarios)).toHaveLength(35)
        expect(statuses.filter((status) => status === 'vencido')).toHaveLength(3)
        expect(statuses.filter((status) => status === 'prox-vencimento')).toHaveLength(3)
        expect(statuses.filter((status) => status === 'critico')).toHaveLength(4)
        expect(statuses.filter((status) => status === 'prox-estoque')).toHaveLength(5)
        expect(statuses.filter((status) => status === 'medio')).toHaveLength(5)
        expect(statuses.filter((status) => status === 'esgotado')).toHaveLength(2)
        expect(statuses.filter((status) => status === null)).toHaveLength(13)
    })
})
