const STORAGE = {
  conversations: "replyflow_demo_conversations_v2",
  flows: "replyflow_demo_flows_v2",
  events: "replyflow_demo_events_v2"
};

const seedConversations = [
  {
    id: "C-2101",
    name: "Paula López",
    company: "Estudio Norte",
    channel: "WhatsApp demo",
    phone: "+54 9 351 555 0101",
    email: "paula@estudionorte.demo",
    status: "Nuevo lead",
    priority: "high",
    assignee: "Ariel",
    tags: ["Presupuesto", "Web"],
    unread: true,
    needsHuman: false,
    automationOn: true,
    updatedAt: Date.now() - 2 * 60 * 1000,
    history: ["Lead capturado desde mensaje entrante", "Flujo “Consulta de precios” ejecutado"],
    messages: [
      { from: "client", text: "Hola, quisiera saber el precio del servicio.", time: "18:02" },
      { from: "bot", text: "¡Hola! Gracias por escribirnos. Los valores dependen del alcance. ¿Querés que un asesor te contacte?", time: "18:02", automation: "Consulta de precios" }
    ]
  },
  {
    id: "C-2102",
    name: "Martín Ríos",
    company: "Ríos Muebles",
    channel: "Instagram",
    phone: "+54 9 11 5555 0202",
    email: "martin@riosmuebles.demo",
    status: "Requiere atención",
    priority: "normal",
    assignee: "Ariel",
    tags: ["Personalizado"],
    unread: false,
    needsHuman: true,
    automationOn: false,
    updatedAt: Date.now() - 18 * 60 * 1000,
    history: ["Conversación derivada a atención humana", "Automatización pausada para este contacto"],
    messages: [
      { from: "client", text: "Necesito hablar con alguien por una propuesta personalizada.", time: "17:46" },
      { from: "bot", text: "Claro. Derivo tu consulta a una persona del equipo.", time: "17:46", automation: "Derivación a persona" },
      { from: "agent", text: "Hola Martín, tomo tu consulta. Contame qué necesitás y lo vemos juntos.", time: "17:50" }
    ]
  },
  {
    id: "C-2103",
    name: "Camila Vega",
    company: "Vega Deco",
    channel: "Web Chat",
    phone: "+54 9 351 555 0303",
    email: "camila@vegadeco.demo",
    status: "Calificado",
    priority: "normal",
    assignee: "Automatización",
    tags: ["Horarios", "Calificado"],
    unread: false,
    needsHuman: false,
    automationOn: true,
    updatedAt: Date.now() - 54 * 60 * 1000,
    history: ["Contacto calificado automáticamente", "Etiqueta “Horarios” agregada"],
    messages: [
      { from: "client", text: "¿Qué horarios de atención tienen?", time: "17:10" },
      { from: "bot", text: "Nuestro horario de atención es de lunes a viernes de 9 a 18 h.", time: "17:10", automation: "Horarios de atención" }
    ]
  },
  {
    id: "C-2104",
    name: "Luciano Benítez",
    company: "LB Ingeniería",
    channel: "WhatsApp demo",
    phone: "+54 9 351 555 0404",
    email: "luciano@lbingenieria.demo",
    status: "En seguimiento",
    priority: "normal",
    assignee: "Sin asignar",
    tags: ["Información"],
    unread: true,
    needsHuman: false,
    automationOn: true,
    updatedAt: Date.now() - 80 * 60 * 1000,
    history: ["Mensaje recibido sin coincidencia de flujo"],
    messages: [
      { from: "client", text: "Hola, vi la web y quiero más información.", time: "16:44" }
    ]
  },
  {
    id: "C-2105",
    name: "Sofía Molina",
    company: "Molina Arquitectura",
    channel: "Instagram",
    phone: "+54 9 351 555 0505",
    email: "sofia@molina.demo",
    status: "Calificado",
    priority: "normal",
    assignee: "Automatización",
    tags: ["Servicios"],
    unread: false,
    needsHuman: false,
    automationOn: true,
    updatedAt: Date.now() - 4 * 60 * 60 * 1000,
    history: ["Flujo “Servicios disponibles” ejecutado"],
    messages: [
      { from: "client", text: "¿Qué servicios ofrecen?", time: "14:05" },
      { from: "bot", text: "Podemos ayudarte con desarrollo web, automatizaciones e integraciones. ¿Qué necesitás resolver?", time: "14:05", automation: "Servicios disponibles" }
    ]
  }
];

