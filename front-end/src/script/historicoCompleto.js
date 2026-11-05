(() => {
  "use strict";

  async function initHistorico() {
    const $ = (id) => document.getElementById(id);

    const tableBody = $("tabela-movimentacoes");
    const searchInput = $("busca-historico");
    const dateInput = $("data-modificacao");
    const typeSelect = $("filtro-tipo");
    const applyButton = $("btn-aplicar-filtros");
    const confirmFiltersButton = $("btn-confirmar-filtros");
    const cancelFiltersButton = $("btn-cancelar-filtros");
    const filtersModal = $("modal-filtros-historico");
    const exportButton = $("btn-exportar-pdf");
    const exportModal = $("modal-exportar-pdf");
    const exportDateInput = $("data-exportacao");
    const exportDateError = $("erro-data-exportacao");
    const confirmExportButton = $("btn-confirmar-exportacao");
    const cancelExportButton = $("btn-cancelar-exportacao");
    const refreshButton = $("btn-atualizar-historico");
    const summary = $("resumo-paginacao");

    // Cards de resumo
    const cardEntradas = $("card-entradas-total");
    const cardEntradasInfo = $("card-entradas-info");
    const cardSaidas = $("card-saidas-total");
    const cardSaidasInfo = $("card-saidas-info");
    const cardUsuario = $("card-usuario-nome");
    const cardUsuarioInfo = $("card-usuario-info");

    if (!tableBody) return;

    if (tableBody.dataset.inicializado === "true") return;
    tableBody.dataset.inicializado = "true";
    tableBody.replaceChildren();
    let rows = [];
    let filteredRows = [...rows];
    let activeTypeFilter = "todos";
    let activeDateFilter = "";

    const normalized = (value) =>
      String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();

    function rowDate(row) {
      const value = row.cells[0]?.textContent.trim().split(/\s+/)[0] || "";
      const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) return null;
      return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
    }

    function rowUser(row) {
      const spans = row.cells[1]?.querySelectorAll("span");
      return spans && spans.length
        ? spans[spans.length - 1].textContent.trim()
        : row.cells[1]?.textContent.trim() || "";
    }

    function updateCards() {
      const total = filteredRows.length;
      const entradas = filteredRows.filter((r) => normalized(r.dataset.tipo) === "entrada").length;
      const saidas = filteredRows.filter((r) => normalized(r.dataset.tipo) === "saida").length;
      const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

      if (cardEntradas) cardEntradas.textContent = entradas;
      if (cardEntradasInfo) cardEntradasInfo.textContent = `${pct(entradas)}% das movimentações`;
      if (cardSaidas) cardSaidas.textContent = saidas;
      if (cardSaidasInfo) cardSaidasInfo.textContent = `${pct(saidas)}% das movimentações`;

      // Usuário com mais ações no filtro atual
      const counts = {};
      filteredRows.forEach((r) => {
        const user = rowUser(r);
        if (user) counts[user] = (counts[user] || 0) + 1;
      });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (cardUsuario) cardUsuario.textContent = top ? top[0] : "—";
      if (cardUsuarioInfo) {
        cardUsuarioInfo.textContent = top
          ? `Responsável por ${pct(top[1])}% das ações`
          : "Sem ações no período";
      }
    }

    function renderRows() {
      const query = normalized(searchInput?.value);
      const selectedType = normalized(activeTypeFilter);
      const selectedDate = activeDateFilter;

      filteredRows = rows.filter((row) => {
        const date = rowDate(row);
        const type = normalized(row.dataset.tipo || row.cells[2]?.textContent);
        const textMatches = normalized(row.textContent).includes(query);
        const typeMatches = selectedType === "todos" || type === selectedType;
        const dateMatches = !selectedDate || date === selectedDate;
        return textMatches && typeMatches && dateMatches;
      });

      const visible = new Set(filteredRows);
      rows.forEach((row) => {
        row.hidden = !visible.has(row);
      });

      if (summary) {
        summary.textContent = filteredRows.length
          ? `Mostrando ${filteredRows.length} de ${rows.length} registros`
          : "Nenhum registro encontrado";
      }
      updateCards();
    }

    function criarLinhaMovimentacao(movimentacao) {
      const linha = document.createElement("tr");
      const tipo = String(movimentacao.tipo || "").toUpperCase();
      const entrada = tipo === "ENTRADA";
      linha.dataset.tipo = tipo;
      linha.className = "border-b border-stone-50";

      const data = movimentacao.data_hora ? new Date(movimentacao.data_hora) : new Date();
      const dataTexto = Number.isNaN(data.getTime())
        ? String(movimentacao.data_hora || "")
        : `${data.toLocaleDateString("pt-BR")} ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
      const usuario = String(movimentacao.usuario || "Sistema");
      const iniciais = usuario.split(/\s+/).slice(0, 2).map((parte) => parte[0] || "").join("").toUpperCase();
      const quantidade = Number(movimentacao.quantidade) || 0;
      const campos = [
        { texto: dataTexto, classe: "py-3 text-stone-600" },
        { texto: "", classe: "py-3" },
        { texto: tipo, classe: "py-3" },
        { texto: String(movimentacao.nome_produto || "Produto"), classe: "py-3 font-medium text-stone-800" },
        {
          texto: `${entrada ? "+" : "-"} ${quantidade} ${movimentacao.unidade || "un"}`,
          classe: `py-3 font-medium ${entrada ? "text-emerald-600" : "text-rose-600"}`,
        },
        { texto: String(movimentacao.descricao || "Ajuste de estoque"), classe: "py-3 text-stone-500" },
      ];

      campos.forEach((campo, indice) => {
        const celula = document.createElement("td");
        celula.className = campo.classe;
        if (indice === 1) {
          const usuarioContainer = document.createElement("div");
          usuarioContainer.className = "flex items-center gap-2";
          const avatar = document.createElement("span");
          avatar.className = "flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800";
          avatar.textContent = iniciais || "S";
          const nome = document.createElement("span");
          nome.className = "text-stone-600";
          nome.textContent = usuario;
          usuarioContainer.append(avatar, nome);
          celula.appendChild(usuarioContainer);
        } else if (indice === 2) {
          const etiqueta = document.createElement("span");
          etiqueta.className = `inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${entrada ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`;
          etiqueta.textContent = tipo;
          celula.appendChild(etiqueta);
        } else {
          celula.textContent = campo.texto;
        }
        linha.appendChild(celula);
      });
      return linha;
    }

    async function carregarMovimentacoes() {
      if (refreshButton) {
        refreshButton.disabled = true;
        refreshButton.textContent = "Atualizando...";
      }
      tableBody.replaceChildren();
      rows = [];
      filteredRows = [];
      try {
        const token = localStorage.getItem("docegestao_token");
        if (!token) throw new Error("Entre com sua conta para consultar o histórico de movimentações.");
        const response = await fetch("/api/produtos/movimentacoes", {
          headers: { Authorization: "Bearer " + token },
        });
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          await response.text();
          throw new Error(
            `A API do histórico não retornou JSON (HTTP ${response.status}). Confirme que o backend atualizado está em execução.`,
          );
        }
        const result = await response.json();
        if (!response.ok) throw new Error(result.mensagem || "Não foi possível carregar o histórico.");
        (result.dados || []).forEach((movimentacao) => {
          tableBody.appendChild(criarLinhaMovimentacao(movimentacao));
        });
        if (tableBody.children.length === 0) {
          const vazio = document.createElement("tr");
          const mensagem = document.createElement("td");
          mensagem.colSpan = 6;
          mensagem.className = "py-6 text-center text-sm text-stone-500";
          mensagem.textContent = "Nenhuma movimentação de estoque registrada.";
          vazio.appendChild(mensagem);
          tableBody.appendChild(vazio);
        }
        rows = [...tableBody.querySelectorAll("tr[data-tipo]")];
      } catch (error) {
        const linhaErro = document.createElement("tr");
        const mensagem = document.createElement("td");
        mensagem.colSpan = 6;
        mensagem.className = "py-6 text-center text-sm text-red-700";
        mensagem.setAttribute("role", "alert");
        mensagem.textContent = error.message || "Não foi possível carregar o histórico.";
        linhaErro.appendChild(mensagem);
        tableBody.appendChild(linhaErro);
        console.error("Não foi possível carregar o histórico de movimentações:", error);
      } finally {
        if (refreshButton) {
          refreshButton.disabled = false;
          refreshButton.textContent = "Atualizar histórico";
        }
        renderRows();
      }
    }

    const fecharModalFiltros = () => {
      filtersModal?.classList.add("hidden");
      filtersModal?.classList.remove("flex");
    };
    applyButton?.addEventListener("click", () => {
      if (typeSelect) typeSelect.value = activeTypeFilter;
      if (dateInput) dateInput.value = activeDateFilter;
      filtersModal?.classList.remove("hidden");
      filtersModal?.classList.add("flex");
    });
    confirmFiltersButton?.addEventListener("click", () => {
      activeTypeFilter = typeSelect?.value || "todos";
      activeDateFilter = dateInput?.value || "";
      renderRows();
      fecharModalFiltros();
    });
    cancelFiltersButton?.addEventListener("click", () => {
      if (typeSelect) typeSelect.value = activeTypeFilter;
      if (dateInput) dateInput.value = activeDateFilter;
      fecharModalFiltros();
    });
    filtersModal?.addEventListener("click", (event) => {
      if (event.target === filtersModal) fecharModalFiltros();
    });
    refreshButton?.addEventListener("click", () => void carregarMovimentacoes());
    searchInput?.addEventListener("input", renderRows);

    const fecharModalExportacao = () => {
      exportModal?.classList.add("hidden");
      exportModal?.classList.remove("flex");
    };
    exportButton?.addEventListener("click", () => {
      if (exportDateError) {
        exportDateError.textContent = "";
        exportDateError.classList.add("hidden");
      }
      if (exportDateInput && !exportDateInput.value) {
        const now = new Date();
        exportDateInput.value = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, "0"),
          String(now.getDate()).padStart(2, "0"),
        ].join("-");
      }
      exportModal?.classList.remove("hidden");
      exportModal?.classList.add("flex");
    });
    cancelExportButton?.addEventListener("click", fecharModalExportacao);
    exportModal?.addEventListener("click", (event) => {
      if (event.target === exportModal) fecharModalExportacao();
    });

    confirmExportButton?.addEventListener("click", async () => {
      if (exportDateError) {
        exportDateError.textContent = "";
        exportDateError.classList.add("hidden");
      }
      if (!exportDateInput?.value) {
        if (exportDateError) {
          exportDateError.textContent = "Selecione o dia das movimentações.";
          exportDateError.classList.remove("hidden");
        }
        return;
      }
      const selectedDate = exportDateInput.value;
      const recordsForDay = rows.filter((row) => rowDate(row) === selectedDate);
      if (!recordsForDay.length) {
        if (exportDateError) {
          exportDateError.textContent = "Não há movimentações registradas na data selecionada.";
          exportDateError.classList.remove("hidden");
        }
        return;
      }
      confirmExportButton.disabled = true;
      confirmExportButton.setAttribute("aria-busy", "true");
      try {
        if (typeof window.html2pdf !== "function") {
          throw new Error("A biblioteca de PDF não carregou. Atualize a página e tente novamente.");
        }
        const wrapper = document.createElement("div");
        wrapper.style.cssText =
          "padding:24px;background:#fff;color:#292524;font-family:Arial,sans-serif";
        const [year, month, day] = selectedDate.split("-");
        wrapper.innerHTML = `<h1 style="font-size:20px;margin:0 0 6px">Histórico de Movimentações</h1><p style="font-size:12px;color:#78716c;margin:0 0 18px">Movimentações de ${day}/${month}/${year} · ${recordsForDay.length} registro(s)</p>`;

        const table = document.createElement("table");
        table.style.cssText = "width:100%;border-collapse:collapse;font-size:11px";
        const thead = document.createElement("thead");
        const header = document.createElement("tr");
        [...tableBody.closest("table").querySelectorAll("thead th")].forEach((th) => {
          const cell = document.createElement("th");
          cell.textContent = th.textContent.trim();
          cell.style.cssText =
            "padding:8px;border-bottom:1px solid #d6d3d1;text-align:left;background:#fafaf9";
          header.appendChild(cell);
        });
        thead.appendChild(header);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        recordsForDay.forEach((row) => {
          const tr = document.createElement("tr");
          [...row.cells].forEach((td, index) => {
            const cell = document.createElement("td");
            cell.textContent =
              index === 1 ? rowUser(row) : td.textContent.trim().replace(/\s+/g, " ");
            cell.style.cssText =
              "padding:8px;border-bottom:1px solid #e7e5e4;vertical-align:top";
            tr.appendChild(cell);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrapper.appendChild(table);

        await window
          .html2pdf()
          .set({
            margin: 0.35,
            filename: `historico-movimentacoes-${selectedDate}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          })
          .from(wrapper)
          .save();
        fecharModalExportacao();
      } catch (error) {
        console.error("Erro ao exportar histórico em PDF:", error);
        window.alert(error.message || "Não foi possível gerar o PDF. Tente novamente.");
      } finally {
        confirmExportButton.disabled = false;
        confirmExportButton.removeAttribute("aria-busy");
      }
    });

    await carregarMovimentacoes();
  }

  window.inicializarHistorico = initHistorico;
  document.addEventListener("demo:page-loaded", (event) => {
    if (event.detail?.pagina === "historico") void initHistorico();
  });
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => void initHistorico(), { once: true });
  else void initHistorico();
})();