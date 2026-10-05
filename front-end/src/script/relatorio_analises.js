// Inicialização dos ícones Lucide
if (window.lucide) {
    lucide.createIcons();
}

// VARIÁVEIS DE ESTADO
const state = {
    nome: "Ana Maria",
    email: "usuario@confeitaria.com",
    fotoUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80"
};

// SISTEMA DE TOAST NOTIFICATIONS
function mostrarToast(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const isSuccess = tipo === 'sucesso';
    const bgColor = isSuccess ? 'bg-[#684627]' : 'bg-red-600';
    const icon = isSuccess ? 'check-circle' : 'alert-circle';

    toast.className = `pointer-events-auto flex items-center gap-2.5 ${bgColor} text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold modal-enter transition-all`;
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-4 h-4 text-[#F0B8CB]"></i>
        <span>${mensagem}</span>
      `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// MANIPULAÇÃO DO DROPDOWN
document.addEventListener('DOMContentLoaded', () => {
    const btnPerfil = document.getElementById('btn-perfil');
    const dropdownPerfil = document.getElementById('dropdown-perfil');

    const menuOptPerfil = document.getElementById('menu-opt-perfil');
    const menuOptConfig = document.getElementById('menu-opt-configuracoes');
    const menuOptSair = document.getElementById('menu-opt-sair');

    // Toggle Dropdown
    if (btnPerfil && dropdownPerfil) {
        btnPerfil.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = dropdownPerfil.classList.contains('hidden');
            dropdownPerfil.classList.toggle('hidden');
            btnPerfil.setAttribute('aria-expanded', !isHidden);
        });

        // Clique fora fecha o dropdown
        document.addEventListener('click', (e) => {
            if (!dropdownPerfil.contains(e.target) && !btnPerfil.contains(e.target)) {
                dropdownPerfil.classList.add('hidden');
                btnPerfil.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // VINCULAÇÃO DE AÇÕES DO MENU DROPDOWN
    if (menuOptPerfil) {
        menuOptPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownPerfil.classList.add('hidden');
            abrirModalPerfil();
        });
    }

    if (menuOptConfig) {
        menuOptConfig.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownPerfil.classList.add('hidden');
            abrirModalConfiguracoes();
        });
    }

    if (menuOptSair) {
        menuOptSair.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownPerfil.classList.add('hidden');
            abrirModalLogout();
        });
    }

    // SUBMIT DO FORMULÁRIO DE PERFIL
    const formPerfil = document.getElementById('form-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', (e) => {
            e.preventDefault();

            const novoNome = document.getElementById('perfil-nome').value.trim();
            const novoEmail = document.getElementById('perfil-email').value.trim();

            if (novoNome) state.nome = novoNome;
            if (novoEmail) state.email = novoEmail;

            // Atualizar elementos na tela
            document.getElementById('dropdown-nome-usuario').textContent = state.nome;
            document.getElementById('dropdown-email-usuario').textContent = state.email;

            fecharModalPerfil();
            mostrarToast('Perfil atualizado com sucesso!');
        });
    }

    // EXPORTAÇÃO PDF
    const btnPdf = document.getElementById('btn-export-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', () => {
            const conteudo = document.getElementById('relatorio-conteudo');
            mostrarToast('Gerando relatório em PDF...');
            const opcoes = {
                margin: 0.3,
                filename: 'relatorio-confeitaria-doce-arte.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
            };
            html2pdf().set(opcoes).from(conteudo).save().then(() => {
                mostrarToast('PDF baixado com sucesso!');
            });
        });
    }

    // EXPORTAÇÃO EXCEL
    const btnExcel = document.getElementById('btn-export-excel');
    if (btnExcel) {
        btnExcel.addEventListener('click', () => {
            const tabela = document.getElementById('tabela-produtos');
            const wb = XLSX.utils.table_to_book(tabela, { sheet: "Produtos Mais Utilizados" });
            XLSX.writeFile(wb, 'relatorio-produtos-confeitaria.xlsx');
            mostrarToast('Planilha Excel exportada!');
        });
    }
});

// FUNÇÕES DOS MODAIS
function abrirModalPerfil() {
    document.getElementById('modal-perfil').classList.remove('hidden');
}

function fecharModalPerfil() {
    document.getElementById('modal-perfil').classList.add('hidden');
}

function abrirModalConfiguracoes(e) {
    if (e) e.preventDefault();
    document.getElementById('modal-configuracoes').classList.remove('hidden');
}

function fecharModalConfiguracoes() {
    document.getElementById('modal-configuracoes').classList.add('hidden');
}

function abrirModalLogout() {
    document.getElementById('modal-logout').classList.remove('hidden');
}

function fecharModalLogout() {
    document.getElementById('modal-logout').classList.add('hidden');
}

function confirmarLogout() {
    fecharModalLogout();
    mostrarToast('Sessão encerrada com sucesso!');
    setTimeout(() => {
        mostrarToast('Redirecionando para a tela de login...', 'sucesso');
    }, 1000);
}

// ALTERAÇÃO DE ABAS NAS CONFIGURAÇÕES
function mudarAbaConfig(aba) {
    const btnGeral = document.getElementById('tab-btn-geral');
    const btnSeguranca = document.getElementById('tab-btn-seguranca');
    const contentGeral = document.getElementById('tab-content-geral');
    const contentSeguranca = document.getElementById('tab-content-seguranca');

    if (aba === 'geral') {
        btnGeral.className = "px-3 py-2 border-b-2 border-[#684627] text-[#684627] font-semibold transition";
        btnSeguranca.className = "px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold transition";
        contentGeral.classList.remove('hidden');
        contentSeguranca.classList.add('hidden');
    } else {
        btnSeguranca.className = "px-3 py-2 border-b-2 border-[#684627] text-[#684627] font-semibold transition";
        btnGeral.className = "px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold transition";
        contentSeguranca.classList.remove('hidden');
        contentGeral.classList.add('hidden');
    }
}

function salvarConfiguracoes(e) {
    e.preventDefault();
    fecharModalConfiguracoes();
    mostrarToast('Configurações salvas com sucesso!');
}

// PREVIEW DE FOTO DE PERFIL
function previewNovaFoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            const novaUrl = evt.target.result;
            document.getElementById('modal-avatar-preview').src = novaUrl;
            document.getElementById('avatar-header').src = novaUrl;
            mostrarToast('Foto de perfil atualizada!');
        };
        reader.readAsDataURL(file);
    }
}

// FECHAR MODAIS COM A TECLA ESC
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModalPerfil();
        fecharModalConfiguracoes();
        fecharModalLogout();
    }
});
