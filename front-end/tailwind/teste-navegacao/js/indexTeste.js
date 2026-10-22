
(() => {
    const modal = document.getElementById("modal-esqueci");
    const btnAbrir = document.getElementById("btn-abrir-esqueci");
    const btnFechar = document.getElementById("btn-fechar-esqueci");
    const btnCancelar = document.getElementById("btn-cancelar-esqueci");
    const formRecuperacao = document.getElementById("form-recuperacao");
    const msgErro = document.getElementById("mensagem-erro");
    const msgSucesso = document.getElementById("mensagem-sucesso");
    const btnEnviar = document.getElementById("btn-enviar-esqueci");
    const formLogin = document.getElementById("form-login");
    const modalContato = document.getElementById("modal-contato");
    const contatoStatus = document.getElementById("contato-status");
    const contatoInfo = document.getElementById("contato-info");
    const contatoNome = document.getElementById("contato-nome");
    const contatoEmail = document.getElementById("contato-email");
    const contatoTelefone = document.getElementById("contato-telefone");
    const contatoInstagram = document.getElementById("contato-instagram");

    async function abrirContato() {
        modalContato.style.display = "flex";
        contatoInfo.style.display = "none";
        contatoStatus.textContent = "Buscando contato cadastrado...";

        function mostrarContato(contato, mensagem) {
            contatoStatus.textContent = mensagem;
            contatoNome.textContent = contato.nome;
            contatoEmail.textContent = contato.email;
            contatoEmail.href = `mailto:${contato.email}`;
            const telefone = (contato.telefone || "").trim();
            const numeroWhatsApp = telefone.replace(/\D/g, "");
            contatoTelefone.textContent =
                numeroWhatsApp.length === 11
                    ? `(${numeroWhatsApp.slice(0, 2)}) ${numeroWhatsApp.slice(2, 7)}-${numeroWhatsApp.slice(7)}`
                    : telefone || "Não configurado";
            if (numeroWhatsApp) {
                const numeroInternacional = numeroWhatsApp.startsWith("55")
                    ? numeroWhatsApp
                    : `55${numeroWhatsApp}`;
                contatoTelefone.href = `https://wa.me/${numeroInternacional}`;
                contatoTelefone.target = "_blank";
                contatoTelefone.rel = "noopener noreferrer";
            } else {
                contatoTelefone.removeAttribute("href");
            }

            const usuarioInstagram = (contato.instagram || "")
                .trim()
                .replace(/^@/, "");
            contatoInstagram.textContent = usuarioInstagram
                ? `@${usuarioInstagram}`
                : "Não configurado";
            if (usuarioInstagram) {
                contatoInstagram.href = `https://www.instagram.com/${encodeURIComponent(usuarioInstagram)}/`;
                contatoInstagram.target = "_blank";
                contatoInstagram.rel = "noopener noreferrer";
            } else {
                contatoInstagram.removeAttribute("href");
            }
            contatoInfo.style.display = "block";
        }

        try {
            const response = await fetch("/api/login/contato");
            const resultado = await response.json();
            const contato = resultado.contato;

            if (!response.ok) throw new Error(resultado.mensagem);
            if (!contato) {
                mostrarContato(
                    {
                        nome: "Geraldo",
                        email: "geraldo_adm@docisis.com",
                        telefone: "11223459067",
                        instagram: "",
                    },
                    "Contato do administrador:",
                );
                return;
            }

            mostrarContato(
                contato,
                "Para solicitar acesso ou ajuda, entre em contato com:",
            );
        } catch {
            mostrarContato(
                {
                    nome: "Geraldo",
                    email: "geraldo_adm@docisis.com",
                    telefone: "11223459067",
                    instagram: "",
                },
                "Contato do administrador:",
            );
        }
    }

    function fecharContato() {
        modalContato.style.display = "none";
    }

    document
        .getElementById("btn-abrir-contato")
        .addEventListener("click", abrirContato);
    document
        .getElementById("btn-fechar-contato")
        .addEventListener("click", fecharContato);
    document
        .getElementById("btn-fechar-contato-footer")
        .addEventListener("click", fecharContato);
    modalContato.addEventListener("click", (event) => {
        if (event.target === modalContato) fecharContato();
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") fecharContato();
    });

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnEntrar = formLogin.querySelector('button[type="submit"]');
        btnEntrar.disabled = true;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    senha: document.getElementById("senha").value,
                }),
            });
            const resultado = await response.json();

            if (!response.ok || !resultado.token) {
                throw new Error(
                    resultado.mensagem || "E-mail ou senha inválidos.",
                );
            }

            localStorage.setItem("docegestao_token", resultado.token);
            localStorage.setItem(
                "docegestao_funcionario",
                JSON.stringify(resultado.funcionario),
            );
            window.location.href = "splash.html";
        } catch (erro) {
            alert(erro.message || "Não foi possível conectar à API.");
        } finally {
            btnEntrar.disabled = false;
        }
    });

    function abrirModal() {
        modal.style.display = "flex";
        msgErro.style.display = "none";
        msgSucesso.style.display = "none";
        formRecuperacao.reset();
        btnEnviar.disabled = false;
        btnEnviar.style.opacity = "1";
    }

    function fecharModal() {
        modal.style.display = "none";
    }

    btnAbrir.addEventListener("click", abrirModal);
    btnFechar.addEventListener("click", fecharModal);
    btnCancelar.addEventListener("click", fecharModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModal();
    });

    formRecuperacao.addEventListener("submit", (e) => {
        e.preventDefault();

        const novaSenha = document.getElementById("nova-senha").value;
        const confirmarSenha =
            document.getElementById("confirmar-senha").value;

        msgErro.style.display = "none";
        msgSucesso.style.display = "none";

        if (novaSenha !== confirmarSenha) {
            msgErro.innerText = "As senhas não coincidem. Digite novamente.";
            msgErro.style.display = "block";
            return;
        }

        if (novaSenha.length < 6) {
            msgErro.innerText = "A senha precisa ter pelo menos 6 caracteres.";
            msgErro.style.display = "block";
            return;
        }

        msgErro.innerText =
            "A recuperação de senha ainda não está conectada ao servidor. Entre em contato com o administrador.";
        msgErro.style.display = "block";
    });
})();
