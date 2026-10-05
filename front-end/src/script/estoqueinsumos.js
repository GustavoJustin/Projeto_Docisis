document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".filtro-btn");
    const inputBusca = document.getElementById("input-busca");
    const cardAdicionar = document.getElementById("btn-card-adicionar");
    const gridProdutos = document.getElementById("grid-produtos");

    // Elementos do Modal de Insumo
    const modal = document.getElementById("modal-insumo");
    const formInsumo = document.getElementById("form-novo-insumo");
    const btnNovoSidebar = document.getElementById("btn-novo-sidebar");
    const btnNovoFooter = document.getElementById("btn-novo-footer");
    const btnFecharModal = document.getElementById("btn-fechar-modal");
    const btnCancelar = document.getElementById("btn-cancelar");

    // Elementos do Modal de Exclusão Customizado
    const modalExcluir = document.getElementById("modal-excluir");
    const textoConfirmaExclusao = document.getElementById(
        "texto-confirma-exclusao",
    );
    const btnCancelarExclusao = document.getElementById(
        "btn-cancelar-exclusao",
    );
    const btnConfirmarExclusao = document.getElementById(
        "btn-confirmar-exclusao",
    );
    let cardParaExcluir = null;

    let categoriaAtiva = 'Tudo';

    // ==================== FILTROS E BUSCA ====================
    function aplicarFiltros() {
        const produtos = document.querySelectorAll(".cartao-produto");
        const termoBusca = inputBusca
            ? inputBusca.value.toLowerCase().trim()
            : "";

        produtos.forEach((produto) => {
            const categoria = produto.getAttribute("data-categoria");
            const nome = produto.getAttribute("data-nome") || "";

            const combinaCategoria =
                categoriaAtiva === "Tudo" || categoria === categoriaAtiva;
            const combinaBusca = nome.includes(termoBusca);

            if (combinaCategoria && combinaBusca) {
                produto.style.display = "flex";
            } else {
                produto.style.display = "none";
            }
        });

        if (cardAdicionar) {
            if (categoriaAtiva === "Tudo" && !termoBusca) {
                cardAdicionar.style.display = "flex";
            } else {
                cardAdicionar.style.display = "none";
            }
        }
    }

    botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoes.forEach((b) => {
                b.classList.remove(
                    "bg-brand-brown",
                    "text-white",
                    "font-semibold",
                );
                b.classList.add(
                    "bg-pink-100/60",
                    "text-brand-text-dark",
                    "font-medium",
                );
            });

            botao.classList.remove(
                "bg-pink-100/60",
                "text-brand-text-dark",
                "font-medium",
            );
            botao.classList.add(
                "bg-brand-brown",
                "text-white",
                "font-semibold",
            );

            categoriaAtiva = botao.getAttribute("data-categoria");
            aplicarFiltros();
        });
    });

    if (inputBusca) {
        inputBusca.addEventListener("input", aplicarFiltros);
    }

    // ==================== LÓGICA DE EXCLUSÃO CUSTOMIZADA ====================
    function abrirModalExclusao(card) {
        cardParaExcluir = card;
        const nomeProduto = card.querySelector("h3")
            ? card.querySelector("h3").innerText
            : "este insumo";
        textoConfirmaExclusao.textContent = `Deseja realmente excluir "${nomeProduto}" do estoque? Esta ação não poderá ser desfeita.`;
        modalExcluir.classList.remove("hidden");
    }

    function fecharModalExclusao() {
        modalExcluir.classList.add("hidden");
        cardParaExcluir = null;
    }

    btnCancelarExclusao.addEventListener("click", fecharModalExclusao);
    btnConfirmarExclusao.addEventListener("click", () => {
        if (cardParaExcluir) {
            cardParaExcluir.remove();
            aplicarFiltros();
        }
        fecharModalExclusao();
    });

    modalExcluir.addEventListener("click", (e) => {
        if (e.target === modalExcluir) fecharModalExclusao();
    });

    // ==================== EVENTOS DOS CARDS (BOTOES + - E EXCLUIR) ====================
    function vincularEventosCard(card) {
        // Botão de Excluir
        const btnExcluir = card.querySelector('.btn-excluir');
        if (btnExcluir) {
            btnExcluir.addEventListener('click', (e) => {
                e.stopPropagation();
                abrirModalExclusao(card);
            });
        }

        // Botões de Quantidade + e -
        const btnMenos = card.querySelector(".btn-menos");
        const btnMais = card.querySelector(".btn-mais");
        const displayQtd = card.querySelector(".qtd-valor");
        const unidade = card.getAttribute("data-unidade") || "un";

        if (btnMenos && btnMais && displayQtd) {
            btnMenos.addEventListener("click", (e) => {
                e.stopPropagation();
                let valor = parseFloat(displayQtd.innerText);
                if (valor > 0) {
                    valor = Math.max(0, valor - 1);
                    const ehVermelho =
                        displayQtd.classList.contains("text-rose-500");
                    const corUnidade = ehVermelho
                        ? "text-rose-400"
                        : "text-brand-text-muted";
                    displayQtd.innerHTML = `${valor} <span class="text-xs font-normal ${corUnidade}">${unidade}</span>`;
                }
            });

            btnMais.addEventListener("click", (e) => {
                e.stopPropagation();
                let valor = parseFloat(displayQtd.innerText);
                valor += 1;
                const ehVermelho = displayQtd.classList.contains("text-rose-500");
                const corUnidade = ehVermelho
                    ? "text-rose-400"
                    : "text-brand-text-muted";
                displayQtd.innerHTML = `${valor} <span class="text-xs font-normal ${corUnidade}">${unidade}</span>`;
            });
        }
    }

    // Inicializar nos cards já existentes na página
    document
        .querySelectorAll(".cartao-produto")
        .forEach(vincularEventosCard);

    // ==================== LÓGICA DO MODAL DE CADASTRO ====================
    function abrirModal() {
        modal.classList.remove("hidden");
    }

    function fecharModal() {
        modal.classList.add("hidden");
        formInsumo.reset();
    }

    if (cardAdicionar) cardAdicionar.addEventListener("click", abrirModal);
    if (btnNovoSidebar)
        btnNovoSidebar.addEventListener("click", abrirModal);
    if (btnNovoFooter) btnNovoFooter.addEventListener("click", abrirModal);
    if (btnFecharModal)
        btnFecharModal.addEventListener("click", fecharModal);
    if (btnCancelar) btnCancelar.addEventListener("click", fecharModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) fecharModal();
    });

    // Submissão do Formulario para Adicionar Insumo
    formInsumo.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = document.getElementById("input-nome").value.trim();
        const categoria = document.getElementById("input-categoria").value;
        const preco =
            document.getElementById("input-preco").value.trim() || "R$ 0,00";
        const qtdAtual =
            parseInt(document.getElementById("input-qtd-atual").value) || 0;
        const qtdMax =
            parseInt(document.getElementById("input-qtd-max").value) || 1;
        const unidade = document.getElementById("input-unidade").value;
        let imagem = document.getElementById("input-imagem").value.trim();

        if (!imagem) {
            imagem = "https://cdn-icons-png.flaticon.com/512/3081/3081986.png";
        }

        const porcentagem = Math.min(
            100,
            Math.round((qtdAtual / qtdMax) * 100),
        );
        const estoqueBaixo = porcentagem <= 25;
        const corBarra = estoqueBaixo ? "bg-rose-500" : "bg-brand-brown";
        const corTextoQtd = estoqueBaixo
            ? "text-rose-500"
            : "text-brand-text-dark";
        const corTextoUnidade = estoqueBaixo
            ? "text-rose-400"
            : "text-brand-text-muted";

        const novoCard = document.createElement('div');
        novoCard.className = 'cartao-produto border border-black/10 rounded-2xl p-3 flex flex-col justify-between bg-white shadow-sm';
        novoCard.setAttribute('data-categoria', categoria);
        novoCard.setAttribute('data-nome', nome.toLowerCase());
        novoCard.setAttribute('data-unidade', unidade);

        novoCard.innerHTML = `
          <div>
            <div class="relative h-36 rounded-xl overflow-hidden mb-3 bg-gray-50 flex items-center justify-center">
              <button type="button" class="btn-excluir absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer" title="Excluir insumo">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
              <img src="${imagem}" alt="${nome}" class="w-full h-full object-contain p-2" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3081/3081986.png'">
            </div>
            
            <div class="px-1 space-y-2">
              <div class="flex items-baseline justify-between">
                <h3 class="font-bold text-xs text-brand-text-dark">${nome}</h3>
                <span class="text-xs font-bold text-brand-brown">${preco}</span>
              </div>
              <p class="text-[10px] text-brand-text-muted">Categoria: ${categoria}</p>

              <div class="pt-2">
                <div class="flex justify-between text-[9px] text-brand-text-muted mb-1">
                  <span>Nível de Estoque</span>
                  <span>${qtdAtual}/${qtdMax} ${unidade}</span>
                </div>
                <div class="w-full bg-black/5 rounded-full h-1">
                  <div class="${corBarra} h-full rounded-full" style="width: ${porcentagem}%"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-4 px-1">
            <span class="qtd-valor text-base font-bold ${corTextoQtd}">${qtdAtual} <span class="text-xs font-normal ${corTextoUnidade}">${unidade}</span></span>
            <div class="flex items-center gap-2 border border-black/10 rounded-lg px-2 py-0.5">
              <button type="button" class="btn-menos text-xs font-bold text-brand-text-muted hover:text-brand-text-dark cursor-pointer">-</button>
              <button type="button" class="btn-mais text-xs font-bold text-brand-text-muted hover:text-brand-text-dark cursor-pointer">+</button>
            </div>
          </div>
        `;

        gridProdutos.insertBefore(novoCard, cardAdicionar);
        vincularEventosCard(novoCard);
        fecharModal();
        aplicarFiltros();
    });
});
