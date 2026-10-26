const HEADER_HTML = `
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
      <button type="button"
        class="relative p-2 text-[#E6D7C6] hover:text-white hover:bg-white/10 rounded-full transition"
        aria-label="Notificações">
        <i data-lucide="bell" class="w-5 h-5"></i>
        <span
          class="absolute top-1 right-1 bg-[#D97706] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          1
        </span>
      </button>

      <button type="button" class="p-2 text-[#E6D7C6] hover:text-white hover:bg-white/10 rounded-full transition"
        aria-label="Configurações">
        <i data-lucide="settings" class="w-5 h-5"></i>
      </button>

      <div class="flex items-center gap-3 border-l border-[#6B4E3B]/70 pl-3 sm:pl-5">
        <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120"
          alt="Avatar da conta" class="w-9 h-9 rounded-full object-cover border border-[#D4A373]">
        <div class="hidden sm:block text-left">
          <p data-header-user-name class="text-xs font-bold leading-tight text-[#FDF7F1]">Nenhuma conta conectada</p>
          <p data-header-user-role class="text-[11px] text-[#D9C6B4]">Acesse sua conta</p>
        </div>
      </div>
    </div>
  </header>
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

  function atualizarConta() {
    try {
      const user = JSON.parse(localStorage.getItem("docegestao_funcionario") || "null");
      const userName = container.querySelector("[data-header-user-name]");
      const userRole = container.querySelector("[data-header-user-role]");
      if (userName) userName.textContent = user?.nome || "Nenhuma conta conectada";
      if (userRole) userRole.textContent = user?.nome_cargo || (user ? "Conta conectada" : "Acesse sua conta");
    } catch (error) {
      console.error("Não foi possível carregar os dados da conta:", error);
    }
  }
  atualizarConta();
  document.addEventListener("demo:page-loaded", atualizarConta);
  window.addEventListener("storage", atualizarConta);

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarHeader, { once: true });
} else {
  carregarHeader();
}