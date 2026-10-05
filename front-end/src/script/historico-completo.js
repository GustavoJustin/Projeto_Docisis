lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
    const rows = [...document.querySelectorAll("#tabela-movimentacoes tr")];
    const searchInput = document.getElementById("busca-historico");
    const startInput = document.getElementById("data-inicio");
    const endInput = document.getElementById("data-fim");
    const typeSelect = document.getElementById("filtro-tipo");
    const summary = document.getElementById("resumo-paginacao");
    const pageButtons = [
        ...document.querySelectorAll("#paginacao-historico [data-page]"),
    ];
    const pageSize = 2;
    let currentPage = 1;
    let filteredRows = rows;

    function rowDate(row) {
        const [day, month, year] = row.cells[0].textContent
            .trim()
            .split(/\s+/)[0]
            .split("/");
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    function renderRows() {
        const query = searchInput.value.trim().toLowerCase();
        const selectedType = typeSelect.value.toLowerCase();
        const startDate = startInput.value
            ? new Date(`${startInput.value}T00:00:00`)
            : null;
        const endDate = endInput.value
            ? new Date(`${endInput.value}T23:59:59`)
            : null;

        filteredRows = rows.filter((row) => {
            const date = rowDate(row);
            const type = row.dataset.tipo.toLowerCase();
            return (
                row.textContent.toLowerCase().includes(query) &&
                (selectedType === "todos" || type === selectedType) &&
                (!startDate || date >= startDate) &&
                (!endDate || date <= endDate)
            );
        });

        const pageCount = Math.max(
            1,
            Math.ceil(filteredRows.length / pageSize),
        );
        currentPage = Math.min(currentPage, pageCount);
        const firstIndex = (currentPage - 1) * pageSize;
        const visibleRows = new Set(
            filteredRows.slice(firstIndex, firstIndex + pageSize),
        );

        rows.forEach((row) => {
            row.style.display = visibleRows.has(row) ? "" : "none";
        });

        const firstRecord = filteredRows.length ? firstIndex + 1 : 0;
        const lastRecord = Math.min(
            firstIndex + pageSize,
            filteredRows.length,
        );
        summary.textContent = `Mostrando ${firstRecord}-${lastRecord} de ${filteredRows.length} registros`;

        pageButtons.forEach((button) => {
            const page = Number(button.dataset.page);
            const selected = Number.isInteger(page) && page === currentPage;
            button.classList.toggle("bg-amber-900", selected);
            button.classList.toggle("text-white", selected);
            button.classList.toggle(
                "text-stone-500",
                !selected && Number.isInteger(page),
            );
            button.disabled =
                (button.dataset.page === "prev" && currentPage === 1) ||
                (button.dataset.page === "next" && currentPage === pageCount) ||
                (Number.isInteger(page) && page > pageCount);
        });
    }

    document
        .getElementById("btn-aplicar-filtros")
        .addEventListener("click", () => {
            currentPage = 1;
            renderRows();
        });
    searchInput.addEventListener("input", () => {
        currentPage = 1;
        renderRows();
    });
    document
        .getElementById("btn-exportar-pdf")
        .addEventListener("click", () => window.print());
    pageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.dataset.page;
            if (page === "prev") currentPage -= 1;
            else if (page === "next") currentPage += 1;
            else currentPage = Number(page);
            renderRows();
        });
    });

    renderRows();
});
