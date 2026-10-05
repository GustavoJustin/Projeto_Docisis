const HEADER_HTML = `
  <header
    class="bg-cocoa-800 border-b border-[#6B4E3B]/60 text-[#F7F1EA] px-4 sm:px-8 py-3 flex flex-wrap justify-between items-center gap-4 shadow-md">
    <div>
      <p class="text-xs text-[#D9C6B4] font-medium">
        Gestão <span class="mx-1">/</span> Estoque
      </p>
      <h1 class="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#F5EFE9]">
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
          alt="Avatar de Maria Luiza" class="w-9 h-9 rounded-full object-cover border border-[#D4A373]">
        <div class="hidden sm:block text-left">
          <p class="text-xs font-bold leading-tight text-[#FDF7F1]">Maria Luiza</p>
          <p class="text-[11px] text-[#D9C6B4]">Administrador(a)</p>
        </div>
      </div>
    </div>
  </header>
`;

function carregarHeader() {
  const container = document.getElementById("header-container");
  if (!container) return;

  container.innerHTML = HEADER_HTML;

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarHeader, { once: true });
} else {
  carregarHeader();
}
