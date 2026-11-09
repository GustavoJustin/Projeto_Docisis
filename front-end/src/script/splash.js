function initializeSplashScreen() {
  const content = document.getElementById("splash-content");
  if (!content || window.__splashScreen?.content === content) return;

  const elements = {
    content,
    loadingText: document.getElementById("splash-loading-text"),
    progressTrack: document.getElementById("splash-progress-track"),
    progressBar: document.getElementById("splash-progress-bar"),
    progressValue: document.getElementById("splash-progress-value"),
    errorActions: document.getElementById("splash-error-actions"),
    retry: document.getElementById("splash-retry"),
    continue: document.getElementById("splash-continue"),
  };

  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      throw new Error(`Elemento obrigatório da tela splash não encontrado: ${name}`);
    }
  }

  const overlay = document.createElement("div");
  overlay.setAttribute("role", "region");
  overlay.setAttribute("aria-label", "Carregamento do Docisis");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;overflow:auto;background:#FAFAFA";
  content.style.cssText =
    "position:relative;inset:auto;z-index:auto;display:flex;min-height:100vh;width:100%;align-items:center;justify-content:center;overflow:auto;background:transparent;color:#4A3F39;font-family:Inter,Arial,sans-serif";
  overlay.append(content);
  document.body.append(overlay);

  let active = true;
  let attempt = 0;
  let progress = 0;
  let timer = null;

  function limparTimer() {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  function mostrarAcoes(mensagem, permitirContinuar) {
    if (!active) return;
    limparTimer();
    elements.loadingText.textContent = mensagem;
    elements.progressValue.textContent = "Carregamento pausado";
    elements.errorActions.hidden = false;
    elements.errorActions.style.display = "flex";
    elements.continue.hidden = !permitirContinuar;
    elements.continue.style.display = permitirContinuar ? "inline-flex" : "none";
    elements.content.setAttribute("aria-busy", "false");
  }

  function concluir() {
    if (!active) return;
    atualizarProgresso(100, "Tudo pronto!");
    active = false;
    limparTimer();
    elements.content.setAttribute("aria-busy", "false");
    overlay.remove();
    delete window.__splashLoader;
    delete window.__splashScreen;
  }

  function cancelar() {
    if (!active) return;
    active = false;
    attempt += 1;
    limparTimer();
    overlay.remove();
    delete window.__splashLoader;
    delete window.__splashScreen;
  }

  function atualizarProgresso(valor, mensagem) {
    if (!active) return;
    progress = Math.max(progress, Math.min(100, Math.max(0, valor)));
    const restante = 100 - Math.round(progress);
    elements.progressBar.style.width = `${progress}%`;
    elements.progressTrack.setAttribute("aria-valuenow", String(Math.round(progress)));
    elements.progressTrack.setAttribute("aria-valuetext", `Faltam ${restante}%`);
    elements.progressValue.textContent = `Faltam ${restante}%`;
    if (mensagem) elements.loadingText.textContent = mensagem;
  }

  const loader = {
    setProgress: atualizarProgresso,
    finish: concluir,
    cancel: cancelar,
  };

  window.__splashLoader = loader;
  window.__splashScreen = { content };

  async function prepararTela() {
    const tentativaAtual = ++attempt;
    limparTimer();
    progress = 0;
    elements.progressBar.style.width = "0%";
    elements.progressTrack.setAttribute("aria-valuenow", "0");
    elements.progressTrack.setAttribute("aria-valuetext", "Faltam 100%");
    elements.progressValue.textContent = "Faltam 100%";
    elements.loadingText.textContent = "Preparando seu perfil…";
    elements.errorActions.hidden = true;
    elements.errorActions.style.display = "none";
    elements.continue.hidden = true;
    elements.continue.style.display = "none";
    elements.content.setAttribute("aria-busy", "true");

    try {
      const prepararPerfil =
        typeof window.prepararPerfilDaConta === "function"
          ? window.prepararPerfilDaConta()
          : typeof window.obterFuncionarioAutenticado === "function"
            ? window.obterFuncionarioAutenticado()
            : Promise.resolve();

      await Promise.race([
        prepararPerfil,
        new Promise((_, reject) => {
          timer = window.setTimeout(
            () => reject(new Error("O perfil está demorando para responder. Verifique a conexão e tente novamente.")),
            20000,
          );
        }),
      ]);
      limparTimer();
      if (!active || tentativaAtual !== attempt) return;

      atualizarProgresso(33, "Perfil preparado. Montando sua tela…");
      if (typeof window.navegarDemo === "function") {
        window.navegarDemo("estoque");
      } else {
        window.location.assign("./painel.html?pagina=splash");
        return;
      }

      timer = window.setTimeout(() => {
        if (active && tentativaAtual === attempt) {
          mostrarAcoes(
            "A tela ainda está carregando. Você pode tentar novamente ou mostrar o painel.",
            progress >= 66,
          );
        }
      }, 25000);
    } catch (error) {
      limparTimer();
      if (!active || tentativaAtual !== attempt) return;
      console.error("Não foi possível preparar os dados do perfil:", error);
      mostrarAcoes(
        error.message || "Não foi possível carregar os dados do perfil.",
        progress >= 66,
      );
    }
  }

  elements.retry.addEventListener("click", () => {
    void prepararTela();
  });
  elements.continue.addEventListener("click", cancelar);

  void prepararTela();
}

document.addEventListener("demo:before-page-change", (event) => {
  if (event.detail?.pagina !== "estoque") {
    window.__splashLoader?.cancel();
  }
});

document.addEventListener("demo:page-loaded", (event) => {
  if (event.detail?.pagina === "splash") initializeSplashScreen();
});

if (document.getElementById("splash-content")) {
  initializeSplashScreen();
}
