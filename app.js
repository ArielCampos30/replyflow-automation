const STORAGE = {
  conversations: "replyflow_demo_conversations_v1",
  rules: "replyflow_demo_rules_v1"
};

const seedConversations = [
  {
    id: "C-1001",
    name: "Paula López",
    company: "Estudio Norte",
    channel: "WhatsApp demo",
    phone: "+54 9 351 555 0101",
    email: "paula@estudionorte.demo",
    status: "Nuevo lead",
    unread: true,
    needsHuman: false,
    updatedAt: Date.now() - 2 * 60 * 1000,
    messages: [
      { from: "client", text: "Hola, quisiera saber el precio del servicio.", time: "18:02" },
      { from: "bot", text: "¡Hola! Gracias por escribirnos. Los valores dependen del alcance. ¿Querés que un asesor te contacte?", time: "18:02" }
    ]
  },
  {
    id: "C-1002",
    name: "Martín Ríos",
    company: "Ríos Muebles",
    channel: "Instagram",
    phone: "+54 9 11 5555 0202",
    email: "martin@riosmuebles.demo",
    status: "En seguimiento",
    unread: false,
    needsHuman: true,
    updatedAt: Date.now() - 18 * 60 * 1000,
    messages: [
      { from: "client", text: "Necesito hablar con alguien por una propuesta personalizada.", time: "17:46" },
      { from: "bot", text: "Claro. Derivo tu consulta a una persona del equipo.", time: "17:46" }
    ]
  },
  {
    id: "C-1003",
    name: "Camila Vega",
    company: "Vega Deco",
    channel: "Web",
    phone: "+54 9 351 555 0303",
    email: "camila@vegadeco.demo",
    status: "Calificado",
    unread: false,
    needsHuman: false,
    updatedAt: Date.now() - 54 * 60 * 1000,
    messages: [
      { from: "client", text: "¿Qué horarios de atención tienen?", time: "17:10" },
      { from: "bot", text: "Nuestro horario de atención es de lunes a viernes de 9 a 18 h.", time: "17:10" }
    ]
  },
  {
    id: "C-1004",
    name: "Luciano Benítez",
    company: "LB Ingeniería",
    channel: "WhatsApp demo",
    phone: "+54 9 351 555 0404",
    email: "luciano@lbingenieria.demo",
    status: "En seguimiento",
    unread: true,
    needsHuman: false,
    updatedAt: Date.now() - 80 * 60 * 1000,
    messages: [
      { from: "client", text: "Hola, vi la web y quiero más información.", time: "16:44" }
    ]
  }
];

const seedRules = [
  {
    id: "R-1",
    name: "Consulta de precios",
    keywords: ["precio", "precios", "valor", "costo"],
    reply: "¡Hola! Gracias por escribirnos. Los valores dependen del alcance. ¿Querés que un asesor te contacte?",
    active: true
  },
  {
    id: "R-2",
    name: "Horarios de atención",
    keywords: ["horario", "horarios", "atienden", "abren"],
    reply: "Nuestro horario de atención es de lunes a viernes de 9 a 18 h.",
    active: true
  },
  {
    id: "R-3",
    name: "Derivación a persona",
    keywords: ["asesor", "persona", "humano", "hablar con alguien"],
    reply: "Claro. Derivo tu consulta a una persona del equipo.",
    active: true
  }
];

let conversations = load(STORAGE.conversations, seedConversations);
let rules = load(STORAGE.rules, seedRules);
let selectedId = conversations[0]?.id || null;
let conversationFilter = "all";
let searchTerm = "";

