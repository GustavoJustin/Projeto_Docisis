function inicializarCadastroFuncionario() {
    const form = document.getElementById("form-cadastro");
    if (!form) return;
    const cadastroPublico =
        form.dataset.cadastroPublico === "true" ||
        new URLSearchParams(window.location.search).get("cadastro-publico") === "1";
    const inputFoto = document.getElementById("input-foto");
    const photoPreview = document.getElementById("photo-preview");
    const uploadPlaceholder = document.getElementById("upload-placeholder");
    const btnCancelar = document.getElementById("btn-cancelar");
    const alertBox = document.getElementById("cadastro-alert");
    const alertText = document.getElementById("cadastro-alert-text");
    const radioNivel = document.querySelectorAll(
        'input[name="nivel_acesso"]',
    );
    const cardAdmin = document.getElementById("card-admin");
    const cardFunc = document.getElementById("card-func");
    const botaoEnviar =
        form.querySelector('button[type="submit"]') ||
        document.querySelector('button[type="submit"][form="form-cadastro"]');
    let administradorAutorizado = cadastroPublico;

    if (cadastroPublico) {
        const loginLink = document.getElementById("cadastro-alert-link");
        if (loginLink) {
            loginLink.href = "./painel.html?pagina=login";
            loginLink.textContent = "Voltar ao login";
        }
        const headerUserProfile = document.getElementById("header-user-profile");
        if (headerUserProfile) headerUserProfile.style.display = "none";
        const titulo = form.querySelector("h2");
        if (titulo) titulo.textContent = "Criar conta de funcionário";
        if (cardAdmin) {
            cardAdmin.style.display = "none";
            const radioAdmin = cardAdmin.querySelector('input[name="nivel_acesso"]');
            if (radioAdmin) radioAdmin.disabled = true;
            const radioFuncionario = document.querySelector(
                'input[name="nivel_acesso"][value="funcionario"]',
            );
            if (radioFuncionario) radioFuncionario.checked = true;
            cardAdmin.parentElement.classList.remove("md:grid-cols-2");
        }
    }

    function pedirLoginAdministrador(mensagem) {
        administradorAutorizado = false;
        if (botaoEnviar) botaoEnviar.disabled = true;
        const loginLink = document.getElementById("cadastro-alert-link");
        if (loginLink) {
            loginLink.href = "./painel.html?pagina=login&retorno=cadastro";
            loginLink.textContent = "Entrar como administrador";
        }
        mostrarAviso(mensagem, "erro", true);
    }

    async function validarAcessoAdministrador() {
        if (cadastroPublico) return;

        const token = localStorage.getItem("docegestao_token");
        if (!token) {
            pedirLoginAdministrador(
                "Para cadastrar um funcionário, entre primeiro com uma conta de administrador.",
            );
            return;
        }

        if (botaoEnviar) {
            botaoEnviar.disabled = true;
            botaoEnviar.textContent = "Verificando acesso...";
        }

        try {
            const response = await fetch("/api/sessao", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const resultado = await response.json();
            if (!response.ok) {
                throw new Error(
                    resultado.mensagem || "Não foi possível validar sua sessão.",
                );
            }

            const nomeCargo = (resultado.funcionario?.nome_cargo || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
            if (!nomeCargo.includes("admin")) {
                pedirLoginAdministrador(
                    "Esta conta não tem permissão para cadastrar funcionários. Entre com uma conta de administrador.",
                );
                return;
            }

            administradorAutorizado = true;
            limparAviso();
        } catch (erro) {
            localStorage.removeItem("docegestao_token");
            localStorage.removeItem("docegestao_funcionario");
            pedirLoginAdministrador(
                erro.message || "Não foi possível validar sua sessão.",
            );
        } finally {
            if (botaoEnviar && administradorAutorizado) {
                botaoEnviar.disabled = false;
                botaoEnviar.textContent = "Criar Conta";
            }
        }
    }

    function voltarAoLogin() {
        if (typeof window.navegarDemo === "function") {
            window.navegarDemo("login");
        } else {
            window.location.href = "./painel.html?pagina=login";
        }
    }

    function mostrarAviso(mensagem, tipo = "erro", mostrarLink = false) {
        if (!alertBox || !alertText) return;
        alertText.textContent = mensagem;
        alertBox.classList.remove(
            "hidden",
            "border-amber-200",
            "bg-amber-50",
            "text-amber-800",
            "border-emerald-200",
            "bg-emerald-50",
            "text-emerald-800",
            "border-red-200",
            "bg-red-50",
            "text-red-800",
        );
        alertBox.classList.add(
            tipo === "sucesso"
                ? "border-emerald-200"
                : "border-red-200",
            tipo === "sucesso" ? "bg-emerald-50" : "bg-red-50",
            tipo === "sucesso" ? "text-emerald-800" : "text-red-800",
        );
        const loginLink = document.getElementById("cadastro-alert-link");
        if (loginLink) loginLink.classList.toggle("hidden", !mostrarLink);
    }

    function limparAviso() {
        if (alertBox) alertBox.classList.add("hidden");
        if (alertText) alertText.textContent = "";
        document.getElementById("cadastro-alert-link")?.classList.add("hidden");
    }

    const cadastroPublicoLink = document.getElementById("cadastro-alert-link");
    cadastroPublicoLink?.classList.add("hidden");
    void validarAcessoAdministrador();

    // Máscara CPF
    const inputCPF = document.getElementById("input-cpf");
    if (inputCPF) {
        inputCPF.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });
    }

    // Máscara Telefone
    const inputTel = document.getElementById("input-telefone");
    if (inputTel) {
        inputTel.addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
            v = v.replace(/(\d{5})(\d)/, "$1-$2");
            e.target.value = v;
        });
    }

    // Upload de foto
    inputFoto?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && photoPreview && uploadPlaceholder) {
            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreview.src = event.target.result;
                photoPreview.classList.remove("hidden");
                uploadPlaceholder.classList.add("hidden");
            };
            reader.readAsDataURL(file);
        }
    });

    // Cartões de nível de acesso
    radioNivel.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            if (!cardAdmin || !cardFunc) return;
            if (e.target.value === "administrador") {
                cardAdmin.className =
                    "relative flex items-start p-4 rounded-xl border-2 border-[#875C46] bg-[#FDFBF7] cursor-pointer transition-all";
                cardFunc.className =
                    "relative flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:border-[#875C46]/50 cursor-pointer transition-all";
            } else {
                cardFunc.className =
                    "relative flex items-start p-4 rounded-xl border-2 border-[#875C46] bg-[#FDFBF7] cursor-pointer transition-all";
                cardAdmin.className =
                    "relative flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:border-[#875C46]/50 cursor-pointer transition-all";
            }
        });
    });

    // Validação e Gravação
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        limparAviso();
        if (!form.checkValidity()) {
            const primeiroCampoInvalido = form.querySelector(":invalid");
            mostrarAviso("Confira os campos obrigatórios e corrija os dados destacados.");
            primeiroCampoInvalido?.focus();
            return;
        }

        const senha = document.getElementById("input-senha").value;
        const confirmaSenha = document.getElementById(
            "input-confirma-senha",
        ).value;

        if (senha !== confirmaSenha) {
            mostrarAviso("As senhas digitadas não coincidem. Verifique e tente novamente.");
            return;
        }

        if (!cadastroPublico && !administradorAutorizado) {
            pedirLoginAdministrador(
                "Entre com uma conta de administrador antes de criar o funcionário.",
            );
            return;
        }

        const nome = document.getElementById("input-nome").value.trim();
        const textoOriginalBotao = botaoEnviar.textContent;
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = "Salvando...";

        if (cadastroPublico) {
            try {
                const response = await fetch("/api/login/cadastro-funcionario", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nome,
                        cpf: document
                            .getElementById("input-cpf")
                            .value.replace(/\D/g, ""),
                        email: document.getElementById("input-email").value.trim(),
                        senha,
                    }),
                });
                const resultado = await response.json();
                if (!response.ok) {
                    throw new Error(
                        resultado.mensagem || "Não foi possível criar a conta.",
                    );
                }

                sessionStorage.setItem(
                    "docegestao_aviso_login",
                    "Conta criada com sucesso. Entre com seu e-mail e senha.",
                );
                voltarAoLogin();
            } catch (erro) {
                mostrarAviso(
                    erro.message || "Não foi possível conectar ao servidor.",
                );
            } finally {
                botaoEnviar.disabled = false;
                botaoEnviar.textContent = textoOriginalBotao;
            }
            return;
        }

        try {
            const token = localStorage.getItem("docegestao_token");
            if (!token) {
                throw new Error("Não há uma sessão de administrador. Faça login ou use o cadastro de conta de funcionário.");
            }

            const headers = { Authorization: `Bearer ${token}` };
            const respostaCargos = await fetch("/api/cargos", { headers });
            const resultadoCargos = await respostaCargos.json();
            if (!respostaCargos.ok) {
                throw new Error(
                    resultadoCargos.mensagem || "Não foi possível consultar os cargos.",
                );
            }

            const nivelSelecionado = form.querySelector(
                'input[name="nivel_acesso"]:checked',
            )?.value;
            const termoCargo = nivelSelecionado === "administrador" ? "admin" : "funcion";
            const cargo = resultadoCargos.dados?.find((item) =>
                item.nome_cargo
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .includes(termoCargo),
            );
            if (!cargo) {
                throw new Error("O cargo selecionado não está cadastrado no sistema.");
            }

            const response = await fetch("/api/funcionarios", {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    cpf: document.getElementById("input-cpf").value.replace(/\D/g, ""),
                    email: document.getElementById("input-email").value.trim(),
                    senha,
                    id_cargos: Number(cargo.id_cargos),
                }),
            });
            const resultado = await response.json();
            if (!response.ok) {
                throw new Error(
                    resultado.mensagem || "Não foi possível cadastrar o funcionário.",
                );
            }

            localStorage.setItem(
                "docegestao_aviso_funcionario",
                `Funcionário ${nome} criado com sucesso.`,
            );
            if (typeof window.navegarDemo === "function") {
                window.navegarDemo("funcionarios");
            } else {
                window.location.href = "./painel.html?pagina=funcionarios";
            }
        } catch (erro) {
            mostrarAviso(
                erro.message || "Não foi possível conectar ao servidor.",
            );
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = textoOriginalBotao;
        }
    });

    form.addEventListener("input", limparAviso);

    // Limpar
    btnCancelar?.addEventListener("click", () => {
        if (cadastroPublico) {
            voltarAoLogin();
            return;
        }
        form.reset();
        if (photoPreview) {
            photoPreview.src = "";
            photoPreview.classList.add("hidden");
        }
        uploadPlaceholder?.classList.remove("hidden");
    });
}

document.addEventListener("demo:page-loaded", inicializarCadastroFuncionario);
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarCadastroFuncionario, { once: true });
} else {
    inicializarCadastroFuncionario();
}
