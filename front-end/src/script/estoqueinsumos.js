const ESTOQUE_NOTIFICACOES_KEY = "docegestao_estoque_v1";

function mostrarAvisoEstoque(message, type = "success") {
  const notice = document.getElementById("aviso-estoque");
  if (!notice) return;
  notice.textContent = message;
  notice.className =
    type === "error"
      ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800";
  notice.hidden = !message;
}

function mostrarErroModal(id, message) {
  const error = document.getElementById(id);
  if (!error) {
    mostrarAvisoEstoque(message, "error");
    return;
  }
  error.textContent = message;
  error.classList.remove("hidden");
}

function limparErroModal(id) {
  const error = document.getElementById(id);
  if (!error) return;
  error.textContent = "";
  error.classList.add("hidden");
}

async function requisitarEstoque(url, options = {}) {
  const token = localStorage.getItem("docegestao_token");
  if (!token) {
    throw new Error("Entre com sua conta para consultar e alterar o estoque.");
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    await response.text();
    throw new Error(
      response.ok
        ? "O servidor retornou uma resposta inesperada. Verifique a configuração da API."
        : `A API do estoque não respondeu com JSON (HTTP ${response.status}). Confirme que o backend atualizado está em execução e tente novamente.`,
    );
  }
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.mensagem || "Não foi possível atualizar o estoque.");
  }
  return result;
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const botaoSidebar = target?.closest("#btn-novo-sidebar");
  if (!botaoSidebar || !document.getElementById("grid-produtos")) return;
  event.preventDefault();
  document.getElementById("modal-insumo")?.classList.remove("hidden");
  limparErroModal("erro-form-insumo");
});

function normalizarProdutoEstoque(product) {
  return {
    id: String(product.id ?? product.id_produtos),
    nome: String(product.nome || product.marca || "Insumo"),
    categoria: String(product.categoria || product.tipo || "Outros"),
    descricao: String(product.descricao || product.categoria || product.tipo || ""),
    unidade: String(product.unidade || "un"),
    quantidade: Number(product.quantidade) || 0,
    maximo: Number(product.maximo) || 1,
    preco: String(product.preco || ""),
    imagem: String(product.imagem || ""),
    chegada: product.chegada ? String(product.chegada).slice(0, 10) : "",
    validade: product.validade ? String(product.validade).slice(0, 10) : "",
    dismissed: false,
  };
}

function salvarEstoqueParaNotificacoes(products) {
  const estoque = Object.fromEntries(
    products.map((product) => {
      const dadosNotificacao = normalizarProdutoEstoque(product);
      delete dadosNotificacao.imagem;
      return [product.id, dadosNotificacao];
    }),
  );
  localStorage.setItem(ESTOQUE_NOTIFICACOES_KEY, JSON.stringify(estoque));
  document.dispatchEvent(new Event("docegestao:atualizar-notificacoes"));
}

function corNivelEstoque(percentual) {
  if (percentual <= 0) return "#ef4444";
  if (percentual <= 50) return "#eab308";
  if (percentual <= 75) return "#eab308";
  return "#10b981";
}

