require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const readline = require("readline");
const pool = require("../config/database");
const CargosRepository = require("../repositories/CargosRepository");
const FuncionarioRepository = require("../repositories/FuncionariosRepository");
const FuncionarioService = require("../services/FuncionarioService");

function perguntarSenha(prompto) {
    return new Promise((resolve, reject) => {
        const entrada = process.stdin;
        if (!entrada.isTTY || typeof entrada.setRawMode !== "function") {
            reject(new Error("Execute este comando em um terminal interativo."));
            return;
        }

        process.stdout.write(prompto);
        entrada.setRawMode(true);
        entrada.resume();
        entrada.setEncoding("utf8");

        let valor = "";
        function finalizar(erro) {
            entrada.removeListener("data", aoDigitar);
            entrada.setRawMode(false);
            entrada.pause();
            process.stdout.write("\n");
            if (erro) reject(erro);
            else resolve(valor);
        }

        function aoDigitar(teclas) {
            for (const tecla of teclas) {
                if (tecla === "\u0003") {
                    finalizar(new Error("Operação cancelada."));
                    return;
                }
                if (tecla === "\r" || tecla === "\n") {
                    finalizar();
                    return;
                }
                if (tecla === "\u007f" || tecla === "\b") {
                    valor = valor.slice(0, -1);
                } else {
                    valor += tecla;
                }
            }
        }

        entrada.on("data", aoDigitar);
    });
}

async function criarAdministradorInicial() {
    await FuncionarioRepository.prepararSchemaAutenticacao();

    const [administradores] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM tbl_funcionarios f
        JOIN tbl_cargos c ON c.id_cargos = f.id_cargos
        WHERE LOWER(c.nome_cargo) LIKE '%admin%'
    `);

    if (administradores[0].total > 0) {
        throw new Error("Já existe uma conta de administrador. Entre com ela para cadastrar outros usuários.");
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let promptClosed = false;
    const perguntar = (mensagem) =>
        new Promise((resolve) => rl.question(mensagem, resolve));

    try {
        const nome = (await perguntar("Nome do administrador: ")).trim();
        const cpf = (await perguntar("CPF (11 dígitos): ")).replace(/\D/g, "");
        const email = (await perguntar("E-mail: ")).trim().toLowerCase();
        if (cpf.length !== 11) {
            throw new Error("Informe um CPF com 11 dígitos.");
        }
        rl.close();
        promptClosed = true;

        const senha = await perguntarSenha("Senha (mínimo de 6 caracteres): ");
        const confirmarSenha = await perguntarSenha("Confirme a senha: ");
        if (senha !== confirmarSenha) {
            throw new Error("As senhas não coincidem.");
        }

        const cargo = await CargosRepository.garantirCargoAdministrador();
        if (!cargo) {
            throw new Error("Não foi possível preparar o cargo de administrador no banco.");
        }

        const resultado = await FuncionarioService.cadastrarFuncionario({
            nome,
            cpf,
            email,
            senha,
            id_cargos: cargo.id_cargos,
        });
        console.log(`Administrador criado com sucesso (ID ${resultado.resultado}).`);
        console.log("Agora entre no DoceGestão usando o e-mail e a senha informados.");
    } finally {
        if (!promptClosed) rl.close();
    }
}

criarAdministradorInicial()
    .catch((erro) => {
        console.error(`Não foi possível criar o administrador: ${erro.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
