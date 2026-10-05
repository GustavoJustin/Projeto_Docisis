function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('flex');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
}

function openReporModal(itemName) {
    document.getElementById('reporItemNome').value = itemName;
    openModal('modalRepor');
}

function updateCounters() {
    const activeCards = document.querySelectorAll('.alert-card');
    const countEl = document.getElementById('totalAlertsCount');
    if (countEl) countEl.innerText = activeCards.length;
}

function handleNovoItem(e) {
    e.preventDefault();
    closeModal('modalNovoItem');
    showToast('Item Cadastrado', 'O novo insumo foi inserido no sistema com sucesso.');
}

function handleReporSubmit(e) {
    e.preventDefault();
    const item = document.getElementById('reporItemNome').value;
    closeModal('modalRepor');
    showToast('Pedido Enviado', `A ordem de reposição para ${item} foi enviada.`);
}

function dismissCard(btn) {
    const card = btn.closest('.alert-card');
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.remove();
        updateCounters();
        showToast('Alerta Descartado', 'O item foi removido da lista de prioridades.');
    }, 200);
}

function showToast(title, message) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    toast.classList.remove('hidden');
    toast.classList.add('flex');
}

function closeToast() {
    const toast = document.getElementById('toastNotification');
    toast.classList.add('hidden');
    toast.classList.remove('flex');
}

// Filtros por Categoria
document.querySelectorAll('#filterTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#filterTabs .tab-btn').forEach(b => {
            b.className = 'tab-btn px-4 py-2 hover:text-gray-800 transition-all';
        });
        btn.className = 'tab-btn bg-white text-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all';

        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.alert-card').forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Ordenação dos Alertas
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const container = document.getElementById('alertCardsContainer');
        const cards = Array.from(container.querySelectorAll('.alert-card'));

        cards.sort((a, b) => {
            if (value === 'urgencia') {
                return parseInt(b.getAttribute('data-urgency')) - parseInt(a.getAttribute('data-urgency'));
            } else if (value === 'vencimento') {
                return new Date(a.getAttribute('data-vencimento')) - new Date(b.getAttribute('data-vencimento'));
            } else if (value === 'quantidade') {
                return parseFloat(b.getAttribute('data-quantidade')) - parseFloat(a.getAttribute('data-quantidade'));
            }
            return 0;
        });

        cards.forEach(card => container.appendChild(card));
    });
}

// Busca em tempo real
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.alert-card').forEach(card => {
        const title = card.querySelector('.item-title').innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', updateCounters);