document.addEventListener("demo:page-loaded", async () => {
    const tableBody = document.getElementById("team-table-body");
    const searchInput = document.getElementById("search-member");
    if (!tableBody || !searchInput) return;

    const roleButtons = document.querySelectorAll(".filter-role");
    const createLink = document.querySelector("#conteudo-principal a[href='cadastroFuncionario.html']");
    const table = tableBody.closest("table");
    const tableContainer = table?.parentElement;
    if (!table || !tableContainer) return;

    let selectedRole = "all";
    let members = [];

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

    const successMessage = localStorage.getItem("docegestao_aviso_funcionario");
    if (successMessage) {
        showNotice(successMessage);
        localStorage.removeItem("docegestao_aviso_funcionario");
    } else {
        notice.hidden = true;
    }

    function updateCounts() {
        document.querySelectorAll("[data-total-count]").forEach((count) => {
            count.textContent = String(members.length);
        });
        document.querySelectorAll('[id="active-count"]').forEach((count) => {
            count.textContent = String(members.length);
        });
        document.querySelectorAll('[id="admin-count"]').forEach((count) => {
            count.textContent = String(
                members.filter((member) =>
                    member.nome_cargo?.normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .includes("admin"),
                ).length,
            );
        });
    }

    function renderMembers() {
        const query = searchInput.value.trim().toLowerCase();
        const filteredMembers = members.filter((member) => {
            const role = member.nome_cargo || "Funcionário";
            return (
                (member.nome.toLowerCase().includes(query) ||
                    member.email.toLowerCase().includes(query)) &&
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
            row.dataset.status = "Ativo";

            const identity = document.createElement("td");
            identity.className = "py-4 px-6 flex items-center gap-3";
            const avatar = document.createElement("div");
            avatar.className =
                "w-9 h-9 rounded-full bg-[#875C46] text-white font-bold flex items-center justify-center";
            avatar.textContent = member.nome.charAt(0).toUpperCase();
            const details = document.createElement("div");
            const name = document.createElement("p");
            name.className = "font-bold text-gray-800 member-name";
            name.textContent = member.nome;
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
            removeButton.addEventListener("click", () => removerFuncionario(member));
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

    async function removerFuncionario(member) {
        if (!confirm(`Deseja realmente remover ${member.nome} da equipe?`)) return;

        const token = localStorage.getItem("docegestao_token");
        try {
            const response = await fetch(`/api/funcionarios/${member.id_funcionario}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.mensagem || "Não foi possível remover o funcionário.");
            }

            showNotice(`${member.nome} foi removido da equipe.`);
            await loadMembers();
        } catch (error) {
            showNotice(error.message || "Não foi possível conectar ao servidor.", "error");
        }
    }

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
});
