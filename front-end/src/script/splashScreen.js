function initializeSplashScreen() {
  const elements = {
    body: document.body,
    decorationTop: document.getElementById('splash-decoration-top'),
    decorationBottom: document.getElementById('splash-decoration-bottom'),
    content: document.getElementById('splash-content'),
    iconCircle: document.getElementById('splash-icon-circle'),
    iconSquare: document.getElementById('splash-icon-square'),
    iconDiamond: document.getElementById('splash-icon-diamond'),
    title: document.getElementById('splash-title'),
    subtitle: document.getElementById('splash-subtitle'),
    loading: document.getElementById('splash-loading'),
    loadingText: document.getElementById('splash-loading-text'),
    progressTrack: document.getElementById('splash-progress-track'),
    progressBar: document.getElementById('splash-progress-bar'),
  };

  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      throw new Error(`Elemento obrigatório da tela splash não encontrado: ${name}`);
    }
  }

  const styles = {
    body: 'relative bg-cream min-h-screen flex items-center justify-center overflow-hidden font-sans',
    decorationTop: 'pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-rose-100/60 blur-3xl',
    decorationBottom: 'pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cocoa-200/50 blur-3xl',
    content: 'relative z-10 flex flex-col items-center text-center px-6',
    iconCircle: 'w-20 h-20 rounded-full border border-dashed border-cocoa-200 flex items-center justify-center mb-6',
    iconSquare: 'w-11 h-11 rounded-xl bg-linear-to-br from-cocoa-400 to-cocoa-600 flex items-center justify-center shadow-sm',
    iconDiamond: 'w-3 h-3 bg-cream rotate-45 rounded-sm',
    title: 'font-display text-3xl font-bold text-cocoa-700',
    subtitle: 'mt-1 text-[11px] tracking-widest text-cocoa-400 font-medium',
    loading: 'mt-16 flex flex-col items-center gap-2',
    loadingText: 'text-xs text-cocoa-400',
    progressTrack: 'w-32 h-1 rounded-full bg-cocoa-200/60 overflow-hidden',
    progressBar: 'h-full rounded-full bg-cocoa-500',
  };

  for (const [name, classNames] of Object.entries(styles)) {
    elements[name].classList.add(...classNames.split(' '));
  }

  const animationDuration = 1800;
  const startedAt = performance.now();
  let animationFrame;
  const timer = window.setTimeout(() => {
    window.location.href = 'estoqueInsumo.html';
  }, 2500);

  function animateProgress(now) {
    const cycleProgress = ((now - startedAt) % animationDuration) / animationDuration;
    const progress = Math.min(cycleProgress / 0.7, 1);
    elements.progressBar.style.width = `${progress * 100}%`;
    elements.progressTrack.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    animationFrame = window.requestAnimationFrame(animateProgress);
  }

  animationFrame = window.requestAnimationFrame(animateProgress);

  window.addEventListener('pagehide', () => {
    window.cancelAnimationFrame(animationFrame);
    window.clearTimeout(timer);
  }, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSplashScreen, { once: true });
} else {
  initializeSplashScreen();
}
