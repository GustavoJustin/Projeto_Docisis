CREATE DATABASE IF NOT EXISTS db_docisis;
USE db_docisis;

-- Desativa checagem temporariamente para limpeza de tabelas existentes
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS tbl_estoque;
DROP TABLE IF EXISTS tbl_mov_saida;
DROP TABLE IF EXISTS tbl_mov_entrada;
DROP TABLE IF EXISTS tbl_produtos;
DROP TABLE IF EXISTS tbl_pedido;
DROP TABLE IF EXISTS tbl_nota_fiscal;
DROP TABLE IF EXISTS tbl_fornecedor;
DROP TABLE IF EXISTS tbl_funcionarios;
DROP TABLE IF EXISTS tbl_cargos;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------
-- 1. Cargos
-- -----------------------------------------------------
CREATE TABLE tbl_cargos (
    id_cargos INT AUTO_INCREMENT PRIMARY KEY,
    nivel_acesso_1 INT NOT NULL,
    nivel_acesso_2 INT NOT NULL,
    nome_cargo VARCHAR(100) NOT NULL,
    departamento VARCHAR(200),
    jornada TIME NOT NULL
);

-- -----------------------------------------------------
-- 2. Funcionários
-- -----------------------------------------------------
CREATE TABLE tbl_funcionarios (
    id_funcionario INT AUTO_INCREMENT PRIMARY KEY,
    id_cargos INT NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    CONSTRAINT fk_funcionarios_cargos FOREIGN KEY (id_cargos) REFERENCES tbl_cargos(id_cargos)
);

-- -----------------------------------------------------
-- 3. Fornecedor
-- -----------------------------------------------------
CREATE TABLE tbl_fornecedor (
    id_fornecedor INT AUTO_INCREMENT PRIMARY KEY,
    nome_fornecedor VARCHAR(200) NOT NULL
);

-- -----------------------------------------------------
-- 4. Nota Fiscal
-- -----------------------------------------------------
CREATE TABLE tbl_nota_fiscal (
    id_nota_fiscal INT AUTO_INCREMENT PRIMARY KEY,
    id_fornecedor INT NOT NULL,
    destinatario VARCHAR(100) NOT NULL,
    remetente VARCHAR(100) NOT NULL,
    servico VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    imposto DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_nota_fiscal_fornecedor FOREIGN KEY (id_fornecedor) REFERENCES tbl_fornecedor(id_fornecedor)
);

-- -----------------------------------------------------
-- 5. Pedidos
-- -----------------------------------------------------
CREATE TABLE tbl_pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    produto VARCHAR(100) NOT NULL
);

-- -----------------------------------------------------
-- 6. Produtos
-- -----------------------------------------------------
CREATE TABLE tbl_produtos (
    id_produtos INT AUTO_INCREMENT PRIMARY KEY,
    id_fornecedor INT,
    marca VARCHAR(100) NOT NULL,
    lote VARCHAR(30) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    validade DATE NULL,
    CONSTRAINT fk_produtos_fornecedor FOREIGN KEY (id_fornecedor) REFERENCES tbl_fornecedor(id_fornecedor)
);

-- -----------------------------------------------------
-- 7. Movimento de Entrada
-- -----------------------------------------------------
CREATE TABLE tbl_mov_entrada (
    id_mov_entrada INT AUTO_INCREMENT PRIMARY KEY,
    id_nota_fiscal INT NOT NULL,
    id_produtos INT NOT NULL,
    id_funcionario INT NOT NULL,
    data_hora DATETIME NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_mov_entrada_nf FOREIGN KEY (id_nota_fiscal) REFERENCES tbl_nota_fiscal(id_nota_fiscal),
    CONSTRAINT fk_mov_entrada_prod FOREIGN KEY (id_produtos) REFERENCES tbl_produtos(id_produtos),
    CONSTRAINT fk_mov_entrada_func FOREIGN KEY (id_funcionario) REFERENCES tbl_funcionarios(id_funcionario)
);

-- -----------------------------------------------------
-- 8. Movimento de Saída
-- -----------------------------------------------------
CREATE TABLE tbl_mov_saida (
    id_mov_saida INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produtos INT NOT NULL,
    id_funcionario INT NOT NULL,
    data_hora DATETIME NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_mov_saida_pedido FOREIGN KEY (id_pedido) REFERENCES tbl_pedido(id_pedido),
    CONSTRAINT fk_mov_saida_prod FOREIGN KEY (id_produtos) REFERENCES tbl_produtos(id_produtos),
    CONSTRAINT fk_mov_saida_func FOREIGN KEY (id_funcionario) REFERENCES tbl_funcionarios(id_funcionario)
);

-- -----------------------------------------------------
-- 9. Estoque
-- -----------------------------------------------------
CREATE TABLE tbl_estoque (
    id_estoque INT AUTO_INCREMENT PRIMARY KEY,
    id_produtos INT NOT NULL UNIQUE,
    localizacao_fisica VARCHAR(200) NOT NULL,
    quantidade DECIMAL(10,3) NOT NULL DEFAULT 0,
    CONSTRAINT fk_estoque_produto FOREIGN KEY (id_produtos) REFERENCES tbl_produtos(id_produtos)
);