const els = {
  sidebar: document.querySelector("#sidebar"),
  menuBtn: document.querySelector("#menu-btn"),
  viewTitle: document.querySelector("#view-title"),
  list: document.querySelector("#conversation-list"),
  search: document.querySelector("#conversation-search"),
  filters: document.querySelector("#conversation-filters"),
  openCounter: document.querySelector("#open-counter"),
  chatHead: document.querySelector("#chat-head"),
  chatBody: document.querySelector("#chat-body"),
  contactPanel: document.querySelector("#contact-panel"),
  messageForm: document.querySelector("#message-form"),
  messageInput: document.querySelector("#message-input"),
  contactsBody: document.querySelector("#contacts-body"),
  automationGrid: document.querySelector("#automation-grid"),
  ruleTestInput: document.querySelector("#rule-test-input"),
  testResult: document.querySelector("#test-result"),
  metricsGrid: document.querySelector("#metrics-grid"),
  channelBars: document.querySelector("#channel-bars"),
  recentActivity: document.querySelector("#recent-activity"),
  simulationModal: document.querySelector("#simulation-modal"),
  simulationForm: document.querySelector("#simulation-form"),
  ruleModal: document.querySelector("#rule-modal"),
  ruleForm: document.querySelector("#rule-form"),
  toast: document.querySelector("#toast")
};

init();

function init() {
  bindNavigation();
  bindInbox();
  bindModals();
  bindAutomationTools();
  renderAll();
}

function bindNavigation() {
  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      document.querySelectorAll("[data-view]").forEach(item => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-view-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.viewPanel === view));
      const labels = { inbox: "Bandeja de atención", contacts: "Contactos capturados", automations: "Automatizaciones", dashboard: "Resumen de atención" };
      els.viewTitle.textContent = labels[view] || "ReplyFlow";
      els.sidebar.classList.remove("open");
      renderAll();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  els.menuBtn.addEventListener("click", () => els.sidebar.classList.toggle("open"));
}

function bindInbox() {
  els.search.addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderConversationList();
  });

  els.filters.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    conversationFilter = button.dataset.filter;
    els.filters.querySelectorAll(".chip").forEach(chip => chip.classList.toggle("active", chip === button));
    renderConversationList();
  });

  els.messageForm.addEventListener("submit", event => {
    event.preventDefault();
    const text = els.messageInput.value.trim();
    const conversation = selectedConversation();
    if (!text || !conversation) return;
    conversation.messages.push({ from: "agent", text, time: currentTime() });
    conversation.unread = false;
    conversation.updatedAt = Date.now();
    persistConversations();
    els.messageInput.value = "";
    renderAll();
    requestAnimationFrame(scrollChatToBottom);
  });
}

function bindModals() {
  document.querySelector("#simulate-btn").addEventListener("click", () => openModal("simulation-modal"));
  document.querySelector("#new-rule-btn").addEventListener("click", () => openModal("rule-modal"));
  document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => closeModal(button.dataset.close)));

  [els.simulationModal, els.ruleModal].forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal(modal.id);
    });
  });

  els.simulationForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(els.simulationForm);
    const message = data.get("message").trim();
    const match = findRule(message);
    const conversation = {
      id: `C-${Date.now().toString().slice(-5)}`,
      name: data.get("name").trim(),
      company: data.get("company").trim(),
      channel: data.get("channel"),
      phone: "Dato demo",
      email: "contacto@demo.local",
      status: "Nuevo lead",
      unread: true,
      needsHuman: Boolean(match?.name.toLowerCase().includes("derivación")),
      updatedAt: Date.now(),
      messages: [
        { from: "client", text: message, time: currentTime() },
        ...(match ? [{ from: "bot", text: match.reply, time: currentTime() }] : [])
      ]
    };
    conversations.unshift(conversation);
    selectedId = conversation.id;
    persistConversations();
    els.simulationForm.reset();
    closeModal("simulation-modal");
    switchToInbox();
    renderAll();
    showToast(match ? `Consulta simulada · regla: ${match.name}` : "Consulta simulada sin coincidencia automática");
  });

  els.ruleForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(els.ruleForm);
    rules.unshift({
      id: `R-${Date.now().toString().slice(-5)}`,
      name: data.get("name").trim(),
      keywords: data.get("keywords").split(",").map(value => value.trim().toLowerCase()).filter(Boolean),
      reply: data.get("reply").trim(),
      active: true
    });
    persistRules();
    els.ruleForm.reset();
    closeModal("rule-modal");
    renderAutomations();
    showToast("Regla creada para la demo");
  });
}