function criarCardProduto(product) {
  const item = normalizarProdutoEstoque(product);
  const classificacao = window.estoqueClassificacao.classificar(item);
  const alertaPrincipal = window.estoqueClassificacao.obterAlerta(classificacao.status);
  const vencido = classificacao.estados.includes("vencido");
  const proximoVencimento = classificacao.estados.includes("prox-vencimento");
  const diasValidade = classificacao.diasValidade;
  const corLateral = alertaPrincipal?.cor || null;
  const card = document.createElement("article");
  card.className =
    `cartao-produto h-full ${corLateral ? "border-0" : "border border-black/10"} rounded-2xl p-3 flex flex-col justify-between bg-white shadow-sm`;
  card.style.minHeight = "320px";
  if (corLateral) {
    card.style.borderLeft = `4px solid ${corLateral}`;
  }
  card.dataset.id = item.id;
  card.dataset.nome = item.nome.toLocaleLowerCase("pt-BR");
  card.dataset.categoria = item.categoria;
  card.dataset.unidade = item.unidade;
  card.dataset.validade = item.validade;
  card.dataset.alertStatus = classificacao.status || "";

  const body = document.createElement("div");
  const imageArea = document.createElement("div");
  imageArea.className =
    "relative h-36 rounded-xl overflow-hidden mb-3 bg-gray-50 flex items-center justify-center";

  if (item.imagem) {
    const image = document.createElement("img");
    image.src = item.imagem;
    image.alt = item.nome;
    image.className = "w-full h-full object-contain p-2";
    image.addEventListener("error", () => image.remove(), { once: true });
    imageArea.appendChild(image);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "text-3xl font-semibold text-brand-brown";
    placeholder.textContent = item.nome.charAt(0).toUpperCase();
    imageArea.appendChild(placeholder);
  }

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className =
    "btn-excluir absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer";
  deleteButton.title = "Excluir insumo";
  deleteButton.setAttribute("aria-label", `Excluir ${item.nome}`);
  deleteButton.innerHTML =
    '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>';
  imageArea.appendChild(deleteButton);

  const details = document.createElement("div");
  details.className = "px-1 space-y-2";
  const heading = document.createElement("div");
  heading.className = "flex items-baseline justify-between gap-2";
  const name = document.createElement("h3");
  name.className = "font-bold text-xs text-brand-text-dark";
  name.textContent = item.nome;
  const price = document.createElement("span");
  price.className = "text-xs font-bold text-brand-brown text-right";
  price.textContent = item.preco;
  heading.append(name, price);

  const category = document.createElement("p");
  category.className = "text-[10px] text-brand-text-muted";
  category.textContent = item.descricao || `Categoria: ${item.categoria}`;
  if (vencido || proximoVencimento) {
    const validade = document.createElement("p");
    validade.className = "text-[10px] font-semibold";
    validade.style.color = window.estoqueClassificacao
      .obterAlerta(vencido ? "vencido" : "prox-vencimento").cor;
    validade.textContent = vencido
      ? `VENCIDO · validade ${dataEstoquePtBr(item.validade)}`
      : `PRÓXIMO DO VENCIMENTO · ${dataEstoquePtBr(item.validade)}${
          diasValidade === 0 ? " (hoje)" : ` (em ${diasValidade} ${diasValidade === 1 ? "dia" : "dias"})`
        }`;
    details.appendChild(validade);
  }

  const level = document.createElement("div");
  level.className = "pt-2";
  const levelInfo = document.createElement("div");
  levelInfo.className =
    "flex justify-between text-[9px] text-brand-text-muted mb-1";
  const levelLabel = document.createElement("span");
  levelLabel.textContent = "Nível de Estoque";
  const levelValue = document.createElement("span");
  levelValue.className = "nivel-estoque";
  levelInfo.append(levelLabel, levelValue);
  const track = document.createElement("div");
  track.className = "w-full bg-black/5 rounded-full h-1";
  const progress = document.createElement("div");
  progress.className = "barra-estoque h-full rounded-full";
  track.appendChild(progress);
  level.append(levelInfo, track);
  details.append(heading, category, level);
  body.append(imageArea, details);

  const footer = document.createElement("div");
  footer.className = "flex items-center justify-between pt-4 px-1";
  const quantity = document.createElement("span");
  quantity.className = "qtd-valor text-base font-bold text-brand-text-dark";
  const unit = document.createElement("span");
  unit.className = "text-xs font-normal text-brand-text-muted";
  quantity.append(document.createTextNode(""), unit);
  const update = document.createElement("button");
  update.type = "button";
  update.className =
    "btn-atualizar rounded-lg bg-brand-brown px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-brown-dark cursor-pointer";
  update.textContent = "Atualizar";
  update.setAttribute("aria-label", `Atualizar estoque de ${item.nome}`);
  footer.append(quantity, update);
  card.append(body, footer);
  atualizarApresentacaoQuantidade(card, item);
  return card;
}

function atualizarApresentacaoQuantidade(card, product) {
  const quantity = Number(product.quantidade) || 0;
  const max = Number(product.maximo) || 1;
  const percentage = Math.min(100, Math.max(0, (quantity / max) * 100));
  const levelValue = card.querySelector(".nivel-estoque");
  const progress = card.querySelector(".barra-estoque");
  const quantityValue = card.querySelector(".qtd-valor");

  if (levelValue) {
    levelValue.textContent = `${quantity}/${max} ${product.unidade}`;
    levelValue.classList.add("text-brand-text-dark");
  }
  if (progress) {
    progress.style.width = `${percentage}%`;
    const classificacao = window.estoqueClassificacao.classificar(product);
    const alerta = window.estoqueClassificacao.obterAlerta(classificacao.status);
    progress.style.backgroundColor = alerta?.cor || corNivelEstoque(percentage);
  }
  if (quantityValue) {
    quantityValue.firstChild.textContent = `${quantity} `;
    quantityValue.classList.add("text-brand-text-dark");
    const unit = quantityValue.querySelector("span");
    if (unit) {
      unit.textContent = product.unidade;
      unit.classList.add("text-brand-text-muted");
    }
  }
}

