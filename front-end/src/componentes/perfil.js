(function () {
  document.documentElement.style.display = "none";
  const USER_KEY = "docegestao_funcionario";
  const TOKEN_KEY = "docegestao_token";

  function getLoginUrl() {
    return window.location.protocol === "file:"
      ? new URL("./index.html", window.location.href).href
      : "/tailwind/index.html";
  }

  async function validateSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || window.location.protocol === "file:") return null;

    try {
      const response = await fetch("/api/sessao", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      const user = result.funcionario;

      if (
        !response.ok ||
        !user?.id_funcionario ||
        !user?.nome ||
        !user?.email ||
        !user?.nome_cargo
      ) {
        return null;
      }

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  }

  function getInitials(name) {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase() || "DG"
    );
  }

  function isAdministrator(user) {
    return user.nome_cargo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes("admin");
  }

  function restrictMovementAccess(user) {
    const admin = isAdministrator(user);
    const pageName = window.location.pathname.split("/").pop();
    const restrictedPages = ["historico.html", "historico-materias_prima.html"];

    if (!admin && restrictedPages.includes(pageName)) {
      window.location.replace("/tailwind/estoqueInsumo.html");
      return false;
    }

    if (!admin) {
      const sidebar = document.getElementById("sidebar-container");
      sidebar
        ?.querySelectorAll('[data-page="entrada"], [data-page="saida"]')
        .forEach((link) => {
          link.style.display = "none";
        });
      const historyMenu =
        sidebar?.querySelector("#btn-historico")?.parentElement;
      if (historyMenu) historyMenu.style.display = "none";
      const newMovement = sidebar?.querySelector("#btn-novo-sidebar");
      if (newMovement) newMovement.style.display = "none";
    }

    return true;
  }

  function setAvatar(trigger, initials, name) {
    const image = trigger.matches("img")
      ? trigger
      : trigger.querySelector("img");
    if (image) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#875C46"/><text x="48" y="53" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="32" font-weight="700" fill="#ffffff">${initials}</text></svg>`;
      image.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      image.alt = `Perfil de ${name}`;
      return;
    }

    if (trigger.dataset.profileInitials !== undefined) {
      trigger.textContent = initials;
    }
  }

  function createMenu(wrapper, user, initials) {
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    menu.style.cssText = [
      "position:absolute",
      "top:calc(100% + 8px)",
      "right:0",
      "width:240px",
      "padding:8px",
      "background:#ffffff",
      "border:1px solid #e5e7eb",
      "border-radius:12px",
      "box-shadow:0 12px 30px rgba(0,0,0,.16)",
      "z-index:1000",
      "color:#374151",
      "font:inherit",
      "display:none",
    ].join(";");

    const identity = document.createElement("div");
    identity.style.cssText =
      "padding:8px 8px 12px;border-bottom:1px solid #eee;margin-bottom:6px;overflow:hidden";

    const name = document.createElement("p");
    name.textContent = user?.nome || "Conta do sistema";
    name.style.cssText =
      "margin:0;font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";

    const email = document.createElement("p");
    email.textContent = user?.email || "Nenhuma conta conectada";
    email.style.cssText =
      "margin:4px 0 0;font-size:11px;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis";
    identity.append(name, email);

    const switchAccount = document.createElement("button");
    switchAccount.type = "button";
    switchAccount.setAttribute("role", "menuitem");
    switchAccount.textContent = "Trocar conta";
    switchAccount.style.cssText =
      "display:block;width:100%;padding:9px 8px;border:0;border-radius:8px;background:transparent;color:#9f1239;text-align:left;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer";
    switchAccount.addEventListener("mouseenter", () => {
      switchAccount.style.background = "#fff1f2";
    });
    switchAccount.addEventListener("mouseleave", () => {
      switchAccount.style.background = "transparent";
    });
    switchAccount.addEventListener("click", () => {
      if (!confirm("Deseja sair desta conta e entrar com outra?")) return;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = "./index.html";
    });

    menu.append(identity, switchAccount);
    wrapper.appendChild(menu);

    const trigger = wrapper.querySelector("[data-profile-trigger]");
    function toggleMenu(open) {
      const shouldOpen = open ?? menu.style.display === "none";
      menu.style.display = shouldOpen ? "block" : "none";
      trigger.setAttribute("aria-expanded", String(shouldOpen));
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu();
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      } else if (event.key === "Escape") {
        toggleMenu(false);
      }
    });
    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) toggleMenu(false);
    });
  }

  function addSidebarFallback() {
    const sidebar = document.getElementById("sidebar-container");
    const brand = sidebar?.querySelector("aside > div > div.bg-white");
    if (!brand) return;

    brand.style.position = "relative";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.profileTrigger = "";
    button.dataset.profileInitials = "";
    button.setAttribute("aria-label", "Abrir perfil e trocar conta");
    button.style.cssText =
      "position:absolute;right:16px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:0;border-radius:50%;background:#875c46;color:#fff;font-size:11px;font-weight:700;cursor:pointer";
    brand.appendChild(button);
  }

  async function initialize() {
    document.documentElement.style.display = "none";
    const user = await validateSession();
    if (!user) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.replace(getLoginUrl());
      return;
    }
    if (!restrictMovementAccess(user)) return;

    let triggers = [...document.querySelectorAll("[data-profile-trigger]")];
    if (triggers.length === 0) {
      addSidebarFallback();
      triggers = [...document.querySelectorAll("[data-profile-trigger]")];
    }

    const name = user.nome;
    const initials = getInitials(name);

    document.querySelectorAll("[data-profile-name]").forEach((element) => {
      element.textContent = name;
    });
    document.querySelectorAll("[data-profile-email]").forEach((element) => {
      element.textContent = user?.email || "Nenhuma conta conectada";
    });

    triggers.forEach((trigger) => {
      if (trigger.dataset.profileReady) return;
      trigger.dataset.profileReady = "true";
      trigger.setAttribute("aria-label", "Abrir perfil e trocar conta");
      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-expanded", "false");
      setAvatar(trigger, initials, name);

      const existingMenu = document.getElementById("dropdown-perfil");
      if (existingMenu && trigger.id === "btn-perfil") {
        const menuName = existingMenu.querySelector("#dropdown-nome-usuario");
        const menuEmail = existingMenu.querySelector("#dropdown-email-usuario");
        const logoutLabel = existingMenu.querySelector("#menu-opt-sair span");
        if (menuName) menuName.textContent = name;
        if (menuEmail)
          menuEmail.textContent = user?.email || "Nenhuma conta conectada";
        if (logoutLabel) logoutLabel.textContent = "Trocar conta";
        return;
      }

      const wrapper = document.createElement("span");
      wrapper.style.cssText =
        "position:relative;display:inline-flex;flex:none;vertical-align:middle";
      trigger.parentNode.insertBefore(wrapper, trigger);
      wrapper.appendChild(trigger);
      trigger.style.cursor = "pointer";
      if (trigger.tagName !== "BUTTON") {
        trigger.setAttribute("role", "button");
        trigger.tabIndex = 0;
      }
      if (trigger.dataset.profileInitials !== undefined) {
        trigger.textContent = initials;
      }
      if (trigger.tagName === "BUTTON") {
        trigger.textContent = initials;
        trigger.style.borderRadius = "50%";
        trigger.style.backgroundColor = "#875c46";
        trigger.style.color = "#ffffff";
        trigger.style.fontWeight = "700";
      }
      createMenu(wrapper, user, initials);
    });

    document.documentElement.style.display = "";
  }

  let initialization;
  window.inicializarPerfilDoceGestao = () => {
    initialization ||= initialize();
    return initialization;
  };
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      window.inicializarPerfilDoceGestao,
      { once: true },
    );
  } else {
    window.inicializarPerfilDoceGestao();
  }
})();
