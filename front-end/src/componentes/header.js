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
            class="absolute top-1 right-1 bg-[#D97706] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        <button id="header-settings-trigger" type="button"
          class="p-2 text-[#E6D7C6] hover:text-white hover:bg-white/10 rounded-full transition"
          aria-label="Configurações" aria-haspopup="dialog" aria-expanded="false">
          <i data-lucide="settings" class="w-5 h-5"></i>
        </button>

        <div class="relative border-l border-[#6B4E3B]/70 pl-3 sm:pl-5">
          <button id="header-profile-trigger" type="button"
            class="flex items-center gap-3 rounded-xl p-1 text-left transition hover:bg-white/10"
            aria-label="Abrir menu da conta" aria-haspopup="menu" aria-expanded="false">
            <img data-header-avatar
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120"
              alt="Avatar da conta" class="w-9 h-9 rounded-full object-cover border border-[#D4A373]">
            <span class="hidden sm:block text-left">
              <span data-header-user-name class="block text-xs font-bold leading-tight text-[#FDF7F1]">Nenhuma conta conectada</span>
              <span data-header-user-role class="block text-[11px] text-[#D9C6B4]">Acesse sua conta</span>
            </span>
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
                <p data-header-menu-role class="mt-1 text-[11px] text-gray-500"></p>
              </div>
            </div>
            <button id="header-account-action" type="button" role="menuitem"
              class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              <i data-lucide="log-in" class="h-4 w-4 text-[#875C46]"></i>
              <span data-header-account-action-label>Entrar na conta</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div id="header-notifications-dialog" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="header-notifications-title"
        class="w-full max-w-md overflow-hidden rounded-2xl border border-white/50 bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-gray-100 bg-[#F8F6F2] px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5ECE5] text-[#875C46]">
              <i data-lucide="bell" class="h-4 w-4"></i>
            </span>
            <div>
              <h2 id="header-notifications-title" class="text-sm font-bold text-[#3A2A1A]">Notificações</h2>
              <p class="text-xs text-gray-500">Avisos importantes do sistema</p>
            </div>
          </div>
          <button type="button" data-close-header-dialog="header-notifications-dialog"
            class="rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800" aria-label="Fechar notificações">
            <i data-lucide="x" class="h-4 w-4"></i>
          </button>
        </div>
        <div class="p-5">
          <article class="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <i data-lucide="package-open" class="h-4 w-4"></i>
            </span>
            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-gray-800">Acompanhe os alertas de estoque</h3>
              <p class="mt-1 text-xs leading-5 text-gray-600">Confira itens próximos do vencimento e produtos com estoque crítico.</p>
              <a href="?pagina=alertas" data-header-alerts-link
                class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#784E38] hover:underline">
                Abrir alertas <i data-lucide="arrow-right" class="h-3 w-3"></i>
              </a>
            </div>
          </article>
        </div>
        <div class="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
          <button type="button" id="header-mark-notifications-read"
            class="rounded-lg px-3 py-2 text-xs font-semibold text-[#784E38] transition hover:bg-[#F8F6F2]">
            Marcar como lida
          </button>
          <button type="button" data-close-header-dialog="header-notifications-dialog"
            class="rounded-lg bg-[#784E38] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#633e2c]">
            Fechar
          </button>
        </div>
      </section>
    </div>

    <div id="header-settings-dialog" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="header-settings-title"
        class="w-full max-w-md overflow-hidden rounded-2xl border border-white/50 bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-gray-100 bg-[#F8F6F2] px-5 py-4">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5ECE5] text-[#875C46]">
              <i data-lucide="settings" class="h-4 w-4"></i>
            </span>
            <div>
              <h2 id="header-settings-title" class="text-sm font-bold text-[#3A2A1A]">Configurações</h2>
              <p class="text-xs text-gray-500">Informações da sua sessão</p>
            </div>
          </div>
          <button type="button" data-close-header-dialog="header-settings-dialog"
            class="rounded-full p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800" aria-label="Fechar configurações">
            <i data-lucide="x" class="h-4 w-4"></i>
          </button>
        </div>
        <div class="space-y-3 p-5">
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <i data-lucide="user-round" class="h-5 w-5 shrink-0 text-[#875C46]"></i>
            <div class="min-w-0">
              <p class="text-xs font-semibold text-gray-800">Conta conectada</p>
              <p data-header-settings-account class="mt-1 truncate text-xs text-gray-500">Nenhuma conta conectada</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
            <i data-lucide="shield-check" class="h-5 w-5 shrink-0 text-[#875C46]"></i>
            <div>
              <p class="text-xs font-semibold text-gray-800">Acesso protegido</p>
              <p class="mt-1 text-xs text-gray-500">Sua sessão é protegida e expira automaticamente.</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end border-t border-gray-100 px-5 py-3">
          <button type="button" data-close-header-dialog="header-settings-dialog"
            class="rounded-lg bg-[#784E38] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#633e2c]">
            Fechar
          </button>
        </div>
      </section>
    </div>
  </div>
`;

function carregarHeader() {
  const container = document.getElementById("header-container");
  if (!container) return;

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
  const notificationCount = container.querySelector("#header-notification-count");
  const accountAction = container.querySelector("#header-account-action");
  const accountActionLabel = container.querySelector("[data-header-account-action-label]");
  const readNotifications = container.querySelector("#header-mark-notifications-read");
  let activeDialogTrigger = null;
  let usuarioAtual = null;

  function atualizarConta() {
    try {
      const user = JSON.parse(localStorage.getItem("docegestao_funcionario") || "null");
      usuarioAtual = user;
      const userName = user?.nome || "Nenhuma conta conectada";
      const userEmail = user?.email || "Entre para acessar sua conta";
      const userRole = user?.nome_cargo || (user ? "Conta conectada" : "");

      container.querySelectorAll("[data-header-user-name], [data-header-menu-name]")
        .forEach((element) => {
          element.textContent = userName;
        });
      container.querySelectorAll("[data-header-user-role], [data-header-menu-role]")
        .forEach((element) => {
          element.textContent = userRole || (element.matches("[data-header-user-role]") ? "Acesse sua conta" : "");
        });
      container.querySelectorAll("[data-header-menu-email]")
        .forEach((element) => {
          element.textContent = userEmail;
        });
      container.querySelector("[data-header-settings-account]").textContent =
        user ? `${userName} · ${userEmail}` : userName;

      if (accountActionLabel) {
        accountActionLabel.textContent = user ? "Trocar conta" : "Entrar na conta";
      }
      const accountIcon = accountAction?.querySelector("[data-lucide]");
      if (accountIcon) accountIcon.dataset.lucide = user ? "log-out" : "log-in";
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
    abrirDialogo(notificationsDialog, notificationsTrigger);
  });
  settingsTrigger.addEventListener("click", () => {
    abrirDialogo(settingsDialog, settingsTrigger);
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
    if (!notificationsDialog.classList.contains("hidden")) {
      fecharDialogo(notificationsDialog, notificationsTrigger);
    } else if (!settingsDialog.classList.contains("hidden")) {
      fecharDialogo(settingsDialog, settingsTrigger);
    } else {
      fecharPerfil();
    }
  });

  readNotifications.addEventListener("click", () => {
    try {
      localStorage.setItem("docegestao_notificacoes_lidas", "true");
      notificationCount.classList.add("hidden");
      fecharDialogo(notificationsDialog, notificationsTrigger);
    } catch (error) {
      console.error("Não foi possível marcar a notificação como lida:", error);
    }
  });

  accountAction.addEventListener("click", () => {
    if (
      usuarioAtual &&
      !window.confirm("Deseja sair desta conta e entrar com outra?")
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

  const alertsLink = container.querySelector("[data-header-alerts-link]");
  alertsLink.addEventListener("click", (event) => {
    if (typeof window.navegarDemo !== "function") return;
    event.preventDefault();
    window.navegarDemo("alertas");
  });

  const fotoPerfil = container.querySelector("[data-header-avatar]");
  const fotoMenu = container.querySelector("[data-header-menu-avatar]");

  function atualizarFoto() {
    const foto = localStorage.getItem("docegestao_foto_perfil");
    if (!foto) return;
    fotoPerfil.src = foto;
    fotoMenu.src = foto;
  }

  function atualizarEstadoNotificacoes() {
    try {
      notificationCount.classList.toggle(
        "hidden",
        localStorage.getItem("docegestao_notificacoes_lidas") === "true",
      );
    } catch (error) {
      console.error("Não foi possível carregar o estado das notificações:", error);
    }
  }

  atualizarConta();
  atualizarFoto();
  atualizarEstadoNotificacoes();
  document.addEventListener("demo:page-loaded", () => {
    const titulo = document.title.replace(/^DoceGestão\s*[|—-]\s*/i, "").trim();
    if (titulo) {
      container.querySelectorAll("[data-header-page-name]").forEach((element) => {
        element.textContent = titulo;
      });
    }
    atualizarConta();
  });
  window.addEventListener("storage", () => {
    atualizarConta();
    atualizarFoto();
    atualizarEstadoNotificacoes();
  });

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarHeader, { once: true });
} else {
  carregarHeader();
}
