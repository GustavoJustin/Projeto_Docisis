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

### POST /api/login/cadastro-funcionario

- Descrição: cria uma conta de funcionário. Se o cargo "Funcionário" ainda não existir, ele é criado automaticamente.
- Body:
  ```json
  {
    "nome": "Maria Oliveira",
    "cpf": "12345678901",
    "email": "maria@email.com",
    "senha": "123456"
  }
  ```

### Primeiro acesso como administrador

- Em uma instalação sem administrador, crie a primeira conta no terminal com `npm --prefix back-end run criar-admin-inicial`.
- O comando prepara as colunas de autenticação ausentes, permite vários funcionários no mesmo cargo e converte CPF para texto de 11 dígitos nas colunas relacionadas, preservando as chaves estrangeiras existentes.
- Informe o CPF com ou sem pontuação; o comando remove a formatação. A senha é solicitada sem exibição e o comando só funciona enquanto ainda não existir um administrador.
- Depois, entre pela página de login e cadastre funcionários pela área de gestão da equipe.

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

- Lista funcionários sem retornar os hashes das senhas. Requer autenticação e perfil de administrador.

### GET /api/funcionarios/:id

- Busca um funcionário por id sem retornar o hash da senha. Requer perfil de administrador.

### POST /api/funcionarios

- Cria um funcionário com senha definida pelo administrador. Requer perfil de administrador.
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

- Atualiza funcionário. Requer perfil de administrador.

### DELETE /api/funcionarios/:id

- Deleta funcionário. Requer perfil de administrador.

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
