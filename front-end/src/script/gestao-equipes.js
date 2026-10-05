
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("team-table-body");
    const searchInput = document.getElementById("search-member");
    const roleButtons = document.querySelectorAll(".filter-role");
    const removedMembers = new Set(
        JSON.parse(
            localStorage.getItem("equipe_docegestao_removida") || "[]",
        ),
    );
    let selectedRole = "all";

    document.querySelectorAll(".member-row").forEach((row) => {
        const email = row.querySelector(".member-email").innerText.trim();
        if (removedMembers.has(email)) row.remove();
    });

    const equipeSalva = JSON.parse(
        localStorage.getItem("equipe_docegestao") || "[]",
    );
    equipeSalva.forEach((func) => {
        if (removedMembers.has(func.email)) return;
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50/50 transition-colors member-row";
        tr.dataset.role = func.cargo;
        tr.dataset.status = func.status || "Ativo";
        const avatar = func.foto
            ? `<img src="${func.foto}" class="w-9 h-9 rounded-full object-cover" alt="${func.nome}" />`
            : `<div class="w-9 h-9 rounded-full bg-[#875C46] text-white font-bold flex items-center justify-center">${func.nome.charAt(0).toUpperCase()}</div>`;

        tr.innerHTML = `
            <td class="py-4 px-6 flex items-center gap-3">
              ${avatar}
              <div>
                <p class="font-bold text-gray-800 member-name">${func.nome}</p>
                <p class="text-[10px] text-gray-400">CPF: ${func.cpf || "Não informado"}</p>
              </div>
            </td>
            <td class="py-4 px-6 text-gray-600 member-email">${func.email}</td>
            <td class="py-4 px-6"><span class="px-2.5 py-1 rounded-full font-semibold">${func.cargo}</span></td>
            <td class="py-4 px-6">${func.status || "Ativo"}</td>
            <td class="py-4 px-6 text-right"><button onclick="deleteMember(this)" class="text-rose-500 hover:text-rose-700 font-semibold">Remover</button></td>
          `;
        tableBody.appendChild(tr);
    });

    function updateCounts() {
        const rows = [...document.querySelectorAll(".member-row")];
        const activeCount = rows.filter(
            (row) => row.dataset.status.toLowerCase() === "ativo",
        ).length;
        const adminCount = rows.filter(
            (row) => row.dataset.role === "Administrador",
        ).length;

        const totalCount = document.getElementById("total-count");
        if (totalCount) totalCount.innerText = rows.length;
        document.querySelectorAll('[id="active-count"]').forEach((count) => {
            count.innerText = activeCount;
        });
        document.querySelectorAll('[id="admin-count"]').forEach((count) => {
            count.innerText = adminCount;
        });
    }

    function applyTableFilters() {
        const query = searchInput.value.trim().toLowerCase();

        document.querySelectorAll(".member-row").forEach((row) => {
            const name = row
                .querySelector(".member-name")
                .innerText.toLowerCase();
            const email = row
                .querySelector(".member-email")
                .innerText.toLowerCase();
            row.style.display =
                (name.includes(query) || email.includes(query)) &&
                    (selectedRole === "all" || row.dataset.role === selectedRole)
                    ? ""
                    : "none";
        });
    }

    updateCounts();
    searchInput.addEventListener("input", applyTableFilters);

    roleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            selectedRole = btn.dataset.filter;
            roleButtons.forEach((button) => {
                const selected = button === btn;
                button.classList.toggle("bg-[#875C46]", selected);
                button.classList.toggle("text-white", selected);
                button.classList.toggle("bg-gray-100", !selected);
                button.classList.toggle("text-gray-600", !selected);
            });
            applyTableFilters();
        });
    });

    window.deleteMember = (btn) => {
        if (
            !confirm("Tem certeza de que deseja remover este membro da equipe?")
        )
            return;
        const row = btn.closest(".member-row");
        const email = row.querySelector(".member-email").innerText.trim();
        removedMembers.add(email);
        localStorage.setItem(
            "equipe_docegestao_removida",
            JSON.stringify([...removedMembers]),
        );
        const savedTeam = JSON.parse(
            localStorage.getItem("equipe_docegestao") || "[]",
        ).filter((member) => member.email !== email);
        localStorage.setItem("equipe_docegestao", JSON.stringify(savedTeam));
        row.remove();
        updateCounts();
        applyTableFilters();
    };
});