function bindAutomationTools() {
  document.querySelector("#test-rule-btn").addEventListener("click", () => {
    const value = els.ruleTestInput.value.trim();
    if (!value) {
      els.testResult.textContent = "Escribí un mensaje para probar las reglas.";
      return;
    }
    const match = findRule(value);
    els.testResult.innerHTML = match
      ? `<strong>${escapeHtml(match.name)}</strong><br>${escapeHtml(match.reply)}`
      : "Ninguna regla activa coincide con ese mensaje. La consulta quedaría pendiente para atención humana.";
  });

  document.querySelector("#export-demo").addEventListener("click", () => showToast("Exportación simulada: función demostrativa"));
}

function renderAll() {
  renderConversationList();
  renderSelectedConversation();
  renderContacts();
  renderAutomations();
  renderDashboard();
}

function renderConversationList() {
  let list = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  if (searchTerm) list = list.filter(item => `${item.name} ${item.company}`.toLowerCase().includes(searchTerm));
  if (conversationFilter === "unread") list = list.filter(item => item.unread);
  if (conversationFilter === "human") list = list.filter(item => item.needsHuman);

  els.openCounter.textContent = `${conversations.length} abiertas`;
  els.list.innerHTML = list.length ? list.map(item => {
    const last = item.messages[item.messages.length - 1];
    return `
      <button class="conversation-item ${item.id === selectedId ? "active" : ""}" data-conversation-id="${item.id}" type="button">
        <span class="conversation-avatar">${initials(item.name)}</span>
        <span class="conversation-copy"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(last?.text || "Sin mensajes")}</span></span>
        <span class="conversation-meta">${relativeTime(item.updatedAt)}${item.unread ? '<i class="unread-dot"></i>' : ""}</span>
      </button>`;
  }).join("") : `<div class="empty-state">No hay conversaciones con ese filtro.</div>`;

  els.list.querySelectorAll("[data-conversation-id]").forEach(button => {
    button.addEventListener("click", () => {
      selectedId = button.dataset.conversationId;
      const conversation = selectedConversation();
      if (conversation) conversation.unread = false;
      persistConversations();
      renderAll();
      requestAnimationFrame(scrollChatToBottom);
    });
  });
}

function renderSelectedConversation() {
  const conversation = selectedConversation();
  if (!conversation) {
    els.chatHead.innerHTML = "";
    els.chatBody.innerHTML = `<div class="empty-state">Seleccioná una conversación.</div>`;
    els.contactPanel.innerHTML = "";
    return;
  }

  els.chatHead.innerHTML = `
    <div class="chat-person"><span class="conversation-avatar">${initials(conversation.name)}</span><div><strong>${escapeHtml(conversation.name)}</strong><span>${escapeHtml(conversation.company)}</span></div></div>
    <div><span class="channel-badge">${escapeHtml(conversation.channel)}</span>${conversation.needsHuman ? '<span class="state-badge">Requiere humano</span>' : ""}</div>`;

  els.chatBody.innerHTML = conversation.messages.map(message => `
    <div class="message-row ${message.from}"><div class="message"><p>${escapeHtml(message.text)}</p><small>${message.from === "bot" ? "Respuesta automática · " : ""}${escapeHtml(message.time)}</small></div></div>`).join("");

  els.contactPanel.innerHTML = `
    <div class="contact-profile"><span class="conversation-avatar">${initials(conversation.name)}</span><strong>${escapeHtml(conversation.name)}</strong><span>${escapeHtml(conversation.company)}</span></div>
    <div class="detail-list">
      <div class="detail-row"><span>Estado</span><b class="lead-status">${escapeHtml(conversation.status)}</b></div>
      <div class="detail-row"><span>Canal</span><strong>${escapeHtml(conversation.channel)}</strong></div>
      <div class="detail-row"><span>Email</span><strong>${escapeHtml(conversation.email)}</strong></div>
      <div class="detail-row"><span>Teléfono</span><strong>${escapeHtml(conversation.phone)}</strong></div>
    </div>
    <button class="secondary-btn handoff-btn" id="handoff-btn" type="button">${conversation.needsHuman ? "Marcar como atendido" : "Derivar a humano"}</button>`;

  document.querySelector("#handoff-btn")?.addEventListener("click", () => {
    conversation.needsHuman = !conversation.needsHuman;
    conversation.status = conversation.needsHuman ? "Requiere atención" : "En seguimiento";
    persistConversations();
    renderAll();
    showToast(conversation.needsHuman ? "Conversación derivada" : "Conversación retomada");
  });
}

