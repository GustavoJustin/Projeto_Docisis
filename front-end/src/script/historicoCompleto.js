(() => {
  "use strict";

  function initHistorico() {
    const $ = (id) => document.getElementById(id);

    const tableBody = $("tabela-movimentacoes");
    const searchInput = $("busca-historico");
    const startInput = $("data-inicio");
    const endInput = $("data-fim");
    const typeSelect = $("filtro-tipo");
    const applyButton = $("btn-aplicar-filtros");
    const exportButton = $("btn-exportar-pdf");
    const summary = $("resumo-paginacao");

    // Cards de resumo
    const cardEntradas = $("card-entradas-total");
    const cardEntradasInfo = $("card-entradas-info");
    const cardSaidas = $("card-saidas-total");
    const cardSaidasInfo = $("card-saidas-info");
    const cardUsuario = $("card-usuario-nome");
    const cardUsuarioInfo = $("card-usuario-info");

    if (!tableBody) return;

    const rows = [...tableBody.querySelectorAll("tr")];
    let filteredRows = [...rows];

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
      return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
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
      const selectedType = normalized(typeSelect?.value || "todos");
      const startDate = startInput?.value ? new Date(`${startInput.value}T00:00:00`) : null;
      const endDate = endInput?.value ? new Date(`${endInput.value}T23:59:59`) : null;

      if (startDate && endDate && startDate > endDate) {
        endInput.setCustomValidity("A data final deve ser igual ou posterior à data inicial.");
        endInput.reportValidity();
        return;
      }
      endInput?.setCustomValidity("");

      filteredRows = rows.filter((row) => {
        const date = rowDate(row);
        const type = normalized(row.dataset.tipo || row.cells[2]?.textContent);
        const textMatches = normalized(row.textContent).includes(query);
        const typeMatches = selectedType === "todos" || type === selectedType;
        const dateMatches =
          (!startDate || (date && date >= startDate)) &&
          (!endDate || (date && date <= endDate));
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

    applyButton?.addEventListener("click", renderRows);
    searchInput?.addEventListener("input", renderRows);
    typeSelect?.addEventListener("change", renderRows);
    startInput?.addEventListener("change", renderRows);
    endInput?.addEventListener("change", renderRows);

    exportButton?.addEventListener("click", async () => {
      if (!filteredRows.length) {
        window.alert("Não há movimentações para exportar com os filtros atuais.");
        return;
      }
      exportButton.disabled = true;
      exportButton.setAttribute("aria-busy", "true");
      try {
        if (typeof window.html2pdf === "function") {
          const wrapper = document.createElement("div");
          wrapper.style.cssText =
            "padding:24px;background:#fff;color:#292524;font-family:Arial,sans-serif";
          wrapper.innerHTML = `<h1 style="font-size:20px;margin:0 0 6px">Histórico de Movimentações</h1><p style="font-size:12px;color:#78716c;margin:0 0 18px">${filteredRows.length} registro(s) • Gerado em ${new Date().toLocaleString("pt-BR")}</p>`;

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
          filteredRows.forEach((row) => {
            const tr = document.createElement("tr");
            [...row.cells].forEach((td, i) => {
              const cell = document.createElement("td");
              // Coluna Usuário: só o nome (sem as iniciais)
              cell.textContent =
                i === 1 ? rowUser(row) : td.textContent.trim().replace(/\s+/g, " ");
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
              filename: `historico-movimentacoes-${new Date().toISOString().slice(0, 10)}.pdf`,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
              pagebreak: { mode: ["avoid-all", "css", "legacy"] },
            })
            .from(wrapper)
            .save();
        } else {
          window.alert(
            "A biblioteca de PDF não carregou. Vamos abrir a impressão para você salvar como PDF."
          );
          window.print();
        }
      } catch (error) {
        console.error("Erro ao exportar histórico em PDF:", error);
        window.alert("Não foi possível gerar o PDF. Tente novamente ou use Imprimir > Salvar como PDF.");
      } finally {
        exportButton.disabled = false;
        exportButton.removeAttribute("aria-busy");
      }
    });

    renderRows();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initHistorico, { once: true });
  else initHistorico();
})();