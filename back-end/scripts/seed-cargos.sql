INSERT INTO tbl_cargos (
    nivel_acesso_1,
    nivel_acesso_2,
    nome_cargo,
    departamento,
    jornada
)
SELECT 1, 1, 'Administrador', 'Administração', '08:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM tbl_cargos
    WHERE LOWER(nome_cargo) LIKE '%admin%'
);

INSERT INTO tbl_cargos (
    nivel_acesso_1,
    nivel_acesso_2,
    nome_cargo,
    departamento,
    jornada
)
SELECT 1, 1, 'Funcionário', 'Operação', '08:00:00'
WHERE NOT EXISTS (
    SELECT 1
    FROM tbl_cargos
    WHERE LOWER(nome_cargo) LIKE '%funcion%'
);