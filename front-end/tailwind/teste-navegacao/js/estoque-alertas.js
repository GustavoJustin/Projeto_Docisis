/* DoceGestão: comportamentos da página de estoque e sincronização dos alertas.
   As duas páginas devem estar na mesma origem/domínio para compartilhar localStorage. */
(() => {
  'use strict';

  const STORAGE_KEY = 'docegestao_estoque_v1';
  const DIAS_PARA_ALERTA = 7;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug = value => String(value || 'insumo').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'insumo';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }
  function save(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function parseQuantity(card) {
    const span = $('.qtd-valor', card);
    return span ? (parseFloat((span.firstChild?.textContent || span.textContent).replace(',', '.')) || 0) : 0;
  }
  function getUnit(card) { return card.dataset.unidade || $('.qtd-valor span', card)?.textContent.trim() || 'un'; }
  function getCardId(card) {
    if (!card.dataset.id) card.dataset.id = slug(card.dataset.nome || $('h3', card)?.textContent.trim());
    return card.dataset.id;
  }
  function dateDiff(dateString) {
    if (!dateString) return null;
    const [y, m, d] = dateString.split('-').map(Number);
    const exp = new Date(y, m - 1, d); exp.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    return Math.round((exp - today) / 86400000);
  }
  function formattedDate(dateString) {
    if (!dateString) return '';
    const [y,m,d] = dateString.split('-'); return `${d}/${m}/${y}`;
  }
  function seedInventory() {
    const data = load();
    $$('.cartao-produto').forEach(card => {
      const id = getCardId(card);
      if (!data[id]) {
        const level = [...card.querySelectorAll('.text-brand-text-muted, .text-[9px]')]
          .map(el => el.textContent.trim()).find(t => /\d+(?:[.,]\d+)?\s*\/\s*\d+/.test(t));
        const match = level?.match(/(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)/);
        data[id] = {
          id, nome: card.dataset.nome || $('h3', card)?.textContent.trim() || id,
          categoria: card.dataset.categoria || '', unidade: getUnit(card), quantidade: parseQuantity(card),
          maximo: match ? parseFloat(match[2].replace(',', '.')) : Math.max(parseQuantity(card), 1),
          validade: card.dataset.validade || '', imagem: $('img', card)?.src || '',
          preco: $('.text-brand-brown', card)?.textContent.trim() || '', dismissed: false
        };
      }
    });
    save(data); return data;
  }
  function syncCard(card, product) {
    card.dataset.id = product.id;
    card.dataset.validade = product.validade || '';
    const quantity = $('.qtd-valor', card);
    if (quantity) {
      const unit = $('span', quantity);
      if (unit) { quantity.firstChild.textContent = `${product.quantidade} `; unit.textContent = product.unidade; }
      else quantity.textContent = `${product.quantidade} ${product.unidade}`;
    }
    let validity = $('.campo-validade', card);
    if (!validity) {
      validity = document.createElement('label');
      validity.className = 'campo-validade block mt-2 px-1 text-[10px] text-brand-text-muted';
      validity.innerHTML = 'Validade do lote <input type="date" class="input-validade ml-1 rounded border border-black/10 px-1 py-0.5 text-[10px]">';
      const info = $('.px-1.space-y-2', card) || card;
      info.appendChild(validity);
    }
    const input = $('.input-validade', validity);
    input.value = product.validade || '';
    input.setAttribute('aria-label', `Data de validade de ${product.nome}`);
    const levelLine = [...card.querySelectorAll('span')].find(el => /Nível de Estoque/i.test(el.textContent));
    if (levelLine?.parentElement) {
      const value = [...levelLine.parentElement.children].find(el => el !== levelLine);
      if (value) value.textContent = `${product.quantidade}/${product.maximo} ${product.unidade}`;
      const bar = levelLine.parentElement.nextElementSibling?.firstElementChild;
      if (bar) bar.style.width = `${Math.max(0, Math.min(100, product.maximo ? product.quantidade / product.maximo * 100 : 0))}%`;
    }
  }
  function refreshStockCard(card) {
    const data = load(), id = getCardId(card), product = data[id];
    if (product) syncCard(card, product);
  }
  function updateQuantity(card, delta) {
    const data = load(), id = getCardId(card), p = data[id];
    if (!p) return;
    p.quantidade = Math.max(0, Math.round((Number(p.quantidade) + delta) * 100) / 100);
    p.dismissed = false; data[id] = p; save(data); syncCard(card, p);
  }

  // Inventory page
  function initInventory() {
    const grid = $('#grid-produtos'); if (!grid) return;
    let data = seedInventory();
    $$('.cartao-produto', grid).forEach(card => { const p = data[getCardId(card)]; if (p) syncCard(card, p); });

    grid.addEventListener('click', event => {
      const card = event.target.closest('.cartao-produto'); if (!card) return;
      if (event.target.closest('.btn-mais')) { event.preventDefault(); updateQuantity(card, 1); }
      else if (event.target.closest('.btn-menos')) { event.preventDefault(); updateQuantity(card, -1); }
      else if (event.target.closest('.btn-excluir')) { event.preventDefault(); window.cardParaExcluir = card; $('#modal-excluir')?.classList.remove('hidden'); }
    });
    grid.addEventListener('change', event => {
      if (!event.target.matches('.input-validade')) return;
      const card = event.target.closest('.cartao-produto'), data = load(), id = getCardId(card);
      if (!data[id]) return;
      data[id].validade = event.target.value; data[id].dismissed = false; save(data);
      card.dataset.validade = event.target.value;
    });
    $('#filtros-categoria')?.addEventListener('click', event => {
      const button = event.target.closest('[data-categoria]'); if (!button) return;
      const category = button.dataset.categoria;
      $$('.filtro-btn').forEach(b => { b.classList.toggle('bg-brand-brown', b === button); b.classList.toggle('text-white', b === button); });
      $$('.cartao-produto', grid).forEach(card => { card.hidden = category !== 'Tudo' && card.dataset.categoria !== category; });
    });

    const modal = $('#modal-insumo');
    const openAdd = () => modal?.classList.remove('hidden');
    $('#btn-card-adicionar')?.addEventListener('click', openAdd);
    $('#btn-fechar-modal')?.addEventListener('click', () => modal?.classList.add('hidden'));
    $('#btn-cancelar')?.addEventListener('click', () => modal?.classList.add('hidden'));
    $('#form-novo-insumo')?.addEventListener('submit', event => {
      event.preventDefault();
      const name = $('#input-nome').value.trim(), category = $('#input-categoria').value;
      const qty = Number($('#input-qtd-atual').value), max = Number($('#input-qtd-max').value);
      const unit = $('#input-unidade').value, image = $('#input-imagem').value.trim();
      const price = $('#input-preco').value.trim(), id = `${slug(name)}-${Date.now().toString(36)}`;
      const product = { id, nome:name, categoria:category, unidade:unit, quantidade:qty, maximo:max, validade:'', imagem:image, preco:price, dismissed:false };
      const card = document.createElement('article');
      card.className = 'cartao-produto border border-black/10 rounded-2xl p-3 flex flex-col justify-between bg-white shadow-sm';
      card.dataset.id=id; card.dataset.nome=name.toLowerCase(); card.dataset.categoria=category; card.dataset.unidade=unit;
      card.innerHTML = `<div><div class="relative h-36 rounded-xl overflow-hidden mb-3 bg-gray-50 flex items-center justify-center"><button type="button" class="btn-excluir absolute top-2 right-2 w-7 h-7 rounded-full bg-white text-rose-500" title="Excluir insumo">×</button>${image ? `<img src="${esc(image)}" alt="${esc(name)}" class="w-full h-full object-contain p-2">` : `<span class="text-3xl text-brand-brown">${esc(name.slice(0,1).toUpperCase())}</span>`}</div><div class="px-1 space-y-2"><div class="flex items-baseline justify-between"><h3 class="font-bold text-xs text-brand-text-dark">${esc(name)}</h3><span class="text-xs font-bold text-brand-brown">${esc(price)}</span></div><p class="text-[10px] text-brand-text-muted">Categoria: ${esc(category)}</p><div class="pt-2"><div class="flex justify-between text-[9px] text-brand-text-muted mb-1"><span>Nível de Estoque</span><span>${qty}/${max} ${esc(unit)}</span></div><div class="w-full bg-black/5 rounded-full h-1"><div class="bg-brand-brown h-full rounded-full" style="width:${max ? Math.min(100,qty/max*100):0}%"></div></div></div></div></div><div class="flex items-center justify-between pt-4 px-1"><span class="qtd-valor text-base font-bold text-brand-text-dark">${qty} <span class="text-xs font-normal text-brand-text-muted">${esc(unit)}</span></span><div class="flex items-center gap-2 border border-black/10 rounded-lg px-2 py-0.5"><button type="button" class="btn-menos">-</button><button type="button" class="btn-mais">+</button></div></div>`;
      data = load(); data[id] = product; save(data); grid.insertBefore(card, $('#btn-card-adicionar')); syncCard(card, product);
      event.target.reset(); modal?.classList.add('hidden');
    });
    $('#btn-cancelar-exclusao')?.addEventListener('click', () => $('#modal-excluir')?.classList.add('hidden'));
    $('#btn-confirmar-exclusao')?.addEventListener('click', () => {
      const card = window.cardParaExcluir; if (!card) return;
      const data = load(); delete data[getCardId(card)]; save(data); card.remove(); window.cardParaExcluir = null;
      $('#modal-excluir')?.classList.add('hidden');
    });
  }

  function getExpiring(data) {
    return Object.values(data).filter(p => p.validade && !p.dismissed && dateDiff(p.validade) <= DIAS_PARA_ALERTA);
  }
  function renderAlerts() {
    const container = $('#alertCardsContainer'); if (!container) return;
    const data = load(), products = getExpiring(data);
    container.innerHTML = '';
    if (!products.length) {
      container.innerHTML = '<p class="rounded-xl bg-white border border-gray-100 p-6 text-sm text-gray-500">Nenhum produto vencido ou com vencimento nos próximos 7 dias. Informe a validade na página de estoque para ativar os alertas.</p>';
    }
    products.sort((a,b) => dateDiff(a.validade) - dateDiff(b.validade)).forEach(p => {
      const days = dateDiff(p.validade), expired = days < 0;
      const card = document.createElement('article');
      card.className = `alert-card bg-white rounded-2xl border border-gray-100 p-5 shadow-sm border-l-4 ${expired?'border-l-red-500':'border-l-rose-800'} flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all`;
      card.dataset.id=p.id; card.dataset.category=expired?'vencido':'prox-vencimento'; card.dataset.vencimento=p.validade;
      card.innerHTML = `<div class="flex gap-4 items-center min-w-0">${p.imagem ? `<img src="${esc(p.imagem)}" alt="${esc(p.nome)}" class="w-24 h-24 rounded-xl object-cover shrink-0">` : ''}<div class="space-y-1"><div class="flex items-center gap-2"><span class="${expired?'bg-red-100 text-red-600':'bg-rose-100 text-rose-800'} text-[9px] font-bold px-2 py-0.5 rounded uppercase">${expired?'VENCIDO':'PRÓX. VENCIMENTO'}</span><span class="text-[10px] text-gray-400">${esc(p.categoria||'Estoque')}</span></div><h3 class="font-bold text-gray-800 text-base item-title">${esc(p.nome)}</h3><p class="text-xs text-gray-400">${expired?'Venceu em':'Validade expira em'}: <strong>${formattedDate(p.validade)}${!expired?` (${days===0?'hoje':`em ${days} ${days===1?'dia':'dias'}`})`:''}</strong></p><div class="pt-2"><span class="text-[10px] text-gray-400 block uppercase font-medium">DISPONÍVEL</span><span class="text-xs font-bold text-gray-800">${esc(p.quantidade)} ${esc(p.unidade)}</span></div></div></div><div class="flex flex-col gap-2 w-full sm:w-32 shrink-0"><button type="button" data-action="priorizar" class="w-full bg-[#784E38] hover:bg-[#633e2c] text-white text-xs font-semibold py-2 px-3 rounded-lg">Priorizar Uso</button><button type="button" data-action="descartar" class="w-full bg-white border border-gray-200 text-gray-600 text-xs font-semibold py-2 px-3 rounded-lg">Descartar</button></div>`;
      container.appendChild(card);
    });
    const count = $('#totalAlertsCount'); if (count) count.textContent = String(products.length);
    container.onclick = onAlertClick;
  }
  function onAlertClick(event) {
    const button = event.target.closest('[data-action]'); if (!button) return;
    const card = button.closest('.alert-card'), data = load(), product = data[card?.dataset.id]; if (!product) return;
    if (button.dataset.action === 'descartar') { product.dismissed = true; data[product.id] = product; save(data); renderAlerts(); }
    else showToast('Priorizado', `${product.nome} foi marcado para uso prioritário.`);
  }
  function showToast(title, message) {
    const toast = $('#toastNotification');
    if (!toast) { window.alert(`${title}: ${message}`); return; }
    const t = $('#toastTitle'), m = $('#toastMessage'); if (t) t.textContent=title; if (m) m.textContent=message;
    toast.classList.remove('hidden'); toast.classList.add('flex'); clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => { toast.classList.add('hidden'); toast.classList.remove('flex'); }, 3500);
  }
  window.showToast = showToast;
  window.closeToast = () => { $('#toastNotification')?.classList.add('hidden'); $('#toastNotification')?.classList.remove('flex'); };
  window.dismissCard = button => { const card = button.closest('.alert-card'); if (!card) return; const data=load(), p=data[card.dataset.id]; if(p){p.dismissed=true;data[p.id]=p;save(data);} renderAlerts(); };
  window.openReporModal = name => { const input=$('#reporItemNome'); if(input) input.value=name; $('#modalRepor')?.classList.remove('hidden'); };
  window.handleReporSubmit = event => {
    event.preventDefault();
    const name=$('#reporItemNome')?.value, card=$$('.alert-card').find(c=>$('.item-title',c)?.textContent.trim()===name);
    if(card){const data=load(),p=data[card.dataset.id];const qty=Number($('input[type="number"]', $('#modalRepor'))?.value||0);if(p){p.quantidade=Number(p.quantidade)+qty;p.dismissed=false;data[p.id]=p;save(data);}}
    $('#modalRepor')?.classList.add('hidden'); showToast('Reposição registrada', 'O estoque foi atualizado.'); renderAlerts();
  };
  window.closeModal = id => document.getElementById(id)?.classList.add('hidden');

  let initialized = false;
  function initialize() { if (initialized) return; initialized = true; initInventory(); renderAlerts(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