const seedFlows = [
  {
    id: "F-1",
    name: "Consulta de precios",
    keywords: ["precio", "precios", "valor", "costo", "presupuesto"],
    reply: "¡Hola! Gracias por escribirnos. Los valores dependen del alcance. ¿Querés que un asesor te contacte?",
    action: "tag",
    tag: "Presupuesto",
    active: true,
    runs: 18
  },
  {
    id: "F-2",
    name: "Horarios de atención",
    keywords: ["horario", "horarios", "atienden", "abren"],
    reply: "Nuestro horario de atención es de lunes a viernes de 9 a 18 h.",
    action: "tag",
    tag: "Horarios",
    active: true,
    runs: 11
  },
  {
    id: "F-3",
    name: "Derivación a persona",
    keywords: ["asesor", "persona", "humano", "hablar con alguien"],
    reply: "Claro. Derivo tu consulta a una persona del equipo.",
    action: "handoff",
    tag: "Atención humana",
    active: true,
    runs: 7
  },
  {
    id: "F-4",
    name: "Servicios disponibles",
    keywords: ["servicio", "servicios", "hacen", "ofrecen"],
    reply: "Podemos ayudarte con desarrollo web, automatizaciones e integraciones. ¿Qué necesitás resolver?",
    action: "reply",
    tag: "",
    active: true,
    runs: 14
  }
];

const seedEvents = [
  { id: "E-1", time: Date.now() - 3 * 60 * 1000, method: "POST", source: "WhatsApp demo", detail: "message.received · C-2101", code: 200 },
  { id: "E-2", time: Date.now() - 18 * 60 * 1000, method: "POST", source: "Instagram", detail: "handoff.created · C-2102", code: 200 },
  { id: "E-3", time: Date.now() - 55 * 60 * 1000, method: "POST", source: "Web Chat", detail: "automation.executed · F-2", code: 200 }
];

let conversations = load(STORAGE.conversations, seedConversations);
let flows = load(STORAGE.flows, seedFlows);
let events = load(STORAGE.events, seedEvents);
let selectedId = conversations[0]?.id || null;
let conversationFilter = "all";
let searchTerm = "";
let webhookPayload = buildWebhookPayload(conversations[0]);

const els = {
  sidebar: document.querySelector("#sidebar"),
  menuBtn: document.querySelector("#menu-btn"),
  viewTitle: document.querySelector("#view-title"),
  navUnread: document.querySelector("#nav-unread"),
  list: document.querySelector("#conversation-list"),
  search: document.querySelector("#conversation-search"),
  filters: document.querySelector("#conversation-filters"),
  openCounter: document.querySelector("#open-counter"),
  chatHead: document.querySelector("#chat-head"),
  chatContextBar: document.querySelector("#chat-context-bar"),
  chatBody: document.querySelector("#chat-body"),
  contactPanel: document.querySelector("#contact-panel"),
  messageForm: document.querySelector("#message-form"),
  messageInput: document.querySelector("#message-input"),
  contactsBody: document.querySelector("#contacts-body"),
  contactsCount: document.querySelector("#contacts-count"),
  mobileContacts: document.querySelector("#mobile-contact-list"),
  automationSummary: document.querySelector("#automation-summary"),
  automationGrid: document.querySelector("#automation-grid"),
  ruleTestInput: document.querySelector("#rule-test-input"),
  testResult: document.querySelector("#test-result"),
  webhookPayload: document.querySelector("#webhook-payload"),
  deliverySteps: document.querySelector("#delivery-steps"),
  eventLog: document.querySelector("#event-log"),
  metricsGrid: document.querySelector("#metrics-grid"),
  channelBars: document.querySelector("#channel-bars"),
  statusBars: document.querySelector("#status-bars"),
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
  bindWebhookLab();
  bindGlobalActions();
  renderAll();
}

