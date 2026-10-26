const conteudoPrincipal = document.getElementById("conteudo-principal");
const paginasDemo = {
  estoque: {
    arquivo: "estoqueInsumosTeste.html",
    titulo: "Estoque de Matérias-Primas",
    ativo: "estoque",
    modais: ["modal-insumo", "modal-excluir"],
  },
  alertas: {
    arquivo: "alertaTeste.html",
    titulo: "Painel de Alertas",
    ativo: "alertas",
    modais: ["modalNovoItem", "modalRepor", "toastNotification"],
  },
  relatorios: {
    arquivo: "relatorioAnalisesTeste.html",
    titulo: "Relatórios e Análises",
    ativo: "relatorios",
    modais: ["modal-perfil", "modal-configuracoes", "modal-logout"],
  },
  historico: {
    arquivo: "historicoCompletoTeste.html",
    titulo: "Histórico Completo",
    ativo: "historico",
  },
  funcionarios: {
    arquivo: "gestao-equipesTeste.html",
    titulo: "Gestão de Equipes",
    ativo: "funcionarios",
  },
  admin: {
    arquivo: "painel-administrativoTeste.html",
    titulo: "Painel Administrativo",
    ativo: "admin",
    modais: ["modal-chamado", "toast-container"],
  },
  materia: {
    arquivo: "materia-primaTeste.html",
    titulo: "Detalhes da Matéria-Prima",
    ativo: "estoque",
  },
  cadastro: {
    arquivo: "cadastroFuncionarioTeste.html",
    titulo: "Cadastro de Funcionário",
    ativo: "funcionarios",
  },
  login: {
    arquivo: "indexTeste.html",
    titulo: "Login",
    especial: true,
    css: "login-css",
  },
  splash: {
    arquivo: "splashTeste.html",
    titulo: "Carregando",
    especial: true,
    css: "splash-css",
  },
};

const paginasPorArquivo = {
  "estoqueinsumo.html": "estoque",
  "estoqueinsumos.html": "estoque",
  "alertas.html": "alertas",
  "relatorios_analises.html": "relatorios",
  "historico-completo.html": "historico",
  "historico.html": "historico",
  "gestao-equipes.html": "funcionarios",
  "painel-administrativo.html": "admin",
  "materia-prima.html": "materia",
  "historico-materias_prima.html": "materia",
  "cadastro-funcionario.html": "cadastro",
  "index.html": "login",
  "splash.html": "splash",
};

let categoriaAlertaAtiva = "all";
let buscaAlertaAtiva = "";
let navegacaoAtual = 0;

function atualizarSidebar(pagina) {
  const sidebar = document.getElementById("sidebar-container");
  sidebar.dataset.active = paginasDemo[pagina]?.ativo || "";

  document.querySelectorAll("#sidebar-container [data-page]").forEach((link) => {
    const destino = link.dataset.page;
    const rota = destino === "funcionarios" ? "funcionarios" : destino;
    const ativo = paginasDemo[pagina]?.ativo === destino;
    link.classList.toggle("bg-cocoa-200/60", ativo);
    link.classList.toggle("text-cocoa-800", ativo);
    link.classList.toggle("font-bold", ativo);
    link.classList.toggle("shadow-sm", ativo);

    if (ativo) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");

    if (paginasDemo[rota]) {
      link.href = `?pagina=${encodeURIComponent(rota)}`;
    }
  });
}

function atualizarHeader(titulo) {
  document.title = `DoceGestão | ${titulo}`;
  document
    .querySelectorAll("#header-container [data-header-page-name]")
    .forEach((element) => {
      element.textContent = titulo;
    });
}

function exibirErro(mensagem) {
  conteudoPrincipal.replaceChildren();
  const aviso = document.createElement("p");
  aviso.className =
    "m-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800";
  aviso.setAttribute("role", "alert");
  aviso.textContent = mensagem;
  conteudoPrincipal.append(aviso);
}

function navegarDemo(pagina, parametros = {}) {
  if (!paginasDemo[pagina]) {
    throw new Error(`A página "${pagina}" não está incluída nesta demonstração.`);
  }

  const destino = new URL(window.location.href);
  destino.search = "";
  destino.searchParams.set("pagina", pagina);
  Object.entries(parametros).forEach(([nome, valor]) => {
    if (valor !== null && valor !== undefined) {
      destino.searchParams.set(nome, String(valor));
    }
  });

  if (destino.href !== window.location.href) {
    window.history.pushState({}, "", destino);
  }
  carregarPaginaAtual();
}

window.navegarDemo = navegarDemo;

