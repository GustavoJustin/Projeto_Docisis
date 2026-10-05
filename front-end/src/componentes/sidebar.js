const SIDEBAR_HTML = `
  <aside
    class="w-64 h-screen flex flex-col justify-between shrink-0 bg-[#f5f2eb] border-r border-black/5 sticky top-0 font-sans">
    <div>
      <!-- Cabeçalho Topo (Branco) -->
      <div class="bg-white px-6 py-5">
        <h1 class="text-xl font-bold text-[#8c5a3e] tracking-tight">
          DoceGestão
        </h1>
      </div>

      <!-- Conteúdo do Menu (Fundo Bege) -->
      <div class="px-5 pt-5 space-y-5">
        <!-- Subtítulo -->
        <div class="px-2">
          <h2 class="text-sm font-bold text-[#8c5a3e]">Confeitaria</h2>
          <p class="text-xs text-[#64748b] font-medium">Gestão Premium</p>
        </div>

        <!-- Navegação Principal -->
        <nav class="space-y-1 text-sm font-semibold text-[#334155]">
          <!-- Dashboard -->
          <a href="#" data-page="dashboard"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="layout-grid" class="w-5 h-5"></i>
            <span>Dashboard</span>
          </a>

          <!-- Estoque -->
          <a href="#" data-page="estoque"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="package" class="w-5 h-5"></i>
            <span>Estoque</span>
          </a>

          <!-- Entrada -->
          <a href="#" data-page="entrada"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="log-in" class="w-5 h-5"></i>
            <span>Entrada</span>
          </a>

          <!-- Saída -->
          <a href="#" data-page="saida"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="log-out" class="w-5 h-5"></i>
            <span>Saída</span>
          </a>

          <!-- Alertas -->
          <a href="#" data-page="alertas"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="bell" class="w-5 h-5"></i>
            <span>Alertas</span>
          </a>

          <a href="#" data-page="relatorios"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="chart-no-axes-combined" class="w-5 h-5"></i>
            <span>Relatórios</span>
          </a>

          <!-- Historico -->
          <a href="#" data-page="historico"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="clock" class="w-5 h-5"></i>
            <span>Historico</span>
          </a>

          <!-- Funcionários -->
          <a href="#" data-page="funcionarios"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="users" class="w-5 h-5"></i>
            <span>Funcionários</span>
          </a>

          <!-- Admin -->
          <a href="#" data-page="admin"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
            <span>Admin</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Rodapé: Botão Novo Item -->
    <div class="p-5">
      <a href="./historico-materias_prima.html" id="btn-novo-sidebar"
        class="w-full bg-[#8c5a3e] hover:bg-[#784c33] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer text-sm">
        <span class="text-base font-normal">+</span>
        <span>Nova Movimentação</span>
      </a>
    </div>
  </aside>
`

const SIDEBAR_SCRIPT_URL = document.currentScript?.src
  ? new URL(document.currentScript.src)
  : null;

async function carregarSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  const cadastroPublico =
    new URLSearchParams(window.location.search).get("cadastro-publico") === "1";
  if (cadastroPublico) {
    container.remove();
    return;
  }

  try {
    container.innerHTML = SIDEBAR_HTML;

    if (window.lucide?.createIcons) {
      window.lucide.createIcons();
    }

    const paginaAtiva = container.getAttribute("data-active");
    if (paginaAtiva) {
      const linkAtivo = container.querySelector(`[data-page="${paginaAtiva}"]`);
      linkAtivo?.classList.add("bg-amber-50", "text-amber-800", "font-medium");
    }

    if (
      window.location.protocol !== "file:" &&
      SIDEBAR_SCRIPT_URL &&
      !document.querySelector("script[data-sidebar-profile]")
    ) {
      const perfilScript = document.createElement("script");
      perfilScript.src = new URL("./perfil.js", SIDEBAR_SCRIPT_URL).href;
      perfilScript.dataset.sidebarProfile = "true";
      document.head.appendChild(perfilScript);
    }
  } catch (error) {
    console.error("Erro ao carregar o sidebar:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarSidebar, { once: true });
} else {
  carregarSidebar();
}
