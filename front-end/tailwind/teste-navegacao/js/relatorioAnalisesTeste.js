const perfilRelatorios = {
  nome: "Ana Maria",
  email: "usuario@confeitaria.com",
};

function mostrarToastRelatorios(mensagem, tipo = "sucesso") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto flex items-center gap-2.5 ${
    tipo === "sucesso" ? "bg-[#684627]" : "bg-red-600"
  } text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold modal-enter transition-all`;

  const icone = document.createElement("i");
  icone.dataset.lucide = tipo === "sucesso" ? "check-circle" : "alert-circle";
  icone.className = "w-4 h-4 text-[#F0B8CB]";

  const texto = document.createElement("span");
  texto.textContent = mensagem;
  toast.append(icone, texto);
  container.append(toast);
  window.lucide?.createIcons();

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    window.setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function abrirModalRelatorios(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function fecharModalRelatorios(id) {
  document.getElementById(id)?.classList.add("hidden");
}

function abrirModalPerfil() {
  abrirModalRelatorios("modal-perfil");
}

function fecharModalPerfil() {
  fecharModalRelatorios("modal-perfil");
}

function abrirModalConfiguracoes(event) {
  event?.preventDefault();
  abrirModalRelatorios("modal-configuracoes");
}

function fecharModalConfiguracoes() {
  fecharModalRelatorios("modal-configuracoes");
}

function abrirModalLogout() {
  abrirModalRelatorios("modal-logout");
}

function fecharModalLogout() {
  fecharModalRelatorios("modal-logout");
}

function confirmarLogout() {
  fecharModalLogout();
  localStorage.removeItem("docegestao_token");
  localStorage.removeItem("docegestao_funcionario");
  window.location.href = "../index.html";
}

function mudarAbaConfig(aba) {
  const geralAtiva = aba === "geral";
  const btnGeral = document.getElementById("tab-btn-geral");
  const btnSeguranca = document.getElementById("tab-btn-seguranca");
  const contentGeral = document.getElementById("tab-content-geral");
  const contentSeguranca = document.getElementById("tab-content-seguranca");
  if (!btnGeral || !btnSeguranca || !contentGeral || !contentSeguranca) return;

  btnGeral.className = geralAtiva
    ? "px-3 py-2 border-b-2 border-[#684627] text-[#684627] font-semibold transition"
    : "px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold transition";
  btnSeguranca.className = geralAtiva
    ? "px-3 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 font-semibold transition"
    : "px-3 py-2 border-b-2 border-[#684627] text-[#684627] font-semibold transition";
  contentGeral.classList.toggle("hidden", !geralAtiva);
  contentSeguranca.classList.toggle("hidden", geralAtiva);
}

function salvarConfiguracoes(event) {
  event.preventDefault();
  fecharModalConfiguracoes();
  mostrarToastRelatorios("Configurações salvas com sucesso!");
}

function previewNovaFoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const preview = document.getElementById("modal-avatar-preview");
    if (preview && typeof reader.result === "string") preview.src = reader.result;
    mostrarToastRelatorios("Foto de perfil atualizada!");
  });
  reader.readAsDataURL(file);
}

function inicializarRelatorios() {
  const botaoPdf = document.getElementById("btn-export-pdf");
  const botaoExcel = document.getElementById("btn-export-excel");
  if (!botaoPdf || !botaoExcel || botaoPdf.dataset.inicializado === "true") return;
  botaoPdf.dataset.inicializado = "true";
  botaoExcel.dataset.inicializado = "true";

  botaoPdf.addEventListener("click", async () => {
    const conteudo = document.getElementById("relatorio-conteudo");
    if (typeof window.html2pdf !== "function") {
      mostrarToastRelatorios("A biblioteca de PDF não foi carregada.", "erro");
      return;
    }

    try {
      mostrarToastRelatorios("Gerando relatório em PDF...");
      await window.html2pdf()
        .set({
          margin: 0.3,
          filename: "relatorio-confeitaria-doce-arte.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        })
        .from(conteudo)
        .save();
      mostrarToastRelatorios("PDF baixado com sucesso!");
    } catch (erro) {
      console.error("Erro ao exportar relatório PDF:", erro);
      mostrarToastRelatorios("Não foi possível exportar o PDF.", "erro");
    }
  });

  botaoExcel.addEventListener("click", () => {
    const tabela = document.getElementById("tabela-produtos");
    if (!window.XLSX?.utils || !tabela) {
      mostrarToastRelatorios("A biblioteca de Excel não foi carregada.", "erro");
      return;
    }

    const planilha = window.XLSX.utils.table_to_book(tabela, {
      sheet: "Produtos Mais Utilizados",
    });
    window.XLSX.writeFile(planilha, "relatorio-produtos-confeitaria.xlsx");
    mostrarToastRelatorios("Planilha Excel exportada!");
  });

  const formPerfil = document.getElementById("form-perfil");
  formPerfil?.addEventListener("submit", (event) => {
    event.preventDefault();
    perfilRelatorios.nome =
      document.getElementById("perfil-nome")?.value.trim() || perfilRelatorios.nome;
    perfilRelatorios.email =
      document.getElementById("perfil-email")?.value.trim() || perfilRelatorios.email;

    const nome = document.getElementById("dropdown-nome-usuario");
    const email = document.getElementById("dropdown-email-usuario");
    if (nome) nome.textContent = perfilRelatorios.nome;
    if (email) email.textContent = perfilRelatorios.email;

    fecharModalPerfil();
    mostrarToastRelatorios("Perfil atualizado com sucesso!");
  });

  const botaoPerfil = document.getElementById("btn-perfil");
  const dropdownPerfil = document.getElementById("dropdown-perfil");
  botaoPerfil?.addEventListener("click", (event) => {
    event.stopPropagation();
    const aberto = dropdownPerfil.classList.toggle("hidden") === false;
    botaoPerfil.setAttribute("aria-expanded", String(aberto));
  });

  document.querySelectorAll("#menu-opt-perfil, #menu-opt-configuracoes, #menu-opt-sair")
    .forEach((opcao) => {
      opcao.addEventListener("click", (event) => {
        event.preventDefault();
        dropdownPerfil?.classList.add("hidden");
        if (opcao.id === "menu-opt-perfil") abrirModalPerfil();
        if (opcao.id === "menu-opt-configuracoes") abrirModalConfiguracoes();
        if (opcao.id === "menu-opt-sair") abrirModalLogout();
      });
    });

  if (window.lucide?.createIcons) window.lucide.createIcons();
}

Object.assign(window, {
  abrirModalConfiguracoes,
  abrirModalLogout,
  abrirModalPerfil,
  confirmarLogout,
  fecharModalConfiguracoes,
  fecharModalLogout,
  fecharModalPerfil,
  inicializarRelatorios,
  mudarAbaConfig,
  previewNovaFoto,
  salvarConfiguracoes,
});

document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("dropdown-perfil");
  const botao = document.getElementById("btn-perfil");
  if (dropdown && !dropdown.contains(event.target) && !botao?.contains(event.target)) {
    dropdown.classList.add("hidden");
    botao?.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharModalPerfil();
    fecharModalConfiguracoes();
    fecharModalLogout();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarRelatorios, { once: true });
} else {
  inicializarRelatorios();
}