function prepararConteudo(documento, configuracao) {
  const fragmento = document.createDocumentFragment();
  const corpo = documento.body;

  if (configuracao.especial) {
    [...corpo.children].forEach((elemento) => {
      if (elemento.tagName !== "SCRIPT") {
        fragmento.append(document.importNode(elemento, true));
      }
    });
    return fragmento;
  }

  const main = documento.querySelector("main");
  if (!main) {
    throw new Error(`O arquivo ${configuracao.arquivo} não contém o elemento <main>.`);
  }

  [...main.childNodes].forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE || node.tagName !== "SCRIPT") {
      fragmento.append(document.importNode(node, true));
    }
  });

  configuracao.modais?.forEach((id) => {
    const modal = documento.getElementById(id);
    if (modal && !main.contains(modal)) {
      fragmento.append(document.importNode(modal, true));
    }
  });

  return fragmento;
}

function atualizarEstruturaPagina(pagina, documento, configuracao) {
  const sidebar = document.getElementById("sidebar-container");
  const header = document.getElementById("header-container");
  const footer = document.getElementById("footer-container");
  const principal = document.getElementById("conteudo-principal");
  const cssLogin = document.getElementById("login-css");
  const cssRelatorios = document.getElementById("relatorios-css");
  const cssSplash = document.getElementById("splash-css");
  const especial = Boolean(configuracao.especial);

  sidebar.hidden = especial;
  header.hidden = especial;
  footer.hidden = especial;
  cssLogin.disabled = configuracao.css !== "login-css";
  cssRelatorios.disabled = pagina !== "relatorios";
  cssSplash.disabled = configuracao.css !== "splash-css";

  if (especial) {
    document.body.className =
      documento.body.getAttribute("class") || "min-h-screen";
    principal.className =
      pagina === "login"
        ? "flex min-h-screen flex-1 items-center justify-center p-4"
        : "relative flex min-h-screen flex-1 items-center justify-center overflow-hidden";
    return;
  }

  document.body.className = "min-h-screen bg-[#FAFAFA] text-[#4A3F39] flex";
  const mainOriginal = documento.querySelector("main");
  const classesOriginais = (mainOriginal.getAttribute("class") || "")
    .replace(/\bh-screen\b/g, "")
    .replace(/\boverflow-hidden\b/g, "")
    .trim();
  principal.className = `${classesOriginais} min-w-0 flex-1`.trim();
}

async function carregarPaginaAtual() {
  const navegacao = ++navegacaoAtual;
  document.dispatchEvent(new Event("demo:before-page-change"));
  const urlAtual = new URL(window.location.href);
  const pagina = urlAtual.searchParams.get("pagina") || "login";
  const configuracao = paginasDemo[pagina];

  if (!configuracao) {
    atualizarSidebar("");
    exibirErro(`A página "${pagina}" não está incluída nesta demonstração.`);
    document.body.style.visibility = "visible";
    return;
  }

  if (!urlAtual.searchParams.has("pagina")) {
    urlAtual.searchParams.set("pagina", pagina);
    window.history.replaceState({}, "", urlAtual);
  }

  atualizarSidebar(pagina);
  atualizarHeader(configuracao.titulo);

  try {
    const resposta = await fetch(`html/${configuracao.arquivo}`);
    if (!resposta.ok) {
      throw new Error(
        `Não foi possível carregar html/${configuracao.arquivo} (HTTP ${resposta.status}).`,
      );
    }

    const html = await resposta.text();
    const documento = new DOMParser().parseFromString(html, "text/html");
    const fragmento = prepararConteudo(documento, configuracao);
    if (navegacao !== navegacaoAtual) return;

    atualizarEstruturaPagina(pagina, documento, configuracao);
    conteudoPrincipal.replaceChildren(fragmento);
    document.body.style.visibility = "visible";

    if (pagina === "alertas") {
      categoriaAlertaAtiva = "all";
      buscaAlertaAtiva = "";
      atualizarContadores();
      aplicarFiltrosAlertas();
    }
    if (pagina === "estoque") window.inicializarEstoque();
    if (pagina === "relatorios") window.inicializarRelatorios();
    if (pagina === "materia") window.inicializarMateriaPrima();

    window.lucide?.createIcons();
    document.dispatchEvent(
      new CustomEvent("demo:page-loaded", { detail: { pagina } }),
    );
  } catch (erro) {
    console.error(`Erro ao carregar html/${configuracao.arquivo}:`, erro);
    exibirErro(
      "Não foi possível carregar a página. Confira se o projeto está aberto por um servidor local.",
    );
    document.body.style.visibility = "visible";
  }
}

