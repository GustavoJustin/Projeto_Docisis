(() => {
  "use strict";

  const STORAGE_KEY = "docegestao_estoque_v1";
  const DIAS_PARA_ALERTA = 7;

  function diasAte(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const validade = new Date(`${data}T00:00:00`);
    return Math.floor((validade - hoje) / 86400000);
  }

  function classificar(produto) {
    const quantidade = Number(produto.quantidade);
    const maximo = Number(produto.maximo);
    const alertas = [];
    if (Number.isFinite(quantidade) && quantidade <= 0) {
      alertas.push("esgotado");
    } else if (Number.isFinite(quantidade) && Number.isFinite(maximo) &&
      maximo > 0 && quantidade / maximo <= 0.25) {
      alertas.push("critico");
    } else if (Number.isFinite(quantidade) && Number.isFinite(maximo) &&
      maximo > 0 && quantidade / maximo > 0.5 && quantidade / maximo <= 0.75) {
      alertas.push("medio");
    }

    const dias = diasAte(produto.validade);
    if (dias !== null && dias < 0) alertas.push("vencido");
    else if (dias !== null && dias <= DIAS_PARA_ALERTA) alertas.push("prox-vencimento");
    return alertas;
  }

  function dataPtBr(valor) {
    if (!valor) return "Sem validade cadastrada";
    return valor.split("-").reverse().join("/");
  }

  function criarCard(produto, status) {
    const card = document.createElement("article");
    const vencido = status === "vencido";
    const critico = status === "critico" || status === "esgotado";
    const estoqueNormal = status === "medio";
    const dias = diasAte(produto.validade);
    const cores = vencido
      ? ["border-red-500", "bg-red-100 text-red-700", "VENCIDO", 4, "#ef4444", "#fee2e2", "#b91c1c"]
      : status === "prox-vencimento"
        ? ["border-orange-500", "bg-orange-100 text-orange-800", "PRÓXIMO DO VENCIMENTO", 3, "#f97316", "#ffedd5", "#9a3412"]
        : status === "medio"
          ? ["border-yellow-400", "bg-yellow-100 text-yellow-800", "ESTOQUE MÉDIO", 2, "#facc15", "#fef9c3", "#854d0e"]
        : status === "esgotado"
          ? ["border-red-600", "bg-red-100 text-red-700", "FORA DE ESTOQUE", 5, "#dc2626", "#fee2e2", "#b91c1c"]
          : ["border-red-600", "bg-red-100 text-red-700", "ESTOQUE CRÍTICO", 4, "#dc2626", "#fee2e2", "#b91c1c"];
    card.className =
      `alert-card flex w-full min-w-0 flex-col items-start justify-between gap-5 rounded-2xl border border-gray-100 border-l-4 ${cores[0]} bg-white p-5 shadow-sm transition-all sm:flex-row sm:items-center`;
    card.style.borderLeftColor = cores[4];
    card.dataset.id = String(produto.id);
    card.dataset.category = status;
    card.dataset.urgency = String(cores[3]);
    card.dataset.quantidade = String(produto.quantidade);
    card.dataset.vencimento = produto.validade || "";

    const detalhes = document.createElement("div");
    detalhes.className = "alert-card__details flex w-full min-w-0 items-center gap-4 sm:w-auto";
    if (produto.imagem) {
      const imagem = document.createElement("img");
      imagem.src = produto.imagem;
      imagem.alt = produto.nome;
      imagem.className = "h-20 w-20 shrink-0 rounded-xl bg-gray-50 object-contain p-1";
      detalhes.appendChild(imagem);
    }
    const texto = document.createElement("div");
    texto.className = "alert-card__content min-w-0 space-y-1";
    const selo = document.createElement("span");
    selo.className = `inline-flex rounded px-2 py-0.5 text-[9px] font-bold ${cores[1]}`;
    selo.style.backgroundColor = cores[5];
    selo.style.color = cores[6];
    selo.textContent = cores[2];
    const nome = document.createElement("h3");
    nome.className = "item-title break-words text-base font-bold text-gray-800";
    nome.textContent = produto.nome;
    const descricao = document.createElement("p");
    descricao.className = "text-xs text-gray-500";
    descricao.textContent = produto.descricao || produto.categoria || "Matéria-prima";
    const quantidade = document.createElement("p");
    quantidade.className = "text-xs font-semibold text-gray-700";
    quantidade.textContent = `Disponível: ${produto.quantidade} ${produto.unidade}`;
    texto.append(selo, nome, descricao, quantidade);

    if (vencido || status === "prox-vencimento") {
      const validade = document.createElement("p");
      validade.className = "text-xs text-gray-500";
      validade.textContent = vencido
        ? `Venceu em ${dataPtBr(produto.validade)}`
        : `Validade: ${dataPtBr(produto.validade)} (${dias === 0 ? "hoje" : `em ${dias} ${dias === 1 ? "dia" : "dias"}`})`;
      texto.appendChild(validade);
    } else {
      const limite = document.createElement("p");
      limite.className = "text-xs text-gray-500";
      limite.textContent = `Limite configurado: ${produto.maximo} ${produto.unidade}`;
      texto.appendChild(limite);
    }
    detalhes.appendChild(texto);
    card.appendChild(detalhes);

    const acoes = document.createElement("div");
    acoes.className = "alert-card__actions flex min-w-0 flex-col gap-2";
    if (critico || estoqueNormal) {
      const atualizar = document.createElement("button");
      atualizar.type = "button";
      atualizar.dataset.action = "atualizar";
      atualizar.className = "rounded-lg bg-[#784E38] px-3 py-2 text-xs font-semibold text-white hover:bg-[#633e2c]";
      atualizar.textContent = "Atualizar estoque";
      acoes.appendChild(atualizar);
    }
    const localizar = document.createElement("button");
    localizar.type = "button";
    localizar.dataset.action = "localizar";
    localizar.className =
      "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50";
    localizar.textContent = "Localizar no estoque";
    acoes.appendChild(localizar);
    if (vencido) {
      const aviso = document.createElement("p");
      aviso.className = "text-center text-xs font-semibold text-red-700";
      aviso.textContent = "Produto vencido — não utilizar";
      acoes.appendChild(aviso);
    }
    card.appendChild(acoes);
    return card;
  }

  function aplicarFiltros() {
    const container = document.getElementById("alertCardsContainer");
    if (!container) return;
    const filtro = document.querySelector("#filterTabs [aria-pressed='true']")?.dataset.filter || "all";
    const busca = String(document.getElementById("searchInput")?.value || "")
      .trim().toLocaleLowerCase("pt-BR");
    container.querySelectorAll(".alert-card").forEach((card) => {
      const nome = card.querySelector(".item-title")?.textContent.toLocaleLowerCase("pt-BR") || "";
      card.hidden = (filtro !== "all" && card.dataset.category !== filtro) || !nome.includes(busca);
    });
  }

  function destacarAlertaDaNotificacao(container) {
    const parametros = new URLSearchParams(window.location.search);
    const produtoId = parametros.get("localizar");
    if (!produtoId) return;

    const status = parametros.get("status");
    const cards = [...container.querySelectorAll(".alert-card")];
    const card = cards.find((item) =>
      item.dataset.id === produtoId && item.dataset.category === status,
    ) || cards.find((item) => item.dataset.id === produtoId);
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.style.outline = "3px solid #875C46";
    card.style.outlineOffset = "3px";
    window.setTimeout(() => {
      if (!card.isConnected) return;
      card.style.outline = "";
      card.style.outlineOffset = "";
    }, 2500);
  }

  function mostrarErro(container, mensagem) {
    container.replaceChildren();
    const erro = document.createElement("p");
    erro.className = "rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800";
    erro.setAttribute("role", "alert");
    erro.textContent = mensagem;
    container.appendChild(erro);
  }

  async function inicializarAlertasEstoque() {
    const container = document.getElementById("alertCardsContainer");
    if (!container) return;
    if (container.dataset.alertasCarregando === "true") return;
    container.dataset.alertasCarregando = "true";
    container.replaceChildren();

    const token = localStorage.getItem("docegestao_token");
    if (!token) {
      mostrarErro(container, "Entre com sua conta para consultar os alertas do estoque.");
      delete container.dataset.alertasCarregando;
      return;
    }

    try {
      const response = await fetch("/api/produtos", {
        headers: { Authorization: "Bearer " + token },
      });
      const resultado = await response.json();
      if (!response.ok) {
        throw new Error(resultado.mensagem || "Não foi possível carregar os alertas.");
      }

      const produtos = (resultado.dados || []).map((produto) => ({
        id: String(produto.id ?? produto.id_produtos),
        nome: String(produto.nome || produto.marca || "Insumo"),
        descricao: String(produto.descricao || produto.categoria || produto.tipo || ""),
        categoria: String(produto.categoria || produto.tipo || "Outros"),
        unidade: String(produto.unidade || "un"),
        quantidade: Number(produto.quantidade) || 0,
        maximo: Number(produto.maximo) || 1,
        validade: produto.validade ? String(produto.validade).slice(0, 10) : "",
        chegada: produto.chegada ? String(produto.chegada).slice(0, 10) : "",
      }));
      const inventory = Object.fromEntries(produtos.map((produto) => [
        produto.id,
        { ...produto, dismissed: false },
      ]));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
      document.dispatchEvent(new Event("docegestao:atualizar-notificacoes"));

      const registros = produtos.flatMap((produto) =>
        classificar(produto).map((status) => ({ produto, status })),
      );
      registros.sort((a, b) => {
        const urgencia = { esgotado: 5, critico: 4, vencido: 4, "prox-vencimento": 3, medio: 2 };
        return urgencia[b.status] - urgencia[a.status];
      });
      registros.forEach(({ produto, status }) => container.appendChild(criarCard(produto, status)));
      if (!registros.length) {
        const vazio = document.createElement("p");
        vazio.className = "rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500";
        vazio.textContent = "Nenhum produto está fora do estoque, com nível crítico ou médio, ou próximo do vencimento.";
        container.appendChild(vazio);
      }
      const contador = document.getElementById("totalAlertsCount");
      if (contador) contador.textContent = String(registros.length);
      aplicarFiltros();
      destacarAlertaDaNotificacao(container);
      container.onclick = (event) => {
        const botao = event.target.closest("[data-action='atualizar'], [data-action='localizar']");
        if (!botao) return;
        const card = botao.closest(".alert-card");
        if (!card) return;
        const pagina = new URL(window.location.href);
        const produtoId = card.dataset.id;
        const localizar = botao.dataset.action === "localizar";
        const parametros = localizar
          ? { localizar: produtoId }
          : { produto: produtoId };
        if (typeof window.navegarDemo === "function") {
          window.navegarDemo("estoque", parametros);
        } else {
          pagina.pathname = pagina.pathname.replace(/alertas?\.html$/i, "painel.html");
          pagina.search = "";
          pagina.searchParams.set("pagina", "estoque");
          pagina.searchParams.set(localizar ? "localizar" : "produto", produtoId);
          window.location.assign(pagina);
        }
      };
      document.dispatchEvent(new Event("docegestao:alertas-carregados"));
    } catch (error) {
      mostrarErro(container, error.message || "Não foi possível carregar os alertas do estoque.");
      console.error("Não foi possível carregar os alertas do estoque:", error);
    } finally {
      delete container.dataset.alertasCarregando;
    }
  }

  document.addEventListener("demo:page-loaded", (event) => {
    if (event.detail?.pagina === "alertas") void inicializarAlertasEstoque();
  });
  window.inicializarAlertasEstoque = inicializarAlertasEstoque;
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#filterTabs .tab-btn")) return;
    document.querySelectorAll("#filterTabs .tab-btn").forEach((botao) => {
      const ativo = botao === event.target.closest("#filterTabs .tab-btn");
      botao.setAttribute("aria-pressed", String(ativo));
    });
    aplicarFiltros();
  });
  document.getElementById("searchInput")?.addEventListener("input", aplicarFiltros);
  document.getElementById("sortSelect")?.addEventListener("change", (event) => {
    const container = document.getElementById("alertCardsContainer");
    if (!container) return;
    const cards = [...container.querySelectorAll(".alert-card")];
    if (event.target.value === "vencimento") {
      cards.sort((a, b) => (a.dataset.vencimento || "9999").localeCompare(b.dataset.vencimento || "9999"));
    } else if (event.target.value === "quantidade") {
      cards.sort((a, b) => Number(a.dataset.quantidade) - Number(b.dataset.quantidade));
    } else {
      cards.sort((a, b) => Number(b.dataset.urgency) - Number(a.dataset.urgency));
    }
    cards.forEach((card) => container.appendChild(card));
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("alertCardsContainer") &&
          !document.getElementById("conteudo-principal")) {
        void inicializarAlertasEstoque();
      }
    }, { once: true });
  } else if (document.getElementById("alertCardsContainer") &&
      !document.getElementById("conteudo-principal")) {
    void inicializarAlertasEstoque();
  }
})();
