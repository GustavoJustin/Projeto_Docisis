function Header() {
  return (
    <div class="bg-[#F8F5F0] text-[#2B1D12] min-h-screen flex flex-col justify-between antialiased">
      {/* <!-- ================= TOP HEADER BAR ================= --> */}
      <header class="bg-cocoa-800 border-b border-[#6B4E3B]/60 px-4 py-3.5 text-[#F7F1EA] shadow-md sm:px-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs font-medium text-[#D9C6B4]">
              Gestão <span class="mx-1">/</span> Estoque
            </p>
            <h1 class="font-serif-heading text-lg font-bold tracking-tight text-[#F5EFE9] sm:text-xl">
              Estoque de Matérias-Primas
            </h1>
          </div>

          <div class="flex items-center gap-3 sm:gap-5">
            <button
              class="relative rounded-full p-2 text-[#E6D7C6] transition hover:bg-white/10 hover:text-white"
              aria-label="Notificações"
            >
              <i data-lucide="bell" class="h-5 w-5"></i>
              <span class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] text-[10px] font-bold text-white">
                1
              </span>
            </button>

            <button
              class="rounded-full p-2 text-[#E6D7C6] transition hover:bg-white/10 hover:text-white"
              aria-label="Configurações"
            >
              <i data-lucide="settings" class="h-5 w-5"></i>
            </button>

            <div class="flex items-center gap-3 border-l border-[#6B4E3B]/70 pl-3 sm:pl-5">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=120"
                alt="Avatar de Maria Luiza"
                class="h-9 w-9 rounded-full border border-#D4A373 object-cover"
              />

              <div class="hidden text-left sm:block">
                <p class="text-xs font-bold leading-tight text-[#FDF7F1]">Maria Luiza</p>
                <p class="text-[11px] text-[#D9C6B4]">Administrador(a)</p>
              </div>
            </div>

            <button class="ml-1 rounded-md border border-[#7A5B48] bg-[#4D362B] px-3.5 py-1.5 text-xs font-semibold text-[#F5EFE8] transition hover:bg-[#5B4135]">
              Sair
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;

{/*
<script>
  if (window.lucide && lucide.createIcons) {
    lucide.createIcons();
  }
</script>
*/}