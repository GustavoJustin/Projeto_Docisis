// Obs: estilizacao não aparece sem ter uma pagina para aparecer
async function carregarSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  const paginaAtiva = container.getAttribute('data-active');

  try {
    const resposta = await fetch('../src/componentes/sidebar.html?v=' + new Date().getTime());
    if (!resposta.ok) throw new Error(`Erro: ${resposta.statusText}`);

    const htmlSidebar = await resposta.text();
    container.innerHTML = htmlSidebar;

    // 1. Converte as tags <i> em ícones SVG do Lucide
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    // 2. Captura os elementos do submenu APÓS a criação do HTML
    const btnHistorico = container.querySelector('#btn-historico');
    const submenuHistorico = container.querySelector('#submenu-historico');

    // Força o submenu a começar FECHADO por padrão
    if (submenuHistorico) {
      submenuHistorico.style.display = 'none';
    }

    // 3. Evento de Clique no botão "Histórico"
    if (btnHistorico && submenuHistorico) {
      btnHistorico.addEventListener('click', (e) => {
        e.preventDefault();

        // Busca a seta atual no DOM no momento exato do clique
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

    // 4. Destaque da Página Ativa
    if (paginaAtiva) {
      const linkAtivo = container.querySelector(`[data-page="${paginaAtiva}"]`);
      if (linkAtivo) {
        linkAtivo.classList.remove('text-stone-500', 'hover:bg-stone-50', 'hover:text-stone-700');
        linkAtivo.classList.add('bg-amber-50', 'text-amber-800', 'font-medium');
      }

      // Se a página atual for um dos sub-itens, abre o submenu automaticamente ao carregar a tela
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