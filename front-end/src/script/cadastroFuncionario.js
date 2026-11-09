function inicializarCadastroFuncionario(root = document, options = {}) {
  const form =
    root instanceof HTMLFormElement
      ? root
      : root.querySelector?.("#form-cadastro");
  if (!form || form.dataset.cadastroInicializado === "true") return;
  form.dataset.cadastroInicializado = "true";

  const get = (id) => form.querySelector(`#${id}`);
  const inputFoto = get("input-foto");
  const photoPreview = get("photo-preview");
  const uploadPlaceholder = get("upload-placeholder");
  const alertBox = get("cadastro-alert");
  const alertText = get("cadastro-alert-text");
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = get("btn-cancelar");
  const adminCard = get("card-admin");
  const employeeCard = get("card-func");
  const adminPermission = get("admin-create-permission");
  const adminPermissionContainer = get("admin-create-permission-container");
  const roleInputs = form.querySelectorAll('input[name="nivel_acesso"]');
  let canCreate = false;

  function showNotice(message, success = false) {
    if (!alertBox || !alertText) return;
    alertText.textContent = message;
    alertBox.className = success
      ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800";
  }

  function clearNotice() {
    if (alertBox) alertBox.classList.add("hidden");
    if (alertText) alertText.textContent = "";
  }

  function normalizedRole(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function updateRoleSelection(selected) {
    const selectedClass =
      "relative flex items-start p-4 rounded-xl border-2 border-[#875C46] bg-[#FDFBF7] cursor-pointer transition-all";
    const idleClass =
      "relative flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:border-[#875C46]/50 cursor-pointer transition-all";
    if (adminCard) {
      adminCard.className = selected === "administrador" ? selectedClass : idleClass;
    }
    if (employeeCard) {
      employeeCard.className = selected === "funcionario" ? selectedClass : idleClass;
    }
    if (adminPermissionContainer) {
      adminPermissionContainer.classList.toggle(
        "hidden",
        selected !== "administrador",
      );
    }
    if (selected !== "administrador" && adminPermission) {
      adminPermission.checked = false;
    }
  }

  function setCpfMask(input) {
    let value = input.value.replace(/\D/g, "").slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = value;
  }

  async function preparePhoto(file) {
    if (!file) return null;
    if (!file.type.startsWith("image/")) {
      throw new Error("Escolha um arquivo de imagem.");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 2 MB.");
    }

    const image = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 512 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Não foi possível processar a foto.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.82);
    } finally {
      image.close();
    }
  }

  async function validateAdminAccess() {
    const token = localStorage.getItem("docegestao_token");
    if (!token) {
      showNotice("Entre com uma conta de administrador autorizada para criar funcionários.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Verificando acesso...";
    try {
      const response = await fetch("/api/sessao", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.mensagem || "Não foi possível validar sua sessão.");
        error.status = response.status;
        throw error;
      }

      const role = normalizedRole(result.funcionario?.nome_cargo);
      canCreate = role.includes("admin") &&
        Boolean(Number(result.funcionario?.pode_cadastrar_funcionarios));
      if (!canCreate) {
        showNotice("Sua conta de administrador não tem permissão para criar funcionários.");
        return;
      }
      clearNotice();
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem("docegestao_token");
        localStorage.removeItem("docegestao_funcionario");
      }
      showNotice(error.message || "Não foi possível validar sua sessão.");
    } finally {
      submitButton.disabled = !canCreate;
      submitButton.textContent = "Criar Conta";
    }
  }

  roleInputs.forEach((radio) => {
    radio.addEventListener("change", () => updateRoleSelection(radio.value));
  });
  updateRoleSelection(form.querySelector('input[name="nivel_acesso"]:checked')?.value);

  const cpfInput = get("input-cpf");
  cpfInput?.addEventListener("input", () => setCpfMask(cpfInput));
  const phoneInput = get("input-telefone");
  phoneInput?.addEventListener("input", () => {
    let value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    phoneInput.value = value;
  });

  inputFoto?.addEventListener("change", () => {
    const file = inputFoto.files?.[0];
    if (!file || !photoPreview || !uploadPlaceholder) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      photoPreview.src = event.target.result;
      photoPreview.classList.remove("hidden");
      uploadPlaceholder.classList.add("hidden");
    };
    reader.onerror = () => showNotice("Não foi possível carregar a foto selecionada.");
    reader.readAsDataURL(file);
  });

  form.addEventListener("input", clearNotice);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearNotice();
    if (!form.checkValidity()) {
      showNotice("Confira os campos obrigatórios e corrija os dados destacados.");
      form.querySelector(":invalid")?.focus();
      return;
    }
    if (!canCreate) {
      showNotice("Sua conta não está autorizada a criar funcionários.");
      return;
    }

    const password = get("input-senha").value;
    if (password !== get("input-confirma-senha").value) {
      showNotice("As senhas digitadas não coincidem. Verifique e tente novamente.");
      return;
    }

    const selectedRole = form.querySelector('input[name="nivel_acesso"]:checked')?.value;
    const name = get("input-nome").value.trim();
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Salvando...";

    try {
      const token = localStorage.getItem("docegestao_token");
      if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
      const headers = { Authorization: `Bearer ${token}` };
      const cargosResponse = await fetch("/api/cargos", { headers });
      const cargosResult = await cargosResponse.json();
      if (!cargosResponse.ok) {
        const error = new Error(cargosResult.mensagem || "Não foi possível consultar os cargos.");
        error.status = cargosResponse.status;
        throw error;
      }

      const cargoTerm = selectedRole === "administrador" ? "admin" : "funcion";
      const cargo = cargosResult.dados?.find((item) =>
        normalizedRole(item.nome_cargo).includes(cargoTerm),
      );
      if (!cargo) throw new Error("O cargo selecionado não está cadastrado no sistema.");

      const response = await fetch("/api/funcionarios", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          cpf: cpfInput.value.replace(/\D/g, ""),
          email: get("input-email").value.trim(),
          senha: password,
          id_cargos: Number(cargo.id_cargos),
          pode_cadastrar_funcionarios:
            selectedRole === "administrador" && Boolean(adminPermission?.checked),
          foto: await preparePhoto(inputFoto?.files?.[0]),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.mensagem || "Não foi possível cadastrar o funcionário.");
        error.status = response.status;
        throw error;
      }

      if (typeof options.onSuccess === "function") {
        await options.onSuccess({ nome: name, resultado: result });
        return;
      }
      localStorage.setItem(
        "docegestao_aviso_funcionario",
        `Funcionário ${name} criado com sucesso.`,
      );
      if (typeof window.navegarDemo === "function") {
        window.navegarDemo("funcionarios");
      } else {
        window.location.href = "./painel.html?pagina=funcionarios";
      }
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem("docegestao_token");
        localStorage.removeItem("docegestao_funcionario");
      }
      showNotice(error.message || "Não foi possível conectar ao servidor.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });

  cancelButton?.addEventListener("click", () => {
    if (typeof options.onCancel === "function") {
      options.onCancel();
      return;
    }
    if (typeof window.navegarDemo === "function") {
      window.navegarDemo("funcionarios");
    } else {
      window.location.href = "./painel.html?pagina=funcionarios";
    }
  });

  void validateAdminAccess();
}

window.inicializarCadastroFuncionario = inicializarCadastroFuncionario;
document.addEventListener("demo:page-loaded", (event) => {
  if (event.detail?.pagina === "cadastro") inicializarCadastroFuncionario();
});
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => inicializarCadastroFuncionario(), { once: true });
} else {
  inicializarCadastroFuncionario();
}
