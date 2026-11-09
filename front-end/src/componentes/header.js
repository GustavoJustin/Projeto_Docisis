const HEADER_HTML = `
  <div class="relative">
    <header
      class="bg-cocoa-800 border-l border-white text-[#F7F1EA] px-4 sm:px-8 py-3 flex flex-wrap justify-between items-center gap-4">
      <div>
        <p class="text-xs text-[#D9C6B4] font-medium">
          Gestão <span class="mx-1">/</span> <span data-header-page-name>Estoque</span>
        </p>
        <h1 data-header-page-name class="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#F5EFE9]">
          Estoque de Matérias-Primas
        </h1>
      </div>

      <div class="flex items-center gap-3 sm:gap-5">
        <button id="header-notifications-trigger" type="button"
          class="relative p-2 text-[#E6D7C6] hover:text-white hover:bg-white/10 rounded-full transition"
          aria-label="Notificações" aria-haspopup="dialog" aria-expanded="false">
          <i data-lucide="bell" class="w-5 h-5"></i>
          <span id="header-notification-count"
            class="absolute top-1 right-1 hidden min-w-4 h-4 px-1 bg-[#D97706] text-white text-[10px] font-bold rounded-full items-center justify-center">
            0
          </span>
        </button>

        <button id="header-settings-trigger" type="button"
          class="p-2 text-[#E6D7C6] hover:text-white hover:bg-white/10 rounded-full transition"
          aria-label="Configurações" aria-haspopup="dialog" aria-expanded="false">
          <i data-lucide="settings" class="w-5 h-5"></i>
        </button>

        <div class="relative">
          <button id="header-profile-trigger" type="button"
            class="flex items-center justify-center rounded-full p-1 transition hover:bg-white/10"
            aria-label="Abrir menu da conta" aria-haspopup="menu" aria-expanded="false">
            <img data-header-avatar
              src="../src/img/avatar-padrao.svg"
              alt="Avatar da conta" class="h-9 w-9 rounded-full border border-[#D4A373] object-cover">
          </button>

          <div id="header-profile-menu" role="menu" aria-labelledby="header-profile-trigger"
            class="absolute right-0 top-full z-50 mt-2 hidden w-80 overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-800 shadow-2xl"
            style="max-width:min(20rem, calc(100vw - 2rem))">
            <div class="flex items-center gap-4 border-b border-gray-200 bg-[#F8F6F2] p-4">
              <img data-header-menu-avatar
                src="../src/img/avatar-padrao.svg"
                alt="" class="h-14 w-14 shrink-0 rounded-full border border-[#D4A373] object-cover">
              <div class="min-w-0">
                <p data-header-menu-name class="truncate text-sm font-bold text-[#3A2A1A]">Nenhuma conta conectada</p>
                <p data-header-menu-email class="truncate text-xs text-gray-600">Entre para acessar sua conta</p>
              </div>
            </div>
              <button id="header-account-settings" type="button" role="menuitem"
                class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                <i data-lucide="settings-2" class="h-4 w-4 text-[#875C46]"></i>
                <span>Configurações da conta</span>
              </button>
              <button id="header-account-action" type="button" role="menuitem"
                class="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                <i data-lucide="log-out" class="h-4 w-4 text-[#875C46]"></i>
                <span data-header-account-action-label>Sair</span>
              </button>
          </div>
        </div>
      </div>
    </header>

    <div id="header-logout-dialog" class="fixed inset-0 z-[70] hidden items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="header-logout-title"
        class="w-full max-w-sm rounded-2xl border border-[#E7DED5] bg-white p-6 text-[#4A3F39] shadow-2xl">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5ECE5] text-[#875C46]">
          <i data-lucide="log-out" class="h-5 w-5"></i>
        </div>
        <h2 id="header-logout-title" class="mt-4 text-center text-lg font-bold text-[#3A2A1A]">Sair da conta?</h2>
        <p class="mt-2 text-center text-sm text-gray-500">Você precisará entrar novamente para acessar sua conta.</p>
        <div class="mt-6 flex justify-center gap-3">
          <button id="header-cancel-logout" type="button"
            class="w-28 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
            Cancelar
          </button>
          <button id="header-confirm-logout" type="button"
            class="w-28 rounded-lg bg-[#875C46] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6D4936]">
            Sair
          </button>
        </div>
      </section>
    </div>

    <div id="header-notifications-dialog" class="fixed inset-0 z-[60] hidden bg-black/20"
      role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="header-notifications-title"
        class="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden border-l border-[#E7DED5] text-[#4A3F39] shadow-2xl"
        style="background-color:#F8F8F8">
        <div class="flex items-center justify-between px-5 py-4" style="background-color:#EDEAE5">
          <div class="flex items-center gap-3">
            <div>
              <h2 id="header-notifications-title" class="text-lg font-bold text-[#3A2A1A]">Notificações</h2>
              <p class="text-xs text-gray-500">Avisos importantes do sistema</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" data-open-header-settings
              class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800" aria-label="Abrir configurações">
              <i data-lucide="settings" class="h-4 w-4"></i>
            </button>
            <button type="button" data-close-header-dialog="header-notifications-dialog"
              class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800" aria-label="Fechar notificações">
            <i data-lucide="x" class="h-4 w-4"></i>
            </button>
          </div>
        </div>
        <p id="header-notifications-error" class="hidden mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert"></p>
        <div id="header-notifications-list" class="flex-1 space-y-3 overflow-y-auto p-5" style="background-color:#F8F8F8">
          <div data-notifications-empty class="flex h-full min-h-64 flex-col items-center justify-center text-center">
            <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5ECE5] text-[#875C46]">
              <i data-lucide="bell-ring" class="h-7 w-7"></i>
            </span>
            <h3 class="text-sm font-bold text-gray-800">Você está atualizado!</h3>
            <p class="mt-1 text-xs text-gray-500">Você não tem novas notificações</p>
          </div>
        </div>
        <div class="flex justify-end border-t border-gray-100 px-5 py-3">
          <button type="button" id="header-close-selected-notification"
            class="rounded-lg bg-[#784E38] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#633e2c] disabled:cursor-not-allowed disabled:opacity-50"
            disabled>
            Fechar notificação
          </button>
        </div>
      </section>
    </div>

    <div id="header-call-details-dialog" class="fixed inset-0 z-[90] hidden items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="header-call-details-title"
        class="w-full max-w-lg rounded-2xl border border-[#E7DED5] bg-white p-6 text-[#4A3F39] shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p id="header-call-details-status" class="text-[11px] font-bold uppercase tracking-wide text-[#875C46]"></p>
            <h2 id="header-call-details-title" class="mt-1 text-lg font-bold text-[#3A2A1A]">Detalhes do chamado</h2>
          </div>
          <button type="button" id="header-call-details-close" class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
            aria-label="Fechar detalhes do chamado">
            <i data-lucide="x" class="h-4 w-4"></i>
          </button>
        </div>
        <p id="header-call-details-description" class="mt-4 whitespace-pre-wrap break-words rounded-xl bg-[#F8F6F2] p-4 text-sm leading-6"></p>
        <p id="header-call-details-metadata" class="mt-3 text-xs text-gray-500"></p>
        <p id="header-call-details-error" class="mt-3 hidden rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert"></p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" id="header-call-details-cancel"
            class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
            Cancelar
          </button>
          <button type="button" id="header-call-details-action"
            class="rounded-lg bg-[#784E38] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#633e2c] disabled:cursor-not-allowed disabled:opacity-50">
            Resolver chamado
          </button>
        </div>
      </section>
    </div>

    <aside id="header-active-call-banner" class="fixed bottom-4 left-1/2 z-[80] hidden w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-[#4A3F39] shadow-2xl"
      aria-live="polite">
      <div id="header-active-call-drag-handle" class="min-w-0 flex-1 cursor-move select-none" style="touch-action:none">
        <p class="text-xs font-bold uppercase tracking-wide text-[#784E38]">Chamado em resolução</p>
        <p id="header-active-call-text" class="mt-1 truncate text-sm font-medium"></p>
      </div>
      <button type="button" id="header-active-call-close"
        class="shrink-0 rounded-lg bg-[#784E38] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#633e2c]">
        Fechar chamado
      </button>
    </aside>

    <div id="header-settings-dialog" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="header-settings-title"
        class="flex h-[min(90vh,42rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/50 bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-gray-100 bg-[#F8F6F2] px-6 py-5">
          <h2 id="header-settings-title" class="text-lg font-bold text-[#3A2A1A]">Configurações</h2>
          <button type="button" data-close-header-dialog="header-settings-dialog"
            class="rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800" aria-label="Fechar configurações">
            <i data-lucide="x" class="h-4 w-4"></i>
          </button>
        </div>
        <div class="flex min-h-0 flex-1">
          <aside class="w-40 shrink-0 border-r border-gray-100 bg-[#F8F6F2] p-3 sm:w-60 sm:p-5">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Preferências</p>
            <nav class="mt-4 space-y-1" aria-label="Abas de configurações">
              <button type="button" data-settings-tab="notifications"
                class="flex w-full items-center gap-3 rounded-lg bg-[#F5ECE5] px-3 py-2.5 text-left text-sm font-semibold text-[#784E38]"
                aria-selected="true">
                <i data-lucide="bell" class="h-4 w-4"></i>
                Notificações
              </button>
              <button type="button" data-settings-tab="page"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                aria-selected="false">
                <i data-lucide="monitor" class="h-4 w-4"></i>
                Página
              </button>
              <button type="button" data-settings-tab="profile"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                aria-selected="false">
                <i data-lucide="user-round" class="h-4 w-4"></i>
                Perfil
              </button>
            </nav>
          </aside>
          <div class="min-w-0 flex-1 overflow-y-auto p-5 sm:p-8">
            <section data-settings-panel="notifications" aria-labelledby="settings-notifications-title">
              <h3 id="settings-notifications-title" class="text-base font-bold text-gray-800">Notificações</h3>
              <p class="mt-1 text-sm text-gray-500">Escolha quais avisos deseja receber.</p>
              <div class="mt-6 divide-y divide-gray-100">
                <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                  <span>
                    <span class="block text-sm font-semibold text-gray-800">Desativar notificações</span>
                    <span class="mt-1 block text-xs text-gray-500">Oculta todos os avisos e zera o contador.</span>
                  </span>
                  <input type="checkbox" data-notification-preference="all" class="h-4 w-4 accent-[#784E38]">
                </label>
                <label data-calls-notification-preference class="hidden flex cursor-pointer items-center justify-between gap-4 py-4">
                  <span>
                    <span class="block text-sm font-semibold text-gray-800">Desativar notificações de chamados</span>
                    <span class="mt-1 block text-xs text-gray-500">Oculta avisos de novos chamados.</span>
                  </span>
                  <input type="checkbox" data-notification-preference="calls" class="h-4 w-4 accent-[#784E38]">
                </label>
                <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
                  <span>
                    <span class="block text-sm font-semibold text-gray-800">Desativar notificações de produtos</span>
                    <span class="mt-1 block text-xs text-gray-500">Oculta avisos de produtos esgotados ou vencidos.</span>
                  </span>
                  <input type="checkbox" data-notification-preference="products" class="h-4 w-4 accent-[#784E38]">
                </label>
              </div>
            </section>

            <section data-settings-panel="page" aria-labelledby="settings-page-title" class="hidden">
              <h3 id="settings-page-title" class="text-base font-bold text-gray-800">Página</h3>
              <p class="mt-1 text-sm text-gray-500">Personalize a aparência da aplicação.</p>
              <div class="mt-6 flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                <span>
                  <span class="block text-sm font-semibold text-gray-800">Modo escuro</span>
                  <span class="mt-1 block text-xs text-gray-500">Altere o tema de todas as páginas.</span>
                </span>
                <button type="button" id="settings-theme-toggle"
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-[#784E38] transition hover:bg-[#F8F6F2]"
                  aria-label="Ativar modo escuro" aria-pressed="false">
                  <i data-lucide="sun" class="h-5 w-5"></i>
                </button>
              </div>
            </section>

            <section data-settings-panel="profile" aria-labelledby="settings-profile-title" class="hidden">
              <h3 id="settings-profile-title" class="text-base font-bold text-gray-800">Perfil</h3>
              <p class="mt-1 text-sm text-gray-500">Atualize as informações exibidas neste navegador.</p>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <img data-settings-avatar
                  src="../src/img/avatar-padrao.svg"
                  alt="Foto de perfil" class="h-16 w-16 rounded-full border border-[#D4A373] object-cover">
                <div>
                  <label for="settings-profile-photo" class="inline-flex cursor-pointer items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                    Alterar foto
                  </label>
                  <input type="file" id="settings-profile-photo" class="sr-only" accept="image/*">
                  <p class="mt-1 text-[11px] text-gray-500">Escolha uma imagem de até 5 MB.</p>
                </div>
              </div>
              <form id="settings-profile-form" class="mt-6 space-y-4">
                <label class="block">
                  <span class="mb-1.5 block text-xs font-semibold text-gray-700">Nome</span>
                  <input type="text" name="nome" required maxlength="120"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#875C46]">
                </label>
                <label class="block">
                  <span class="mb-1.5 block text-xs font-semibold text-gray-700">Idade</span>
                  <input type="number" name="idade" min="1" max="120"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#875C46]">
                </label>
                <label class="block">
                  <span class="mb-1.5 block text-xs font-semibold text-gray-700">E-mail</span>
                  <input type="email" name="email" required maxlength="254"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#875C46]">
                </label>
                <p id="settings-profile-feedback" class="min-h-5 text-xs text-gray-500" role="status"></p>
                <button type="submit"
                  class="rounded-lg bg-[#784E38] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#633e2c]">
                  Salvar alterações
                </button>
              </form>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
`;

