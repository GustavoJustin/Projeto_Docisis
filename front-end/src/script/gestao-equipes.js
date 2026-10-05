document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("team-table-body");
    const searchInput = document.getElementById("search-member");
    const roleButtons = document.querySelectorAll(".filter-role");

    // Carregar do localStorage
    const equipeSalva = JSON.parse(
        localStorage.getItem("equipe_docegestao") || "[]",
    );
    equipeSalva.forEach((func) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50/50 transition-colors member-row";
        tr.setAttribute("data-role", func.cargo);
        tr.setAttribute("data-status", func.status || "Ativo");

        tr.innerHTML = `
          <td class="py-4 px-6 flex items-center gap-3">
            ${func.foto
                ? `<img src="${func.foto}" class="w-9 h-9 rounded-full object-cover" />`
                : `<div class="w-9 h-9 rounded-full bg-[#875C46] text-white font-bold flex items-center justify-center">${func.nome.charAt(0).toUpperCase()}</div>`
            }
            <div>
              <p class="font-bold text-gray-800 member-name">${func.nome}</p>
              <p class="text-[10px] text-gray-400">CPF: ${func.cpf || "Não informado"}</p>
            </div>
          </td>
          <td class="py-4 px-6 text-gray-600 member-email">${func.email}</td>
          <td class="py-4 px-6">
            <span class="px-2.5 py-1 rounded-full font-semibold ${func.cargo === "Administrador" ? "bg-[#875C46]/10 text-[#875C46]" : "bg-gray-100 text-gray-700"}">${func.cargo}</span>
          </td>
          <td class="py-4 px-6">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-600">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Ativo
            </span>
          </td>
          <td class="py-4 px-6 text-right">
            <button onclick="deleteMember(this)" class="text-rose-500 hover:text-rose-700 font-semibold">Remover</button>
          </td>
        `;
        tableBody.appendChild(tr);
    });

    function updateCounts() {
        const rows = document.querySelectorAll(".member-row");
        document.getElementById("total-count").innerText = rows.length;
        let admins = 0;
        rows.forEach((r) => {
            if (r.getAttribute("data-role") === "Administrador") admins++;
        });
        document.getElementById("admin-count").innerText = admins;
        document.getElementById("active-count").innerText = rows.length;
    }

    updateCounts();

    // Busca por Texto
    searchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll(".member-row").forEach((row) => {
            const name = row
                .querySelector(".member-name")
                .innerText.toLowerCase();
            const email = row
                .querySelector(".member-email")
                .innerText.toLowerCase();
            if (name.includes(q) || email.includes(q)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Filtros por Cargo
    roleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            roleButtons.forEach(
                (b) =>
                (b.className =
                    "filter-role bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition-colors"),
            );
            btn.className =
                "filter-role bg-[#875C46] text-white px-3 py-1.5 rounded-lg font-medium transition-colors";

            const role = btn.getAttribute("data-filter");
            document.querySelectorAll(".member-row").forEach((row) => {
                if (role === "all" || row.getAttribute("data-role") === role) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    });
});

function deleteMember(btn) {
    if (
        confirm("Tem certeza de que deseja remover este membro da equipa?")
    ) {
        const row = btn.closest(".member-row");
        row.remove();
        document.getElementById("total-count").innerText =
            document.querySelectorAll(".member-row").length;
    }
}