function aplicarFiltrosAlertas() {
  conteudoPrincipal.querySelectorAll(".alert-card").forEach((card) => {
    const titulo = card.querySelector(".item-title")?.textContent.toLowerCase() ?? "";
    const correspondeCategoria =
      categoriaAlertaAtiva === "all" ||
      card.dataset.category === categoriaAlertaAtiva;
    const correspondeBusca = titulo.includes(buscaAlertaAtiva);
    card.style.display =
      correspondeCategoria && correspondeBusca ? "flex" : "none";
  });
}

function atualizarContadores() {
  const contador = conteudoPrincipal.querySelector("#totalAlertsCount");
  if (contador) {
    contador.textContent = conteudoPrincipal.querySelectorAll(".alert-card").length;
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function openReporModal(itemName) {
  const campoNome = document.getElementById("reporItemNome");
  if (campoNome) campoNome.value = itemName;
  openModal("modalRepor");
}

function showToast(title, message) {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;
  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMessage").textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("flex");
}

function closeToast() {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;
  toast.classList.add("hidden");
  toast.classList.remove("flex");
}

function handleNovoItem(event) {
  event.preventDefault();
  closeModal("modalNovoItem");
  showToast("Item Cadastrado", "O novo insumo foi inserido no sistema com sucesso.");
}

function handleReporSubmit(event) {
  event.preventDefault();
  const item = document.getElementById("reporItemNome")?.value ?? "item";
  closeModal("modalRepor");
  showToast("Pedido Enviado", `A ordem de reposição para ${item} foi enviada.`);
}

function dismissCard(botao) {
  const card = botao.closest(".alert-card");
  if (!card) return;
  card.style.opacity = "0";
  card.style.transform = "scale(0.95)";
  window.setTimeout(() => {
    card.remove();
    atualizarContadores();
    showToast("Alerta Descartado", "O item foi removido da lista de prioridades.");
  }, 200);
}

function rotaDoLink(link) {
  const rotaDataPage = {
    estoque: "estoque",
    alertas: "alertas",
    relatorios: "relatorios",
    historico: "historico",
    funcionarios: "funcionarios",
    admin: "admin",
  };
  if (rotaDataPage[link.dataset.page]) return rotaDataPage[link.dataset.page];

  const destino = new URL(link.href, window.location.href);
  if (destino.origin !== window.location.origin) return null;
  if (paginasDemo[destino.searchParams.get("pagina")]) {
    return destino.searchParams.get("pagina");
  }
  return paginasPorArquivo[destino.pathname.split("/").pop().toLowerCase()] || null;
}

Object.assign(window, {
  closeModal,
  closeToast,
  dismissCard,
  handleNovoItem,
  handleReporSubmit,
  openModal,
  openReporModal,
  showToast,
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (link && !event.defaultPrevented && event.button === 0 &&
      !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const pagina = rotaDoLink(link);
    if (pagina) {
      event.preventDefault();
      const destino = new URL(link.href, window.location.href);
      const parametros = Object.fromEntries(destino.searchParams.entries());
      delete parametros.pagina;
      navegarDemo(pagina, parametros);
      return;
    }
  }

  const botaoFiltro = event.target.closest("#conteudo-principal #filterTabs .tab-btn");
  if (botaoFiltro) {
    conteudoPrincipal.querySelectorAll("#filterTabs .tab-btn").forEach((botao) => {
      botao.className = "tab-btn px-4 py-2 hover:text-gray-800 transition-all";
    });
    botaoFiltro.className =
      "tab-btn bg-white text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all";
    categoriaAlertaAtiva = botaoFiltro.dataset.filter ?? "all";
    aplicarFiltrosAlertas();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.matches("#conteudo-principal #searchInput")) {
    buscaAlertaAtiva = event.target.value.trim().toLowerCase();
    aplicarFiltrosAlertas();
  }
});

document.addEventListener("change", (event) => {
  if (!event.target.matches("#conteudo-principal #sortSelect")) return;

  const container = conteudoPrincipal.querySelector("#alertCardsContainer");
  if (!container) return;

  const criterio = event.target.value;
  const cards = [...container.querySelectorAll(".alert-card")];
  cards.sort((a, b) => {
    if (criterio === "urgencia") {
      return Number(b.dataset.urgency) - Number(a.dataset.urgency);
    }
    if (criterio === "vencimento") {
      return new Date(a.dataset.vencimento) - new Date(b.dataset.vencimento);
    }
    if (criterio === "quantidade") {
      return Number(b.dataset.quantidade) - Number(a.dataset.quantidade);
    }
    return 0;
  });
  cards.forEach((card) => container.append(card));
});

window.addEventListener("popstate", carregarPaginaAtual);
carregarPaginaAtual();