function diasAteValidade(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor || "")) return null;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.floor((new Date(`${valor}T00:00:00`) - hoje) / 86400000);
}

function dataEstoquePtBr(valor) {
  return valor ? valor.split("-").reverse().join("/") : "";
}

async function inicializarEstoque() {
  const grid = document.getElementById("grid-produtos");
  if (!grid || grid.dataset.estoqueInicializado === "true") return;
  grid.dataset.estoqueInicializado = "true";

  const modal = document.getElementById("modal-insumo");
  const modalExcluir = document.getElementById("modal-excluir");
  const modalAtualizar = document.getElementById("modal-atualizar-estoque");
  const formInsumo = document.getElementById("form-novo-insumo");
  const cardAdicionar = document.getElementById("btn-card-adicionar");
  const botaoConfirmarExclusao = document.getElementById("btn-confirmar-exclusao");
  const botaoCancelarExclusao = document.getElementById("btn-cancelar-exclusao");
  const formAtualizacao = document.getElementById("form-atualizar-estoque");
  const campoQuantidadeAtualizacao = document.getElementById("input-quantidade-atualizacao");
  const botaoConfirmarAtualizacao = document.getElementById("btn-concluir-atualizacao");
  const inputImagemArquivo = document.getElementById("input-imagem-arquivo");
  const inputImagemUrl = document.getElementById("input-imagem");
  const botaoRemoverImagem = document.getElementById("btn-remover-imagem");
  const campoQuantidadeCadastro = document.getElementById("input-qtd-atual");
  const campoMaximoCadastro = document.getElementById("input-qtd-max");
  const campoMaximoAtualizacao = document.getElementById("input-maximo-atualizacao");
  const avisoLimiteCadastro = document.getElementById("aviso-limite-cadastro");
  const textoNivelCadastro = document.getElementById("texto-nivel-cadastro");
  const barraNivelCadastro = document.getElementById("barra-nivel-cadastro");
  const textoNivelAtualizacao = document.getElementById("texto-nivel-atualizacao");
  const barraNivelAtualizacao = document.getElementById("barra-nivel-atualizacao");
  const textoArquivoImagem = document.getElementById("nome-arquivo-imagem");
  let imagemSelecionada = "";
  let productToUpdate = null;
  const aviso = document.createElement("div");
  aviso.id = "aviso-estoque";
  aviso.className = "hidden";
  aviso.setAttribute("role", "status");
  aviso.setAttribute("aria-live", "polite");
  grid.parentElement.insertBefore(aviso, grid);

  let products = [];
  let productToDelete = null;
  let activeCategory = "Tudo";
  const filterButtons = [...document.querySelectorAll(".filtro-btn")];
  const search = document.getElementById("input-busca");

  function atualizarIndicadorCadastro() {
    const quantidade = Number(campoQuantidadeCadastro?.value);
    const maximo = Number(campoMaximoCadastro?.value);
    const dadosValidos = Number.isFinite(quantidade) && quantidade >= 0 &&
      Number.isFinite(maximo) && maximo > 0;
    const percentual = dadosValidos ? (quantidade / maximo) * 100 : 0;
    if (textoNivelCadastro) {
      textoNivelCadastro.textContent = dadosValidos
        ? `${Math.round(percentual)}% do limite utilizado · ${Math.max(0, maximo - quantidade)} ${document.getElementById("input-unidade").value} disponíveis`
        : "Informe a quantidade e o limite máximo para acompanhar o estoque.";
    }
    if (barraNivelCadastro) {
      barraNivelCadastro.style.width = `${Math.min(100, Math.max(0, percentual))}%`;
      barraNivelCadastro.style.backgroundColor = corNivelEstoque(percentual);
      barraNivelCadastro.parentElement.setAttribute(
        "aria-valuenow",
        String(Math.min(100, Math.max(0, Math.round(percentual)))),
      );
    }
    if (avisoLimiteCadastro) {
      const excedeu = dadosValidos && quantidade > maximo;
      avisoLimiteCadastro.textContent = excedeu
        ? `Não é possível cadastrar ${quantidade} ${document.getElementById("input-unidade").value}: o limite máximo é ${maximo}. Reduza a quantidade ou aumente o limite.`
        : "";
      avisoLimiteCadastro.classList.toggle("hidden", !excedeu);
    }
  }

  function atualizarIndicadorAtualizacao() {
    if (!productToUpdate) return;
    const quantidade = Number(campoQuantidadeAtualizacao?.value);
    const maximo = Number(campoMaximoAtualizacao?.value);
    const dadosValidos = Number.isFinite(quantidade) && quantidade >= 0 &&
      Number.isFinite(maximo) && maximo > 0;
    const percentual = dadosValidos ? (quantidade / maximo) * 100 : 0;
    if (textoNivelAtualizacao) {
      textoNivelAtualizacao.textContent = dadosValidos
        ? quantidade > maximo
          ? `O estoque está ${quantidade - maximo} ${productToUpdate.unidade} acima do limite. Reduza a quantidade ou aumente o limite.`
          : `${Math.round(percentual)}% do limite utilizado · ${Math.max(0, maximo - quantidade)} ${productToUpdate.unidade} disponíveis`
        : "Informe uma quantidade e um limite máximo válidos.";
    }
    if (barraNivelAtualizacao) {
      barraNivelAtualizacao.style.width = `${Math.min(100, Math.max(0, percentual))}%`;
      barraNivelAtualizacao.style.backgroundColor = corNivelEstoque(percentual);
      barraNivelAtualizacao.parentElement.setAttribute(
        "aria-valuenow",
        String(Math.min(100, Math.max(0, Math.round(percentual)))),
      );
    }
    const aumentar = document.getElementById("btn-aumentar-atualizacao");
    if (aumentar) aumentar.disabled = !dadosValidos || quantidade >= maximo;
  }

  function atualizarArquivoImagem() {
    const arquivo = inputImagemArquivo?.files?.[0];
    if (textoArquivoImagem) {
      textoArquivoImagem.textContent = arquivo?.name || "Nenhuma imagem selecionada";
    }
    if (botaoRemoverImagem) {
      botaoRemoverImagem.classList.toggle(
        "hidden",
        !arquivo && !imagemSelecionada && !inputImagemUrl?.value.trim(),
      );
    }
  }

  function applyFilters() {
    const term = String(search?.value || "").trim().toLocaleLowerCase("pt-BR");
    grid.querySelectorAll(".cartao-produto").forEach((card) => {
      const matchesCategory =
        activeCategory === "Tudo" || card.dataset.categoria === activeCategory;
      const matchesTerm = (card.dataset.nome || "").includes(term);
      card.style.display = matchesCategory && matchesTerm ? "flex" : "none";
    });
    if (cardAdicionar) {
      cardAdicionar.style.minHeight = "320px";
      cardAdicionar.style.height = "100%";
      cardAdicionar.style.alignSelf = "stretch";
      cardAdicionar.style.display =
        activeCategory === "Tudo" && !term ? "flex" : "none";
    }
  }

  function renderProducts() {
    grid.querySelectorAll(".cartao-produto").forEach((card) => card.remove());
    const sortedProducts = [...products].sort((a, b) => {
      const percentA = a.maximo > 0 ? a.quantidade / a.maximo : 0;
      const percentB = b.maximo > 0 ? b.quantidade / b.maximo : 0;
      const criticalA = a.quantidade <= 0 || percentA <= 0.25;
      const criticalB = b.quantidade <= 0 || percentB <= 0.25;
      const daysA = diasAteValidade(a.validade);
      const daysB = diasAteValidade(b.validade);
      const expiredA = daysA !== null && daysA < 0;
      const expiredB = daysB !== null && daysB < 0;
      const nearCriticalA = percentA > 0.25 && percentA <= 0.5;
      const nearCriticalB = percentB > 0.25 && percentB <= 0.5;
      const mediumA = percentA > 0.5 && percentA <= 0.75;
      const mediumB = percentB > 0.5 && percentB <= 0.75;
      const nearExpirationA = daysA !== null && daysA >= 0 && daysA <= 7;
      const nearExpirationB = daysB !== null && daysB >= 0 && daysB <= 7;
      const priorityA = criticalA || expiredA
        ? 0
        : nearCriticalA || nearExpirationA
          ? 1
          : mediumA
            ? 2
            : 3;
      const priorityB = criticalB || expiredB
        ? 0
        : nearCriticalB || nearExpirationB
          ? 1
          : mediumB
            ? 2
            : 3;
      if (priorityA !== priorityB) return priorityA - priorityB;
      if (priorityA === 0) return percentA - percentB;
      if (priorityA === 1) {
        const expirationA = daysA === null ? Number.POSITIVE_INFINITY : daysA;
        const expirationB = daysB === null ? Number.POSITIVE_INFINITY : daysB;
        if (expirationA !== expirationB) return expirationA - expirationB;
      }
      return a.nome.localeCompare(b.nome, "pt-BR");
    });
    sortedProducts.forEach((product) => {
      grid.insertBefore(criarCardProduto(product), cardAdicionar || null);
    });
    const contadorAlertas = document.querySelector("#estoque-total-alertas span");
    if (contadorAlertas) {
      contadorAlertas.textContent = String(
        sortedProducts.filter((product) =>
          window.estoqueClassificacao.classificar(product).status,
        ).length,
      );
    }
    atualizarContadoresCategorias();
    salvarEstoqueParaNotificacoes(products);
    applyFilters();
  }

  function atualizarContadoresCategorias() {
    filterButtons.forEach((button) => {
      const categoria = button.dataset.categoria || "Tudo";
      const count = categoria === "Tudo"
        ? products.length
        : products.filter((product) => product.categoria === categoria).length;
      let contador = button.querySelector(".filtro-contador");
      if (!contador) {
        contador = document.createElement("span");
        contador.className = "filtro-contador ml-1 text-[10px] opacity-70";
        button.appendChild(contador);
      }
      contador.textContent = String(count);
    });
  }

  async function carregarProdutos() {
    try {
      const result = await requisitarEstoque("/api/produtos");
      products = (result.dados || []).map(normalizarProdutoEstoque);
      renderProducts();
      mostrarAvisoEstoque("");
    } catch (error) {
      products = [];
      renderProducts();
      mostrarAvisoEstoque(error.message || "Não foi possível carregar o estoque.", "error");
    }
  }

  function abrirModal() {
    limparErroModal("erro-form-insumo");
    modal?.classList.remove("hidden");
  }

  function fecharModal() {
    modal?.classList.add("hidden");
    formInsumo?.reset();
    imagemSelecionada = "";
    atualizarIndicadorCadastro();
    atualizarArquivoImagem();
    limparErroModal("erro-form-insumo");
  }

  function fecharModalExclusao() {
    modalExcluir?.classList.add("hidden");
    productToDelete = null;
    limparErroModal("erro-exclusao");
  }

  function fecharModalAtualizacao() {
    modalAtualizar?.classList.add("hidden");
    formAtualizacao?.reset();
    productToUpdate = null;
    limparErroModal("erro-atualizar-estoque");
  }

  function abrirModalAtualizacao(card) {
    productToUpdate = products.find((item) => String(item.id) === card.dataset.id);
    if (!productToUpdate) {
      mostrarAvisoEstoque("Não foi possível identificar o produto selecionado.", "error");
      return;
    }
    const nome = document.getElementById("titulo-atualizacao-produto");
    const descricao = document.getElementById("descricao-atualizacao-produto");
    const quantidadeAtual = document.getElementById("quantidade-atual-produto");
    const quantidadeMaxima = document.getElementById("maximo-atual-produto");
    if (nome) nome.textContent = productToUpdate.nome;
    if (descricao) descricao.textContent = productToUpdate.descricao || productToUpdate.categoria;
    if (quantidadeAtual) quantidadeAtual.textContent = `${productToUpdate.quantidade} ${productToUpdate.unidade}`;
    if (quantidadeMaxima) quantidadeMaxima.textContent = `${productToUpdate.maximo} ${productToUpdate.unidade}`;
    if (campoQuantidadeAtualizacao) {
      campoQuantidadeAtualizacao.value = String(productToUpdate.quantidade);
    }
    if (campoMaximoAtualizacao) {
      campoMaximoAtualizacao.value = String(productToUpdate.maximo);
    }
    atualizarIndicadorAtualizacao();
    const diminuir = document.getElementById("btn-diminuir-atualizacao");
    if (diminuir) diminuir.disabled = productToUpdate.quantidade <= 0;
    campoQuantidadeAtualizacao?.dispatchEvent(new Event("input", { bubbles: true }));
    limparErroModal("erro-atualizar-estoque");
    modalAtualizar?.classList.remove("hidden");
  }

  async function concluirAtualizacaoEstoque() {
    if (!productToUpdate || !campoQuantidadeAtualizacao || !campoMaximoAtualizacao) return;
    const quantidadeDesejada = Number(campoQuantidadeAtualizacao.value);
    const limiteNovo = Number(campoMaximoAtualizacao.value);
    if (!Number.isFinite(quantidadeDesejada) ||
        quantidadeDesejada < 0 ||
        !Number.isFinite(limiteNovo) ||
        limiteNovo <= 0 ||
        quantidadeDesejada > limiteNovo) {
      mostrarErroModal(
        "erro-atualizar-estoque",
        quantidadeDesejada > limiteNovo
          ? `A quantidade não pode ultrapassar o novo limite de ${limiteNovo} ${productToUpdate.unidade}.`
          : `Informe um limite máximo maior que zero e uma quantidade entre 0 e ${limiteNovo} ${productToUpdate.unidade}.`,
      );
      return;
    }

    const variacao = Math.round((quantidadeDesejada - productToUpdate.quantidade) * 100) / 100;
    const limiteAlterado = limiteNovo !== productToUpdate.maximo;
    if (variacao === 0 && !limiteAlterado) {
      fecharModalAtualizacao();
      return;
    }

    limparErroModal("erro-atualizar-estoque");
    botaoConfirmarAtualizacao.disabled = true;
    botaoConfirmarAtualizacao.textContent = "Atualizando...";
    try {
      const resultado = await requisitarEstoque(
        `/api/produtos/${productToUpdate.id}/movimentacoes`,
        {
          method: "POST",
          body: JSON.stringify({
            variacao,
            maximo: limiteNovo,
            descricao: document.getElementById("input-descricao-movimentacao").value.trim(),
          }),
        },
      );
      productToUpdate.quantidade = resultado.dados.quantidade;
      productToUpdate.maximo = resultado.dados.maximo;
      renderProducts();
      const nome = productToUpdate.nome;
      fecharModalAtualizacao();
      mostrarAvisoEstoque(
        variacao === 0
          ? `Limite de estoque de ${nome} atualizado.`
          : `Estoque de ${nome} atualizado e movimentação registrada.`,
      );
    } catch (error) {
      mostrarErroModal(
        "erro-atualizar-estoque",
        error.message || "Não foi possível atualizar o estoque.",
      );
    } finally {
      botaoConfirmarAtualizacao.disabled = false;
      botaoConfirmarAtualizacao.textContent = "Concluir";
    }
  }

  function abrirModalExclusao(card) {
    const productId = card.dataset.id;
    productToDelete = products.find((product) => String(product.id) === productId);
    if (!productToDelete) {
      mostrarAvisoEstoque("Não foi possível identificar o produto selecionado.", "error");
      return;
    }
    limparErroModal("erro-exclusao");
    const text = document.getElementById("texto-confirma-exclusao");
    if (text) {
      text.textContent = `Deseja realmente excluir "${productToDelete.nome}" do estoque? Esta ação não poderá ser desfeita.`;
    }
    modalExcluir?.classList.remove("hidden");
  }

  cardAdicionar?.addEventListener("click", abrirModal);
  document.getElementById("btn-novo-footer")?.addEventListener("click", abrirModal);
  document.getElementById("btn-fechar-modal")?.addEventListener("click", fecharModal);
  document.getElementById("btn-cancelar")?.addEventListener("click", fecharModal);
  document.getElementById("btn-cancelar-atualizacao")?.addEventListener("click", fecharModalAtualizacao);
  document.getElementById("btn-fechar-atualizacao")?.addEventListener("click", fecharModalAtualizacao);
  modalAtualizar?.addEventListener("click", (event) => {
    if (event.target === modalAtualizar) fecharModalAtualizacao();
  });
  formAtualizacao?.addEventListener("submit", (event) => {
    event.preventDefault();
    void concluirAtualizacaoEstoque();
  });
  document.getElementById("btn-diminuir-atualizacao")?.addEventListener("click", () => {
    if (!campoQuantidadeAtualizacao) return;
    const atual = Number(campoQuantidadeAtualizacao.value) || 0;
    campoQuantidadeAtualizacao.value = String(Math.max(0, Math.round((atual - 1) * 100) / 100));
    campoQuantidadeAtualizacao.dispatchEvent(new Event("input", { bubbles: true }));
  });
  document.getElementById("btn-aumentar-atualizacao")?.addEventListener("click", () => {
    if (!campoQuantidadeAtualizacao) return;
    const atual = Number(campoQuantidadeAtualizacao.value) || 0;
    const maximo = Number(campoMaximoAtualizacao?.value);
    campoQuantidadeAtualizacao.value = String(Math.min(maximo, Math.round((atual + 1) * 100) / 100));
    campoQuantidadeAtualizacao.dispatchEvent(new Event("input", { bubbles: true }));
  });
  campoQuantidadeAtualizacao?.addEventListener("input", () => {
    const quantidade = Number(campoQuantidadeAtualizacao.value) || 0;
    const maximo = Number(campoMaximoAtualizacao?.value) || 0;
    const diminuir = document.getElementById("btn-diminuir-atualizacao");
    const aumentar = document.getElementById("btn-aumentar-atualizacao");
    if (diminuir) diminuir.disabled = quantidade <= 0;
    if (aumentar) aumentar.disabled = quantidade >= maximo;
    atualizarIndicadorAtualizacao();
  });
  document.getElementById("input-unidade")?.addEventListener("change", atualizarIndicadorCadastro);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) fecharModal();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.categoria || "Tudo";
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("bg-white", selected);
        item.classList.toggle("text-gray-800", selected);
        item.classList.toggle("shadow-sm", selected);
        item.classList.toggle("text-gray-500", !selected);
        item.classList.toggle("hover:text-gray-800", !selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      applyFilters();
    });
  });
  search?.addEventListener("input", applyFilters);

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".cartao-produto");
    if (!card) return;
    if (event.target.closest(".btn-excluir")) {
      event.preventDefault();
      abrirModalExclusao(card);
    } else if (event.target.closest(".btn-atualizar")) {
      event.preventDefault();
      abrirModalAtualizacao(card);
    }
  });

  formInsumo?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = formInsumo.querySelector('button[type="submit"]');
    limparErroModal("erro-form-insumo");
    const nome = document.getElementById("input-nome").value.trim();
    const categoria = document.getElementById("input-categoria").value;
    const quantidade = Number(campoQuantidadeCadastro.value);
    const maximo = Number(campoMaximoCadastro.value);
    if (!Number.isFinite(quantidade) || quantidade < 0 ||
        !Number.isFinite(maximo) || maximo <= 0) {
      mostrarErroModal("erro-form-insumo", "Informe uma quantidade válida e um limite máximo maior que zero.");
      return;
    }
    if (quantidade > maximo) {
      mostrarErroModal(
        "erro-form-insumo",
        `Não é possível cadastrar ${quantidade} ${document.getElementById("input-unidade").value}: o limite máximo é ${maximo}. Reduza a quantidade ou aumente o limite.`,
      );
      return;
    }
    if (!formInsumo.checkValidity()) {
      formInsumo.reportValidity();
      return;
    }
    const imagemUrl = inputImagemUrl.value.trim();
    if (!imagemSelecionada && imagemUrl) {
      try {
        const url = new URL(imagemUrl);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        mostrarErroModal("erro-form-insumo", "Informe uma URL de imagem iniciando com http:// ou https://.");
        return;
      }
    }
    const payload = {
      nome,
      categoria,
      descricao: document.getElementById("input-descricao").value.trim(),
      preco: document.getElementById("input-preco").value.trim(),
      quantidade,
      maximo,
      unidade: document.getElementById("input-unidade").value,
      chegada: document.getElementById("input-chegada").value,
      validade: document.getElementById("input-validade").value,
      imagem: imagemSelecionada || imagemUrl,
    };
    if (button) {
      button.disabled = true;
      button.textContent = "Salvando...";
    }
    try {
      const result = await requisitarEstoque("/api/produtos", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      products.push(normalizarProdutoEstoque({
        ...payload,
        id: result.resultado,
      }));
      renderProducts();
      fecharModal();
      imagemSelecionada = "";
      mostrarAvisoEstoque(`${nome} foi adicionado ao estoque.`);
    } catch (error) {
      mostrarErroModal(
        "erro-form-insumo",
        error.message || "Não foi possível salvar o produto.",
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Salvar Insumo";
      }
    }
  });

  inputImagemArquivo?.addEventListener("change", async () => {
    const arquivo = inputImagemArquivo.files?.[0];
    if (!arquivo) {
      imagemSelecionada = "";
      return;
    }
    imagemSelecionada = "";
    if (inputImagemUrl) inputImagemUrl.value = "";
    atualizarArquivoImagem();
    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      mostrarErroModal("erro-form-insumo", "Selecione uma imagem JPG, PNG ou WEBP.");
      inputImagemArquivo.value = "";
      atualizarArquivoImagem();
      return;
    }
    if (arquivo.size > 10 * 1024 * 1024) {
      mostrarErroModal("erro-form-insumo", "A imagem deve ter no máximo 10 MB.");
      inputImagemArquivo.value = "";
      atualizarArquivoImagem();
      return;
    }
    try {
      const enderecoTemporario = URL.createObjectURL(arquivo);
      try {
        const imagem = new Image();
        await new Promise((resolve, reject) => {
          imagem.onload = resolve;
          imagem.onerror = () => reject(new Error("Não foi possível abrir o arquivo de imagem."));
          imagem.src = enderecoTemporario;
        });
        const escala = Math.min(1, 800 / Math.max(imagem.naturalWidth, imagem.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(imagem.naturalWidth * escala));
        canvas.height = Math.max(1, Math.round(imagem.naturalHeight * escala));
        const contexto = canvas.getContext("2d");
        if (!contexto) throw new Error("Não foi possível processar a imagem.");
        contexto.fillStyle = "#ffffff";
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
        imagemSelecionada = canvas.toDataURL("image/jpeg", 0.78);
        if (imagemSelecionada.length > 1_500_000) {
          imagemSelecionada = "";
          throw new Error("A imagem comprimida continua muito grande. Escolha um arquivo menor.");
        }
      } finally {
        URL.revokeObjectURL(enderecoTemporario);
      }
      document.getElementById("input-imagem").value = "";
      atualizarArquivoImagem();
      limparErroModal("erro-form-insumo");
    } catch (error) {
      mostrarErroModal("erro-form-insumo", error.message || "Não foi possível processar a imagem.");
      inputImagemArquivo.value = "";
      atualizarArquivoImagem();
    }
  });
  inputImagemArquivo?.addEventListener("change", atualizarArquivoImagem);
  inputImagemUrl?.addEventListener("input", () => {
    if (inputImagemUrl.value.trim()) {
      imagemSelecionada = "";
      if (inputImagemArquivo) inputImagemArquivo.value = "";
    }
    atualizarArquivoImagem();
  });
  botaoRemoverImagem?.addEventListener("click", () => {
    imagemSelecionada = "";
    inputImagemUrl.value = "";
    if (inputImagemArquivo) inputImagemArquivo.value = "";
    atualizarArquivoImagem();
    limparErroModal("erro-form-insumo");
  });
  campoMaximoCadastro?.addEventListener("input", atualizarIndicadorCadastro);
  campoQuantidadeCadastro?.addEventListener("input", atualizarIndicadorCadastro);
  campoMaximoAtualizacao?.addEventListener("input", atualizarIndicadorAtualizacao);
  atualizarIndicadorCadastro();
  atualizarArquivoImagem();

  botaoCancelarExclusao?.addEventListener("click", fecharModalExclusao);
  modalExcluir?.addEventListener("click", (event) => {
    if (event.target === modalExcluir) fecharModalExclusao();
  });
  botaoConfirmarExclusao?.addEventListener("click", async () => {
    if (!productToDelete) return;
    const product = productToDelete;
    botaoConfirmarExclusao.disabled = true;
    botaoConfirmarExclusao.textContent = "Excluindo...";
    try {
      await requisitarEstoque(`/api/produtos/${product.id}`, { method: "DELETE" });
      products = products.filter((item) => String(item.id) !== String(product.id));
      renderProducts();
      fecharModalExclusao();
      mostrarAvisoEstoque(`${product.nome} foi removido do estoque.`);
    } catch (error) {
      mostrarErroModal(
        "erro-exclusao",
        error.message || "Não foi possível remover o produto.",
      );
    } finally {
      botaoConfirmarExclusao.disabled = false;
      botaoConfirmarExclusao.textContent = "Sim, Excluir";
    }
  });

  await carregarProdutos();
  const produtoParaLocalizar = new URLSearchParams(window.location.search).get("localizar");
  if (produtoParaLocalizar) {
    const card = [...grid.querySelectorAll(".cartao-produto")]
      .find((item) => item.dataset.id === produtoParaLocalizar);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.style.outline = "3px solid #ef4444";
      card.style.outlineOffset = "3px";
      window.setTimeout(() => {
        card.style.outline = "";
        card.style.outlineOffset = "";
      }, 3000);
    } else {
      mostrarAvisoEstoque("O produto do alerta não foi encontrado no estoque.", "error");
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("localizar");
    window.history.replaceState({}, "", url);
  }
  const produtoInicial = new URLSearchParams(window.location.search).get("produto");
  if (produtoInicial) {
    const card = [...grid.querySelectorAll(".cartao-produto")]
      .find((item) => item.dataset.id === produtoInicial);
    if (card) abrirModalAtualizacao(card);
  }
}

window.inicializarEstoque = inicializarEstoque;
document.addEventListener("demo:page-loaded", (event) => {
  if (event.detail?.pagina === "estoque") void inicializarEstoque();
});
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void inicializarEstoque(), { once: true });
} else {
  void inicializarEstoque();
}
