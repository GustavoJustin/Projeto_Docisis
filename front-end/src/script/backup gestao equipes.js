document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("team-table-body");
  const searchInput = document.getElementById("search-member");
  if (!tableBody || !searchInput) return;

  const readArray = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };
  const removedMembers = new Set(readArray("equipe_docegestao_removida"));
  let selectedRole = "all";
  let selectedStatus = "all";

  document.querySelectorAll(".member-row").forEach((row) => {
    const email = row.querySelector(".member-email")?.textContent.trim();
    if (email && removedMembers.has(email)) row.remove();
  });

  readArray("equipe_docegestao").forEach((func) => {
    if (!func?.email || removedMembers.has(func.email)) return;
    if ([...tableBody.querySelectorAll(".member-row")].some(
      (row) => row.querySelector(".member-email")?.textContent.trim().toLowerCase() === func.email.toLowerCase()
    )) return;

    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50/50 transition-colors member-row";
    tr.dataset.role = func.cargo || "Funcionário";
    tr.dataset.status = func.status || "Ativo";
    const avatar = func.foto
      ? `<img src="${escapeHtml(func.foto)}" class="w-9 h-9 rounded-full object-cover" alt="Foto de ${escapeHtml(func.nome)}" />`
      : `<div class="w-9 h-9 rounded-full bg-[#875C46] text-white font-bold flex items-center justify-center">${escapeHtml((func.nome || "?").charAt(0).toUpperCase())}</div>`;
    const roleStyle = tr.dataset.role === "Administrador"
      ? "inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-[#875C46]/10 text-[#875C46]"
      : "inline-flex items-center px-2.5 py-1 rounded-full font-semibold border border-gray-200 bg-gray-100 text-gray-700";
    const active = tr.dataset.status.toLowerCase() === "ativo";
    tr.innerHTML = `
      <td class="py-4 px-6"><div class="flex items-center gap-3">${avatar}<div>
        <p class="font-bold text-gray-800 member-name">${escapeHtml(func.nome || "Sem nome")}</p>
        <p class="text-[10px] text-gray-400">CPF: ${escapeHtml(func.cpf || "Não informado")}</p>
      </div></div></td>
      <td class="py-4 px-6 text-gray-600 member-email">${escapeHtml(func.email)}</td>
      <td class="py-4 px-6"><span class="px-2.5 py-1 rounded-full font-semibold ${roleStyle}">${escapeHtml(tr.dataset.role)}</span></td>
      <td class="py-4 px-6"><span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium ${active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"}"><span class="w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}"></span>${escapeHtml(tr.dataset.status)}</span></td>
      <td class="py-4 px-6 text-right"><button type="button" class="btn-remover text-rose-500 hover:text-rose-700 font-semibold">Remover</button></td>`;
    tableBody.appendChild(tr);
  });

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);
  }

  function updateCounts() {
    const rows = [...tableBody.querySelectorAll(".member-row")];
    const active = rows.filter((row) => (row.dataset.status || "").toLowerCase() === "ativo").length;
    const admins = rows.filter((row) => row.dataset.role === "Administrador").length;
    const totalCount = document.getElementById("total-count");
    const activeCount = document.getElementById("active-count");
    const adminCount = document.getElementById("admin-count");
    if (totalCount) totalCount.textContent = rows.length;
    if (activeCount) activeCount.textContent = active;
    if (adminCount) adminCount.textContent = admins;
  }

  function applyTableFilters() {
    const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    tableBody.querySelectorAll(".member-row").forEach((row) => {
      const name = row.querySelector(".member-name")?.textContent.toLocaleLowerCase("pt-BR") || "";
      const email = row.querySelector(".member-email")?.textContent.toLocaleLowerCase("pt-BR") || "";
      const roleMatches = selectedRole === "all" || row.dataset.role === selectedRole;
      const statusMatches = selectedStatus === "all" || (row.dataset.status || "").toLowerCase() === selectedStatus;
      row.hidden = !((name.includes(query) || email.includes(query)) && roleMatches && statusMatches);
    });
  }

  const roleButtons = [...document.querySelectorAll(".filter-role")];
  roleButtons.forEach((button) => button.addEventListener("click", () => {
    selectedRole = button.dataset.filter || "all";
    selectedStatus = "all";
    roleButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("bg-[#875C46]", selected);
      item.classList.toggle("text-white", selected);
      item.classList.toggle("bg-gray-100", !selected);
      item.classList.toggle("text-gray-600", !selected);
    });
    applyTableFilters();
  }));
  searchInput.addEventListener("input", applyTableFilters);

  document.querySelectorAll("[data-team-filter]").forEach((metric) => {
    const applyMetric = () => {
      const mode = metric.dataset.teamFilter;
      selectedRole = mode === "admins" ? "Administrador" : "all";
      selectedStatus = mode === "active" ? "ativo" : "all";
      roleButtons.forEach((item) => {
        const selected = item.dataset.filter === selectedRole;
        item.classList.toggle("bg-[#875C46]", selected);
        item.classList.toggle("text-white", selected);
        item.classList.toggle("bg-gray-100", !selected);
        item.classList.toggle("text-gray-600", !selected);
      });
      applyTableFilters();
      tableBody.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    metric.addEventListener("click", applyMetric);
    metric.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); applyMetric(); }
    });
  });

  let pendingRemovalRow = null;
  let pendingRemovalButton = null;
  const removalModal = document.getElementById("confirm-removal-modal");
  const removalName = document.getElementById("confirm-removal-name");
  const confirmRemovalButton = document.getElementById("confirm-removal-yes");
  const cancelRemovalButton = document.getElementById("confirm-removal-cancel");

  function openRemovalConfirmation(button) {
    if (!button || button.dataset.removalOpened === "true") return;
    const row = button.closest(".member-row");
    if (!row) return;
    button.dataset.removalOpened = "true";
    pendingRemovalRow = row;
    pendingRemovalButton = button;
    const name = row.querySelector(".member-name")?.textContent.trim() || "este funcionário";
    if (removalName) removalName.textContent = name;
    if (removalModal) {
      removalModal.classList.remove("hidden");
      removalModal.classList.add("flex");
      document.body.classList.add("overflow-hidden");
      confirmRemovalButton?.focus();
    }
  }

  function closeRemovalConfirmation() {
    removalModal?.classList.add("hidden");
    removalModal?.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    pendingRemovalButton?.removeAttribute("data-removal-opened");
    pendingRemovalButton = null;
    pendingRemovalRow = null;
  }

  function confirmRemoveMember() {
    if (!pendingRemovalRow) return closeRemovalConfirmation();
    const row = pendingRemovalRow;
    const email = row.querySelector(".member-email")?.textContent.trim();
    if (!email) return closeRemovalConfirmation();

    row.remove();
    removedMembers.add(email);
    try {
      localStorage.setItem("equipe_docegestao_removida", JSON.stringify([...removedMembers]));
      localStorage.setItem("equipe_docegestao", JSON.stringify(
        readArray("equipe_docegestao").filter((member) => member.email !== email)
      ));
    } catch (error) {
      console.warn("Não foi possível persistir a remoção no armazenamento do navegador.", error);
    }
    closeRemovalConfirmation();
    updateCounts();
    applyTableFilters();
  }

  // Compatibilidade com HTML antigo, sem voltar a abrir o popup nativo do navegador.
  window.deleteMember = openRemovalConfirmation;
  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest(".btn-remover, [onclick='deleteMember(this)']");
    if (!button || button.dataset.removalOpened === "true") return;
    openRemovalConfirmation(button);
  });
  confirmRemovalButton?.addEventListener("click", confirmRemoveMember);
  cancelRemovalButton?.addEventListener("click", closeRemovalConfirmation);
  removalModal?.addEventListener("click", (event) => {
    if (event.target === removalModal) closeRemovalConfirmation();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && removalModal && !removalModal.classList.contains("hidden")) {
      closeRemovalConfirmation();
    }
  });

  updateCounts();
  applyTableFilters();
});
