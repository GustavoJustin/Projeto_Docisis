// Obs: estilizacao não aparece sem ter uma pagina para aparecer
const SIDEBAR_HTML = `
  <aside
    class="w-64 h-screen flex flex-col justify-between shrink-0 bg-[#f5f2eb] border-r border-black/5 sticky top-0 font-sans">
    <div>
      <div class="bg-white px-6 py-5">
        <h1 class="text-xl font-bold text-[#8c5a3e] tracking-tight">DoceGestão</h1>
      </div>

      <div class="px-5 pt-5 space-y-5">
        <div class="px-2">
          <h2 class="text-sm font-bold text-[#8c5a3e]">Confeitaria</h2>
          <p class="text-xs text-[#64748b] font-medium">Gestão Premium</p>
        </div>

        <nav class="space-y-1 text-sm font-semibold text-[#334155]">
          <a href="#" data-page="dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="layout-grid" class="w-5 h-5"></i>
            <span>Dashboard</span>
          </a>

          <a href="#" data-page="estoque" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="package" class="w-5 h-5"></i>
            <span>Estoque</span>
          </a>

          <a href="#" data-page="entrada" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="log-in" class="w-5 h-5"></i>
            <span>Entrada</span>
          </a>

          <a href="#" data-page="saida" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="log-out" class="w-5 h-5"></i>
            <span>Saída</span>
          </a>

          <a href="#" data-page="alertas" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="bell" class="w-5 h-5"></i>
            <span>Alertas</span>
          </a>

          <div>
            <button type="button" id="btn-historico" data-page="historico" class="flex w-full items-center justify-between px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all cursor-pointer">
              <div class="flex items-center gap-3">
                <i data-lucide="clock" class="w-5 h-5"></i>
                <span>Histórico</span>
              </div>
              <i data-lucide="chevron-down" id="seta-historico" class="w-4 h-4 transition-transform duration-200"></i>
            </button>

            <div id="submenu-historico" class="pl-10 pr-2 pt-1 space-y-1" style="display: none;">
              <a href="#" data-page="historico-movimentacoes" class="block px-3 py-2 rounded-lg text-xs font-semibold text-[#475569] hover:bg-black/5 transition-all">
                Movimentações
              </a>
              <a href="#" data-page="historico-materia-prima" class="block px-3 py-2 rounded-lg text-xs font-semibold text-[#475569] hover:bg-black/5 transition-all">
                Matéria Prima
              </a>
            </div>
          </div>

          <a href="#" data-page="funcionarios" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="users" class="w-5 h-5"></i>
            <span>Funcionários</span>
          </a>

          <a href="#" data-page="admin" class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
            <span>Admin</span>
          </a>
        </nav>
      </div>
    </div>

    <div class="p-5">
      <button type="button" id="btn-novo-sidebar" class="w-full bg-[#8c5a3e] hover:bg-[#784c33] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer text-sm">
        <a href="#">
          <span class="text-base font-normal">+</span>
          <span>Novo Item</span>
        </a>
      </button>
    </div>
  </aside>
`;

async function carregarSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  const paginaAtiva = container.getAttribute('data-active');

  try {
    let htmlSidebar = SIDEBAR_HTML;

    if (window.location.protocol !== 'file:') {
      const resposta = await fetch('../src/componentes/sidebar.html?v=' + new Date().getTime());
      if (!resposta.ok) throw new Error(`Erro: ${resposta.statusText}`);
      htmlSidebar = await resposta.text();
    }

    container.innerHTML = htmlSidebar;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    const btnHistorico = container.querySelector('#btn-historico');
    const submenuHistorico = container.querySelector('#submenu-historico');

    if (submenuHistorico) {
      submenuHistorico.style.display = 'none';
    }

    if (btnHistorico && submenuHistorico) {
      btnHistorico.addEventListener('click', (e) => {
        e.preventDefault();

        const setaHistorico = container.querySelector('#seta-historico');
        const estaFechado = submenuHistorico.style.display === 'none' || submenuHistorico.style.display === '';

        if (estaFechado) {
          submenuHistorico.style.display = 'block';
          if (setaHistorico) setaHistorico.style.transform = 'rotate(180deg)';
        } else {
          submenuHistorico.style.display = 'none';
          if (setaHistorico) setaHistorico.style.transform = 'rotate(0deg)';
        }
      });
    }

    if (paginaAtiva) {
      const linkAtivo = container.querySelector(`[data-page="${paginaAtiva}"]`);
      if (linkAtivo) {
        linkAtivo.classList.remove('text-stone-500', 'hover:bg-stone-50', 'hover:text-stone-700');
        linkAtivo.classList.add('bg-amber-50', 'text-amber-800', 'font-medium');
      }

      if (paginaAtiva === 'historico-movimentacoes' || paginaAtiva === 'historico-materia-prima') {
        const setaHistorico = container.querySelector('#seta-historico');
        if (submenuHistorico) submenuHistorico.style.display = 'block';
        if (setaHistorico) setaHistorico.style.transform = 'rotate(180deg)';
        if (btnHistorico) btnHistorico.classList.add('text-amber-800', 'font-medium');
      }
    }

  } catch (erro) {
    console.error('Erro ao carregar menu lateral:', erro);
  }
}

document.addEventListener('DOMContentLoaded', carregarSidebar);