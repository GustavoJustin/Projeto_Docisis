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
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120"
              alt="Avatar da conta" class="h-9 w-9 rounded-full border border-[#D4A373] object-cover">
          </button>

          <div id="header-profile-menu" role="menu" aria-labelledby="header-profile-trigger"
            class="absolute right-0 top-full z-50 mt-2 hidden w-80 overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-800 shadow-2xl"
            style="max-width:min(20rem, calc(100vw - 2rem))">
            <div class="flex items-center gap-4 border-b border-gray-200 bg-[#F8F6F2] p-4">
              <img data-header-menu-avatar
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120"
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

    <div id="header-notifications-dialog" class="fixed inset-0 z-[60] hidden bg-black/20"
      role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="header-notifications-title"
        class="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden border-l border-[#E7DED5] bg-white text-[#4A3F39] shadow-2xl">
        <div class="flex items-center justify-between border-b border-gray-100 bg-[#F8F6F2] px-5 py-4">
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
        <div id="header-notifications-list" class="flex-1 space-y-3 overflow-y-auto p-5">
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
      <div id="header-notification-details" class="absolute inset-0 z-10 hidden items-center justify-center bg-black/40 p-4"
        role="presentation">
        <section role="dialog" aria-modal="true" aria-labelledby="header-notification-details-title"
          class="w-full max-w-md rounded-2xl border border-white/50 bg-white p-5 text-[#4A3F39] shadow-2xl">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 id="header-notification-details-title" class="text-base font-bold text-[#3A2A1A]">Detalhes da notificação</h2>
              <p id="header-notification-details-date" class="mt-1 text-[11px] text-gray-400"></p>
            </div>
            <button id="header-close-notification-details" type="button"
              class="shrink-0 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              aria-label="Fechar detalhes">
              <i data-lucide="x" class="h-4 w-4"></i>
            </button>
          </div>
          <p id="header-notification-details-message" class="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700"></p>
        </section>
      </div>
    </div>

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
                <label class="flex cursor-pointer items-center justify-between gap-4 py-4">
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
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120"
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
  html[data-theme="dark"] #header-notifications-dialog [role="dialog"],
  html[data-theme="dark"] #header-notification-details [role="dialog"] {
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
  const notificationDetails = container.querySelector("#header-notification-details");
  const notificationDetailsMessage = container.querySelector("#header-notification-details-message");
  const notificationDetailsDate = container.querySelector("#header-notification-details-date");
  const accountAction = container.querySelector("#header-account-action");
  const accountSettingsAction = container.querySelector("#header-account-settings");
  const accountActionLabel = container.querySelector("[data-header-account-action-label]");
  const closeSelectedNotification = container.querySelector("#header-close-selected-notification");
  const closeNotificationDetails = container.querySelector("#header-close-notification-details");
  const fotoPerfil = container.querySelector("[data-header-avatar]");
  const fotoMenu = container.querySelector("[data-header-menu-avatar]");
  const NOTIFICATIONS_KEY = "docegestao_notificacoes_v1";
  const PREFERENCES_KEY = "docegestao_preferencias_v1";
  const PROFILE_KEY = "docegestao_perfil_v1";
  const THEME_KEY = "docegestao_tema_v1";
  let activeDialogTrigger = null;
  let usuarioAtual = null;
  let selectedProfilePhoto = null;

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
    const avatar = profile.foto || localStorage.getItem("docegestao_foto_perfil");
    if (avatar) settingsProfileAvatar.src = avatar;
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

  function dataLocalISO(data) {
    return [
      data.getFullYear(),
      String(data.getMonth() + 1).padStart(2, "0"),
      String(data.getDate()).padStart(2, "0"),
    ].join("-");
  }

  function importarAlertasDaPagina(inventory, state) {
    const alertContainer = document.querySelector("#alertCardsContainer");
    if (!alertContainer) return inventory;

    const removedProductIds = new Set(state.removedProductIds);
    Object.values(inventory).forEach((product) => {
      if (product?.nome) removedProductIds.delete(slugProduto(product.nome));
    });
    state.removedProductIds = [...removedProductIds];

    const pageProductIds = [];
    alertContainer.querySelectorAll(".alert-card").forEach((card) => {
      const category = card.dataset.category;
      if (!["vencido", "critico", "prox-vencimento"].includes(category)) return;
      const name = card.querySelector(".item-title")?.textContent.trim();
      if (!name) return;

      const id = String(card.dataset.id || slugProduto(name));
      if (removedProductIds.has(id) || removedProductIds.has(slugProduto(name))) return;
      const existing = inventory[id];
      pageProductIds.push(id);

      const quantity = Number(card.dataset.quantidade);
      if (!Number.isFinite(quantity)) return;
      const product = {
        ...existing,
        id,
        nome: name,
        categoria: category === "prox-vencimento" && existing?.categoria === "Estoque crítico"
          ? "Próximo ao vencimento"
          : existing?.categoria || (
          category === "vencido"
            ? "Vencido"
            : category === "prox-vencimento"
              ? "Próximo ao vencimento"
              : "Estoque crítico"
          ),
        unidade: (existing?.unidade && !(category === "prox-vencimento" && existing.unidade === "un"))
          || card.textContent.match(/\bkg\b|\blitros?\b|\bunidades?|\bbandejas?\b/i)?.[0]
          || "un",
        quantidade: existing?.quantidade ?? quantity,
        maximo: existing?.maximo ?? quantity,
        validade: existing?.validade || "",
        imagem: existing?.imagem || card.querySelector("img")?.src || "",
      };

      if (["vencido", "prox-vencimento"].includes(category) && !product.validade) {
        const dateFromData = card.dataset.vencimento;
        const dateFromText = card.textContent.match(/(?:Venceu em|Vencimento(?: em)?|Validade(?: expira em)?)\s*:?\s*(\d{2})\/(\d{2})\/(\d{4})/i);
        const validDataDate = /^\d{4}-\d{2}-\d{2}$/.test(dateFromData || "") ? dateFromData : "";
        const parsedTextDate = dateFromText
          ? `${dateFromText[3]}-${dateFromText[2]}-${dateFromText[1]}`
          : "";
        if (category === "vencido") {
          product.validade = validDataDate || parsedTextDate;
        } else {
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          const dateFromTextDays = card.textContent.match(/(?:em\s*)?(\d+)\s*dias?/i);
          if (validDataDate && validDataDate >= dataLocalISO(todayDate)) {
            product.validade = validDataDate;
          } else if (dateFromTextDays) {
            todayDate.setDate(todayDate.getDate() + Number(dateFromTextDays[1]));
            product.validade = dataLocalISO(todayDate);
          } else if (/\bhoje\b/i.test(card.textContent)) {
            product.validade = dataLocalISO(todayDate);
          } else if (parsedTextDate && parsedTextDate >= dataLocalISO(todayDate)) {
            product.validade = parsedTextDate;
          }
        }
      }

      if (category === "critico" && !Number(existing?.maximo)) {
        const percentages = [...card.textContent.matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)];
        const percentage = percentages[percentages.length - 1];
        const fraction = percentage ? Number(percentage[1].replace(",", ".")) / 100 : 0.25;
        product.maximo = fraction > 0 ? Math.round((quantity / fraction) * 100) / 100 : quantity;
      }
      inventory[id] = product;
    });
    state.alertProductIds = pageProductIds;
    return inventory;
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
      if (["esgotado", "critico", "vencido", "prox-vencimento"].includes(item.tipo) && preferences.products) return false;
      return true;
    });
    notificationCount.textContent = String(visibleItems.length);
    notificationCount.classList.toggle("hidden", visibleItems.length === 0);
    const selectedItem = visibleItems.find((item) =>
      item.id === state.selectedId && item.tipo === "chamado",
    );
    if (!selectedItem && state.selectedId) {
      state.selectedId = null;
      salvarNotificacoes(state);
    }
    closeSelectedNotification.disabled = !selectedItem;
    closeSelectedNotification.classList.toggle("shadow-md", Boolean(selectedItem));
    closeSelectedNotification.classList.toggle("brightness-110", Boolean(selectedItem));
    notificationsList.replaceChildren();

    if (visibleItems.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "flex h-full min-h-64 flex-col items-center justify-center text-center";
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
      return new Date(second.criadaEm) - new Date(first.criadaEm);
    }).forEach((item) => {
      const card = document.createElement("article");
      const selectable = item.tipo === "chamado";
      const selected = selectable && item.id === state.selectedId;
      card.tabIndex = selectable ? 0 : -1;
      if (selectable) {
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Selecionar notificação: ${item.titulo}`);
        card.setAttribute("aria-pressed", String(selected));
      }
      const severityClass = item.tipo === "vencido"
        ? "border-red-300 bg-red-50"
        : item.tipo === "prox-vencimento"
          ? "border-rose-300 bg-rose-50"
        : item.tipo === "critico" || item.tipo === "esgotado"
          ? "border-amber-300 bg-amber-50"
          : item.tipo === "chamado"
            ? "border-sky-200 bg-sky-50"
            : "border-[#E9D9CC] bg-[#F8F6F2]";
      const accentClass = item.tipo === "vencido"
        ? "border-l-4"
        : item.tipo === "prox-vencimento"
          ? "border-l-4"
        : item.tipo === "critico" || item.tipo === "esgotado"
          ? "border-l-4"
          : item.tipo === "chamado"
            ? "border-l-4"
            : "";
      const accentColor = item.tipo === "vencido"
        ? "#ef4444"
        : item.tipo === "prox-vencimento"
          ? "#f43f5e"
          : item.tipo === "critico" || item.tipo === "esgotado"
            ? "#f59e0b"
            : item.tipo === "chamado"
              ? "#0ea5e9"
              : "";
      card.className = `rounded-xl border p-4 transition-all duration-200 ease-out ${selectable ? "cursor-pointer focus-visible:outline-none" : ""} ${selected ? "-translate-y-1 shadow-md" : ""} ${accentClass} ${severityClass} ${item.lida ? "opacity-80" : ""}`;
      if (selected) {
        card.style.transform = "translateY(-5px)";
        card.style.boxShadow = "0 8px 18px rgba(58, 42, 26, 0.22)";
      }
      if (accentColor) card.style.borderLeftColor = accentColor;
      if (selectable) {
        const selecionarNotificacao = () => {
          const currentState = carregarNotificacoes();
          currentState.selectedId = item.id;
          salvarNotificacoes(currentState);
          renderizarNotificacoes(currentState);
        };
        card.addEventListener("click", (event) => {
          if (!event.target.closest("button")) selecionarNotificacao();
        });
        card.addEventListener("keydown", (event) => {
          if (event.target !== card || !["Enter", " "].includes(event.key)) return;
          event.preventDefault();
          selecionarNotificacao();
        });
      }

      const title = document.createElement("h3");
      title.className = "text-sm font-semibold text-gray-800";
      title.textContent = item.titulo;
      const message = document.createElement("p");
      message.className = "mt-1 text-xs leading-5 text-gray-600";
      const previewLimit = 70;
      message.textContent = item.mensagem.length > previewLimit
        ? `${item.mensagem.slice(0, previewLimit).trimEnd()}...`
        : item.mensagem;
      message.style.display = "-webkit-box";
      message.style.webkitBoxOrient = "vertical";
      message.style.webkitLineClamp = "2";
      message.style.overflow = "hidden";
      message.style.overflowWrap = "anywhere";
      const date = document.createElement("p");
      date.className = "mt-2 text-[11px] text-gray-400";
      date.textContent = new Date(item.criadaEm).toLocaleString("pt-BR");
      card.append(title, message, date);

      if (item.tipo === "chamado") {
        const viewDetails = document.createElement("button");
        viewDetails.type = "button";
        viewDetails.className = "mt-3 text-xs font-semibold text-[#784E38] hover:underline";
        viewDetails.textContent = "Ver notificação";
        viewDetails.addEventListener("click", () => {
          const currentState = carregarNotificacoes();
          const notification = currentState.items.find((entry) => entry.id === item.id);
          if (!notification) return;
          notification.lida = true;
          salvarNotificacoes(currentState);
          renderizarNotificacoes(currentState);
          notificationDetailsMessage.textContent = notification.mensagem;
          notificationDetailsDate.textContent = new Date(notification.criadaEm).toLocaleString("pt-BR");
          notificationDetails.classList.remove("hidden");
          notificationDetails.classList.add("flex");
        });
        card.appendChild(viewDetails);
      }

      notificationsList.appendChild(card);
    });
    window.lucide?.createIcons();
  }

  function atualizarNotificacoes() {
    const state = carregarNotificacoes();
    let inventory = lerJsonLocalStorage("docegestao_estoque_v1", {});
    inventory = importarAlertasDaPagina(inventory, state);
    const activeProducts = {};
    const today = new Date();
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    Object.entries(inventory).forEach(([key, product]) => {
      if (!product || typeof product !== "object") return;
      const id = String(product.id || key);
      const name = String(product.nome || "Produto");
      const quantity = Number(product.quantidade);
      const maximo = Number(product.maximo);
      const validExpiry = /^\d{4}-\d{2}-\d{2}$/.test(product.validade || "");
      const daysUntilExpiry = validExpiry
        ? Math.floor(
          (new Date(`${product.validade}T00:00:00`) - new Date(`${todayString}T00:00:00`)) / 86400000,
        )
        : null;
      const statuses = [];
      if (
        product.quantidade !== "" &&
        product.quantidade !== null &&
        product.quantidade !== undefined &&
        Number.isFinite(quantity) &&
        quantity <= 0
      ) {
        statuses.push("esgotado");
      } else if (
        Number.isFinite(quantity) &&
        Number.isFinite(maximo) &&
        maximo > 0 &&
        quantity / maximo <= 0.25
      ) {
        statuses.push("critico");
      }
      if (validExpiry && daysUntilExpiry < 0) {
        statuses.push("vencido");
      } else if (validExpiry) {
        if (daysUntilExpiry <= 7) statuses.push("prox-vencimento");
      }

      statuses.forEach((status) => {
        const stateId = `${id}:${status}`;
        activeProducts[stateId] = true;
        const notificationId = `produto:${stateId}`;
        if (state.items.some((item) => item.id === notificationId)) return;
        criarNotificacao(
          state,
          notificationId,
          status,
          status === "vencido"
            ? "Produto vencido"
            : status === "prox-vencimento"
              ? "Produto próximo ao vencimento"
            : status === "critico"
              ? "Estoque crítico"
              : "Produto esgotado",
          status === "esgotado"
            ? `${name} está sem estoque.`
            : status === "critico"
              ? `${name} está com ${quantity} de ${maximo} ${product.unidade || "un"} em estoque.`
              : status === "prox-vencimento"
                  ? `${name} vence em ${product.validade.split("-").reverse().join("/")} (${daysUntilExpiry === 0 ? "hoje" : `em ${daysUntilExpiry} ${daysUntilExpiry === 1 ? "dia" : "dias"}`}).`
                : `${name} venceu em ${product.validade.split("-").reverse().join("/")}.`,
          "alertas",
        );
        const created = state.items[state.items.length - 1];
        created.produtoStateId = stateId;
      });
    });
    state.activeProducts = activeProducts;
    state.items = state.items.filter((item) =>
      item.tipo === "chamado" || activeProducts[item.produtoStateId],
    );
    if (!state.items.some((item) => item.id === state.selectedId)) state.selectedId = null;
    try {
      localStorage.setItem("docegestao_estoque_v1", JSON.stringify(inventory));
    } catch (error) {
      console.error("Não foi possível sincronizar os alertas com o estoque:", error);
    }

    const calls = lerJsonLocalStorage("docegestao_chamados", []);
    if (Array.isArray(calls)) {
      calls.forEach((call, index) => {
        if (!call || typeof call !== "object") return;
        const callId = String(
          call.id || `${call.criadoEm || "chamado"}:${index}:${call.descricao || ""}`,
        );
        if (state.seenCalls.includes(callId)) return;
        state.seenCalls.push(callId);
        criarNotificacao(
          state,
          `chamado:${callId}`,
          "chamado",
          "Novo chamado aberto",
          String(call.descricao || "Um novo chamado foi registrado na administração."),
          "admin",
        );
      });
    }

    state.items = state.items.slice(-100);
    salvarNotificacoes(state);
    renderizarNotificacoes(state);
  }

  function atualizarConta() {
    try {
      const user = JSON.parse(localStorage.getItem("docegestao_funcionario") || "null");
      usuarioAtual = user;
      const profile = obterPerfilSalvo();
      const userName = profile.nome || user?.nome || "Nenhuma conta conectada";
      const userEmail = profile.email || user?.email || "Entre para acessar sua conta";
      const userRole = user?.nome_cargo || (user ? "Conta conectada" : "");
      const avatar = profile.foto || localStorage.getItem("docegestao_foto_perfil");

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
      if (avatar) {
        fotoPerfil.src = avatar;
        fotoMenu.src = avatar;
        settingsProfileAvatar.src = avatar;
      }
    } catch (error) {
      console.error("Não foi possível carregar os dados da conta:", error);
    }
  }

  function fecharPerfil() {
    profileMenu.classList.add("hidden");
    profileTrigger.setAttribute("aria-expanded", "false");
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
      selectedProfilePhoto = await prepararFotoPerfil(file);
      const profile = { ...obterPerfilSalvo(), foto: selectedProfilePhoto };
      if (salvarPerfilSalvo(profile)) {
        settingsProfileAvatar.src = selectedProfilePhoto;
        fotoPerfil.src = selectedProfilePhoto;
        fotoMenu.src = selectedProfilePhoto;
        settingsProfileFeedback.textContent = "Foto atualizada.";
        settingsProfileFeedback.className = "min-h-5 text-xs text-emerald-700";
      }
    } catch (error) {
      console.error("Não foi possível atualizar a foto do perfil:", error);
      settingsProfileFeedback.textContent = error.message || "Não foi possível carregar essa imagem.";
      settingsProfileFeedback.className = "min-h-5 text-xs text-red-600";
    } finally {
      settingsProfilePhoto.value = "";
    }
  });

  settingsProfileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(settingsProfileForm);
    const ageText = String(formData.get("idade") || "").trim();
    const age = ageText ? Number(ageText) : null;
    if (ageText && (!Number.isInteger(age) || age < 1 || age > 120)) {
      settingsProfileFeedback.textContent = "Informe uma idade entre 1 e 120 anos.";
      settingsProfileFeedback.className = "min-h-5 text-xs text-red-600";
      return;
    }

    const profile = {
      ...obterPerfilSalvo(),
      nome: String(formData.get("nome") || "").trim(),
      idade: age,
      email: String(formData.get("email") || "").trim(),
    };
    if (!salvarPerfilSalvo(profile)) return;
    atualizarConta();
    settingsProfileFeedback.textContent = "Perfil atualizado neste navegador.";
    settingsProfileFeedback.className = "min-h-5 text-xs text-emerald-700";
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
    if (!notificationDetails.classList.contains("hidden")) {
      fecharDetalhesNotificacao();
    } else if (!notificationsDialog.classList.contains("hidden")) {
      fecharDialogo(notificationsDialog, notificationsTrigger);
    } else if (!settingsDialog.classList.contains("hidden")) {
      fecharDialogo(settingsDialog, settingsTrigger);
    } else {
      fecharPerfil();
    }
  });

  function fecharDetalhesNotificacao() {
    notificationDetails.classList.add("hidden");
    notificationDetails.classList.remove("flex");
  }

  closeNotificationDetails.addEventListener("click", fecharDetalhesNotificacao);
  notificationDetails.addEventListener("click", (event) => {
    if (event.target === notificationDetails) fecharDetalhesNotificacao();
  });

  closeSelectedNotification.addEventListener("click", () => {
    const state = carregarNotificacoes();
    const selectedItem = state.items.find((item) =>
      item.id === state.selectedId && item.tipo === "chamado",
    );
    if (!selectedItem) return;
    state.items = state.items.filter((item) => item.id !== selectedItem.id);
    state.selectedId = null;
    salvarNotificacoes(state);
    renderizarNotificacoes(state);
    fecharDetalhesNotificacao();
  });

  accountAction.addEventListener("click", () => {
    if (
      usuarioAtual &&
      !window.confirm("Deseja sair desta conta?")
    ) {
      return;
    }
    fecharPerfil();
    if (usuarioAtual) {
      localStorage.removeItem("docegestao_token");
      localStorage.removeItem("docegestao_funcionario");
    }
    if (typeof window.navegarDemo === "function") {
      window.navegarDemo("login");
    } else {
      window.location.href = "./painel.html?pagina=login";
    }
  });

  accountSettingsAction.addEventListener("click", () => {
    fecharPerfil();
    preencherPerfil();
    abrirDialogo(settingsDialog, settingsTrigger);
    abrirAbaConfiguracao("profile");
  });

  function atualizarFoto() {
    const foto = obterPerfilSalvo().foto || localStorage.getItem("docegestao_foto_perfil");
    if (!foto) return;
    fotoPerfil.src = foto;
    fotoMenu.src = foto;
    settingsProfileAvatar.src = foto;
  }

  aplicarTema(localStorage.getItem(THEME_KEY) === "dark");
  atualizarConta();
  atualizarFoto();
  preencherPerfil();
  atualizarNotificacoes();
  document.addEventListener("demo:page-loaded", () => {
    const titulo = document.title.replace(/^DoceGestão\s*[|—-]\s*/i, "").trim();
    if (titulo) {
      container.querySelectorAll("[data-header-page-name]").forEach((element) => {
        element.textContent = titulo;
      });
    }
    atualizarConta();
    atualizarNotificacoes();
    preencherPerfil();
  });
  window.addEventListener("storage", () => {
    atualizarConta();
    atualizarFoto();
    atualizarNotificacoes();
  });
  document.addEventListener("docegestao:atualizar-notificacoes", atualizarNotificacoes);
  document.addEventListener("docegestao:produto-removido", registrarProdutoRemovido);

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarHeader, { once: true });
} else {
  carregarHeader();
}