function renderContacts() {
  els.contactsBody.innerHTML = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt).map(item => `
    <tr>
      <td><div class="contact-cell"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.email)}</span></div></td>
      <td>${escapeHtml(item.company)}</td>
      <td>${escapeHtml(item.channel)}</td>
      <td><span class="lead-status">${escapeHtml(item.status)}</span></td>
      <td>${relativeTime(item.updatedAt)}</td>
    </tr>`).join("");
}

function renderAutomations() {
  els.automationGrid.innerHTML = rules.map(rule => `
    <article class="panel rule-card">
      <div class="rule-top"><div><span class="section-kicker">Regla automática</span><h2>${escapeHtml(rule.name)}</h2></div><label class="toggle"><input type="checkbox" data-rule-toggle="${rule.id}" ${rule.active ? "checked" : ""}><span></span></label></div>
      <p>${escapeHtml(rule.reply)}</p>
      <div class="keyword-list">${rule.keywords.map(keyword => `<span class="keyword">${escapeHtml(keyword)}</span>`).join("")}</div>
    </article>`).join("");

  els.automationGrid.querySelectorAll("[data-rule-toggle]").forEach(input => {
    input.addEventListener("change", () => {
      const rule = rules.find(item => item.id === input.dataset.ruleToggle);
      if (!rule) return;
      rule.active = input.checked;
      persistRules();
      showToast(rule.active ? "Regla activada" : "Regla pausada");
    });
  });
}

function renderDashboard() {
  const unread = conversations.filter(item => item.unread).length;
  const human = conversations.filter(item => item.needsHuman).length;
  const automated = conversations.reduce((sum, item) => sum + item.messages.filter(message => message.from === "bot").length, 0);
  const metrics = [
    ["Conversaciones", conversations.length, "Total de la demo"],
    ["Sin leer", unread, "Pendientes de revisión"],
    ["Derivadas", human, "Requieren atención humana"],
    ["Respuestas auto.", automated, "Generadas por reglas"]
  ];
  els.metricsGrid.innerHTML = metrics.map(([label, value, note]) => `<article class="panel metric-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join("");

  const counts = conversations.reduce((acc, item) => {
    acc[item.channel] = (acc[item.channel] || 0) + 1;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(counts));
  els.channelBars.innerHTML = Object.entries(counts).map(([channel, count]) => `
    <div class="bar-row"><span>${escapeHtml(channel)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(count / max * 100)}%"></div></div><strong>${count}</strong></div>`).join("");

  els.recentActivity.innerHTML = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4).map(item => `
    <div class="activity-item"><span class="conversation-avatar">${initials(item.name)}</span><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.channel)} · ${relativeTime(item.updatedAt)}</span></div></div>`).join("");
}

function findRule(text) {
  const value = text.toLowerCase();
  return rules.find(rule => rule.active && rule.keywords.some(keyword => value.includes(keyword)));
}

function selectedConversation() {
  return conversations.find(item => item.id === selectedId) || conversations[0] || null;
}

function switchToInbox() {
  document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === "inbox"));
  document.querySelectorAll("[data-view-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.viewPanel === "inbox"));
  els.viewTitle.textContent = "Bandeja de atención";
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
}

function persistConversations() {
  localStorage.setItem(STORAGE.conversations, JSON.stringify(conversations));
}

function persistRules() {
  localStorage.setItem(STORAGE.rules, JSON.stringify(rules));
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch {
    return JSON.parse(JSON.stringify(fallback));
  }
}

function relativeTime(timestamp) {
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} h` : `${Math.floor(hours / 24)} d`;
}

function currentTime() {
  return new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
}

function scrollChatToBottom() {
  els.chatBody.scrollTop = els.chatBody.scrollHeight;
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}
