async function inicializarGestaoEquipes(event = {}) {
  const tableBody = document.getElementById("team-table-body");
  const searchInput = document.getElementById("search-member");
  if (!tableBody || !searchInput) return;

  const usuario = await window.obterFuncionarioAutenticado?.();
  const cargo = String(usuario?.nome_cargo || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (!cargo.includes("admin")) {
    const main = document.querySelector("main");
    if (main) {
      const notice = document.createElement("p");
      notice.className = "m-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800";
      notice.setAttribute("role", "alert");
      notice.textContent = "A gestão de funcionários está disponível apenas para administradores.";
      main.replaceChildren(notice);
    }
    return;
  }

  const roleButtons = document.querySelectorAll(".filter-role");
  roleButtons.forEach((button) => {
    const selected = button.dataset.filter === "all";
    button.setAttribute("aria-pressed", String(selected));
  });
  const createButton = document.getElementById("btn-novo-funcionario");
  const editButton = document.getElementById("btn-editar-funcionario");
  const createModal = document.getElementById("create-employee-modal");
  const createContent = document.getElementById("create-employee-content");
  const editModal = document.getElementById("edit-employee-modal");
  const editList = document.getElementById("edit-employee-list");
  const table = tableBody.closest("table");
  const tableContainer = table?.parentElement;
  if (!table || !tableContainer) return;
  if (tableBody.dataset.gestaoEquipesInicializada === "true") return;
  tableBody.dataset.gestaoEquipesInicializada = "true";

  let selectedRole = "all";
  let members = [];
  let canCreateEmployees = Boolean(Number(usuario?.pode_cadastrar_funcionarios));
  let canDeleteEmployees = Boolean(Number(usuario?.pode_excluir_funcionarios));
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
      if (typeof usuario.foto === "string" && usuario.foto) return usuario.foto;
      if (perfil?.userId === userId && typeof perfil.foto === "string") {
        return perfil.foto;
      }
      return "";
    } catch (error) {
      console.error("Não foi possível carregar a foto do perfil:", error);
      return "";
    }
  }

  function criarAvatar(member) {
    const foto = obterFotoPerfilDoUsuario(member);
    const avatar = document.createElement("img");
    avatar.src = foto || "../src/img/avatar-padrao.svg";
    avatar.alt = `Foto de ${member.nome || "funcionário"}`;
    avatar.className = "w-9 h-9 rounded-full object-cover";
    avatar.addEventListener("error", () => {
      avatar.replaceWith(criarAvatarInicial(member));
    }, { once: true });
    return avatar;
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
        canDeleteEmployees
          ? "text-rose-500 transition-colors hover:text-rose-700 font-semibold"
          : "cursor-default text-rose-300 opacity-50 font-semibold";
      removeButton.textContent = "Remover";
      removeButton.disabled = !canDeleteEmployees;
      removeButton.title = canDeleteEmployees
        ? "Remover funcionário"
        : "Sua conta não pode remover funcionários";
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
      showNotice(
        "Entre com uma conta de administrador para consultar a equipe.",
        "info",
      );
      updateCounts();
      renderMembers();
      return;
    }

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
      }
      showNotice(error.message || "Não foi possível conectar ao servidor.", "error");
    }
  }

  function abrirConfirmacaoExclusao(member, button) {
    if (!canDeleteEmployees) {
      showNotice("Sua conta de administrador não tem permissão para remover funcionários.", "error");
      return;
    }
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
        item.setAttribute("aria-pressed", String(selected));
        item.classList.toggle("bg-[#875C46]", selected);
        item.classList.toggle("text-white", selected);
        item.classList.toggle("bg-gray-100", !selected);
        item.classList.toggle("text-gray-600", !selected);
      });
      renderMembers();
    });
  });

  function abrirModal(modal) {
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  }

  function fecharModal(modal) {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  }

  async function abrirCriacaoFuncionario() {
    createButton.disabled = true;
    try {
      createContent.innerHTML = `
        <form id="form-cadastro" novalidate class="mx-auto max-w-3xl space-y-5">
          <div id="cadastro-alert" class="hidden rounded-xl border px-4 py-3 text-sm" role="alert" aria-live="polite">
            <span id="cadastro-alert-text"></span>
          </div>
          <div class="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)]">
            <section class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-[#FAF8F5] p-5 text-center">
              <label id="photo-dropzone" class="relative mb-3 flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#875C46]/40 bg-white">
                <span id="upload-placeholder" class="text-xs font-semibold text-[#875C46]">Enviar foto</span>
                <img id="photo-preview" class="absolute inset-0 hidden h-full w-full object-cover" alt="Prévia da foto de perfil">
                <input type="file" id="input-foto" class="absolute inset-0 h-full w-full cursor-pointer opacity-0" accept="image/*">
              </label>
              <p class="text-[11px] text-gray-500">Imagem até 2 MB</p>
            </section>
            <section class="space-y-4 rounded-xl border border-gray-200 p-5">
              <label class="block text-xs font-semibold text-gray-700">Nome completo
                <input id="input-nome" required maxlength="120" class="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Nome do funcionário">
              </label>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="block text-xs font-semibold text-gray-700">CPF
                  <input id="input-cpf" required minlength="14" maxlength="14" pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" class="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="000.000.000-00">
                </label>
                <label class="block text-xs font-semibold text-gray-700">Idade (opcional)
                  <input id="input-idade" type="number" min="1" max="120" class="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                </label>
              </div>
              <label class="block text-xs font-semibold text-gray-700">E-mail
                <input id="input-email" type="email" required maxlength="254" class="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="nome@empresa.com">
              </label>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="block text-xs font-semibold text-gray-700">Senha inicial
                  <input id="input-senha" type="password" required minlength="6" autocomplete="new-password" class="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                </label>
                <label class="block text-xs font-semibold text-gray-700">Confirmar senha
                  <input id="input-confirma-senha" type="password" required minlength="6" autocomplete="new-password" class="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                </label>
              </div>
            </section>
          </div>
          <fieldset class="rounded-xl border border-gray-200 p-5">
            <legend class="px-1 text-sm font-bold text-[#6D4936]">Cargo e permissões</legend>
            <div class="grid gap-3 sm:grid-cols-2">
              <label id="card-admin" class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 text-sm font-semibold transition-all">
                <span>Administrador</span>
                <input type="radio" name="nivel_acesso" value="administrador" required class="accent-[#875C46]" style="margin:0;width:1rem;height:1rem;flex:none">
              </label>
              <label id="card-func" class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 text-sm font-semibold transition-all">
                <span>Funcionário</span>
                <input type="radio" name="nivel_acesso" value="funcionario" checked class="accent-[#875C46]" style="margin:0;width:1rem;height:1rem;flex:none">
              </label>
            </div>
            <div id="admin-permissions-container" class="mt-4 hidden grid gap-3 sm:grid-cols-2">
              <label class="flex items-center gap-2 rounded-lg bg-[#F8F6F2] p-3 text-xs">
                <input id="admin-create-permission" type="checkbox" class="accent-[#875C46]">
                Pode criar funcionários
              </label>
              <label class="flex items-center gap-2 rounded-lg bg-[#F8F6F2] p-3 text-xs">
                <input id="admin-delete-permission" type="checkbox" class="accent-[#875C46]">
                Pode remover funcionários
              </label>
            </div>
          </fieldset>
          <div class="flex flex-wrap justify-end gap-3">
            <button type="button" id="btn-cancelar" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" class="rounded-lg bg-[#875C46] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6D4936]">Criar conta</button>
          </div>
        </form>`;
      const form = createContent.querySelector("#form-cadastro");
      if (!form) throw new Error("Não foi possível criar o formulário de cadastro.");
      abrirModal(createModal);
      window.inicializarCadastroFuncionario(form, {
        onCancel: () => fecharModal(createModal),
        onSuccess: async ({ nome }) => {
          fecharModal(createModal);
          await loadMembers();
          showNotice(`Funcionário ${nome} criado com sucesso.`);
        },
      });
    } catch (error) {
      showNotice(error.message || "Não foi possível abrir o formulário de criação.", "error");
    } finally {
      createButton.disabled = false;
    }
  }

  function criarCampoSenha(labelText, autocomplete) {
    const wrapper = document.createElement("label");
    wrapper.className = "grid gap-1 text-xs font-medium text-gray-700";
    wrapper.append(document.createTextNode(labelText));
    const input = document.createElement("input");
    input.type = "password";
    input.required = true;
    input.minLength = 6;
    input.autocomplete = autocomplete;
    input.className = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm";
    input.placeholder = "Mínimo de 6 caracteres";
    wrapper.append(input);
    return { wrapper, input };
  }

  async function renderEditList() {
    if (!editList) return;
    editList.replaceChildren();
    if (members.length === 0) {
      const empty = document.createElement("p");
      empty.className = "rounded-xl border border-gray-200 p-4 text-sm text-gray-500";
      empty.textContent = "Nenhum funcionário cadastrado.";
      editList.append(empty);
      return;
    }

    const token = localStorage.getItem("docegestao_token");
    let cargos;
    try {
      if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
      const response = await fetch("/api/cargos", {
        headers: { Authorization: "Bearer " + token },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.mensagem || "Não foi possível carregar os cargos.");
      }
      cargos = result.dados || [];
    } catch (error) {
      const failure = document.createElement("p");
      failure.className = "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800";
      failure.setAttribute("role", "alert");
      failure.textContent = error.message || "Não foi possível carregar os cargos.";
      editList.append(failure);
      return;
    }

    members.forEach((member) => {
      const card = document.createElement("details");
      card.className = "group mb-2 rounded-xl border border-gray-200 bg-white p-3 last:mb-0";
      const summary = document.createElement("summary");
      summary.className = "flex cursor-pointer list-none items-center justify-between gap-3";
      const details = document.createElement("div");
      details.className = "mt-3 space-y-3 border-t border-gray-100 pt-3";
      const name = document.createElement("p");
      name.className = "truncate text-sm font-semibold text-gray-800";
      name.textContent = member.nome || "Sem nome";
      const email = document.createElement("p");
      email.className = "truncate text-xs text-gray-500";
      email.textContent = member.email || "E-mail não informado";
      const roleSummary = document.createElement("span");
      roleSummary.className = "shrink-0 rounded-full bg-[#F5ECE5] px-2.5 py-1 text-[11px] font-semibold text-[#784E38]";
      roleSummary.textContent = member.nome_cargo || "Sem cargo";
      const identity = document.createElement("div");
      identity.className = "min-w-0";
      identity.append(name, email);
      summary.append(identity, roleSummary);
      const accessForm = document.createElement("form");
      accessForm.className = "grid gap-3";
      const roleLabel = document.createElement("label");
      roleLabel.className = "grid gap-1 text-xs font-semibold text-gray-700";
      roleLabel.append(document.createTextNode("Cargo"));
      const roleSelect = document.createElement("select");
      roleSelect.required = true;
      roleSelect.className = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm";
      cargos.forEach((cargo) => {
        const option = document.createElement("option");
        option.value = String(cargo.id_cargos);
        option.textContent = cargo.nome_cargo;
        option.selected = Number(member.id_cargos) === Number(cargo.id_cargos);
        roleSelect.append(option);
      });
      const isSelf = String(member.id_funcionario) === String(usuario?.id_funcionario);
      if (isSelf) {
        roleSelect.disabled = true;
        roleSelect.title = "Peça a outro administrador para alterar seu próprio cargo.";
      }
      roleLabel.append(roleSelect);
      const permissions = document.createElement("div");
      permissions.className = "gap-2 sm:grid-cols-2";
      const createPermission = document.createElement("input");
      createPermission.type = "checkbox";
      createPermission.className = "accent-[#875C46]";
      createPermission.checked = Boolean(Number(member.pode_cadastrar_funcionarios));
      const deletePermission = document.createElement("input");
      deletePermission.type = "checkbox";
      deletePermission.className = "accent-[#875C46]";
      deletePermission.checked = Boolean(Number(member.pode_excluir_funcionarios));
      const createPermissionLabel = document.createElement("label");
      createPermissionLabel.className = "flex items-center gap-2 rounded-lg bg-[#F8F6F2] p-3 text-xs";
      createPermissionLabel.append(createPermission, document.createTextNode("Pode criar funcionários"));
      const deletePermissionLabel = document.createElement("label");
      deletePermissionLabel.className = "flex items-center gap-2 rounded-lg bg-[#F8F6F2] p-3 text-xs";
      deletePermissionLabel.append(deletePermission, document.createTextNode("Pode remover funcionários"));
      permissions.append(createPermissionLabel, deletePermissionLabel);
      const isAdminRole = (cargoId) => normalizarCargo(
        cargos.find((cargo) => String(cargo.id_cargos) === String(cargoId))?.nome_cargo,
      ).includes("admin");
      const atualizarPermissoesVisiveis = () => {
        permissions.style.display = isAdminRole(roleSelect.value) ? "grid" : "none";
      };
      roleSelect.addEventListener("change", atualizarPermissoesVisiveis);
      atualizarPermissoesVisiveis();
      const accessStatus = document.createElement("p");
      accessStatus.className = "hidden text-xs";
      accessStatus.setAttribute("role", "status");
      const saveAccess = document.createElement("button");
      saveAccess.type = "submit";
      saveAccess.className = "justify-self-start rounded-lg bg-[#875C46] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6D4936]";
      saveAccess.textContent = "Salvar cargo e permissões";
      accessForm.append(roleLabel, permissions, accessStatus, saveAccess);
      accessForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const selectedCargo = cargos.find(
          (cargo) => String(cargo.id_cargos) === String(roleSelect.value),
        );
        if (!selectedCargo) {
          accessStatus.textContent = "Selecione um cargo válido.";
          accessStatus.className = "text-xs text-red-700";
          return;
        }
        saveAccess.disabled = true;
        saveAccess.textContent = "Salvando...";
        try {
          const response = await fetch(`/api/funcionarios/${member.id_funcionario}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_cargos: Number(roleSelect.value),
              pode_cadastrar_funcionarios: isAdminRole(roleSelect.value) && createPermission.checked,
              pode_excluir_funcionarios: isAdminRole(roleSelect.value) && deletePermission.checked,
            }),
          });
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.mensagem || "Não foi possível atualizar a conta.");
          }
          Object.assign(member, {
            id_cargos: Number(roleSelect.value),
            nome_cargo: selectedCargo.nome_cargo,
            pode_cadastrar_funcionarios: isAdminRole(roleSelect.value) && createPermission.checked ? 1 : 0,
            pode_excluir_funcionarios: isAdminRole(roleSelect.value) && deletePermission.checked ? 1 : 0,
          });
          if (isSelf) {
            const usuarioAtualizado = {
              ...usuario,
              id_cargos: member.id_cargos,
              nome_cargo: member.nome_cargo,
              pode_cadastrar_funcionarios: member.pode_cadastrar_funcionarios,
              pode_excluir_funcionarios: member.pode_excluir_funcionarios,
            };
            try {
              Object.assign(usuario, usuarioAtualizado);
              localStorage.setItem("docegestao_funcionario", JSON.stringify(usuarioAtualizado));
            } catch (error) {
              console.error("A conta foi atualizada, mas não foi possível atualizar a sessão local:", error);
            }
            canCreateEmployees = Boolean(member.pode_cadastrar_funcionarios);
            canDeleteEmployees = Boolean(member.pode_excluir_funcionarios);
            if (createButton) {
              createButton.disabled = false;
              createButton.classList.remove("opacity-50", "cursor-default");
              createButton.classList.add("hover:bg-[#6D4936]");
              createButton.title = "Criar funcionário";
            }
          }
          roleSummary.textContent = selectedCargo.nome_cargo;
          updateCounts();
          renderMembers();
          accessStatus.textContent = "Cargo e permissões atualizados.";
          accessStatus.className = "text-xs text-emerald-700";
        } catch (error) {
          accessStatus.textContent = error.message || "Não foi possível atualizar a conta.";
          accessStatus.className = "text-xs text-red-700";
        } finally {
          accessStatus.classList.remove("hidden");
          saveAccess.disabled = false;
          saveAccess.textContent = "Salvar cargo e permissões";
        }
      });
      details.append(accessForm);
      const passwordInfo = document.createElement("p");
      passwordInfo.className = "text-[11px] text-gray-400";
      passwordInfo.textContent = "Senha corporativa: protegida (não exibida)";
      details.append(passwordInfo);

      const resetButton = document.createElement("button");
      resetButton.type = "button";
      resetButton.className = "mt-3 rounded-lg border border-[#875C46]/30 px-3 py-2 text-xs font-semibold text-[#875C46] hover:bg-[#FDFBF7]";
      resetButton.textContent = "Redefinir senha";
      const resetForm = document.createElement("form");
      resetForm.className = "mt-3 gap-3 rounded-lg bg-gray-50 p-3";
      resetForm.style.display = "none";
      resetForm.append(document.createTextNode(`Definir nova senha para ${member.nome || "este funcionário"}`));
      const newPassword = criarCampoSenha("Nova senha", "new-password");
      const confirmPassword = criarCampoSenha("Confirmar nova senha", "new-password");
      const resetStatus = document.createElement("p");
      resetStatus.className = "hidden text-xs";
      resetStatus.setAttribute("role", "status");
      const submit = document.createElement("button");
      submit.type = "submit";
      submit.className = "rounded-lg bg-[#875C46] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6D4936]";
      submit.textContent = "Salvar nova senha";
      resetForm.append(newPassword.wrapper, confirmPassword.wrapper, resetStatus, submit);
      resetButton.addEventListener("click", () => {
        resetForm.style.display = resetForm.style.display === "none" ? "grid" : "none";
        if (resetForm.style.display !== "none") newPassword.input.focus();
      });
      resetForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        resetStatus.classList.add("hidden");
        if (newPassword.input.value !== confirmPassword.input.value) {
          resetStatus.textContent = "As senhas digitadas não coincidem.";
          resetStatus.className = "text-xs text-red-700";
          return;
        }

        const token = localStorage.getItem("docegestao_token");
        if (!token) {
          resetStatus.textContent = "Sua sessão expirou. Entre novamente para redefinir senhas.";
          resetStatus.className = "text-xs text-red-700";
          return;
        }
        submit.disabled = true;
        submit.textContent = "Salvando...";
        try {
          const response = await fetch(`/api/funcionarios/${member.id_funcionario}/senha`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ senha: newPassword.input.value }),
          });
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.mensagem || "Não foi possível redefinir a senha.");
          }
          resetForm.reset();
          resetForm.style.display = "none";
          resetStatus.textContent = `Senha de ${member.nome || "funcionário"} redefinida com sucesso.`;
          resetStatus.className = "text-xs text-emerald-700";
        } catch (error) {
          resetStatus.textContent = error.message || "Não foi possível conectar ao servidor.";
          resetStatus.className = "text-xs text-red-700";
        } finally {
          submit.disabled = false;
          submit.textContent = "Salvar nova senha";
        }
      });
      details.append(resetButton, resetForm);
      card.append(summary, details);
      editList.append(card);
    });
  }

  createButton?.addEventListener("click", abrirCriacaoFuncionario);
  editButton?.addEventListener("click", () => {
    abrirModal(editModal);
    void renderEditList();
  });
  document.getElementById("create-employee-close")?.addEventListener("click", () => fecharModal(createModal));
  document.getElementById("edit-employee-close")?.addEventListener("click", () => fecharModal(editModal));
  createModal?.addEventListener("click", (event) => {
    if (event.target === createModal) fecharModal(createModal);
  });
  editModal?.addEventListener("click", (event) => {
    if (event.target === editModal) fecharModal(editModal);
  });
  window.addEventListener("docegestao:perfil-atualizado", () => {
    if (!tableBody.isConnected) return;
    void loadMembers();
  });
  if (createButton) {
    createButton.disabled = false;
    createButton.classList.remove("opacity-50", "cursor-default");
    createButton.classList.add("hover:bg-[#6D4936]");
    createButton.title = "Criar funcionário";
  }
  if (tableBody.dataset.polling !== "true") {
    tableBody.dataset.polling = "true";
    window.setInterval(() => {
      if (!document.hidden && tableBody.isConnected) void loadMembers();
    }, 15000);
  }

  await loadMembers();
  if (event.detail?.pagina === "cadastro") {
    await abrirCriacaoFuncionario();
  }
}

document.addEventListener("demo:page-loaded", inicializarGestaoEquipes);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarGestaoEquipes, { once: true });
} else {
  inicializarGestaoEquipes();
}