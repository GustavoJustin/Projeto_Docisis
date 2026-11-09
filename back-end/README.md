# Backend

## Carregar dados de demonstração

Configure `DB_HOST`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` no `.env` para apontar a uma base MySQL já criada com o esquema do projeto. Depois, na pasta `back-end`, execute:

```sh
npm run seed:demo
```

A carga é transacional e idempotente: fornecedores existentes são reutilizados; funcionários já existentes pelo e-mail ou CPF e produtos cujo lote já existe são ignorados, sem sobrescrever alterações. Ela não é executada automaticamente ao iniciar o servidor.

As senhas de demonstração são os números de `1` a `5`, na ordem em que os funcionários aparecem em `src/scripts/demo-seed-data.js`; o banco recebe hashes bcrypt. São credenciais fracas, exclusivas para simulação, e não devem ser usadas em produção. As validades dos produtos foram mantidas conforme os dados fornecidos, inclusive as datas passadas.

Para todos os usuários verem e alterarem o mesmo conteúdo, configure-os para usar a mesma instância MySQL. Executar a carga em bancos locais separados não compartilha dados.

## Atualizar alertas da demonstração

Para ajustar os 35 produtos de demonstração para mostrar alertas variados e também produtos sem alertas, execute `npm run demo:alertas`. O comando atualiza apenas validade, quantidade e estoque máximo dos lotes `L2024-01` a `L2024-35`; os demais dados dos produtos não são alterados.
