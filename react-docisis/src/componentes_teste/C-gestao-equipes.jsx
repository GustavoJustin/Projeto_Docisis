function GestaoEquipes() {
  return (
    <div class="min-h-screen bg-[#FAFAFA] text-[#4A3F39] flex font-sans antialiased">
      <div id="sidebar-container" data-active="gestao-equipes" class="w-64 shrink-0"></div>

      <main class="flex-1 overflow-y-auto p-10">
        <div class="max-w-6xl mx-auto space-y-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-[#2F241E]">Gestão de Funcionários</h2>
              <p class="mt-0.5 text-sm text-gray-500">
                Controle de acessos, permissões e atividades da equipe.
              </p>
            </div>

            <a
              href="cadastro-funcionario.html"
              class="flex items-center gap-2 rounded-lg bg-[#875C46] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#6E4837]"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </svg>
              Novo Funcionário
            </a>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Total da Equipe</p>
                <p id="total-count" class="mt-1 text-2xl font-bold text-gray-800">4</p>
              </div>
              <div class="rounded-xl bg-[#F3E8DE] p-3 text-[#875C46]">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Acessos Ativos</p>
                <p id="active-count" class="mt-1 text-2xl font-bold text-emerald-600">3</p>
              </div>
              <div class="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Bloqueados / Inativos</p>
                <p id="inactive-count" class="mt-1 text-2xl font-bold text-rose-500">1</p>
              </div>
              <div class="rounded-xl bg-rose-50 p-3 text-rose-500">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div class="relative min-w-[240px] flex-1">
              <svg class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                id="search-input"
                type="text"
                placeholder="Buscar por nome ou cargo..."
                class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-[#875C46] focus:outline-none"
              />
            </div>

            <select
              id="filter-status"
              class="cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Apenas Ativos</option>
              <option value="inactive">Apenas Inativos</option>
            </select>
          </div>

          <div id="employee-grid" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div
              class="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              data-name="mario silva"
              data-role="chef confeiteira"
              data-status="active"
            >
              <div class="flex flex-col items-center p-6 text-center">
                <div class="relative mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150"
                    alt="Mario Silva"
                    class="h-20 w-20 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <span class="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
                </div>
                <div class="rounded-xl bg-[#F3E8DE] p-3 text-[#875C46]">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              <div class="bg-white p-4">
                <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Acessos Ativos</p>
                    <p class="mt-1 text-2xl font-bold text-emerald-600">3</p>
                  </div>
                </div>
              </div>

              <div class="bg-white p-4 pt-0">
                <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Administradores</p>
                    <p id="admin-count" class="mt-1 text-2xl font-bold text-[#875C46]">2</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
              <div class="relative w-full md:w-80">
                <input
                  type="text"
                  id="search-member"
                  placeholder="Buscar por nome ou e-mail..."
                  class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs focus:border-[#875C46] focus:outline-none"
                />
                <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>

              <div class="flex items-center gap-2 text-xs">
                <button data-filter="all" class="filter-role rounded-lg bg-[#875C46] px-3 py-1.5 font-medium text-white transition-colors">
                  Todos
                </button>
                <button data-filter="Administrador" class="filter-role rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-200">
                  Admins
                </button>
                <button data-filter="Funcionário" class="filter-role rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-200">
                  Funcionários
                </button>
              </div>
            </div>

            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:col-span-2 lg:col-span-3">
              <table class="w-full border-collapse text-left text-xs">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
                    <th class="px-6 py-3.5">Funcionário</th>
                    <th class="px-6 py-3.5">E-mail</th>
                    <th class="px-6 py-3.5">Nível de Acesso</th>
                    <th class="px-6 py-3.5">Status</th>
                    <th class="px-6 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>

                <tbody id="team-table-body" class="divide-y divide-gray-100">
                  <tr class="member-row transition-colors hover:bg-gray-50/50" data-role="Administrador" data-status="Ativo">
                    <td class="flex items-center gap-3 px-6 py-4">
                      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#875C46] font-bold text-white">
                        A
                      </div>
                      <div>
                        <p class="member-name font-bold text-gray-800">Ana Silva</p>
                        <p class="text-[10px] text-gray-400">CPF: 123.456.789-00</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600 member-email">ana.silva@docegestao.com</td>
                    <td class="px-6 py-4">
                      <span class="rounded-full bg-[#875C46]/10 px-2.5 py-1 font-semibold text-[#875C46]">Administrador</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-600">
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Ativo
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button onClick="deleteMember(this)" class="font-semibold text-rose-500 hover:text-rose-700">
                        Remover
                      </button>
                    </td>
                  </tr>

                  <tr class="member-row transition-colors hover:bg-gray-50/50" data-role="Funcionário" data-status="Ativo">
                    <td class="flex items-center gap-3 px-6 py-4">
                      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 font-bold text-white">
                        C
                      </div>
                      <div>
                        <p class="member-name font-bold text-gray-800">Carlos Eduardo</p>
                        <p class="text-[10px] text-gray-400">CPF: 987.654.321-11</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600 member-email">carlos@docegestao.com</td>
                    <td class="px-6 py-4">
                      <span class="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-700">Funcionário</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-600">
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Ativo
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button onClick="deleteMember(this)" class="font-semibold text-rose-500 hover:text-rose-700">
                        Remover
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GestaoEquipes;

/*
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("team-table-body");
    const searchInput = document.getElementById("search-member");
    const roleButtons = document.querySelectorAll(".filter-role");

    const equipeSalva = JSON.parse(localStorage.getItem("equipe_docegestao") || "[]");
    equipeSalva.forEach((func) => {
      const tr = document.createElement("tr");
      tr.className = "member-row transition-colors hover:bg-gray-50/50";
      tr.setAttribute("data-role", func.cargo);
      tr.setAttribute("data-status", func.status || "Ativo");

      tr.innerHTML = `
        <td class="flex items-center gap-3 px-6 py-4">
          ${
            func.foto
              ? `<img src="${func.foto}" class="h-9 w-9 rounded-full object-cover" />`
              : `<div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#875C46] font-bold text-white">${func.nome.charAt(0).toUpperCase()}</div>`
          }
          <div>
            <p class="member-name font-bold text-gray-800">${func.nome}</p>
            <p class="text-[10px] text-gray-400">CPF: ${func.cpf || "Não informado"}</p>
          </div>
        </td>
        <td class="px-6 py-4 text-gray-600 member-email">${func.email}</td>
        <td class="px-6 py-4">
          <span class="rounded-full ${func.cargo === "Administrador" ? "bg-[#875C46]/10 text-[#875C46]" : "bg-gray-100 text-gray-700"} px-2.5 py-1 font-semibold">${func.cargo}</span>
        </td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-600">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Ativo
          </span>
        </td>
        <td class="px-6 py-4 text-right">
          <button onclick="deleteMember(this)" class="font-semibold text-rose-500 hover:text-rose-700">Remover</button>
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

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll(".member-row").forEach((row) => {
        const name = row.querySelector(".member-name").innerText.toLowerCase();
        const email = row.querySelector(".member-email").innerText.toLowerCase();
        if (name.includes(q) || email.includes(q)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });

    roleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        roleButtons.forEach((b) => {
          b.className = "filter-role rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-600 transition-colors hover:bg-gray-200";
        });
        btn.className = "filter-role rounded-lg bg-[#875C46] px-3 py-1.5 font-medium text-white transition-colors";

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
    if (confirm("Tem certeza de que deseja remover este membro da equipa?")) {
      const row = btn.closest(".member-row");
      row.remove();
      document.getElementById("total-count").innerText = document.querySelectorAll(".member-row").length;
    }
  }
</script>
*/

/*
<script>lucide.createIcons()</script>
*/

/*
<script src="../src/componentes/sidebar.js" defer></script>
*/
