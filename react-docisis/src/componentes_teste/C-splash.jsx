function Splash() {
  return (
    <div className="splash" class="relative bg-cream min-h-screen flex items-center justify-center overflow-hidden">
      <div class="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-100/60 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cocoa-200/50 blur-3xl"></div>

      <div class="relative z-10 flex flex-col items-center text-center px-6">

        <div class="w-20 h-20 rounded-full border border-dashed border-cocoa-200 flex items-center justify-center mb-6">

          <div class="w-11 h-11 rounded-xl bg-linear-to-br from-cocoa-400 to-cocoa-600 flex items-center justify-center shadow-sm">

            <div class="w-3 h-3 bg-cream rotate-45 rounded-2px"></div>
          </div>
        </div>

        <h1 class="font-display text-3xl font-bold text-cocoa-700">Docisis</h1>

        <p class="mt-1 text-[11px] tracking-widest text-cocoa-400 font-medium">
          GESTÃO DE ESTOQUE
        </p>

        <div class="mt-16 flex flex-col items-center gap-2">
          <p class="text-xs text-cocoa-400">Carregando seus dados…</p>

          <div class="w-32 h-1 rounded-full bg-cocoa-200/60 overflow-hidden">

            <div class="h-full rounded-full bg-cocoa-500 barra-carregando"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Splash;


/*
<script>
    setTimeout(() => {
      // Altere de 'estoque.html' para o nome correto do arquivo
      window.location.href = 'estoqueInsumo.html';
    }, 2500);
  </script>
*/