const HEADER_DARK_STYLES = `
  html[data-theme="dark"] body {
    background-color: #17120f !important;
    color: #f7f0e8 !important;
  }
  html[data-theme="dark"] body,
  html[data-theme="dark"] main,
  html[data-theme="dark"] [class~="bg-[#FAFAFA]"],
  html[data-theme="dark"] [class~="bg-[#F8F6F2]"],
  html[data-theme="dark"] [class~="bg-[#F5F6F8]"],
  html[data-theme="dark"] [class~="bg-[#F5F0E8]"],
  html[data-theme="dark"] [class~="bg-brand-bg"] {
    background-color: #17120f !important;
  }
  html[data-theme="dark"] #header-container header,
  html[data-theme="dark"] #sidebar-container aside > div:first-child > div:first-child {
    background-color: #241a15 !important;
  }
  html[data-theme="dark"] #sidebar-container aside {
    background-color: #211914 !important;
    border-color: #49382d !important;
    color: #f7f0e8 !important;
  }
  html[data-theme="dark"] [class~="bg-white"],
  html[data-theme="dark"] [class~="bg-gray-50"],
  html[data-theme="dark"] [class~="bg-gray-100"],
  html[data-theme="dark"] [class~="bg-brand-cream"],
  html[data-theme="dark"] [class~="bg-cream"] {
    background-color: #2c221c !important;
  }
  html[data-theme="dark"] [class~="cartao-produto"],
  html[data-theme="dark"] #header-profile-menu,
  html[data-theme="dark"] #header-settings-dialog [role="dialog"],
  html[data-theme="dark"] #header-logout-dialog [role="dialog"] {
    background-color: #2c221c !important;
    color: #f7f0e8 !important;
    border-color: #49382d !important;
  }
  html[data-theme="dark"] .cartao-produto .bg-gray-50,
  html[data-theme="dark"] .cartao-produto [class~="bg-brand-cream"] {
    background-color: #352a23 !important;
  }
  html[data-theme="dark"] #sidebar-container aside a[aria-current="page"],
  html[data-theme="dark"] #sidebar-container aside a[class~="bg-cocoa-200/60"],
  html[data-theme="dark"] .filtro-btn[class~="bg-brand-brown"] {
    background-color: #59402b !important;
    color: #f7f0e8 !important;
  }
  html[data-theme="dark"] .filtro-btn,
  html[data-theme="dark"] [class~="bg-pink-100/60"] {
    background-color: #39282f !important;
    color: #f7f0e8 !important;
  }
  html[data-theme="dark"] .filtro-btn[class~="bg-brand-brown"] {
    background-color: #b77c49 !important;
  }
  html[data-theme="dark"] .cartao-produto,
  html[data-theme="dark"] [class~="border-gray-100"],
  html[data-theme="dark"] [class~="border-gray-200"],
  html[data-theme="dark"] [class~="border-black/5"],
  html[data-theme="dark"] [class~="border-black/10"],
  html[data-theme="dark"] [class~="border-[#E9D9CC]"] {
    border-color: #49382d !important;
  }
  html[data-theme="dark"] [class~="text-gray-900"],
  html[data-theme="dark"] [class~="text-gray-800"],
  html[data-theme="dark"] [class~="text-gray-700"],
  html[data-theme="dark"] [class~="text-gray-600"],
  html[data-theme="dark"] [class~="text-brand-text-dark"],
  html[data-theme="dark"] [class~="text-[#4A3F39]"],
  html[data-theme="dark"] [class~="text-[#3A2E2B]"],
  html[data-theme="dark"] [class~="text-[#3A2A1A]"],
  html[data-theme="dark"] [class~="text-[#334155]"] {
    color: #f7f0e8 !important;
  }
  html[data-theme="dark"] [class~="text-gray-500"],
  html[data-theme="dark"] [class~="text-gray-400"],
  html[data-theme="dark"] [class~="text-brand-text-muted"],
  html[data-theme="dark"] [class~="text-[#64748B]"] {
    color: #c1ada0 !important;
  }
  html[data-theme="dark"] [class~="text-brand-brown"],
  html[data-theme="dark"] [class~="text-[#784E38]"],
  html[data-theme="dark"] [class~="text-[#875C46]"] {
    color: #e5a66b !important;
  }
  html[data-theme="dark"] [class~="text-rose-500"],
  html[data-theme="dark"] [class~="text-rose-600"],
  html[data-theme="dark"] [class~="text-rose-700"],
  html[data-theme="dark"] [class~="text-rose-800"],
  html[data-theme="dark"] [class~="text-red-500"],
  html[data-theme="dark"] [class~="text-red-600"],
  html[data-theme="dark"] [class~="text-red-700"],
  html[data-theme="dark"] [class~="text-red-800"] {
    color: #ff759b !important;
  }
  html[data-theme="dark"] [class~="text-amber-500"],
  html[data-theme="dark"] [class~="text-amber-600"],
  html[data-theme="dark"] [class~="text-amber-700"],
  html[data-theme="dark"] [class~="text-amber-800"],
  html[data-theme="dark"] [class~="text-orange-500"],
  html[data-theme="dark"] [class~="text-orange-600"],
  html[data-theme="dark"] [class~="text-orange-700"],
  html[data-theme="dark"] [class~="text-orange-800"] {
    color: #ffad42 !important;
  }
  html[data-theme="dark"] [class~="text-emerald-500"],
  html[data-theme="dark"] [class~="text-emerald-600"],
  html[data-theme="dark"] [class~="text-green-500"],
  html[data-theme="dark"] [class~="text-green-600"] {
    color: #b77c49 !important;
  }
  html[data-theme="dark"] [class~="bg-rose-50"],
  html[data-theme="dark"] [class~="bg-red-50"],
  html[data-theme="dark"] [class~="bg-rose-100"],
  html[data-theme="dark"] [class~="bg-red-100"] {
    background-color: #39282f !important;
  }
  html[data-theme="dark"] [class~="bg-amber-50"],
  html[data-theme="dark"] [class~="bg-orange-50"],
  html[data-theme="dark"] [class~="bg-amber-100"],
  html[data-theme="dark"] [class~="bg-orange-100"] {
    background-color: #352a23 !important;
  }
  html[data-theme="dark"] [class~="bg-emerald-50"],
  html[data-theme="dark"] [class~="bg-green-50"],
  html[data-theme="dark"] [class~="bg-emerald-100"],
  html[data-theme="dark"] [class~="bg-green-100"] {
    background-color: #352a23 !important;
  }
  html[data-theme="dark"] #conteudo-centralizado main,
  html[data-theme="dark"] main {
    background-color: #17120f !important;
  }
  html[data-theme="dark"] [class~="border-rose-300"],
  html[data-theme="dark"] [class~="border-red-300"] {
    border-color: #ff759b !important;
  }
  html[data-theme="dark"] [class~="border-amber-300"],
  html[data-theme="dark"] [class~="border-orange-300"] {
    border-color: #ffad42 !important;
  }
  html[data-theme="dark"] #header-settings-dialog input,
  html[data-theme="dark"] #header-settings-dialog select,
  html[data-theme="dark"] input,
  html[data-theme="dark"] select,
  html[data-theme="dark"] textarea {
    background-color: #2c221c !important;
    color: #f7f0e8 !important;
    border-color: #49382d !important;
  }
  html[data-theme="dark"] #header-profile-menu [class~="bg-[#F8F6F2]"],
  html[data-theme="dark"] #header-settings-dialog aside,
  html[data-theme="dark"] #header-settings-dialog [class~="bg-[#F8F6F2]"],
  html[data-theme="dark"] #header-notifications-dialog > section > div:first-child {
    background-color: #211914 !important;
  }
  html[data-theme="dark"] #header-settings-dialog [class~="hover:bg-gray-100"]:hover,
  html[data-theme="dark"] #header-profile-menu [class~="hover:bg-gray-100"]:hover {
    background-color: #39282f !important;
  }
  html[data-theme="dark"] [class~="bg-[#784E38]"],
  html[data-theme="dark"] [class~="bg-cocoa-700"],
  html[data-theme="dark"] [class~="bg-brand-brown"] {
    background-color: #b77c49 !important;
    color: #17120f !important;
  }
`;

