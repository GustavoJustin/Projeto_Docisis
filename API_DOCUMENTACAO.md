# API Docisis

Documentação automática gerada a partir das rotas e controladores do backend.

## Visão geral

- Base URL: /api
- Autenticação: JWT via header `Authorization: Bearer <token>`
- Status de resposta: JSON com `sucesso`, `mensagem`, `dados` e/ou `erro`

## Auth

### GET /api/login/contato

- Descrição: retorna os dados do administrador para contato.
- Resposta 200:
  ```json
  {
    "sucesso": true,
    "contato": {
      "nome": "Geraldo",
      "email": "geraldo_adm@docisis.com",
      "telefone": "11223459067",
      "instagram": ""
    }
  }
  ```

### POST /api/login

- Descrição: autentica um funcionário com e-mail e senha.
- Body:
  ```json
  {
    "email": "usuario@docesis.com",
    "senha": "123456"
  }
  ```
- Resposta 200:
  ```json
  {
    "sucesso": true,
    "mensagem": "Login realizado com sucesso",
    "token": "<jwt>",
    "funcionario": {
      "id_funcionario": 1,
      "nome": "Maria",
      "email": "maria@docesis.com",
      "id_cargos": 2
    }
  }
  ```

### GET /api/sessao

- Descrição: valida o token do usuário autenticado.
- Requer autenticação JWT.
- Resposta 200:
  ```json
  {
    "sucesso": true,
    "funcionario": {
      "id_funcionario": 1,
      "nome": "Maria",
      "email": "maria@docesis.com",
      "nome_cargo": "Funcionário"
    }
  }
  ```

## Cargos

### GET /api/cargos

- Lista todos os cargos.

### GET /api/cargos/:id

- Busca cargo por id.

### POST /api/cargos

- Cria um cargo.
- Body exemplo:
  ```json
  {
    "nivel_acesso_1": 1,
    "nivel_acesso_2": 1,
    "nome_cargo": "Funcionário",
    "departamento": "Operação",
    "jornada": "08:00:00"
  }
  ```

### PUT /api/cargos/:id

- Atualiza cargo.

### DELETE /api/cargos/:id

- Remove cargo.

## Funcionários

### GET /api/funcionarios

- Lista funcionários.

### GET /api/funcionarios/:id

- Busca um funcionário por id.

### POST /api/funcionarios

- Cria funcionário.
- Body exemplo:
  ```json
  {
    "cpf": "12345678901",
    "id_cargos": 2,
    "nome": "Maria Oliveira",
    "email": "maria@email.com",
    "senha": "123456"
  }
  ```

### PUT /api/funcionarios/:id

- Atualiza funcionário.

### DELETE /api/funcionarios/:id

- Deleta funcionário.

## Estoque

### GET /api/estoque

- Lista itens em estoque.

### GET /api/estoque/:id

- Busca item do estoque.

### POST /api/estoque

- Cria registro no estoque.

### PUT /api/estoque/:id

- Atualiza estoque.

### DELETE /api/estoque/:id

- Remove item do estoque.

## Entradas

### GET /api/entradas

- Lista entradas.

### GET /api/entradas/:id

- Busca entrada.

### POST /api/entradas

- Cria entrada.

### PUT /api/entradas/:id

- Atualiza entrada.

### DELETE /api/entradas/:id

- Exclui entrada.

## Saídas

### GET /api/saidas

- Lista saídas.

### GET /api/saidas/:id

- Busca saída.

### POST /api/saidas

- Cria saída.

### PUT /api/saidas/:id

- Atualiza saída.

### DELETE /api/saidas/:id

- Exclui saída.

## Produtos

### GET /api/produtos

- Lista produtos.

### GET /api/produtos/:id

- Busca um produto.

### POST /api/produtos

- Cria produto.

### PUT /api/produtos/:id

- Atualiza produto.

### DELETE /api/produtos/:id

- Remove produto.

## Fornecedores

### GET /api/fornecedores

- Lista fornecedores.

### GET /api/fornecedores/:id

- Busca fornecedor.

### POST /api/fornecedores

- Cria fornecedor.

### PUT /api/fornecedores/:id

- Atualiza fornecedor.

### DELETE /api/fornecedores/:id

- Remove fornecedor.

## Relatórios

### GET /api/relatorios

- Lista relatórios.

### GET /api/relatorios/:id

- Busca relatório por id.

### POST /api/relatorios

- Cria relatório.

### PUT /api/relatorios/:id

- Atualiza relatório.

### DELETE /api/relatorios/:id

- Remove relatório.

## Observações

- Toda rota protegida exige JWT válido.
- O arquivo principal de rotas é [Projeto_Docisis/back-end/src/routes/index.js](Projeto_Docisis/back-end/src/routes/index.js).
- O projeto ainda depende da configuração correta do banco e do arquivo `.env` para funcionar de ponta a ponta.