function bindNavigation() {
  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
  els.menuBtn.addEventListener("click", () => els.sidebar.classList.toggle("open"));
}

function switchView(view) {
  const labels = {
    inbox: "Bandeja omnicanal",
    automations: "Automation Studio",
    webhooks: "Webhook Lab",
    contacts: "Contactos capturados",
    analytics: "Analítica de atención"
  };
  document.querySelectorAll("[data-view]").forEach(item => item.classList.toggle("active", item.dataset.view === view));
  document.querySelectorAll("[data-view-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.viewPanel === view));
  els.viewTitle.textContent = labels[view] || "ReplyFlow";
  els.sidebar.classList.remove("open");
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    sendAgentMessage(els.messageInput.value.trim());
  });

  document.querySelector("#quick-replies").addEventListener("click", event => {
    const button = event.target.closest("[data-quick-reply]");
    if (!button) return;
    sendAgentMessage(button.dataset.quickReply);
  });
}

function sendAgentMessage(text) {
  const conversation = selectedConversation();
  if (!text || !conversation) return;
  conversation.messages.push({ from: "agent", text, time: currentTime() });
  conversation.unread = false;
  conversation.updatedAt = Date.now();
  conversation.assignee = conversation.assignee === "Sin asignar" ? "Ariel" : conversation.assignee;
  conversation.history.unshift("Respuesta manual enviada por operador");
  persistConversations();
  els.messageInput.value = "";
  renderAll();
  requestAnimationFrame(scrollChatToBottom);
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

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal("simulation-modal");
      closeModal("rule-modal");
      els.sidebar.classList.remove("open");
    }
  });

  els.simulationForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(els.simulationForm);
    const message = data.get("message").trim();
    const match = findFlow(message);
    const id = `C-${Date.now().toString().slice(-5)}`;
    const tags = ["Nuevo"];
    let needsHuman = false;
    let status = "Nuevo lead";
    let assignee = "Sin asignar";

    if (match?.action === "tag" && match.tag) tags.push(match.tag);
    if (match?.action === "handoff") {
      needsHuman = true;
      status = "Requiere atención";
      assignee = "Ariel";
      if (match.tag) tags.push(match.tag);
    }

    const conversation = {
      id,
      name: data.get("name").trim(),
      company: data.get("company").trim(),
      channel: data.get("channel"),
      phone: "Dato demo",
      email: "contacto@demo.local",
      status,
      priority: data.get("priority"),
      assignee,
      tags,
      unread: true,
      needsHuman,
      automationOn: true,
      updatedAt: Date.now(),
      history: ["Mensaje entrante recibido", ...(match ? [`Flujo “${match.name}” ejecutado`] : ["Sin coincidencia automática"])],
      messages: [
        { from: "client", text: message, time: currentTime() },
        ...(match ? [{ from: "bot", text: match.reply, time: currentTime(), automation: match.name }] : [])
      ]
    };

    if (match) match.runs += 1;
    conversations.unshift(conversation);
    selectedId = id;
    webhookPayload = buildWebhookPayload(conversation, message);
    addEvent(data.get("channel"), `message.received · ${id}`);
    if (match) addEvent("Automation Engine", `flow.executed · ${match.id}`);
    persistAll();
    els.simulationForm.reset();
    closeModal("simulation-modal");
    switchView("inbox");
    showToast(match ? `Mensaje procesado · flujo: ${match.name}` : "Mensaje recibido · requiere revisión manual");
    requestAnimationFrame(scrollChatToBottom);
  });

  els.ruleForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(els.ruleForm);
    const flow = {
      id: `F-${Date.now().toString().slice(-5)}`,
      name: data.get("name").trim(),
      keywords: data.get("keywords").split(",").map(value => value.trim().toLowerCase()).filter(Boolean),
      reply: data.get("reply").trim(),
      action: data.get("action"),
      tag: data.get("tag").trim(),
      active: true,
      runs: 0
    };
    flows.unshift(flow);
    persistFlows();
    els.ruleForm.reset();
    closeModal("rule-modal");
    renderAutomations();
    showToast("Flujo agregado al Automation Studio");
  });
}