function carregarHeader() {
  const container = document.getElementById("header-container");
  if (!container) return;

  if (!document.getElementById("header-dark-styles")) {
    const darkStyles = document.createElement("style");
    darkStyles.id = "header-dark-styles";
    darkStyles.textContent = HEADER_DARK_STYLES;
    document.head.appendChild(darkStyles);
  }

  container.innerHTML = HEADER_HTML;

  const pageName = document.title
    .replace(/^DoceGestão\s*[|—-]\s*/i, "")
    .trim();
  if (pageName) {
    container.querySelectorAll("[data-header-page-name]").forEach((element) => {
      element.textContent = pageName;
    });
  }

  const notificationsTrigger = container.querySelector("#header-notifications-trigger");
  const settingsTrigger = container.querySelector("#header-settings-trigger");
  const profileTrigger = container.querySelector("#header-profile-trigger");
  const profileMenu = container.querySelector("#header-profile-menu");
  const notificationsDialog = container.querySelector("#header-notifications-dialog");
  const settingsDialog = container.querySelector("#header-settings-dialog");
  const settingsProfileForm = container.querySelector("#settings-profile-form");
  const settingsProfilePhoto = container.querySelector("#settings-profile-photo");
  const settingsProfileAvatar = container.querySelector("[data-settings-avatar]");
  const settingsProfileFeedback = container.querySelector("#settings-profile-feedback");
  const settingsThemeToggle = container.querySelector("#settings-theme-toggle");
  const notificationCount = container.querySelector("#header-notification-count");
  const notificationsList = container.querySelector("#header-notifications-list");
  const notificationsError = container.querySelector("#header-notifications-error");
  const accountAction = container.querySelector("#header-account-action");
  const accountSettingsAction = container.querySelector("#header-account-settings");
  const logoutDialog = container.querySelector("#header-logout-dialog");
  const cancelLogoutButton = container.querySelector("#header-cancel-logout");
  const confirmLogoutButton = container.querySelector("#header-confirm-logout");
  const accountActionLabel = container.querySelector("[data-header-account-action-label]");
  const closeSelectedNotification = container.querySelector("#header-close-selected-notification");
  const callDetailsDialog = container.querySelector("#header-call-details-dialog");
  const callDetailsStatus = container.querySelector("#header-call-details-status");
  const callDetailsDescription = container.querySelector("#header-call-details-description");
  const callDetailsMetadata = container.querySelector("#header-call-details-metadata");
  const callDetailsError = container.querySelector("#header-call-details-error");
  const callDetailsAction = container.querySelector("#header-call-details-action");
  const activeCallBanner = container.querySelector("#header-active-call-banner");
  const activeCallDragHandle = container.querySelector("#header-active-call-drag-handle");
  const activeCallText = container.querySelector("#header-active-call-text");
  const activeCallClose = container.querySelector("#header-active-call-close");
  const fotoPerfil = container.querySelector("[data-header-avatar]");
  const fotoMenu = container.querySelector("[data-header-menu-avatar]");
  const avatarPadraoPerfil = fotoPerfil.getAttribute("src");
  const avatarPadraoMenu = fotoMenu.getAttribute("src");
  const avatarPadraoConfiguracoes = settingsProfileAvatar.getAttribute("src");
  const NOTIFICATIONS_KEY = "docegestao_notificacoes_v1";
  const PREFERENCES_KEY = "docegestao_preferencias_v1";
  const PROFILE_KEY = "docegestao_perfil_v1";
  const THEME_KEY = "docegestao_tema_v1";
  const MIGRATED_CALLS_KEY = "docegestao_chamados_migrados_v1";
  let activeDialogTrigger = null;
  let usuarioAtual = null;
  let sincronizacaoChamadosAtual = null;
  let chamadoEmDetalhe = null;

  function lerJsonLocalStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.error(`Não foi possível ler ${key}:`, error);
      return fallback;
    }
  }

  function carregarNotificacoes() {
    const state = lerJsonLocalStorage(NOTIFICATIONS_KEY, {});
    return {
      items: Array.isArray(state.items) ? state.items : [],
      selectedId: state.selectedId || null,
      alertProductIds: Array.isArray(state.alertProductIds) ? state.alertProductIds : [],
      removedProductIds: Array.isArray(state.removedProductIds) ? state.removedProductIds : [],
      activeProducts: state.activeProducts && typeof state.activeProducts === "object"
        ? state.activeProducts
        : {},
      seenCalls: Array.isArray(state.seenCalls) ? state.seenCalls : [],
    };
  }

  function salvarNotificacoes(state) {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Não foi possível salvar as notificações:", error);
    }
  }

  function exibirErroNotificacoes(mensagem) {
    notificationsError.textContent = mensagem;
    notificationsError.classList.remove("hidden");
  }

  function limparErroNotificacoes() {
    notificationsError.textContent = "";
    notificationsError.classList.add("hidden");
  }

  function idFuncionarioAtual() {
    const funcionario = usuarioAtual ||
      lerJsonLocalStorage("docegestao_funcionario", {});
    return String(funcionario?.id_funcionario || "");
  }

  function usuarioResponsavelPeloChamado(chamado) {
    return Boolean(
      chamado?.id_responsavel &&
      String(chamado.id_responsavel) === idFuncionarioAtual(),
    );
  }

  function atualizarBannerChamado(chamados) {
    const chamadoAtivo = chamados.find(
      (chamado) =>
        chamado.tipo === "chamado" &&
        chamado.status === "em_resolucao" &&
        usuarioResponsavelPeloChamado(chamado),
    );
    activeCallBanner.classList.toggle("hidden", !chamadoAtivo);
    activeCallBanner.classList.toggle("flex", Boolean(chamadoAtivo));
    if (chamadoAtivo) {
      activeCallText.textContent = `#${chamadoAtivo.callId}: ${chamadoAtivo.mensagem}`;
      activeCallClose.dataset.callId = chamadoAtivo.callId;
    } else {
      delete activeCallClose.dataset.callId;
    }
  }

  function atualizarCacheChamado(chamado, concluido = false) {
    const chamados = lerJsonLocalStorage("docegestao_chamados", []);
    const atuais = Array.isArray(chamados) ? chamados : [];
    const atualizados = concluido
      ? atuais.filter((item) => String(item.id) !== String(chamado.id))
      : [
          ...atuais.filter((item) => String(item.id) !== String(chamado.id)),
          chamado,
        ];
    try {
      localStorage.setItem("docegestao_chamados", JSON.stringify(atualizados));
    } catch (error) {
      console.error("Não foi possível atualizar o cache dos chamados:", error);
    }
    atualizarNotificacoes();
  }

  function fecharDetalhesChamado() {
    callDetailsDialog.classList.add("hidden");
    callDetailsDialog.classList.remove("flex");
    chamadoEmDetalhe = null;
  }

  function abrirDetalhesChamado(chamado) {
    fecharDialogo(notificationsDialog, notificationsTrigger);
    chamadoEmDetalhe = chamado;
    callDetailsStatus.textContent = chamado.status === "em_resolucao"
      ? `Em resolução${chamado.responsavelNome ? ` por ${chamado.responsavelNome}` : ""}`
      : "Chamado aberto";
    callDetailsDescription.textContent = chamado.mensagem;
    const criadoEm = chamado.criadaEm
      ? new Date(chamado.criadaEm).toLocaleString("pt-BR")
      : "Data não informada";
    callDetailsMetadata.textContent =
      `Aberto por ${chamado.solicitanteNome || "Funcionário"} em ${criadoEm}.`;
    callDetailsError.textContent = "";
    callDetailsError.classList.add("hidden");

    const responsavel = usuarioResponsavelPeloChamado(chamado);
    const emResolucao = chamado.status === "em_resolucao";
    callDetailsAction.textContent = responsavel
      ? "Fechar chamado"
      : emResolucao
        ? "Em resolução"
        : "Resolver chamado";
    callDetailsAction.disabled = emResolucao && !responsavel;
    callDetailsAction.dataset.action = responsavel ? "concluir" : "assumir";
    callDetailsDialog.classList.remove("hidden");
    callDetailsDialog.classList.add("flex");
    window.lucide?.createIcons();
  }

  async function executarAcaoChamado(chamado, acao) {
    const callId = String(chamado.callId || chamado.id || "").replace(/^chamado:/, "");
    if (!/^\d+$/.test(callId)) {
      throw new Error("Não foi possível identificar o chamado. Atualize as notificações e tente novamente.");
    }
    const token = localStorage.getItem("docegestao_token");
    if (!token) throw new Error("Sua sessão expirou. Entre novamente para continuar.");

    const response = await fetch(`/api/chamados/${encodeURIComponent(callId)}/${acao}`, {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token },
    });
    const result = await lerRespostaChamados(
      response,
      acao === "assumir"
        ? "Não foi possível assumir o chamado."
        : "Não foi possível concluir o chamado.",
    );
    const atualizado = {
      ...result.dados,
      id: String(result.dados.id),
      callId: String(result.dados.id),
    };

    if (acao === "concluir") {
      const state = carregarNotificacoes();
      state.items = state.items.filter(
        (item) => item.id !== `chamado:${callId}`,
      );
      if (state.selectedId === `chamado:${callId}`) state.selectedId = null;
      salvarNotificacoes(state);
      atualizarCacheChamado(atualizado, true);
      fecharDetalhesChamado();
      limparErroNotificacoes();
    } else {
      atualizarCacheChamado(atualizado);
      const state = carregarNotificacoes();
      const item = state.items.find((entry) => entry.id === `chamado:${callId}`);
      if (item) {
        Object.assign(item, {
          status: atualizado.status,
          id_responsavel: atualizado.id_responsavel,
          responsavelNome: atualizado.responsavelNome,
        });
        salvarNotificacoes(state);
        chamadoEmDetalhe = item;
        atualizarBannerChamado(state.items);
        renderizarNotificacoes(state);
      }
    }
    document.dispatchEvent(new Event("docegestao:chamados-atualizados"));
    return atualizado;
  }

  async function lerRespostaChamados(response, mensagemPadrao) {
    const body = await response.text();
    let result;
    try {
      result = JSON.parse(body);
    } catch {
      if (body.trimStart().startsWith("<")) {
        throw new Error(
          "O servidor ainda não carregou a API de chamados. Reinicie o backend e tente novamente.",
        );
      }
      throw new Error(mensagemPadrao);
    }

    if (!response.ok) {
      throw new Error(result.mensagem || mensagemPadrao);
    }
    return result;
  }

  function obterPreferencias() {
    const preferences = lerJsonLocalStorage(PREFERENCES_KEY, {});
    return {
      all: Boolean(preferences.all),
      calls: Boolean(preferences.calls),
      products: Boolean(preferences.products),
    };
  }

  function obterPerfilSalvo() {
    const profile = lerJsonLocalStorage(PROFILE_KEY, {});
    const userId = String(usuarioAtual?.id_funcionario || usuarioAtual?.email || "");
    return profile.userId === userId ? profile : {};
  }

  function salvarPerfilSalvo(profile) {
    const userId = String(usuarioAtual?.id_funcionario || usuarioAtual?.email || "");
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, userId }));
      return true;
    } catch (error) {
      console.error("Não foi possível salvar as informações do perfil:", error);
      settingsProfileFeedback.textContent = "Não foi possível salvar. A foto pode ser muito grande.";
      settingsProfileFeedback.className = "min-h-5 text-xs text-red-600";
      return false;
    }
  }

  function exibirAvisoPerfil(mensagem, tipo = "success") {
    const aviso = document.createElement("div");
    aviso.className = tipo === "error"
      ? "fixed left-1/2 top-20 z-[120] -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800 shadow-xl"
      : "fixed left-1/2 top-20 z-[120] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-xl";
    aviso.setAttribute("role", tipo === "error" ? "alert" : "status");
    aviso.setAttribute("aria-live", tipo === "error" ? "assertive" : "polite");
    aviso.textContent = mensagem;
    document.body.appendChild(aviso);
    window.setTimeout(() => aviso.remove(), 4500);
  }

  function notificarPerfilAtualizado() {
    window.dispatchEvent(new CustomEvent("docegestao:perfil-atualizado", {
      detail: { funcionario: usuarioAtual },
    }));
  }

  function aplicarPreferenciasNotificacao() {
    const preferences = obterPreferencias();
    const allToggle = container.querySelector('[data-notification-preference="all"]');
    const callsToggle = container.querySelector('[data-notification-preference="calls"]');
    const productsToggle = container.querySelector('[data-notification-preference="products"]');
    allToggle.checked = preferences.all;
    callsToggle.checked = preferences.calls;
    productsToggle.checked = preferences.products;
    callsToggle.disabled = preferences.all;
    productsToggle.disabled = preferences.all;
    callsToggle.closest("label").classList.toggle("opacity-50", preferences.all);
    productsToggle.closest("label").classList.toggle("opacity-50", preferences.all);
  }

  function aplicarTema(escuro) {
    document.documentElement.dataset.theme = escuro ? "dark" : "light";
    settingsThemeToggle.setAttribute("aria-pressed", String(escuro));
    settingsThemeToggle.setAttribute(
      "aria-label",
      escuro ? "Desativar modo escuro" : "Ativar modo escuro",
    );
    settingsThemeToggle.querySelector("[data-lucide]").dataset.lucide = escuro ? "moon" : "sun";
    try {
      localStorage.setItem(THEME_KEY, escuro ? "dark" : "light");
    } catch (error) {
      console.error("Não foi possível salvar o tema:", error);
    }
    window.lucide?.createIcons();
  }

  function preencherPerfil() {
    const user = usuarioAtual || {};
    const profile = obterPerfilSalvo();
    settingsProfileForm.elements.namedItem("nome").value = profile.nome || user.nome || "";
    settingsProfileForm.elements.namedItem("idade").value = profile.idade || "";
    settingsProfileForm.elements.namedItem("email").value = profile.email || user.email || "";
    const avatar = user.foto || profile.foto;
    settingsProfileAvatar.src = avatar || avatarPadraoConfiguracoes;
  }

  function abrirAbaConfiguracao(tabName) {
    container.querySelector(`[data-settings-tab="${tabName}"]`)?.click();
  }

  function salvarPreferenciaNotificacao(event) {
    const preferences = obterPreferencias();
    preferences[event.target.dataset.notificationPreference] = event.target.checked;
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Não foi possível salvar as preferências de notificação:", error);
    }
    aplicarPreferenciasNotificacao();
    renderizarNotificacoes(carregarNotificacoes());
  }

  async function prepararFotoPerfil(file) {
    if (!file) return null;
    if (!file.type.startsWith("image/")) {
      throw new Error("Escolha um arquivo de imagem.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 5 MB.");
    }

    const image = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 512 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.82);
    } finally {
      image.close();
    }
  }

  function configurarAbas() {
    const tabs = [...container.querySelectorAll("[data-settings-tab]")];
    const panels = [...container.querySelectorAll("[data-settings-panel]")];
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const selectedTab = tab.dataset.settingsTab;
        tabs.forEach((entry) => {
          const selected = entry === tab;
          entry.setAttribute("aria-selected", String(selected));
          entry.className = selected
            ? "flex w-full items-center gap-3 rounded-lg bg-[#F5ECE5] px-3 py-2.5 text-left text-sm font-semibold text-[#784E38]"
            : "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100";
        });
        panels.forEach((panel) => {
          panel.classList.toggle("hidden", panel.dataset.settingsPanel !== selectedTab);
        });
      });
    });
  }

  function criarNotificacao(state, id, tipo, titulo, mensagem, pagina) {
    state.items.push({
      id,
      tipo,
      titulo,
      mensagem,
      pagina,
      produtoStateId: tipo === "chamado" ? null : id.replace(/^produto:/, ""),
      criadaEm: new Date().toISOString(),
      lida: false,
    });
  }

  function slugProduto(nome) {
    return String(nome || "produto")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "produto";
  }

  function registrarProdutoRemovido(event) {
    const id = String(event.detail?.id || "");
    const name = String(event.detail?.nome || "");
    const removedIds = [id, name ? slugProduto(name) : ""].filter(Boolean);
    const state = carregarNotificacoes();
    state.removedProductIds = [...new Set([...state.removedProductIds, ...removedIds])];
    state.items = state.items.filter((item) =>
      item.tipo === "chamado" ||
      !removedIds.some((removedId) =>
        item.produtoStateId?.startsWith(`${removedId}:`),
      ),
    );
    if (!state.items.some((item) => item.id === state.selectedId)) state.selectedId = null;
    salvarNotificacoes(state);
    atualizarNotificacoes();
  }

  function renderizarNotificacoes(state) {
    const preferences = obterPreferencias();
    const visibleItems = state.items.filter((item) => {
      if (preferences.all) return false;
      if (item.tipo === "chamado" && preferences.calls) return false;
      if (["esgotado", "critico", "prox-estoque", "vencido", "prox-vencimento", "medio"].includes(item.tipo) && preferences.products) return false;
      return true;
    });
    atualizarBannerChamado(state.items);
    notificationCount.textContent = String(visibleItems.length);
    notificationCount.classList.toggle("hidden", visibleItems.length === 0);
    const selectedItem = visibleItems.find((item) =>
      item.id === state.selectedId && item.tipo === "chamado",
    );
    if (!selectedItem && state.selectedId) {
      state.selectedId = null;
      salvarNotificacoes(state);
    }
    const selectedCallCanClose =
      selectedItem?.status === "em_resolucao" &&
      usuarioResponsavelPeloChamado(selectedItem);
    closeSelectedNotification.textContent = "Fechar chamado";
    closeSelectedNotification.disabled = !selectedCallCanClose;
    closeSelectedNotification.classList.toggle("shadow-md", selectedCallCanClose);
    closeSelectedNotification.classList.toggle("brightness-110", selectedCallCanClose);
    notificationsList.replaceChildren();

    const stockNotificationCount = state.items.filter((item) =>
      item.tipo !== "chamado",
    ).length;
    const stockNotificationSummary = document.createElement("p");
    stockNotificationSummary.className = "text-xs font-semibold text-gray-600";
    stockNotificationSummary.setAttribute("role", "status");
    stockNotificationSummary.textContent =
      `Alertas de estoque ativos: ${stockNotificationCount}`;
    notificationsList.appendChild(stockNotificationSummary);

    if (visibleItems.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "flex min-h-64 flex-col items-center justify-center text-center";
      emptyState.innerHTML = `
        <span class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5ECE5] text-[#875C46]">
          <i data-lucide="bell-ring" class="h-7 w-7"></i>
        </span>
        <h3 class="text-sm font-bold text-gray-800">Você está atualizado!</h3>
        <p class="mt-1 text-xs text-gray-500">Você não tem novas notificações</p>
      `;
      notificationsList.appendChild(emptyState);
      window.lucide?.createIcons();
      return;
    }

    [...visibleItems].sort((first, second) => {
      if (first.tipo === "chamado" && second.tipo !== "chamado") return -1;
      if (first.tipo !== "chamado" && second.tipo === "chamado") return 1;
      const urgencia = (item) =>
        window.estoqueClassificacao.obterAlerta(item.tipo)?.prioridade || 0;
      const diferencaUrgencia = urgencia(second) - urgencia(first);
      if (diferencaUrgencia !== 0) return diferencaUrgencia;
      return new Date(second.criadaEm) - new Date(first.criadaEm);
    }).forEach((item) => {
      const card = document.createElement("article");
      const selectable = item.tipo === "chamado";
      const selected = selectable && item.id === state.selectedId;
      card.tabIndex = selectable ? 0 : -1;
      card.setAttribute("role", selectable ? "group" : "button");
      card.setAttribute(
        "aria-label",
        `${selectable ? "Ver detalhes do chamado" : "Localizar alerta"}: ${item.titulo}`,
      );
      const alertaEstoque = window.estoqueClassificacao.obterAlerta(item.tipo);
      card.className = `cursor-pointer rounded-xl border-0 bg-white p-4 transition-all duration-200 ease-out hover:shadow-md focus:outline-none ${selected ? "shadow-md" : ""} ${item.lida ? "opacity-80" : ""}`;
      card.style.backgroundColor = "#ffffff";
      if (alertaEstoque) {
        card.style.borderLeft = `4px solid ${alertaEstoque.cor}`;
      } else if (item.tipo === "chamado") {
        card.style.borderLeft = `4px solid ${item.status === "em_resolucao" ? "#d97706" : "#0ea5e9"}`;
      }
      if (selected) {
        card.style.transform = "translateY(-5px)";
        card.style.boxShadow = "0 8px 18px rgba(58, 42, 26, 0.22)";
      }
      const ativarNotificacao = () => {
        if (selectable) {
          const currentState = carregarNotificacoes();
          const notification = currentState.items.find((entry) => entry.id === item.id);
          if (!notification) return;
          currentState.selectedId = item.id;
          notification.lida = true;
          salvarNotificacoes(currentState);
          renderizarNotificacoes(currentState);
          abrirDetalhesChamado(notification);
          return;
        }

        const productStateId = String(item.produtoStateId || "");
        const separatorIndex = productStateId.lastIndexOf(":");
        if (separatorIndex < 1) return;
        const produtoId = productStateId.slice(0, separatorIndex);
        const status = productStateId.slice(separatorIndex + 1);
        fecharDialogo(notificationsDialog, notificationsTrigger);
        if (typeof window.navegarDemo === "function") {
          window.navegarDemo("alertas", { localizar: produtoId, status });
        } else {
          const destination = new URL("./painel.html", window.location.href);
          destination.searchParams.set("pagina", "alertas");
          destination.searchParams.set("localizar", produtoId);
          destination.searchParams.set("status", status);
          window.location.assign(destination);
        }
      };
      card.addEventListener("click", ativarNotificacao);
      card.addEventListener("keydown", (event) => {
        if (!["Enter", " "].includes(event.key)) return;
        if (event.target !== card) return;
        event.preventDefault();
        ativarNotificacao();
      });

      const title = document.createElement("h3");
      title.className = "text-sm font-semibold text-gray-800";
      title.textContent = item.tipo === "chamado" && item.status === "em_resolucao"
        ? "Chamado em resolução"
        : item.titulo;
      const message = document.createElement("p");
      message.className = "mt-1 text-xs leading-5 text-gray-600";
      const previewLimit = 70;
      message.textContent = selected || item.mensagem.length <= previewLimit
        ? item.mensagem
        : `${item.mensagem.slice(0, previewLimit).trimEnd()}...`;
      if (!selected) {
        message.style.display = "-webkit-box";
        message.style.webkitBoxOrient = "vertical";
        message.style.webkitLineClamp = "2";
        message.style.overflow = "hidden";
      } else {
        message.classList.add("whitespace-pre-wrap");
      }
      message.style.overflowWrap = "anywhere";
      const date = document.createElement("p");
      date.className = "mt-2 text-[11px] text-gray-400";
      date.textContent = new Date(item.criadaEm).toLocaleString("pt-BR");
      card.append(title, message, date);
      if (item.tipo === "chamado" && item.status === "em_resolucao") {
        const owner = document.createElement("p");
        owner.className = "mt-2 text-[11px] font-medium text-amber-700";
        owner.textContent = `Em resolução por ${item.responsavelNome || "um funcionário"}`;
        card.appendChild(owner);
      }
      if (
        item.tipo === "chamado" &&
        item.status === "em_resolucao" &&
        usuarioResponsavelPeloChamado(item)
      ) {
        const closeCallButton = document.createElement("button");
        closeCallButton.type = "button";
        closeCallButton.className = "mt-3 rounded-lg bg-[#784E38] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#633e2c]";
        closeCallButton.textContent = "Fechar chamado";
        closeCallButton.addEventListener("click", async (event) => {
          event.stopPropagation();
          closeCallButton.disabled = true;
          try {
            await executarAcaoChamado(item, "concluir");
          } catch (error) {
            console.error("Não foi possível concluir o chamado:", error);
            exibirErroNotificacoes(error.message || "Não foi possível concluir o chamado.");
            closeCallButton.disabled = false;
          }
        });
        card.appendChild(closeCallButton);
      }

      notificationsList.appendChild(card);
    });
    window.lucide?.createIcons();
  }

  function atualizarNotificacoes() {
    const state = carregarNotificacoes();
    let inventory = lerJsonLocalStorage("docegestao_estoque_v1", {});
    const activeProducts = {};
    const chamadas = state.items.filter((item) => item.tipo === "chamado");
    const notificacoesExistentes = new Map();
    state.items
      .filter((item) => item.tipo !== "chamado")
      .forEach((item) => {
        const estadoAnterior = String(item.produtoStateId || "");
        const separador = estadoAnterior.lastIndexOf(":");
        const id = String(
          item.produtoId ||
            (separador > 0
              ? estadoAnterior.slice(0, separador)
              : String(item.id || "").replace(/^produto:/, "").split(":")[0]),
        );
        if (id && !notificacoesExistentes.has(id)) {
          notificacoesExistentes.set(id, item);
        }
      });

    const notificacoesProdutos = [];
    Object.entries(inventory).forEach(([key, product]) => {
      if (!product || typeof product !== "object") return;
      const id = String(product.id || key);
      const classificacao = window.estoqueClassificacao.classificar(product);
      const status = classificacao.status;
      if (!status) return;

      const estadoId = `${id}:${status}`;
      const estadosAtivos = classificacao.estados;
      const alerta = window.estoqueClassificacao.obterAlerta(status);
      const mensagem = estadosAtivos
        .map((estado) =>
          window.estoqueClassificacao.obterMensagem(
            product,
            estado,
            classificacao.diasValidade,
          ),
        )
        .filter(Boolean)
        .join(" ");
      activeProducts[estadoId] = true;

      const anterior = notificacoesExistentes.get(id);
      const notification = anterior || {
        id: `produto:${id}`,
        criadaEm: new Date().toISOString(),
        lida: false,
      };
      if (anterior && anterior.tipo !== status) notification.lida = false;
      Object.assign(notification, {
        id: `produto:${id}`,
        tipo: status,
        titulo: alerta.titulo,
        mensagem,
        pagina: "alertas",
        produtoId: id,
        produtoStateId: estadoId,
      });
      notificacoesProdutos.push(notification);
    });

    state.activeProducts = activeProducts;
    state.items = [...notificacoesProdutos, ...chamadas];
    try {
      localStorage.setItem("docegestao_estoque_v1", JSON.stringify(inventory));
    } catch (error) {
      console.error("Não foi possível sincronizar os alertas com o estoque:", error);
    }

    const calls = lerJsonLocalStorage("docegestao_chamados", []);
    const activeCalls = new Map();
    if (Array.isArray(calls)) {
      calls.forEach((call, index) => {
        if (!call || typeof call !== "object") return;
        if (call.status === "concluido") return;
        const callId = String(
          call.id || `${call.criadoEm || "chamado"}:${index}:${call.descricao || ""}`,
        );
        activeCalls.set(callId, call);
      });
    }
    state.items = state.items.filter((item) => {
      if (item.tipo !== "chamado") return true;
      const callId = String(item.callId || item.id || "").replace(/^chamado:/, "");
      return activeCalls.has(callId);
    });
    activeCalls.forEach((call, callId) => {
      const notificationId = `chamado:${callId}`;
      let notification = state.items.find((item) => item.id === notificationId);
      if (!notification) {
        criarNotificacao(
          state,
          notificationId,
          "chamado",
          "Novo chamado aberto",
          String(call.descricao || "Um novo chamado foi registrado na administração."),
          "admin",
        );
        notification = state.items[state.items.length - 1];
      }
      notification.callId = callId;
      notification.mensagem = String(call.descricao || "Um novo chamado foi registrado na administração.");
      notification.criadaEm = call.criadoEm || notification.criadaEm;
      notification.status = call.status || "aberto";
      notification.id_responsavel = call.id_responsavel || null;
      notification.responsavelNome = call.responsavelNome || null;
      notification.solicitanteNome = call.solicitanteNome || null;
      notification.titulo = notification.status === "em_resolucao"
        ? "Chamado em resolução"
        : "Novo chamado aberto";
    });

    salvarNotificacoes(state);
    renderizarNotificacoes(state);
  }

  async function sincronizarEstoqueNotificacoes() {
    const token = localStorage.getItem("docegestao_token");
    if (!token) return;

    try {
      const response = await fetch("/api/produtos", {
        headers: { Authorization: "Bearer " + token },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Não foi possível atualizar as notificações do estoque.");
      }

      const inventory = Object.fromEntries((result.dados || []).map((product) => {
        const id = String(product.id ?? product.id_produtos);
        return [id, {
          id,
          nome: String(product.nome || product.marca || "Insumo"),
          categoria: String(product.categoria || product.tipo || "Outros"),
          descricao: String(product.descricao || product.categoria || product.tipo || ""),
          unidade: String(product.unidade || "un"),
          quantidade: Number(product.quantidade) || 0,
          maximo: Number(product.maximo) || 1,
          chegada: product.chegada ? String(product.chegada).slice(0, 10) : "",
          validade: product.validade ? String(product.validade).slice(0, 10) : "",
          dismissed: false,
        }];
      }));
      localStorage.setItem("docegestao_estoque_v1", JSON.stringify(inventory));
      atualizarNotificacoes();
    } catch (error) {
      console.error("Não foi possível sincronizar os produtos para as notificações:", error);
    }
  }

  async function sincronizarChamadosNotificacoes() {
    if (sincronizacaoChamadosAtual) return sincronizacaoChamadosAtual;

    const token = localStorage.getItem("docegestao_token");
    if (!token) return;

    sincronizacaoChamadosAtual = (async () => {
      try {
        const headers = { Authorization: "Bearer " + token };
        const response = await fetch("/api/chamados", { headers });
        const result = await lerRespostaChamados(
          response,
          "Não foi possível carregar os chamados.",
        );
        const chamados = Array.isArray(result.dados) ? result.dados : [];
        const chamadosMigrados = lerJsonLocalStorage(MIGRATED_CALLS_KEY, {});
        const chamadosAntigos = lerJsonLocalStorage("docegestao_chamados", []);
        const chamadosParaMigrar = new Map();
        const novosChamados = [];

        (Array.isArray(chamadosAntigos) ? chamadosAntigos : []).forEach((chamado) => {
          if (chamado?.id) chamadosParaMigrar.set(String(chamado.id), chamado);
        });
        carregarNotificacoes().items
          .filter((item) => item.tipo === "chamado")
          .forEach((item) => {
            const id = String(item.callId || item.id || "").replace(/^chamado:/, "");
            if (id && !/^\d+$/.test(id) && !chamadosParaMigrar.has(id)) {
              chamadosParaMigrar.set(id, {
                id,
                descricao: item.mensagem,
                criadoEm: item.criadaEm,
              });
            }
          });

        for (const chamado of chamadosParaMigrar.values()) {
          const idAntigo = String(chamado?.id || "");
          if (!idAntigo || /^\d+$/.test(idAntigo) || chamadosMigrados[idAntigo]) continue;

          const migracaoResponse = await fetch("/api/chamados", {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ descricao: chamado.descricao }),
          });
          const migracao = await lerRespostaChamados(
            migracaoResponse,
            "Não foi possível migrar os chamados antigos.",
          );
          const idNovo = String(migracao.dados?.id || "");
          if (!/^\d+$/.test(idNovo)) {
            throw new Error("O servidor retornou um identificador inválido para o chamado.");
          }

          chamadosMigrados[idAntigo] = idNovo;
          localStorage.setItem(MIGRATED_CALLS_KEY, JSON.stringify(chamadosMigrados));
          novosChamados.push(migracao.dados);
        }

        const chamadosPorId = new Map(
          [...chamados, ...novosChamados].map((chamado) => [String(chamado.id), chamado]),
        );
        const chamadosAtualizados = [...chamadosPorId.values()];
        localStorage.setItem("docegestao_chamados", JSON.stringify(chamadosAtualizados));
        atualizarNotificacoes();
        limparErroNotificacoes();
        document.dispatchEvent(new Event("docegestao:chamados-sincronizados"));
      } catch (error) {
        console.error("Não foi possível sincronizar os chamados:", error);
        exibirErroNotificacoes(error.message || "Não foi possível carregar os chamados.");
      } finally {
        sincronizacaoChamadosAtual = null;
      }
    })();

    return sincronizacaoChamadosAtual;
  }

  function atualizarConta() {
    try {
      const user = JSON.parse(localStorage.getItem("docegestao_funcionario") || "null");
      usuarioAtual = user;
      const profile = obterPerfilSalvo();
      const userName = profile.nome || user?.nome || "Nenhuma conta conectada";
      const userEmail = profile.email || user?.email || "Entre para acessar sua conta";
      const userRole = user?.nome_cargo || (user ? "Conta conectada" : "");
      const avatar = user?.foto || profile.foto;

      container.querySelectorAll("[data-header-user-name], [data-header-menu-name]")
        .forEach((element) => {
          element.textContent = userName;
        });
      container.querySelectorAll("[data-header-user-role]")
        .forEach((element) => {
          element.textContent = userRole || "Acesse sua conta";
        });
      container.querySelectorAll("[data-header-menu-email]")
        .forEach((element) => {
          element.textContent = userEmail;
        });
      if (accountActionLabel) {
        accountActionLabel.textContent = "Sair";
      }
      fotoPerfil.src = avatar || avatarPadraoPerfil;
      fotoMenu.src = avatar || avatarPadraoMenu;
      settingsProfileAvatar.src = avatar || avatarPadraoConfiguracoes;
    } catch (error) {
      console.error("Não foi possível carregar os dados da conta:", error);
    }
  }

  async function sincronizarContaDaSessao() {
    const token = localStorage.getItem("docegestao_token");
    if (!token || typeof window.obterFuncionarioAutenticado !== "function") return;

    const user = await window.obterFuncionarioAutenticado();
    if (token !== localStorage.getItem("docegestao_token") || !user) return;

    usuarioAtual = user;
    atualizarConta();
    preencherPerfil();
  }

  async function atualizarVisibilidadePreferenciaChamados() {
    const preference = container.querySelector("[data-calls-notification-preference]");
    if (!preference) return;

    const user = await window.obterFuncionarioAutenticado?.();
    const role = String(user?.nome_cargo || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    preference.hidden = !role.includes("admin");
  }

  function fecharPerfil() {
    profileMenu.classList.add("hidden");
    profileTrigger.setAttribute("aria-expanded", "false");
  }

  function fecharConfirmacaoSaida() {
    logoutDialog.classList.add("hidden");
    logoutDialog.classList.remove("flex");
    profileTrigger.focus();
  }

  function sairDaConta() {
    fecharPerfil();
    logoutDialog.classList.add("hidden");
    logoutDialog.classList.remove("flex");
    localStorage.removeItem("docegestao_token");
    localStorage.removeItem("docegestao_funcionario");
    if (typeof window.navegarDemo === "function") {
      window.navegarDemo("login");
    } else {
      window.location.assign("./painel.html?pagina=login");
    }
  }

  function fecharDialogo(dialog, trigger) {
    dialog.classList.add("hidden");
    dialog.classList.remove("flex");
    trigger.setAttribute("aria-expanded", "false");
    if (activeDialogTrigger === trigger) {
      activeDialogTrigger = null;
      trigger.focus();
    }
  }

  function abrirDialogo(dialog, trigger) {
    fecharPerfil();
    fecharDialogo(notificationsDialog, notificationsTrigger);
    fecharDialogo(settingsDialog, settingsTrigger);
    activeDialogTrigger = trigger;
    dialog.classList.remove("hidden");
    dialog.classList.add("flex");
    trigger.setAttribute("aria-expanded", "true");
    dialog.querySelector("[role='dialog'] button")?.focus();
  }

  notificationsTrigger.addEventListener("click", () => {
    atualizarNotificacoes();
    abrirDialogo(notificationsDialog, notificationsTrigger);
  });
  settingsTrigger.addEventListener("click", () => {
    preencherPerfil();
    abrirDialogo(settingsDialog, settingsTrigger);
    abrirAbaConfiguracao("page");
  });
  profileTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const abrir = profileMenu.classList.contains("hidden");
    fecharPerfil();
    fecharDialogo(notificationsDialog, notificationsTrigger);
    fecharDialogo(settingsDialog, settingsTrigger);
    if (abrir) {
      profileMenu.classList.remove("hidden");
      profileTrigger.setAttribute("aria-expanded", "true");
    }
  });

  container.querySelectorAll("[data-close-header-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = container.querySelector(`#${button.dataset.closeHeaderDialog}`);
      const trigger = dialog === notificationsDialog ? notificationsTrigger : settingsTrigger;
      fecharDialogo(dialog, trigger);
    });
  });

  container.querySelectorAll("[data-open-header-settings]").forEach((button) => {
    button.addEventListener("click", () => {
      preencherPerfil();
      abrirDialogo(settingsDialog, settingsTrigger);
      abrirAbaConfiguracao("notifications");
    });
  });

  configurarAbas();
  aplicarPreferenciasNotificacao();
  container.querySelectorAll("[data-notification-preference]").forEach((toggle) => {
    toggle.addEventListener("change", salvarPreferenciaNotificacao);
  });

  settingsThemeToggle.addEventListener("click", () => {
    aplicarTema(document.documentElement.dataset.theme !== "dark");
  });

  settingsProfilePhoto.addEventListener("change", async () => {
    const file = settingsProfilePhoto.files?.[0];
    if (!file) return;
    settingsProfileFeedback.textContent = "Atualizando foto...";
    settingsProfileFeedback.className = "min-h-5 text-xs text-gray-500";
    try {
      const foto = await prepararFotoPerfil(file);
      const token = localStorage.getItem("docegestao_token");
      if (!token || !usuarioAtual?.id_funcionario) {
        throw new Error("Entre na sua conta para salvar a foto do perfil.");
      }

      const response = await fetch("/api/funcionarios/perfil/foto", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foto }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Não foi possível salvar a foto no sistema.");
      }

      usuarioAtual = { ...usuarioAtual, foto };
      try {
        localStorage.setItem("docegestao_funcionario", JSON.stringify(usuarioAtual));
      } catch (error) {
        console.error("Não foi possível atualizar a conta local:", error);
      }
      fotoPerfil.src = foto;
      fotoMenu.src = foto;
      settingsProfileAvatar.src = foto;
      notificarPerfilAtualizado();
      settingsProfileFeedback.textContent = "Foto de perfil atualizada e salva na sua conta.";
      settingsProfileFeedback.className = "inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800";
      exibirAvisoPerfil("Foto de perfil atualizada com sucesso.");
    } catch (error) {
      console.error("Não foi possível atualizar a foto do perfil:", error);
      settingsProfileFeedback.textContent = error.message || "Não foi possível carregar essa imagem.";
      settingsProfileFeedback.className = "inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800";
      exibirAvisoPerfil(settingsProfileFeedback.textContent, "error");
    } finally {
      settingsProfilePhoto.value = "";
    }
  });

  settingsProfileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(settingsProfileForm);
    const ageText = String(formData.get("idade") || "").trim();
    const age = ageText ? Number(ageText) : null;
    if (ageText && (!Number.isInteger(age) || age < 1 || age > 120)) {
      settingsProfileFeedback.textContent = "Informe uma idade entre 1 e 120 anos.";
      settingsProfileFeedback.className = "inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800";
      return;
    }

    const nome = String(formData.get("nome") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    if (!nome || !email) {
      settingsProfileFeedback.textContent = "Informe seu nome e e-mail.";
      settingsProfileFeedback.className = "inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800";
      return;
    }

    const profile = {
      ...obterPerfilSalvo(),
      nome,
      idade: age,
      email,
    };
    const token = localStorage.getItem("docegestao_token");
    const submitButton = settingsProfileForm.querySelector('button[type="submit"]');
    if (!token || !usuarioAtual?.id_funcionario) {
      settingsProfileFeedback.textContent = "Entre na sua conta para salvar as alterações.";
      settingsProfileFeedback.className = "inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800";
      return;
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Salvando...";
    }
    settingsProfileFeedback.textContent = "Salvando alterações...";
    settingsProfileFeedback.className = "inline-flex rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-600";
    try {
      const response = await fetch("/api/funcionarios/perfil", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Não foi possível salvar as alterações do perfil.");
      }

      usuarioAtual = { ...usuarioAtual, ...result.dados };
      localStorage.setItem("docegestao_funcionario", JSON.stringify(usuarioAtual));
      if (!salvarPerfilSalvo(profile)) return;
      atualizarConta();
      notificarPerfilAtualizado();
      settingsProfileFeedback.textContent = "Perfil atualizado e salvo na sua conta.";
      settingsProfileFeedback.className = "inline-flex rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800";
      exibirAvisoPerfil("Perfil atualizado com sucesso.");
    } catch (error) {
      console.error("Não foi possível atualizar o perfil:", error);
      settingsProfileFeedback.textContent = error.message || "Não foi possível salvar as alterações.";
      settingsProfileFeedback.className = "inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800";
      exibirAvisoPerfil(settingsProfileFeedback.textContent, "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Salvar alterações";
      }
    }
  });

  [notificationsDialog, settingsDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const trigger = dialog === notificationsDialog ? notificationsTrigger : settingsTrigger;
      fecharDialogo(dialog, trigger);
    });
  });

  document.addEventListener("click", (event) => {
    if (!container.querySelector("#header-profile-menu").parentElement.contains(event.target)) {
      fecharPerfil();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!callDetailsDialog.classList.contains("hidden")) {
      fecharDetalhesChamado();
    } else if (!notificationsDialog.classList.contains("hidden")) {
      fecharDialogo(notificationsDialog, notificationsTrigger);
    } else if (!settingsDialog.classList.contains("hidden")) {
      fecharDialogo(settingsDialog, settingsTrigger);
    } else {
      fecharPerfil();
    }
  });

  callDetailsDialog.addEventListener("click", (event) => {
    if (event.target === callDetailsDialog) fecharDetalhesChamado();
  });
  container.querySelector("#header-call-details-close").addEventListener(
    "click",
    fecharDetalhesChamado,
  );
  container.querySelector("#header-call-details-cancel").addEventListener(
    "click",
    fecharDetalhesChamado,
  );
  callDetailsAction.addEventListener("click", async () => {
    if (!chamadoEmDetalhe || callDetailsAction.disabled) return;
    const acao = callDetailsAction.dataset.action;
    callDetailsAction.disabled = true;
    callDetailsError.textContent = "";
    callDetailsError.classList.add("hidden");
    try {
      await executarAcaoChamado(chamadoEmDetalhe, acao);
      fecharDetalhesChamado();
    } catch (error) {
      console.error(`Não foi possível ${acao === "assumir" ? "assumir" : "concluir"} o chamado:`, error);
      callDetailsError.textContent = error.message || "Não foi possível atualizar o chamado.";
      callDetailsError.classList.remove("hidden");
    } finally {
      if (callDetailsDialog.isConnected && chamadoEmDetalhe) {
        callDetailsAction.disabled =
          chamadoEmDetalhe.status === "em_resolucao" &&
          !usuarioResponsavelPeloChamado(chamadoEmDetalhe);
      }
    }
  });

  let arrasteChamado = null;
  activeCallDragHandle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !activeCallBanner.classList.contains("flex")) return;
    const bounds = activeCallBanner.getBoundingClientRect();
    arrasteChamado = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
    };
    activeCallDragHandle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  activeCallDragHandle.addEventListener("pointermove", (event) => {
    if (!arrasteChamado || event.pointerId !== arrasteChamado.pointerId) return;
    const bounds = activeCallBanner.getBoundingClientRect();
    const left = Math.max(
      0,
      Math.min(window.innerWidth - bounds.width, event.clientX - arrasteChamado.offsetX),
    );
    const top = Math.max(
      0,
      Math.min(window.innerHeight - bounds.height, event.clientY - arrasteChamado.offsetY),
    );
    activeCallBanner.style.left = `${left}px`;
    activeCallBanner.style.top = `${top}px`;
    activeCallBanner.style.right = "auto";
    activeCallBanner.style.bottom = "auto";
    activeCallBanner.style.transform = "none";
  });
  const terminarArrasteChamado = (event) => {
    if (arrasteChamado?.pointerId !== event.pointerId) return;
    arrasteChamado = null;
  };
  activeCallDragHandle.addEventListener("pointerup", terminarArrasteChamado);
  activeCallDragHandle.addEventListener("pointercancel", terminarArrasteChamado);

  closeSelectedNotification.addEventListener("click", async () => {
    const state = carregarNotificacoes();
    const selectedItem = state.items.find((item) =>
      item.id === state.selectedId && item.tipo === "chamado",
    );
    if (!selectedItem || closeSelectedNotification.disabled) return;
    closeSelectedNotification.disabled = true;
    limparErroNotificacoes();
    try {
      await executarAcaoChamado(selectedItem, "concluir");
    } catch (error) {
      console.error("Não foi possível concluir o chamado:", error);
      exibirErroNotificacoes(error.message || "Não foi possível concluir o chamado.");
      closeSelectedNotification.disabled = false;
    }
  });
  activeCallClose.addEventListener("click", async () => {
    const callId = activeCallClose.dataset.callId;
    const chamado = carregarNotificacoes().items.find(
      (item) => item.tipo === "chamado" && item.callId === callId,
    );
    if (!chamado) return;
    activeCallClose.disabled = true;
    try {
      await executarAcaoChamado(chamado, "concluir");
    } catch (error) {
      console.error("Não foi possível concluir o chamado:", error);
      exibirErroNotificacoes(error.message || "Não foi possível concluir o chamado.");
    } finally {
      activeCallClose.disabled = false;
    }
  });

  accountAction.addEventListener("click", () => {
    fecharPerfil();
    if (!usuarioAtual) {
      sairDaConta();
      return;
    }
    logoutDialog.classList.remove("hidden");
    logoutDialog.classList.add("flex");
    confirmLogoutButton.focus();
  });
  cancelLogoutButton.addEventListener("click", fecharConfirmacaoSaida);
  confirmLogoutButton.addEventListener("click", sairDaConta);
  logoutDialog.addEventListener("click", (event) => {
    if (event.target === logoutDialog) fecharConfirmacaoSaida();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !logoutDialog.classList.contains("hidden")) {
      fecharConfirmacaoSaida();
    }
  });

  accountSettingsAction.addEventListener("click", () => {
    fecharPerfil();
    preencherPerfil();
    abrirDialogo(settingsDialog, settingsTrigger);
    abrirAbaConfiguracao("profile");
  });

  function atualizarFoto() {
    const foto = usuarioAtual?.foto || obterPerfilSalvo().foto;
    fotoPerfil.src = foto || avatarPadraoPerfil;
    fotoMenu.src = foto || avatarPadraoMenu;
    settingsProfileAvatar.src = foto || avatarPadraoConfiguracoes;
  }

  window.prepararPerfilDaConta = async () => {
    await sincronizarContaDaSessao();
    atualizarFoto();
    preencherPerfil();
    return usuarioAtual;
  };

  aplicarTema(localStorage.getItem(THEME_KEY) === "dark");
  atualizarConta();
  void sincronizarContaDaSessao();
  void atualizarVisibilidadePreferenciaChamados();
  atualizarFoto();
  preencherPerfil();
  atualizarNotificacoes();
  void sincronizarChamadosNotificacoes();
  document.addEventListener("demo:page-loaded", () => {
    const titulo = document.title.replace(/^DoceGestão\s*[|—-]\s*/i, "").trim();
    if (titulo) {
      container.querySelectorAll("[data-header-page-name]").forEach((element) => {
        element.textContent = titulo;
      });
    }
    atualizarConta();
    void sincronizarContaDaSessao();
    void atualizarVisibilidadePreferenciaChamados();
    atualizarNotificacoes();
    void sincronizarChamadosNotificacoes();
    preencherPerfil();
  });
  window.addEventListener("storage", () => {
    atualizarConta();
    void sincronizarContaDaSessao();
    atualizarFoto();
    atualizarNotificacoes();
  });
  document.addEventListener("docegestao:atualizar-notificacoes", atualizarNotificacoes);
  document.addEventListener("docegestao:chamados-atualizados", () => {
    void sincronizarChamadosNotificacoes();
  });
  window.setInterval(() => {
    if (!document.hidden) void sincronizarChamadosNotificacoes();
  }, 15000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) void sincronizarChamadosNotificacoes();
  });
  document.addEventListener("docegestao:produto-removido", registrarProdutoRemovido);
  void sincronizarEstoqueNotificacoes();

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarHeader, { once: true });
} else {
  carregarHeader();
}
