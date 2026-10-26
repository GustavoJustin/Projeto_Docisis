// Inicialização dos ícones Lucide
if (window.lucide) {
    lucide.createIcons();
}

// VARIÁVEIS DE ESTADO
const state = {
    nome: "Ana Maria",
    email: "usuario@confeitaria.com",
    fotoUrl:
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
};

// SISTEMA DE TOAST NOTIFICATIONS
function mostrarToast(mensagem, tipo = "sucesso") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");

    const isSuccess = tipo === "sucesso";
    const bgColor = isSuccess ? "bg-[#684627]" : "bg-red-600";
    const icon = isSuccess ? "check-circle" : "alert-circle";

    toast.className = `pointer-events-auto flex items-center gap-2.5 ${bgColor} text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold modal-enter transition-all`;
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-4 h-4 text-[#F0B8CB]"></i>
        <span>${mensagem}</span>
      `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// MANIPULAÇÃO DO DROPDOWN
document.addEventListener("DOMContentLoaded", () => {
    const btnPerfil = document.getElementById("btn-perfil");
    const dropdownPerfil = document.getElementById("dropdown-perfil");

    const menuOptPerfil = document.getElementById("menu-opt-perfil");
    const menuOptConfig = document.getElementById("menu-opt-configuracoes");
    const menuOptSair = document.getElementById("menu-opt-sair");

    // Toggle Dropdown
    if (btnPerfil && dropdownPerfil) {
        btnPerfil.addEventListener("click", (e) => {
            e.stopPropagation();
            const isHidden = dropdownPerfil.classList.contains("hidden");
            dropdownPerfil.classList.toggle("hidden");
            btnPerfil.setAttribute("aria-expanded", !isHidden);
        });

        // Clique fora fecha o dropdown
        document.addEventListener("click", (e) => {
            if (
                !dropdownPerfil.contains(e.target) &&
                !btnPerfil.contains(e.target)
            ) {
                dropdownPerfil.classList.add("hidden");
                btnPerfil.setAttribute("aria-expanded", "false");
            }
        });
    }

    // VINCULAÇÃO DE AÇÕES DO MENU DROPDOWN
    if (menuOptPerfil) {
        menuOptPerfil.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownPerfil.classList.add("hidden");
            abrirModalPerfil();
        });
    }

    if (menuOptConfig) {
        menuOptConfig.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownPerfil.classList.add("hidden");
            abrirModalConfiguracoes();
        });
    }

    if (menuOptSair) {
        menuOptSair.addEventListener("click", (e) => {
            e.preventDefault();
            dropdownPerfil.classList.add("hidden");
            abrirModalLogout();
        });
    }

    // SUBMIT DO FORMULÁRIO DE PERFIL
    const formPerfil = document.getElementById("form-perfil");
    if (formPerfil) {
        formPerfil.addEventListener("submit", (e) => {
            e.preventDefault();

            const novoNome = document
                .getElementById("perfil-nome")
                .value.trim();
            const novoEmail = document
                .getElementById("perfil-email")
                .value.trim();

            if (novoNome) state.nome = novoNome;
            if (novoEmail) state.email = novoEmail;

            // Atualizar elementos na tela
            document.getElementById("dropdown-nome-usuario").textContent =
                state.nome;
            document.getElementById("dropdown-email-usuario").textContent =
                state.email;

            fecharModalPerfil();
            mostrarToast("Perfil atualizado com sucesso!");
        });
    }

    // EXPORTAÇÃO PDF
    const btnPdf = document.getElementById("btn-export-pdf");
    if (btnPdf) {
        btnPdf.addEventListener("click", () => {
            const conteudo = document.getElementById("relatorio-conteudo");
            mostrarToast("Gerando relatório em PDF...");
            const opcoes = {
                margin: 0.3,
                filename: "relatorio-confeitaria-doce-arte.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            };
            html2pdf()
                .set(opcoes)
                .from(conteudo)
                .save()
                .then(() => {
                    mostrarToast("PDF baixado com sucesso!");
                });
        });
    }

    // EXPORTAÇÃO EXCEL
    const btnExcel = document.getElementById("btn-export-excel");
    if (btnExcel) {
        btnExcel.addEventListener("click", () => {
            const tabela = document.getElementById("tabela-produtos");
            const wb = XLSX.utils.table_to_book(tabela, {
                sheet: "Produtos Mais Utilizados",
            });
            XLSX.writeFile(wb, "relatorio-produtos-confeitaria.xlsx");
            mostrarToast("Planilha Excel exportada!");
        });
    }
});

// FUNÇÕES DOS MODAIS
function abrirModalPerfil() {
    document.getElementById("modal-perfil").classList.remove("hidden");
}

function fecharModalPerfil() {
    document.getElementById("modal-perfil").classList.add("hidden");
}

function abrirModalConfiguracoes(e) {
    if (e) e.preventDefault();
    document
        .getElementById("modal-configuracoes")
        .classList.remove("hidden");
}

function fecharModalConfiguracoes() {
    document.getElementById("modal-configuracoes").classList.add("hidden");
}

function abrirModalLogout() {
    document.getElementById("modal-logout").classList.remove("hidden");
}

function fecharModalLogout() {
    document.getElementById("modal-logout").classList.add("hidden");
}

function confirmarLogout() {
    fecharModalLogout();
    localStorage.removeItem("docegestao_token");
    localStorage.removeItem("docegestao_funcionario");
    window.location.href = "index.html";
}

// ALTERAÇÃO DE ABAS NAS CONFIGURAÇÕES
function mudarAbaConfig(aba) {
    const btnGeral = document.getElementById("tab-btn-geral");
    const btnSeguranca = document.getElementById("tab-btn-seguranca");
    const contentGeral = document.getElementById("tab-content-geral");
    const contentSeguranca = document.getElementById(
        "tab-content-seguranca",
    );

    if (aba === "geral") {
        btnGeral.className =
            "px-3 py-2 border-b-2 border-[#684627] text-[#684627] font-semibold transition";
        btnSeguranca.className =
            "px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold transition";
        contentGeral.classList.remove("hidden");
        contentSeguranca.classList.add("hidden");
    } else {
        btnSeguranca.className =
            "px-3 py-2 border-b-2 border-[#684627] text-[#684627] font-semibold transition";
        btnGeral.className =
            "px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold transition";
        contentSeguranca.classList.remove("hidden");
        contentGeral.classList.add("hidden");
    }
}

function salvarConfiguracoes(e) {
    e.preventDefault();
    fecharModalConfiguracoes();
    mostrarToast("Configurações salvas com sucesso!");
}

// PREVIEW DE FOTO DE PERFIL
function previewNovaFoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            const novaUrl = evt.target.result;
            document.getElementById("modal-avatar-preview").src = novaUrl;
            document.getElementById("avatar-header").src = novaUrl;
            mostrarToast("Foto de perfil atualizada!");
        };
        reader.readAsDataURL(file);
    }
}

// FECHAR MODAIS COM A TECLA ESC
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        fecharModalPerfil();
        fecharModalConfiguracoes();
        fecharModalLogout();
    }
});


// O estoque desta versão persiste no navegador; o relatório usa as mesmas chaves.
(() => {
    const STOCK_KEY = "docegestao_estoque_v1";
    const MOVEMENT_KEY = "docegestao_movimentos_v1";
    const palette = ["#684627", "#CD9A67", "#7A5877", "#F0B8CB", "#9B7653", "#A8A29E", "#B45309"];
    const amount = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
    const fmt = (value) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(amount(value));
    const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));

    function readStorage(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
        catch { return fallback; }
    }
    function parseDate(value) {
        if (!value) return null;
        const text = String(value);
        const parsed = new Date(text.includes("T") ? text : text.replace(" ", "T"));
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    function expiryDate(value) {
        if (!value) return null;
        const parsed = new Date(`${String(value).slice(0, 10)}T00:00:00`);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    function setStatus(message, kind = "ok") {
        const node = document.getElementById("status-relatorio");
        if (!node) return;
        node.textContent = message;
        node.className = "mb-3 rounded-xl border px-4 py-2 text-xs" + (kind === "aviso"
            ? " border-amber-100 bg-amber-50 text-amber-900"
            : " border-emerald-100 bg-emerald-50 text-emerald-900");
    }
    function renderCategories(products) {
        const list = document.getElementById("lista-categorias");
        const donut = document.getElementById("grafico-categorias");
        const center = document.getElementById("categorias-total");
        const groups = new Map();
        products.forEach((p) => {
            const name = String(p.categoria || "Sem categoria").trim() || "Sem categoria";
            groups.set(name, (groups.get(name) || 0) + 1);
        });
        const sorted = [...groups.entries()].sort((a, b) => b[1] - a[1]);
        const total = sorted.reduce((sum, [, n]) => sum + n, 0);
        if (center) center.textContent = String(sorted.length);
        if (!total) {
            donut.style.background = "conic-gradient(#e7e5e4 0% 100%)";
            list.innerHTML = '<p class="p-1.5 text-xs text-gray-400">Nenhum insumo salvo no estoque.</p>';
            return;
        }
        let cursor = 0;
        const segments = sorted.map(([, n], i) => {
            const start = cursor;
            cursor += n / total * 100;
            return `${palette[i % palette.length]} ${start}% ${cursor}%`;
        });
        donut.style.background = `conic-gradient(${segments.join(",")})`;
        list.innerHTML = sorted.map(([name, n], i) => {
            const percent = Math.round(n / total * 100);
            return `<div class="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#F6F2EC] transition"><span class="flex min-w-0 items-center gap-2"><span class="inline-block h-3 w-3 shrink-0 rounded-full" style="background:${palette[i % palette.length]}"></span><span class="truncate">${esc(name)}</span></span><span class="font-bold text-gray-800">${percent}% <span class="font-normal text-gray-400">(${n})</span></span></div>`;
        }).join("");
    }
    function renderFlow(movements) {
        const container = document.getElementById("grafico-fluxo-mensal");
        const now = new Date();
        const months = [];
        for (let offset = 5; offset >= 0; offset -= 1) {
            const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
            months.push({ year: date.getFullYear(), month: date.getMonth(), label: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(), entrada: 0, consumo: 0 });
        }
        const index = new Map(months.map((m) => [`${m.year}-${m.month}`, m]));
        movements.forEach((move) => {
            const date = parseDate(move.at || move.data_hora);
            if (!date) return;
            const bucket = index.get(`${date.getFullYear()}-${date.getMonth()}`);
            if (!bucket) return;
            if (move.type === "consumo" || move.tipo === "consumo") bucket.consumo += 1;
            else bucket.entrada += 1;
        });
        const max = Math.max(1, ...months.map((m) => Math.max(m.entrada, m.consumo)));
        container.innerHTML = months.map((m) => {
            const entryHeight = m.entrada ? Math.max(4, m.entrada / max * 100) : 0;
            const consumptionHeight = m.consumo ? Math.max(4, m.consumo / max * 100) : 0;
            return `<div class="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><div class="flex h-full w-full items-end justify-center gap-1.5"><div class="w-1/2 rounded-t-sm bg-[#684627] transition-all hover:opacity-80" style="height:${entryHeight}%" title="Reposições ${m.label}: ${m.entrada} registros"></div><div class="w-1/2 rounded-t-sm bg-[#F0B8CB] transition-all hover:opacity-80" style="height:${consumptionHeight}%" title="Consumo ${m.label}: ${m.consumo} registros"></div></div><span class="text-[10px] font-semibold uppercase text-gray-400">${m.label}</span></div>`;
        }).join("");
    }
    function renderUsage(products, movements) {
        const body = document.getElementById("tabela-produtos-body");
        const now = new Date();
        const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const usageThis = new Map(), usagePrevious = new Map();
        movements.forEach((move) => {
            if (!(move.type === "consumo" || move.tipo === "consumo")) return;
            const date = parseDate(move.at || move.data_hora);
            if (!date) return;
            const id = String(move.productId ?? move.id ?? "");
            const qty = amount(move.quantity ?? move.quantidade);
            if (date >= currentStart && date <= now) usageThis.set(id, (usageThis.get(id) || 0) + qty);
            else if (date >= previousStart && date < currentStart) usagePrevious.set(id, (usagePrevious.get(id) || 0) + qty);
        });
        const ranked = [...usageThis.entries()].map(([id, used]) => ({ id, used, product: products.find((p) => String(p.id) === id) })).filter((x) => x.product).sort((a, b) => b.used - a.used).slice(0, 10);
        if (!ranked.length) {
            body.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-sm text-gray-400">Nenhum consumo registrado neste mês. As reduções de quantidade na página de estoque aparecerão aqui.</td></tr>';
            return;
        }
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        body.innerHTML = ranked.map(({ id, used, product }) => {
            const qty = amount(product.quantidade);
            const exp = expiryDate(product.validade);
            const days = exp ? Math.ceil((exp - today) / 86400000) : null;
            let status = "COM SALDO", cls = "bg-emerald-100 text-emerald-700";
            if (qty <= 0) { status = "SEM ESTOQUE"; cls = "bg-red-100 text-red-700"; }
            else if (days !== null && days < 0) { status = "VENCIDO"; cls = "bg-red-100 text-red-700"; }
            else if (days !== null && days <= 7) { status = "VENCE EM BREVE"; cls = "bg-amber-100 text-amber-800"; }
            const previous = usagePrevious.get(id) || 0;
            const trend = used > previous ? ["↗", "text-emerald-600"] : used < previous ? ["↘", "text-red-500"] : ["→", "text-gray-400"];
            const subline = [product.chegada ? `Chegada ${product.chegada.split("-").reverse().join("/")}` : "", product.validade ? `Validade ${product.validade.split("-").reverse().join("/")}` : ""].filter(Boolean).join(" · ");
            return `<tr class="transition hover:bg-gray-50/50"><td class="px-6 py-4"><div class="font-semibold text-gray-900">${esc(product.nome || "Insumo")}</div><div class="mt-1 text-[10px] text-gray-400">${esc(subline || product.categoria || "Estoque")}</div></td><td class="px-6 py-4 font-medium text-gray-500">${esc(product.categoria || "Sem categoria")}</td><td class="px-6 py-4 font-medium">${fmt(used)} ${esc(product.unidade || "un")}</td><td class="px-6 py-4 font-medium">${fmt(qty)} ${esc(product.unidade || "un")}</td><td class="px-6 py-4"><span class="rounded-full px-3 py-1 text-[10px] font-bold tracking-wide ${cls}">${status}</span></td><td class="px-6 py-4 text-center text-base font-bold ${trend[1]}" title="Comparação com o mês anterior">${trend[0]}</td></tr>`;
        }).join("");
    }
    function render() {
        const stored = readStorage(STOCK_KEY, {});
        const products = Object.values(stored).filter((p) => p && typeof p === "object" && p.id);
        const savedMovements = readStorage(MOVEMENT_KEY, []);
        const movements = Array.isArray(savedMovements) ? savedMovements : [];
        const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = String(value); };
        const withStock = products.filter((p) => amount(p.quantidade) > 0).length;
        const noStock = products.length - withStock;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const expiresSoon = products.filter((p) => {
            if (amount(p.quantidade) <= 0) return false;
            const exp = expiryDate(p.validade);
            if (!exp) return false;
            const days = Math.ceil((exp - today) / 86400000);
            return days >= 0 && days <= 7;
        }).length;
        const categories = new Set(products.map((p) => String(p.categoria || "Sem categoria").trim() || "Sem categoria"));
        set("metric-produtos-com-saldo", withStock);
        set("metric-total-produtos", products.length);
        set("metric-sem-estoque", noStock);
        set("metric-vencendo", expiresSoon);
        set("metric-produtos-com-saldo-nota", "Dados sincronizados com a página de estoque neste navegador");
        set("metric-categorias", `${categories.size} categoria(s) registradas`);
        renderCategories(products);
        renderFlow(movements);
        renderUsage(products, movements);
        setStatus(products.length
            ? `Relatório atualizado com ${products.length} insumo(s) e ${movements.length} movimentação(ões) salvos pela página de estoque neste navegador.`
            : "Ainda não há insumos salvos neste navegador. Abra/cadastre produtos na página de estoque primeiro.", products.length ? "ok" : "aviso");
    }
    function start() {
        render();
        window.addEventListener("storage", (event) => {
            if (!event.key || event.key === STOCK_KEY || event.key === MOVEMENT_KEY) render();
        });
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
})();