function bindAutomationTools() {
  document.querySelector("#test-rule-btn").addEventListener("click", () => {
    const value = els.ruleTestInput.value.trim();
    if (!value) {
      els.testResult.textContent = "Escribí un mensaje para probar los flujos.";
      return;
    }
    const match = findFlow(value);
    if (!match) {
      els.testResult.innerHTML = "<strong>Sin coincidencia</strong><br>El mensaje quedaría disponible para revisión humana.";
      return;
    }
    const actionLabel = actionText(match);
    els.testResult.innerHTML = `<strong>${escapeHtml(match.name)}</strong><br>Trigger: ${escapeHtml(match.keywords.join(", "))}<br>Acciones: responder automáticamente · ${escapeHtml(actionLabel)}<br><br>${escapeHtml(match.reply)}`;
  });

  document.querySelector("#export-demo").addEventListener("click", exportContactsCsv);
}

function bindWebhookLab() {
  document.querySelector("#webhook-trigger-btn").addEventListener("click", () => {
    const sources = ["WhatsApp demo", "Instagram", "Web Chat"];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const mock = {
      id: `evt_${Date.now()}`,
      type: "message.received",
      channel: source,
      timestamp: new Date().toISOString(),
      contact: { id: `demo_${Math.floor(Math.random() * 9000 + 1000)}`, name: "Contacto simulado" },
      message: { type: "text", text: "Consulta generada desde Webhook Lab" }
    };
    webhookPayload = mock;
    addEvent(source, `message.received · ${mock.contact.id}`);
    renderWebhookLab();
    showToast("Webhook simulado procesado correctamente");
  });

  document.querySelector("#clear-events-btn").addEventListener("click", () => {
    events = [];
    persistEvents();
    renderWebhookLab();
    showToast("Registro de eventos limpiado");
  });
}

function bindGlobalActions() {
  document.querySelector("#reset-demo-btn").addEventListener("click", () => {
    Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
    conversations = clone(seedConversations);
    flows = clone(seedFlows);
    events = clone(seedEvents);
    selectedId = conversations[0].id;
    webhookPayload = buildWebhookPayload(conversations[0]);
    renderAll();
    showToast("Demo reiniciada");
  });
}

function renderAll() {
  renderConversationList();
  renderSelectedConversation();
  renderContacts();
  renderAutomations();
  renderWebhookLab();
  renderAnalytics();
  renderNavState();
}

function renderNavState() {
  const unread = conversations.filter(item => item.unread).length;
  els.navUnread.textContent = unread;
  els.navUnread.hidden = unread === 0;
}

