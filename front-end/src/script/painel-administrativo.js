document.addEventListener("demo:page-loaded", () => {
    const historicoChamados = document.getElementById("historico-chamados-tbody");
    if (historicoChamados) void carregarHistoricoChamados(historicoChamados);

    const capacidadeValor = document.getElementById("estoque-capacidade-percentual");
    const capacidadeBarra = document.getElementById("estoque-capacidade-barra");
    const capacidadeDetalhe = document.getElementById("estoque-capacidade-detalhe");

    if (capacidadeValor && capacidadeBarra && capacidadeDetalhe) {
        const token = localStorage.getItem("docegestao_token");
        if (!token) {
            capacidadeValor.textContent = "Indisponível";
            capacidadeDetalhe.textContent = "Entre na sua conta para consultar o estoque.";
        } else {
            void fetch("/api/produtos", {
                headers: { Authorization: "Bearer " + token },
            })
                .then(async (response) => {
                    if (!response.headers.get("content-type")?.includes("application/json")) {
                        throw new Error("A API não retornou os dados de estoque.");
                    }
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.mensagem || "Não foi possível carregar os produtos.");
                    }
                    const produtos = result.dados || [];
                    const niveis = produtos
                        .map((produto) => {
                            const quantidade = Number(produto.quantidade);
                            const maximo = Number(produto.maximo);
                            return Number.isFinite(quantidade) && Number.isFinite(maximo) && maximo > 0
                                ? quantidade / maximo
                                : null;
                        })
                        .filter((nivel) => nivel !== null);
                    const percentual = niveis.length
                        ? (niveis.reduce((total, nivel) => total + nivel, 0) / niveis.length) * 100
                        : 0;
                    const percentualArredondado = Math.round(percentual * 10) / 10;
                    const percentualTexto = `${percentualArredondado.toLocaleString("pt-BR", {
                        maximumFractionDigits: 1,
                    })}%`;
                    capacidadeValor.textContent = percentualTexto;
                    capacidadeDetalhe.textContent = niveis.length
                        ? `Média do estoque atual em relação ao limite máximo de ${niveis.length} produto(s).`
                        : "Nenhum produto com limite máximo configurado.";
                    capacidadeBarra.style.width = `${Math.min(100, Math.max(0, percentual))}%`;
                    capacidadeBarra.classList.toggle("bg-rose-500", percentual >= 90);
                    capacidadeBarra.classList.toggle("bg-amber-500", percentual >= 70 && percentual < 90);
                    capacidadeBarra.classList.toggle("bg-emerald-500", percentual < 70);
                    capacidadeValor.classList.toggle("text-rose-600", percentual >= 90);
                    capacidadeValor.classList.toggle("text-amber-600", percentual >= 70 && percentual < 90);
                    capacidadeValor.classList.toggle("text-emerald-600", percentual < 70);
                    capacidadeBarra.parentElement.setAttribute(
                        "aria-valuenow",
                        String(Math.min(100, Math.max(0, percentualArredondado))),
                    );
                })
                .catch((error) => {
                    capacidadeValor.textContent = "Indisponível";
                    capacidadeDetalhe.textContent = error.message;
                    console.error("Não foi possível carregar os parâmetros de estoque:", error);
                });

        }
    }

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

    if (tabVisaoGeral && tabPainelAdmin && viewVisaoGeral && viewPainelAdmin) {
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
    }

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
    const chamadoErro = document.getElementById("chamado-erro");

    btnChamado?.addEventListener("click", () => {
        if (chamadoErro) {
            chamadoErro.textContent = "";
            chamadoErro.classList.add("hidden");
        }
        modalChamado.classList.remove("hidden");
    });

    const fecharModal = () => {
        modalChamado.classList.add("hidden");
        if (chamadoTexto) chamadoTexto.value = "";
        if (chamadoErro) {
            chamadoErro.textContent = "";
            chamadoErro.classList.add("hidden");
        }
    };

    closeModalChamado?.addEventListener("click", fecharModal);
    btnCancelarChamado?.addEventListener("click", fecharModal);

    btnEnviarChamado?.addEventListener("click", async () => {
        const descricao = chamadoTexto.value.trim();
        if (!descricao) {
            chamadoErro.textContent = "Descreva o chamado antes de enviar.";
            chamadoErro.classList.remove("hidden");
            return;
        }
        if (chamadoErro) {
            chamadoErro.textContent = "";
            chamadoErro.classList.add("hidden");
        }

        const token = localStorage.getItem("docegestao_token");
        if (!token) {
            chamadoErro.textContent = "Sua sessão expirou. Entre novamente para abrir um chamado.";
            chamadoErro.classList.remove("hidden");
            return;
        }

        btnEnviarChamado.disabled = true;
        btnEnviarChamado.textContent = "Enviando...";
        try {
            const response = await fetch("/api/chamados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ descricao }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.mensagem || "Não foi possível registrar o chamado.");
            }

            document.dispatchEvent(new Event("docegestao:chamados-atualizados"));
            fecharModal();
            showToast("Chamado salvo", "A solicitação foi registrada com sucesso.");
        } catch (error) {
            chamadoErro.textContent = error.message || "Não foi possível conectar ao servidor.";
            chamadoErro.classList.remove("hidden");
            console.error("Não foi possível registrar o chamado:", error);
        } finally {
            btnEnviarChamado.disabled = false;
            btnEnviarChamado.textContent = "Enviar Chamado";
        }
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
            document.querySelectorAll("#historico-chamados-tbody tr").forEach((row) => {
                row.style.display = row.innerText.toLowerCase().includes(query)
                    ? ""
                    : "none";
            });
        });
});

