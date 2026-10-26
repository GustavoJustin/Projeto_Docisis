const FOOTER_HTML = `
  <footer class="bg-cocoa-800 text-cocoa-100 border-t border-cocoa-700">
    <div class="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <a href="./index.html" class="inline-flex items-center gap-2 text-xl font-bold text-cream">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-cocoa-700 text-brand-brown-light">
              <i data-lucide="cake-slice" class="h-5 w-5"></i>
            </span>
            DoceGestão
          </a>
          <p class="mt-4 max-w-sm text-sm leading-6 text-cocoa-300">
            Gestão simples e organizada para acompanhar o dia a dia da sua confeitaria.
          </p>
        </div>

        <div>
          <div class="flex items-center gap-2">
            <i data-lucide="clipboard-check" class="h-4 w-4 text-brand-brown-light"></i>
            <h2 class="text-sm font-semibold uppercase tracking-wider text-brand-brown-light">
              Informações do sistema
            </h2>
          </div>
          <p class="mt-4 max-w-xs text-sm leading-6 text-cocoa-300">
            Os dados exibidos dependem dos registros cadastrados e das permissões de cada usuário.
          </p>
        </div>

        <div>
          <div class="flex items-center gap-2">
            <i data-lucide="circle-help" class="h-4 w-4 text-brand-brown-light"></i>
            <h2 class="text-sm font-semibold uppercase tracking-wider text-brand-brown-light">
              Precisa de ajuda?
            </h2>
          </div>
          <p class="mt-4 max-w-xs text-sm leading-6 text-cocoa-300">
            Para dúvidas sobre cadastro, acesso ou permissões, procure o administrador do sistema.
          </p>
        </div>
      </div>

      <div class="mt-10 flex flex-col gap-3 border-t border-cocoa-700 pt-5 text-xs text-cocoa-400 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; <span data-footer-year></span> DoceGestão. Todos os direitos reservados.</p>
        <p class="flex items-center gap-1.5">
          Feito com
          <i data-lucide="heart" class="h-3.5 w-3.5 fill-blush-500 text-blush-500"></i>
          para quem transforma ingredientes em momentos especiais.
        </p>
      </div>
    </div>
  </footer>
`

function carregarFooter() {
  const container = document.getElementById("footer-container");
  if (!container) return;

  container.innerHTML = FOOTER_HTML;

  const year = container.querySelector("[data-footer-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarFooter, { once: true });
} else {
  carregarFooter();
}