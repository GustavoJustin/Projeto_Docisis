document.addEventListener("DOMContentLoaded", () => {
    // --- Funcao Toast Personalizada (Visual Escuro com Ícone Verde idêntico à foto) ---
    function showToast(title, message) {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");

        toast.className =
            "bg-[#1E2530] text-white p-4 rounded-2xl shadow-2xl border border-gray-700/50 flex items-center gap-3 min-w-[300px] pointer-events-auto transition-all duration-300 transform translate-y-2";
        toast.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-xs font-bold text-white leading-tight">${title}</h4>
            <p class="text-[11px] text-gray-400 mt-0.5">${message}</p>
          </div>
          <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-white font-bold p-1">&times;</button>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    // --- 1. Troca Funcional de Abas (Visão Geral x Painel Admin) ---
    const tabVisaoGeral = document.getElementById("tab-visao-geral");
    const tabPainelAdmin = document.getElementById("tab-painel-admin");
    const viewVisaoGeral = document.getElementById("view-visao-geral");
    const viewPainelAdmin = document.getElementById("view-painel-admin");

    tabVisaoGeral.addEventListener("click", () => {
        viewVisaoGeral.classList.remove("hidden");
        viewPainelAdmin.classList.add("hidden");
        tabVisaoGeral.className =
            "text-[#875C46] font-bold border-b-2 border-[#875C46] h-full transition-all";
        tabPainelAdmin.className =
            "text-gray-400 font-medium hover:text-[#875C46] h-full border-b-2 border-transparent transition-all";
    });

    tabPainelAdmin.addEventListener("click", () => {
        viewPainelAdmin.classList.remove("hidden");
        viewVisaoGeral.classList.add("hidden");
        tabPainelAdmin.className =
            "text-[#875C46] font-bold border-b-2 border-[#875C46] h-full transition-all";
        tabVisaoGeral.className =
            "text-gray-400 font-medium hover:text-[#875C46] h-full border-b-2 border-transparent transition-all";
    });

    // --- 2. Correção do Botão BACKUP ---
    const btnBackup = document.getElementById("btn-backup");
    btnBackup?.addEventListener("click", () => {
        showToast(
            "Backup indisponível",
            "O servidor ainda não oferece uma operação de backup do banco de dados.",
        );
    });

    // --- 3. Correção do Botão EXPORTAR ---
    const btnExportar = document.getElementById("btn-exportar");
    btnExportar?.addEventListener("click", () => {
        const rows = [...document.querySelectorAll("#logs-tbody tr")];
        const csv = [
            ["Data/Hora", "Usuário", "Ação", "Status"],
            ...rows.map((row) =>
                [...row.cells].map((cell) => cell.innerText.trim()),
            ),
        ]
            .map((row) =>
                row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","),
            )
            .join("\r\n");
        const url = URL.createObjectURL(
            new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "logs-auditoria.csv";
        link.click();
        URL.revokeObjectURL(url);
        showToast(
            "Relatório Exportado",
            "O arquivo CSV dos registros exibidos foi baixado.",
        );
    });

    // --- 4. Correção do Botão ABRIR CHAMADO e Modal ---
    const btnChamado = document.getElementById("btn-chamado");
    const modalChamado = document.getElementById("modal-chamado");
    const closeModalChamado = document.getElementById(
        "close-modal-chamado",
    );
    const btnCancelarChamado = document.getElementById(
        "btn-cancelar-chamado",
    );
    const btnEnviarChamado = document.getElementById("btn-enviar-chamado");
    const chamadoTexto = document.getElementById("chamado-texto");

    btnChamado?.addEventListener("click", () => {
        modalChamado.classList.remove("hidden");
    });

    const fecharModal = () => {
        modalChamado.classList.add("hidden");
        if (chamadoTexto) chamadoTexto.value = "";
    };

    closeModalChamado?.addEventListener("click", fecharModal);
    btnCancelarChamado?.addEventListener("click", fecharModal);

    btnEnviarChamado?.addEventListener("click", () => {
        if (chamadoTexto.value.trim() === "") {
            alert("Por favor, descreva o seu chamado.");
            return;
        }
        const chamados = JSON.parse(
            localStorage.getItem("docegestao_chamados") || "[]",
        );
        chamados.push({
            descricao: chamadoTexto.value.trim(),
            criadoEm: new Date().toISOString(),
        });
        localStorage.setItem("docegestao_chamados", JSON.stringify(chamados));
        fecharModal();
        showToast(
            "Chamado salvo",
            "A solicitação foi salva neste navegador; o servidor não possui integração de chamados.",
        );
    });

    // --- 5. Botão Novo Item ---
    document
        .getElementById("btn-novo-item")
        ?.addEventListener("click", () => {
            showToast("Novo Cadastramento", "Formulário de inclusão aberto.");
        });

    // --- 6. Filtro de Busca da Tabela ---
    document
        .getElementById("search-input")
        ?.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll("#logs-tbody tr").forEach((row) => {
                row.style.display = row.innerText.toLowerCase().includes(query)
                    ? ""
                    : "none";
            });
        });
});