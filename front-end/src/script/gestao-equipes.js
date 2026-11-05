async function inicializarGestaoEquipes() {
  const tableBody = document.getElementById("team-table-body");
  const searchInput = document.getElementById("search-member");
  if (!tableBody || !searchInput) return;

  const roleButtons = document.querySelectorAll(".filter-role");
  const createLink = document.querySelector("#conteudo-principal a[href='cadastroFuncionario.html']");
  const table = tableBody.closest("table");
  const tableContainer = table?.parentElement;
  if (!table || !tableContainer) return;
  if (tableBody.dataset.gestaoEquipesInicializada === "true") return;
  tableBody.dataset.gestaoEquipesInicializada = "true";

  let selectedRole = "all";
  let members = [];
  let membroParaExcluir = null;
  let botaoDeExclusaoAtual = null;
  const modalExclusao = document.getElementById("confirm-removal-modal");
  const tituloConfirmacao = document.getElementById("confirm-removal-title");
  const textoConfirmacao = document.getElementById("confirm-removal-text");
  const botaoConfirmarExclusao = document.getElementById("confirm-removal-yes");
  const botaoCancelarExclusao = document.getElementById("confirm-removal-cancel");

  const notice = document.createElement("div");
  notice.className = "mb-4 rounded-xl border px-4 py-3 text-sm";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  tableContainer.parentElement.insertBefore(notice, tableContainer);

  function showNotice(message, type = "success") {
    notice.textContent = message;
    notice.className =
      type === "error"
        ? "mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        : type === "info"
          ? "mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          : "mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800";
    notice.hidden = !message;
  }

  function configureCreateLink(hasSession) {
    if (!createLink) return;
    createLink.href = hasSession
      ? "?pagina=cadastro"
      : "?pagina=cadastroPublico";
    const label = createLink.querySelector("[data-create-label]");
    if (label) {
      label.textContent = hasSession
        ? "Novo Funcionário"
        : "Criar conta de funcionário";
    }
  }

  function normalizarCargo(cargo) {
    return String(cargo || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function ehAdministrador(member) {
    return normalizarCargo(member.nome_cargo).includes("admin");
  }

  function ehAtivo(member) {
    return String(member.status || "Ativo").toLowerCase() === "ativo";
  }

  const successMessage = localStorage.getItem("docegestao_aviso_funcionario");
  if (successMessage) {
    showNotice(successMessage);
    localStorage.removeItem("docegestao_aviso_funcionario");
  } else {
    notice.hidden = true;
  }

  function updateCounts() {
    const total = document.getElementById("total-count");
    const ativos = document.getElementById("active-count");
    const administradores = document.getElementById("admin-count");
    if (total) total.textContent = String(members.length);
    document.querySelectorAll("[data-total-count]").forEach((count) => {
      count.textContent = String(members.length);
    });
    if (ativos) ativos.textContent = String(members.filter(ehAtivo).length);
    if (administradores) {
      administradores.textContent = String(members.filter(ehAdministrador).length);
    }
  }

  function obterFotoPerfilDoUsuario(member) {
    if (member.foto) return String(member.foto);

    try {
      const usuario = JSON.parse(
        localStorage.getItem("docegestao_funcionario") || "null",
      );
      if (!usuario) return "";
      const mesmoUsuario =
        String(member.id_funcionario) === String(usuario.id_funcionario) ||
        String(member.email || "").toLowerCase() ===
          String(usuario.email || "").toLowerCase();
      if (!mesmoUsuario) return "";

      const perfil = JSON.parse(
        localStorage.getItem("docegestao_perfil_v1") || "null",
      );
      const userId = String(usuario.id_funcionario || usuario.email || "");
      if (perfil?.userId === userId && typeof perfil.foto === "string") {
        return perfil.foto;
      }
      return localStorage.getItem("docegestao_foto_perfil") || "";
    } catch (error) {
      console.error("Não foi possível carregar a foto do perfil:", error);
      return "";
    }
  }

  function criarAvatar(member) {
    const foto = obterFotoPerfilDoUsuario(member);
    if (foto) {
      const avatar = document.createElement("img");
      avatar.src = foto;
      avatar.alt = `Foto de ${member.nome || "funcionário"}`;
      avatar.className = "w-9 h-9 rounded-full object-cover";
      avatar.addEventListener("error", () => {
        avatar.replaceWith(criarAvatarInicial(member));
      }, { once: true });
      return avatar;
    }
    return criarAvatarInicial(member);
  }

  function criarAvatarInicial(member) {
    const avatar = document.createElement("div");
    avatar.className =
      "w-9 h-9 rounded-full bg-[#875C46] text-white font-bold flex items-center justify-center";
    avatar.textContent = String(member.nome || "?").charAt(0).toUpperCase();
    return avatar;
  }

  function renderMembers() {
    const query = searchInput.value.trim().toLowerCase();
    const filteredMembers = members.filter((member) => {
      const role = member.nome_cargo || "Funcionário";
      return (
        (String(member.nome || "").toLowerCase().includes(query) ||
          String(member.email || "").toLowerCase().includes(query)) &&
        (selectedRole === "all" || role === selectedRole)
      );
    });

    tableBody.replaceChildren();
    if (filteredMembers.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.className = "py-6 px-6 text-center text-sm text-gray-500";
      cell.textContent = members.length
        ? "Nenhum funcionário corresponde à busca."
        : "Nenhum funcionário cadastrado.";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    filteredMembers.forEach((member) => {
      const row = document.createElement("tr");
      row.className = "hover:bg-gray-50/50 transition-colors member-row";
      row.dataset.role = member.nome_cargo || "Funcionário";
      row.dataset.status = member.status || "Ativo";

      const identity = document.createElement("td");
      identity.className = "py-4 px-6 flex items-center gap-3";
      const avatar = criarAvatar(member);
      const details = document.createElement("div");
      const name = document.createElement("p");
      name.className = "font-bold text-gray-800 member-name";
      name.textContent = member.nome || "Sem nome";
      const cpf = document.createElement("p");
      cpf.className = "text-[10px] text-gray-400";
      cpf.textContent = `CPF: ${member.cpf || "Não informado"}`;
      details.append(name, cpf);
      identity.append(avatar, details);

      const email = document.createElement("td");
      email.className = "py-4 px-6 text-gray-600 member-email";
      email.textContent = member.email;

      const roleCell = document.createElement("td");
      roleCell.className = "py-4 px-6";
      const role = document.createElement("span");
      role.className = "px-2.5 py-1 rounded-full font-semibold";
      role.textContent = member.nome_cargo || "Funcionário";
      roleCell.appendChild(role);

      const statusCell = document.createElement("td");
      statusCell.className = "py-4 px-6";
      statusCell.textContent = "Ativo";

      const actions = document.createElement("td");
      actions.className = "py-4 px-6 text-right";
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className =
        "text-rose-500 hover:text-rose-700 font-semibold";
      removeButton.textContent = "Remover";
      removeButton.addEventListener("click", () =>
        abrirConfirmacaoExclusao(member, removeButton),
      );
      actions.appendChild(removeButton);

      row.append(identity, email, roleCell, statusCell, actions);
      tableBody.appendChild(row);
    });
  }

  async function loadMembers() {
    tableBody.replaceChildren();
    members = [];
    updateCounts();
    const token = localStorage.getItem("docegestao_token");
    if (!token) {
      configureCreateLink(false);
      showNotice(
        "Nenhuma sessão de administrador está ativa. Use “Criar conta de funcionário” para se cadastrar e depois entrar no sistema.",
        "info",
        "error",
      );
      updateCounts();
      renderMembers();
      return;
    }

    configureCreateLink(true);
    try {
      const response = await fetch("/api/funcionarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Não foi possível carregar a equipe.");
      }

      members = result.dados || [];
      updateCounts();
      renderMembers();
    } catch (error) {
      renderMembers();
      if (error.message === "Token inválido ou expirado") {
        localStorage.removeItem("docegestao_token");
        localStorage.removeItem("docegestao_funcionario");
        configureCreateLink(false);
      }
      showNotice(error.message || "Não foi possível conectar ao servidor.", "error");
    }
  }

  function abrirConfirmacaoExclusao(member, button) {
    if (!modalExclusao || !botaoConfirmarExclusao || !botaoCancelarExclusao) {
      showNotice("Não foi possível abrir a confirmação de exclusão.", "error");
      return;
    }

    if (ehAdministrador(member) && members.filter(ehAdministrador).length <= 1) {
      showNotice(
        "Não é possível excluir o último administrador cadastrado.",
        "error",
      );
      return;
    }

    membroParaExcluir = member;
    botaoDeExclusaoAtual = button;
    const ehAdmin = ehAdministrador(member);
    if (tituloConfirmacao) {
      tituloConfirmacao.textContent = `Excluir ${ehAdmin ? "Administrador" : "Funcionário"}`;
    }
    if (textoConfirmacao) {
      textoConfirmacao.textContent = `Deseja realmente excluir ${member.nome || "este usuário"} da equipe? Esta ação não poderá ser desfeita.`;
    }
    modalExclusao?.classList.remove("hidden");
    modalExclusao?.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    botaoConfirmarExclusao?.focus();
  }

  function fecharConfirmacaoExclusao() {
    modalExclusao?.classList.add("hidden");
    modalExclusao?.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    botaoDeExclusaoAtual?.focus();
    membroParaExcluir = null;
    botaoDeExclusaoAtual = null;
  }

  async function confirmarExclusao() {
    const member = membroParaExcluir;
    if (!member || !botaoConfirmarExclusao) return;

    const token = localStorage.getItem("docegestao_token");
    if (!token) {
      fecharConfirmacaoExclusao();
      showNotice("Sua sessão expirou. Entre novamente para excluir usuários.", "error");
      return;
    }
    botaoConfirmarExclusao.disabled = true;
    botaoConfirmarExclusao.textContent = "Excluindo...";
    if (botaoCancelarExclusao) botaoCancelarExclusao.disabled = true;
    try {
      const response = await fetch(`/api/funcionarios/${member.id_funcionario}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Não foi possível remover o funcionário.");
      }

      fecharConfirmacaoExclusao();
      showNotice(`${member.nome} foi removido da equipe.`);
      await loadMembers();
    } catch (error) {
      fecharConfirmacaoExclusao();
      showNotice(error.message || "Não foi possível conectar ao servidor.", "error");
    } finally {
      botaoConfirmarExclusao.disabled = false;
      botaoConfirmarExclusao.textContent = "Sim, Excluir";
      if (botaoCancelarExclusao) botaoCancelarExclusao.disabled = false;
    }
  }

  botaoConfirmarExclusao?.addEventListener("click", confirmarExclusao);
  botaoCancelarExclusao?.addEventListener("click", fecharConfirmacaoExclusao);
  modalExclusao?.addEventListener("click", (event) => {
    if (event.target === modalExclusao) fecharConfirmacaoExclusao();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalExclusao?.classList.contains("hidden")) {
      fecharConfirmacaoExclusao();
    }
  });

  searchInput.addEventListener("input", renderMembers);
  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedRole = button.dataset.filter;
      roleButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("bg-[#875C46]", selected);
        item.classList.toggle("text-white", selected);
        item.classList.toggle("bg-gray-100", !selected);
        item.classList.toggle("text-gray-600", !selected);
      });
      renderMembers();
    });
  });

  await loadMembers();
}

document.addEventListener("demo:page-loaded", inicializarGestaoEquipes);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarGestaoEquipes, { once: true });
} else {
  inicializarGestaoEquipes();
}