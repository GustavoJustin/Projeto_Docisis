const conteudoPrincipal = document.getElementById("conteudo-principal");
const paginaInicial = conteudoPrincipal.innerHTML;
const paginasDemo = {
  alertas: {
    arquivo: "teste.html",
    titulo: "Painel de Alertas",
    modais: ["modalNovoItem", "modalRepor"],
  },
  relatorios: {
    arquivo: "testeRe.html",
    titulo: "Relatórios e Analises",
    modais: ["modal-perfil", "modal-configuracoes", "modal-logout"],
  },
};
let categoriaAlertaAtiva = "all";
let buscaAlertaAtiva = "";
let navegacaoAtual = 0;

function atualizarSidebar(pagina) {
  document.querySelectorAll("#sidebar-container [data-page]").forEach((link) => {
    const ativo = link.dataset.page === pagina;
    link.classList.toggle("bg-cocoa-200/60", ativo);
    link.classList.toggle("text-cocoa-800", ativo);
    link.classList.toggle("font-bold", ativo);
    link.classList.toggle("shadow-sm", ativo);

    if (ativo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    if (paginasDemo[link.dataset.page]) {
      link.href = new URL(
        `painel.html?pagina=${link.dataset.page}`,
        window.location.href,
      ).href;
    } else if (link.getAttribute("href")?.startsWith("./")) {
      link.href = new URL(`../${link.getAttribute("href").slice(2)}`, window.location.href).href;
    }
  });
}

function atualizarHeader(titulo) {
  document.title = `DoceGestão | ${titulo}`;
  document.querySelectorAll("#header-container [data-header-page-name]").forEach((element) => {
    element.textContent = titulo;
  });
}

function exibirErro(mensagem) {
  conteudoPrincipal.replaceChildren();
  const aviso = document.createElement("p");
  aviso.className = "m-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800";
  aviso.setAttribute("role", "alert");
  aviso.textContent = mensagem;
  conteudoPrincipal.append(aviso);
}

async function carregarPaginaAtual() {
  const navegacao = ++navegacaoAtual;
  const pagina = new URL(window.location.href).searchParams.get("pagina");
  const cssRelatorios = document.getElementById("relatorios-css");

  if (!pagina) {
    cssRelatorios.disabled = true;
    atualizarSidebar("");
    atualizarHeader("Painel de Demonstração");
    conteudoPrincipal.innerHTML = paginaInicial;
    return;
  }

  const configuracao = paginasDemo[pagina];
  if (!configuracao) {
    cssRelatorios.disabled = true;
    atualizarSidebar("");
    exibirErro(`A página "${pagina}" não está incluída nesta demonstração.`);
    return;
  }

  cssRelatorios.disabled = pagina !== "relatorios";
  atualizarSidebar(pagina);
  atualizarHeader(configuracao.titulo);

  try {
    const resposta = await fetch(configuracao.arquivo);
    if (!resposta.ok) {
      throw new Error(
        `Não foi possível carregar ${configuracao.arquivo} (HTTP ${resposta.status}).`,
      );
    }

    const html = await resposta.text();
    const documento = new DOMParser().parseFromString(html, "text/html");
    const conteudoPagina = documento.querySelector("main");
    if (!conteudoPagina) {
      throw new Error(`O arquivo ${configuracao.arquivo} não contém o elemento <main> esperado.`);
    }

    if (navegacao !== navegacaoAtual) return;

    const fragmento = document.createElement("div");
    fragmento.innerHTML = conteudoPagina.innerHTML;
    configuracao.modais.forEach((id) => {
      const modal = documento.getElementById(id);
      if (modal) fragmento.append(modal);
    });

    conteudoPrincipal.replaceChildren(...fragmento.childNodes);
    if (pagina === "alertas") {
      categoriaAlertaAtiva = "all";
      buscaAlertaAtiva = "";
      atualizarContadores();
      aplicarFiltrosAlertas();
    }

    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }
  } catch (erro) {
    console.error(`Erro ao carregar ${configuracao.arquivo}:`, erro);
    exibirErro("Não foi possível carregar a página. Confira se o projeto está aberto por um servidor local.");
  }
}

function aplicarFiltrosAlertas() {
  conteudoPrincipal.querySelectorAll(".alert-card").forEach((card) => {
    const titulo = card.querySelector(".item-title")?.textContent.toLowerCase() ?? "";
    const correspondeCategoria =
      categoriaAlertaAtiva === "all" || card.dataset.category === categoriaAlertaAtiva;
    const correspondeBusca = titulo.includes(buscaAlertaAtiva);
    card.style.display = correspondeCategoria && correspondeBusca ? "flex" : "none";
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
  const link = event.target.closest(
    "#sidebar-container [data-page='alertas'], #sidebar-container [data-page='relatorios'], [data-demo-nav='alertas']",
  );
  if (link && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    const destino = new URL(link.href, window.location.href);
    if (destino.href !== window.location.href) {
      window.history.pushState({}, "", destino);
    }
    carregarPaginaAtual();
    return;
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