function renderConversationList() {
  let list = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  if (searchTerm) list = list.filter(item => `${item.name} ${item.company} ${item.tags.join(" ")}`.toLowerCase().includes(searchTerm));
  if (conversationFilter === "unread") list = list.filter(item => item.unread);
  if (conversationFilter === "human") list = list.filter(item => item.needsHuman);
  if (conversationFilter === "bot") list = list.filter(item => item.automationOn && !item.needsHuman);

  els.openCounter.textContent = `${conversations.length} abiertas`;
  els.list.innerHTML = list.length ? list.map(item => {
    const last = item.messages[item.messages.length - 1];
    return `
      <button class="conversation-item ${item.id === selectedId ? "active" : ""} ${item.priority === "high" ? "high" : ""}" data-conversation-id="${item.id}" type="button">
        <span class="conversation-avatar">${initials(item.name)}</span>
        <span class="conversation-copy">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(last?.text || "Sin mensajes")}</span>
          <small><i class="mini-channel" style="background:${channelColor(item.channel)}"></i>${escapeHtml(item.channel)} · ${escapeHtml(item.assignee)}</small>
        </span>
        <span class="conversation-meta">${relativeTime(item.updatedAt)}${item.unread ? '<i class="unread-dot"></i>' : ""}${item.priority === "high" ? '<b class="priority-flag">!</b>' : ""}</span>
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
    els.chatContextBar.innerHTML = "";
    els.chatBody.innerHTML = `<div class="empty-state">Seleccioná una conversación.</div>`;
    els.contactPanel.innerHTML = "";
    return;
  }

  els.chatHead.innerHTML = `
    <div class="chat-person">
      <span class="conversation-avatar">${initials(conversation.name)}</span>
      <div><strong>${escapeHtml(conversation.name)}</strong><span>${escapeHtml(conversation.company)} · ${escapeHtml(conversation.id)}</span></div>
    </div>
    <div class="chat-head-actions">
      <span class="channel-badge">${escapeHtml(conversation.channel)}</span>
      ${conversation.priority === "high" ? '<span class="priority-badge">Prioridad alta</span>' : ""}
      ${conversation.needsHuman ? '<span class="state-badge">Atención humana</span>' : '<span class="automation-badge">Automatización</span>'}
    </div>`;

  els.chatContextBar.innerHTML = `
    <label class="context-pill">Responsable <select id="assignee-select"><option ${conversation.assignee === "Sin asignar" ? "selected" : ""}>Sin asignar</option><option ${conversation.assignee === "Ariel" ? "selected" : ""}>Ariel</option><option ${conversation.assignee === "Automatización" ? "selected" : ""}>Automatización</option></select></label>
    <label class="context-pill">Estado <select id="status-select"><option ${conversation.status === "Nuevo lead" ? "selected" : ""}>Nuevo lead</option><option ${conversation.status === "En seguimiento" ? "selected" : ""}>En seguimiento</option><option ${conversation.status === "Calificado" ? "selected" : ""}>Calificado</option><option ${conversation.status === "Requiere atención" ? "selected" : ""}>Requiere atención</option><option ${conversation.status === "Cerrado" ? "selected" : ""}>Cerrado</option></select></label>
    <button class="context-pill" id="automation-toggle" type="button"><b>${conversation.automationOn ? "Automatización ON" : "Automatización OFF"}</b></button>`;

  els.chatBody.innerHTML = `<div class="day-separator"><span>Hoy · conversación demo</span></div>` + conversation.messages.map(message => `
    <div class="message-row ${message.from}">
      <div class="message">
        <p>${escapeHtml(message.text)}</p>
        <small>${message.from === "bot" ? `<span class="message-meta-label">Bot${message.automation ? ` · ${escapeHtml(message.automation)}` : ""}</span> · ` : message.from === "agent" ? '<span class="message-meta-label">Operador</span> · ' : ""}${escapeHtml(message.time)}</small>
      </div>
    </div>`).join("");

  els.contactPanel.innerHTML = `
    <div class="contact-profile"><span class="conversation-avatar">${initials(conversation.name)}</span><strong>${escapeHtml(conversation.name)}</strong><span>${escapeHtml(conversation.company)}</span></div>
    <div class="context-section">
      <div class="context-section-title"><strong>Datos del contacto</strong></div>
      <div class="detail-list">
        <div class="detail-row"><span>Email</span><strong>${escapeHtml(conversation.email)}</strong></div>
        <div class="detail-row"><span>Teléfono</span><strong>${escapeHtml(conversation.phone)}</strong></div>
        <div class="detail-row"><span>Canal</span><strong>${escapeHtml(conversation.channel)}</strong></div>
      </div>
    </div>
    <div class="context-section">
      <div class="context-section-title"><strong>Etiquetas</strong></div>
      <div class="tag-list">${conversation.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
    <div class="context-section">
      <div class="context-section-title"><strong>Historial operativo</strong></div>
      <div class="activity-timeline">${conversation.history.slice(0,4).map(item => `<div class="timeline-item"><i></i><span>${escapeHtml(item)}</span></div>`).join("")}</div>
    </div>
    <div class="context-section"><button class="secondary-btn handoff-btn" id="handoff-btn" type="button">${conversation.needsHuman ? "Cerrar handoff" : "Derivar a humano"}</button></div>`;

  document.querySelector("#assignee-select")?.addEventListener("change", event => {
    conversation.assignee = event.target.value;
    conversation.history.unshift(`Responsable cambiado a ${conversation.assignee}`);
    persistConversations();
    renderAll();
  });

  document.querySelector("#status-select")?.addEventListener("change", event => {
    conversation.status = event.target.value;
    conversation.needsHuman = conversation.status === "Requiere atención";
    conversation.history.unshift(`Estado actualizado a ${conversation.status}`);
    persistConversations();
    renderAll();
  });

  document.querySelector("#automation-toggle")?.addEventListener("click", () => {
    conversation.automationOn = !conversation.automationOn;
    conversation.history.unshift(conversation.automationOn ? "Automatización activada" : "Automatización pausada");
    persistConversations();
    renderAll();
    showToast(conversation.automationOn ? "Automatización activada" : "Automatización pausada para este contacto");
  });

  document.querySelector("#handoff-btn")?.addEventListener("click", () => {
    conversation.needsHuman = !conversation.needsHuman;
    conversation.status = conversation.needsHuman ? "Requiere atención" : "En seguimiento";
    conversation.assignee = conversation.needsHuman ? "Ariel" : conversation.assignee;
    conversation.automationOn = !conversation.needsHuman;
    conversation.history.unshift(conversation.needsHuman ? "Handoff creado para atención humana" : "Handoff cerrado");
    addEvent("ReplyFlow", `${conversation.needsHuman ? "handoff.created" : "handoff.closed"} · ${conversation.id}`);
    persistAll();
    renderAll();
    showToast(conversation.needsHuman ? "Conversación derivada" : "Handoff cerrado");
  });
}

function renderContacts() {
  const ordered = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  els.contactsCount.textContent = `${ordered.length} contactos`;
  els.contactsBody.innerHTML = ordered.map(item => `
    <tr>
      <td><div class="contact-cell"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.email)}</span></div></td>
      <td>${escapeHtml(item.company)}</td>
      <td>${escapeHtml(item.channel)}</td>
      <td><span class="status-pill">${escapeHtml(item.status)}</span></td>
      <td><div class="tag-list">${item.tags.slice(0,2).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div></td>
      <td><span class="assignee-pill"><i>${initials(item.assignee)}</i>${escapeHtml(item.assignee)}</span></td>
      <td>${relativeTime(item.updatedAt)}</td>
    </tr>`).join("");

  els.mobileContacts.innerHTML = ordered.map(item => `
    <article class="mobile-contact-card">
      <div class="mobile-contact-card-head"><span class="conversation-avatar">${initials(item.name)}</span><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.company)} · ${escapeHtml(item.channel)}</span></div></div>
      <div class="mobile-contact-meta"><span class="status-pill">${escapeHtml(item.status)}</span>${item.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </article>`).join("");
}

function renderAutomations() {
  const active = flows.filter(flow => flow.active).length;
  const totalRuns = flows.reduce((sum, flow) => sum + flow.runs, 0);
  const handoffs = flows.filter(flow => flow.action === "handoff").reduce((sum, flow) => sum + flow.runs, 0);
  const coverage = Math.min(100, Math.round((totalRuns / Math.max(1, totalRuns + conversations.filter(c => c.messages.length === 1).length)) * 100));
  const cards = [
    ["Flujos activos", active],
    ["Ejecuciones demo", totalRuns],
    ["Handoffs", handoffs],
    ["Cobertura estimada", `${coverage}%`]
  ];
  els.automationSummary.innerHTML = cards.map(([label, value]) => `<article class="summary-card"><span>${label}</span><strong>${value}</strong></article>`).join("");

  els.automationGrid.innerHTML = flows.map(flow => `
    <article class="panel flow-card">
      <div class="flow-top">
        <div><span class="section-kicker">Flujo ${escapeHtml(flow.id)}</span><h2>${escapeHtml(flow.name)}</h2><p>${escapeHtml(flow.reply)}</p></div>
        <label class="toggle" title="Activar o pausar"><input type="checkbox" data-flow-toggle="${flow.id}" ${flow.active ? "checked" : ""}><span></span></label>
      </div>
      <div class="flow-chain">
        <div class="flow-node"><span>Trigger</span><strong>Mensaje entrante</strong></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node"><span>Condición</span><strong>${escapeHtml(flow.keywords.slice(0,3).join(" · "))}</strong></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node"><span>Acción</span><strong>${escapeHtml(actionText(flow))}</strong></div>
      </div>
      <div class="flow-footer"><span class="flow-stats"><b>${flow.runs}</b> ejecuciones simuladas</span><span class="${flow.active ? "automation-badge" : "state-badge"}">${flow.active ? "Activo" : "Pausado"}</span></div>
    </article>`).join("");

  els.automationGrid.querySelectorAll("[data-flow-toggle]").forEach(input => {
    input.addEventListener("change", () => {
      const flow = flows.find(item => item.id === input.dataset.flowToggle);
      if (!flow) return;
      flow.active = input.checked;
      persistFlows();
      renderAutomations();
      showToast(flow.active ? "Flujo activado" : "Flujo pausado");
    });
  });
}

function renderWebhookLab() {
  els.webhookPayload.textContent = JSON.stringify(webhookPayload, null, 2);
  const steps = [
    ["1", "Recepción", "Payload validado", "OK"],
    ["2", "Normalización", "Canal convertido a modelo interno", "OK"],
    ["3", "Automation Engine", "Reglas evaluadas", "OK"],
    ["4", "Persistencia", "Evento registrado localmente", "OK"]
  ];
  els.deliverySteps.innerHTML = steps.map(([icon, title, copy, state]) => `<div class="delivery-step"><span class="step-icon">${icon}</span><div><strong>${title}</strong><span>${copy}</span></div><b class="step-state">${state}</b></div>`).join("");
  els.eventLog.innerHTML = events.length ? [...events].sort((a,b) => b.time - a.time).slice(0,10).map(event => `
    <div class="event-row"><time>${formatEventTime(event.time)}</time><span class="event-method">${escapeHtml(event.method)}</span><b>${escapeHtml(event.source)} · ${escapeHtml(event.detail)}</b><span class="event-code">${event.code}</span></div>`).join("") : `<div class="empty-state">No hay eventos registrados.</div>`;
}

function renderAnalytics() {
  const unread = conversations.filter(item => item.unread).length;
  const human = conversations.filter(item => item.needsHuman).length;
  const automated = conversations.reduce((sum, item) => sum + item.messages.filter(message => message.from === "bot").length, 0);
  const manual = conversations.reduce((sum, item) => sum + item.messages.filter(message => message.from === "agent").length, 0);
  const metrics = [
    ["Conversaciones", conversations.length, "Contactos activos en la demo"],
    ["Sin leer", unread, "Pendientes de revisión"],
    ["Respuestas automáticas", automated, "Generadas por flujos"],
    ["Intervenciones humanas", manual + human, "Respuestas + handoffs"]
  ];
  els.metricsGrid.innerHTML = metrics.map(([label, value, note]) => `<article class="panel metric-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join("");

  const channelCounts = countBy(conversations, item => item.channel);
  renderBars(els.channelBars, channelCounts);

  const statusCounts = countBy(conversations, item => item.status);
  renderBars(els.statusBars, statusCounts);

  els.recentActivity.innerHTML = [...conversations].sort((a,b) => b.updatedAt - a.updatedAt).slice(0,5).map(item => `
    <div class="activity-item"><span class="conversation-avatar">${initials(item.name)}</span><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.status)} · ${relativeTime(item.updatedAt)}</span></div></div>`).join("");
}

function renderBars(target, counts) {
  const entries = Object.entries(counts);
  const max = Math.max(1, ...entries.map(([,count]) => count));
  target.innerHTML = entries.map(([label, count]) => `
    <div class="bar-row"><span>${escapeHtml(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(count / max * 100)}%"></div></div><strong>${count}</strong></div>`).join("");
}

function findFlow(text) {
  const value = text.toLowerCase();
  return flows.find(flow => flow.active && flow.keywords.some(keyword => value.includes(keyword)));
}

function actionText(flow) {
  if (flow.action === "handoff") return "Responder + derivar a humano";
  if (flow.action === "tag") return `Responder + etiqueta${flow.tag ? ` “${flow.tag}”` : ""}`;
  return "Responder automáticamente";
}

function selectedConversation() {
  return conversations.find(item => item.id === selectedId) || conversations[0] || null;
}

function addEvent(source, detail) {
  events.unshift({ id: `E-${Date.now()}`, time: Date.now(), method: "POST", source, detail, code: 200 });
  events = events.slice(0,30);
  persistEvents();
}

function buildWebhookPayload(conversation, messageText) {
  if (!conversation) return { event: "message.received", demo: true };
  return {
    id: `evt_${Date.now()}`,
    type: "message.received",
    channel: conversation.channel,
    timestamp: new Date().toISOString(),
    contact: {
      id: conversation.id,
      name: conversation.name,
      company: conversation.company
    },
    message: {
      type: "text",
      text: messageText || conversation.messages[0]?.text || "Mensaje demo"
    },
    demo: true
  };
}

function exportContactsCsv() {
  const rows = [
    ["Nombre", "Empresa", "Email", "Canal", "Estado", "Responsable", "Etiquetas"],
    ...conversations.map(item => [item.name, item.company, item.email, item.channel, item.status, item.assignee, item.tags.join(" | ")])
  ];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "replyflow-contactos-demo.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("CSV demo generado");
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector("input, select, textarea, button")?.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = "";
}

function persistConversations() { localStorage.setItem(STORAGE.conversations, JSON.stringify(conversations)); }
function persistFlows() { localStorage.setItem(STORAGE.flows, JSON.stringify(flows)); }
function persistEvents() { localStorage.setItem(STORAGE.events, JSON.stringify(events)); }
function persistAll() { persistConversations(); persistFlows(); persistEvents(); }

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function clone(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function countBy(items, getter) {
  return items.reduce((acc, item) => {
    const key = getter(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function relativeTime(timestamp) {
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} h` : `${Math.floor(hours / 24)} d`;
}

function formatEventTime(timestamp) {
  return new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(timestamp));
}

function currentTime() {
  return new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

function initials(name) {
  const value = String(name || "NA").trim();
  return value.split(/\s+/).slice(0,2).map(part => part[0]).join("").toUpperCase();
}

function channelColor(channel) {
  if (channel.includes("WhatsApp")) return "#22c77c";
  if (channel.includes("Instagram")) return "#d657a7";
  return "#4a86ff";
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
