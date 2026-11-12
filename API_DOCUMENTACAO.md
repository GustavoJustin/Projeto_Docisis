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
      "id_cargos": 2,
      "foto": null,
      "pode_cadastrar_funcionarios": 0,
      "pode_excluir_funcionarios": 0
    }
  }
  ```

### Primeiro acesso como administrador

- Em uma instalação sem administrador, crie a primeira conta no terminal com `npm --prefix back-end run criar-admin-inicial`.
- O comando prepara as colunas de autenticação ausentes, permite vários funcionários no mesmo cargo e converte CPF para texto de 11 dígitos nas colunas relacionadas, preservando as chaves estrangeiras existentes.
- Informe o CPF com ou sem pontuação; o comando remove a formatação. A senha é solicitada sem exibição e o comando só funciona enquanto ainda não existir um administrador.
- O primeiro administrador recebe permissão para criar e remover funcionários; permissões de novos administradores são escolhidas no formulário de cadastro.
- Depois, entre pela página de login e crie funcionários pela área de gestão da equipe. O cadastro público não está disponível.

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
      "nome_cargo": "Funcionário",
      "foto": null,
      "pode_cadastrar_funcionarios": 0,
      "pode_excluir_funcionarios": 0
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

### PATCH /api/funcionarios/perfil

- Atualiza nome e e-mail da conta autenticada e retorna os dados atualizados. Requer autenticação JWT.
- Body: `{ "nome": "Maria Oliveira", "email": "maria@email.com" }`

### PUT /api/funcionarios/perfil/foto

- Salva a foto de perfil da conta autenticada no banco de dados. Requer autenticação JWT.
- Body: `{ "foto": "data:image/jpeg;base64,..." }` (JPEG, PNG ou WebP; até 1,5 MB).

### POST /api/funcionarios

- Cria um funcionário com senha definida pelo administrador. Requer perfil de administrador com permissão `pode_cadastrar_funcionarios`.
- Para novos administradores, os campos `pode_cadastrar_funcionarios` e `pode_excluir_funcionarios` definem as permissões de criação e remoção de funcionários.
- Body exemplo:
  ```json
  {
    "cpf": "12345678901",
    "id_cargos": 2,
    "nome": "Maria Oliveira",
    "email": "maria@email.com",
    "senha": "123456",
    "foto": null,
    "pode_cadastrar_funcionarios": false,
    "pode_excluir_funcionarios": false
  }
  ```

### PATCH /api/funcionarios/:id/senha

- Redefine a senha de um funcionário sem revelar a senha anterior ou seu hash. Requer perfil de administrador.
- Body: `{ "senha": "novaSenha123" }` (mínimo de 6 caracteres).

### PUT /api/funcionarios/:id

- Atualiza dados da conta, cargo e permissões de criação/remoção. Requer perfil de administrador.
- Para cargos não administrativos, as permissões administrativas são removidas. Não é permitido alterar o próprio cargo nem rebaixar o último administrador.
- Body de acesso: `{ "id_cargos": 2, "pode_cadastrar_funcionarios": true, "pode_excluir_funcionarios": false }`.

### DELETE /api/funcionarios/:id

- Remove funcionário e registra a ação no histórico de contas. Requer perfil de administrador com permissão `pode_excluir_funcionarios`.

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

- Cria produto no banco de dados, incluindo imagem, nome, descrição, categoria, preço, quantidade, limite, unidade e datas. Registra a entrada inicial no histórico do estoque.

### PUT /api/produtos/:id

- Atualiza dados do produto e registra a movimentação correspondente no histórico do estoque.

### DELETE /api/produtos/:id

- Arquiva o produto e registra a remoção no histórico do estoque.

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

## Chamados

Todas as rotas exigem autenticação JWT.

### GET /api/chamados

- Lista chamados abertos e em resolução para as notificações.
- Cada item inclui o status, quem abriu e, quando assumido, o funcionário responsável.

### POST /api/chamados

- Registra um chamado para o funcionário autenticado.
- Body: `{ "descricao": "Descrição do chamado" }`.

### PATCH /api/chamados/:id/assumir

- Vincula o chamado aberto ao funcionário autenticado e altera o status para `em_resolucao`.
- Um chamado assumido por outra pessoa não pode ser atribuído novamente.

### PATCH /api/chamados/:id/concluir

- Conclui o chamado somente se a conta autenticada for a responsável atual.
- Mantém o registro e a data de conclusão para consulta no histórico administrativo.

### GET /api/chamados/historico

- Lista chamados e ações de criação/remoção de contas feitas por administradores, ordenados por data. Requer perfil de administrador.
- Requer autenticação JWT e cargo de administrador.

## Observações

- Toda rota protegida exige JWT válido.
- O arquivo principal de rotas é [Projeto_Docisis/back-end/src/routes/index.js](Projeto_Docisis/back-end/src/routes/index.js).
- O projeto ainda depende da configuração correta do banco e do arquivo `.env` para funcionar de ponta a ponta.