async function carregarHistoricoChamados(tbody) {
    const token = localStorage.getItem("docegestao_token");
    if (!token) {
        mostrarEstadoHistoricoChamados(tbody, "Entre na sua conta para consultar o histórico.");
        return;
    }

    try {
        const response = await fetch("/api/chamados/historico", {
            headers: { Authorization: "Bearer " + token },
        });
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            throw new Error("A API não retornou o histórico de chamadas.");
        }
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.mensagem || "Não foi possível carregar o histórico de chamadas.");
        }

        const registros = Array.isArray(result.dados) ? result.dados : [];
        if (registros.length === 0) {
            mostrarEstadoHistoricoChamados(tbody, "Ainda não há chamados ou movimentações de contas registrados.");
            return;
        }

        tbody.replaceChildren();
        registros.forEach((registro) => {
            const row = document.createElement("tr");
            const valores = [
                new Date(registro.data).toLocaleString("pt-BR"),
                registro.usuario || "Usuário não identificado",
                registro.acao || "Atividade registrada",
            ];
            valores.forEach((valor, index) => {
                const cell = document.createElement("td");
                cell.className = index === 1
                    ? "py-3.5 px-3 font-semibold text-gray-800"
                    : index === 2
                        ? "py-3.5 px-3 text-gray-600"
                        : "py-3.5 px-3 text-gray-400";
                cell.textContent = valor;
                row.appendChild(cell);
            });
            const statusCell = document.createElement("td");
            statusCell.className = "py-3.5 px-3 text-center";
            const badge = document.createElement("span");
            const status = registro.status || "REGISTRADO";
            const classes = status === "CONCLUÍDO"
                ? "bg-emerald-50 text-emerald-600"
                : status === "EM RESOLUÇÃO"
                    ? "bg-amber-50 text-amber-700"
                    : status === "CRIAÇÃO"
                        ? "bg-blue-50 text-blue-700"
                        : status === "REMOÇÃO"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-gray-100 text-gray-600";
            badge.className = `${classes} rounded-full px-2.5 py-1 text-[10px] font-bold`;
            badge.textContent = status;
            statusCell.appendChild(badge);
            row.appendChild(statusCell);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Não foi possível carregar o histórico de chamadas:", error);
        mostrarEstadoHistoricoChamados(
            tbody,
            error.message || "Não foi possível carregar o histórico de chamadas.",
        );
    }
}

function atualizarHistoricoChamadosEmTela() {
    const tbody = document.getElementById("historico-chamados-tbody");
    if (tbody) void carregarHistoricoChamados(tbody);
}

document.addEventListener("docegestao:chamados-atualizados", atualizarHistoricoChamadosEmTela);
document.addEventListener("docegestao:chamados-sincronizados", atualizarHistoricoChamadosEmTela);

function mostrarEstadoHistoricoChamados(tbody, message) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "py-6 px-3 text-center text-gray-400";
    cell.setAttribute("role", "status");
    cell.textContent = message;
    row.appendChild(cell);
    tbody.replaceChildren(row);
}