function inicializarLogin() {
  const formLogin = document.getElementById("form-login");
  if (!formLogin || formLogin.dataset.loginInicializado === "true") return;
  formLogin.dataset.loginInicializado = "true";

  const loginAlert = document.getElementById("login-alert");
  const loginAlertText = document.getElementById("login-alert-text");
  const modalContato = document.getElementById("modal-contato");
  const contatoStatus = document.getElementById("contato-status");
  const contatoInfo = document.getElementById("contato-info");

  async function abrirContato() {
    if (!modalContato || !contatoStatus || !contatoInfo) return;
    modalContato.style.display = "flex";
    contatoInfo.style.display = "none";
    contatoStatus.textContent = "Buscando contato cadastrado...";

    try {
      const response = await fetch("/api/login/contato");
      const resultado = await response.json();
      if (!response.ok) {
        throw new Error(resultado.mensagem || "Não foi possível consultar o contato.");
      }

      const contato = resultado.contato;
      if (!contato) {
        contatoStatus.textContent = "O contato do administrador não está configurado.";
        return;
      }
      document.getElementById("contato-nome").textContent = contato.nome || "";
      const email = document.getElementById("contato-email");
      email.textContent = contato.email || "";
      if (contato.email) email.href = `mailto:${contato.email}`;

      const telefone = String(contato.telefone || "").trim();
      const telefoneLink = document.getElementById("contato-telefone");
      const numero = telefone.replace(/\D/g, "");
      telefoneLink.textContent = telefone || "Não configurado";
      if (numero) {
        telefoneLink.href = `https://wa.me/${numero.startsWith("55") ? numero : `55${numero}`}`;
        telefoneLink.target = "_blank";
        telefoneLink.rel = "noopener noreferrer";
      } else {
        telefoneLink.removeAttribute("href");
      }

      const instagram = String(contato.instagram || "").trim().replace(/^@/, "");
      const instagramLink = document.getElementById("contato-instagram");
      instagramLink.textContent = instagram ? `@${instagram}` : "Não configurado";
      if (instagram) {
        instagramLink.href = `https://www.instagram.com/${encodeURIComponent(instagram)}/`;
        instagramLink.target = "_blank";
        instagramLink.rel = "noopener noreferrer";
      } else {
        instagramLink.removeAttribute("href");
      }

      contatoStatus.textContent = "Para solicitar acesso ou ajuda, entre em contato com:";
      contatoInfo.style.display = "block";
    } catch (error) {
      contatoStatus.textContent =
        error.message || "Não foi possível consultar o contato do administrador.";
    }
  }

  function fecharContato() {
    if (modalContato) modalContato.style.display = "none";
  }

  document.getElementById("btn-abrir-contato")?.addEventListener("click", abrirContato);
  document.getElementById("btn-fechar-contato")?.addEventListener("click", fecharContato);
  document.getElementById("btn-fechar-contato-footer")?.addEventListener("click", fecharContato);
  modalContato?.addEventListener("click", (event) => {
    if (event.target === modalContato) fecharContato();
  });

  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = formLogin.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    if (loginAlert) loginAlert.classList.add("hidden");

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
        throw new Error(resultado.mensagem || "E-mail ou senha inválidos.");
      }

      localStorage.setItem("docegestao_token", resultado.token);
      localStorage.setItem(
        "docegestao_funcionario",
        JSON.stringify(resultado.funcionario),
      );
      if (typeof window.navegarDemo === "function") {
        window.navegarDemo("splash");
      } else {
        window.location.href = "./painel.html?pagina=splash";
      }
    } catch (error) {
      if (loginAlert && loginAlertText) {
        loginAlertText.textContent = error.message || "Não foi possível conectar à API.";
        loginAlert.classList.remove("hidden");
      }
    } finally {
      submitButton.disabled = false;
    }
  });
}

document.addEventListener("demo:page-loaded", (event) => {
  if (event.detail?.pagina === "login") inicializarLogin();
});
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarLogin, { once: true });
} else {
  inicializarLogin();
}
