const SIDEBAR_HTML = `
  <aside
    class="w-64 h-screen flex flex-col justify-between shrink-0 border-r border-black/5 sticky top-0 font-sans" style="background-color: #f5f0e8">
    <div>
      <!-- Cabeçalho Topo (Branco) -->
      <div class="bg-cocoa-800 px-6 py-5">
        <h1 class="text-xl font-bold text-white tracking-tight">
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
          <!-- Estoque -->
          <a href="./estoqueInsumos.html" data-page="estoque"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-black/5 transition-all">
            <i data-lucide="package" class="w-5 h-5"></i>
            <span>Estoque</span>
          </a>

          <!-- Alertas -->
          <a href="./alerta.html" data-page="alertas"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-black/5 transition-all">
            <i data-lucide="bell" class="w-5 h-5"></i>
            <span>Alertas</span>
          </a>

          <!-- Historico -->
          <a href="./historicoCompleto.html" data-page="historico"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-black/5 transition-all">
            <i data-lucide="clock" class="w-5 h-5"></i>
            <span>Historico</span>
          </a>

          <!-- Funcionários -->
          <a href="./gestao-equipes.html" data-page="funcionarios"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-black/5 transition-all">
            <i data-lucide="users" class="w-5 h-5"></i>
            <span>Gestão</span>
          </a>

          <!-- Admin -->
          <a href="./painel-administrativo.html" data-page="admin"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-black/5 transition-all">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
            <span>Admin</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Rodapé: Botão Novo Item -->
    <div class="p-5">
      <a href="./materia-prima.html" id="btn-novo-sidebar"
        class="w-full bg-cocoa-700 hover:bg-cocoa-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer text-sm">
        <span class="text-base font-normal">+</span>
        <span>Nova Movimentação</span>
      </a>
    </div>
  </aside>
`
let sessaoUsuarioAtual = null;
let tokenSessaoUsuarioAtual = null;

async function obterFuncionarioAutenticado() {
  const token = localStorage.getItem("docegestao_token");
  if (!token) {
    sessaoUsuarioAtual = null;
    tokenSessaoUsuarioAtual = null;
    return null;
  }
  if (token === tokenSessaoUsuarioAtual) return sessaoUsuarioAtual;

  try {
    const response = await fetch("/api/sessao", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok || !result.funcionario?.nome_cargo) {
      throw new Error(result.mensagem || "Não foi possível validar o cargo da conta.");
    }

    sessaoUsuarioAtual = result.funcionario;
    tokenSessaoUsuarioAtual = token;
    localStorage.setItem("docegestao_funcionario", JSON.stringify(result.funcionario));
    return sessaoUsuarioAtual;
  } catch (error) {
    sessaoUsuarioAtual = null;
    tokenSessaoUsuarioAtual = null;
    console.error("Não foi possível validar a sessão do usuário:", error);
    return null;
  }
}

function carregarSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  container.innerHTML = SIDEBAR_HTML;
  const linkFuncionarios = container.querySelector('[data-page="funcionarios"]');
  if (linkFuncionarios) linkFuncionarios.hidden = true;

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }

  const paginasPorLink = {
    estoque: ["estoque", "estoqueinsumos", "materia_prima"],
    alertas: ["alertas"],
    relatorios: ["relatorios", "relatorios_analises"],
    historico: ["historico", "historico-completo"],
    funcionarios: ["funcionarios", "gestao-equipes", "cadastro-funcionario"],
    admin: ["admin", "painel-administrativo"],
  };
  const paginaAtiva = container.dataset.active?.trim().toLowerCase();
  const linkAtivo = [...container.querySelectorAll("[data-page]")].find((link) =>
    paginasPorLink[link.dataset.page]?.includes(paginaAtiva),
  );

  if (linkAtivo) {
    linkAtivo.classList.add(
      "bg-cocoa-200/60",
      "text-cocoa-800",
      "font-bold",
      "shadow-sm",
    );
    linkAtivo.setAttribute("aria-current", "page");
  }

  void (async () => {
    const funcionario = await obterFuncionarioAutenticado();
    const cargo = String(funcionario?.nome_cargo || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (linkFuncionarios?.isConnected) {
      linkFuncionarios.hidden = !cargo.includes("admin");
    }
  })();
}

window.obterFuncionarioAutenticado = obterFuncionarioAutenticado;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarSidebar, { once: true });
} else {
  carregarSidebar();
}
document.addEventListener("demo:page-loaded", carregarSidebar);