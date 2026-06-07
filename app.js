const carriers = {
  ups: {
    name: "UPS",
    short: "UPS",
    section: "parcel",
    color: "#7a4b21",
    portal: "https://www.ups.com/ca/en/business-solutions/pickup-dropoff-options/schedule-pickup.page",
    note: "Pickup and shipment portal",
    checklist: {
      pickup: [
        "Open UPS pickup scheduling.",
        "Confirm pickup address, contact, ready time, close time, package count, and total weight.",
        "Submit only after the generated summary matches the portal form.",
        "Paste the confirmation number into notes, then save the log."
      ],
      shipment: [
        "Open UPS shipping.",
        "Enter origin, destination, service level, package dimensions, and weight.",
        "Create or print the label, then add tracking to notes.",
        "Save the log and draft the recipient email."
      ],
      email: [
        "Review the generated email.",
        "Add the pickup confirmation or tracking number if available.",
        "Open the email draft and send after review."
      ]
    }
  },
  purolator: {
    name: "Purelator",
    short: "Pure",
    section: "parcel",
    color: "#225ca8",
    portal: "https://www.purolator.com/en/shipping/pickup-and-dropoff",
    note: "Pickup, labels, tracking",
    checklist: {
      pickup: [
        "Open Purolator pickup and sign in if needed.",
        "Use the ready date, ready time, close time, package count, and contact details from this page.",
        "Check whether the shipment already has labels before submitting.",
        "Save the pickup confirmation number in the log."
      ],
      shipment: [
        "Open Purolator shipping tools.",
        "Create the shipment using the origin, destination, service, package, and billing details.",
        "Add tracking or PIN details to notes.",
        "Save the log before emailing the contact."
      ],
      email: [
        "Review the generated message.",
        "Include any Purolator PIN, tracking, or pickup confirmation.",
        "Open the mail draft and send after review."
      ]
    }
  },
  shipsavvy: {
    name: "ShipSavvy",
    short: "SS",
    section: "parcel",
    color: "#176b55",
    portal: "https://shipsavvy.com/",
    note: "Create shipments",
    checklist: {
      pickup: [
        "Open ShipSavvy and choose the relevant carrier or shipment.",
        "Confirm pickup location, package count, and pickup window.",
        "Book the pickup or attach the carrier pickup reference.",
        "Save the log with the shipment or pickup reference."
      ],
      shipment: [
        "Open ShipSavvy and start a new shipment.",
        "Enter destination, package details, service level, and billing/account settings.",
        "Buy or create the label, then paste tracking into notes.",
        "Save the log and draft the notification email."
      ],
      email: [
        "Review the generated email for the ShipSavvy shipment.",
        "Add tracking, label, pickup, or reference details if available.",
        "Open the draft and send after review."
      ]
    }
  },
  canadaPost: {
    name: "Canada Post",
    short: "CP",
    section: "parcel",
    color: "#d3222a",
    portal: "https://www.canadapost-postescanada.ca/cpc/en/commercial/pickup-deposit-delivery/schedule-pickup.page",
    note: "Business pickup and labels",
    checklist: {
      pickup: [
        "Open Canada Post business pickup scheduling.",
        "Confirm pickup address, contact, ready time, close time, package count, and service.",
        "Check that labels or manifests are ready before the pickup window.",
        "Save the pickup confirmation or manifest details in the log."
      ],
      shipment: [
        "Open Canada Post shipping tools.",
        "Enter destination, package details, service level, and business account details.",
        "Create the label or manifest, then add tracking to notes.",
        "Save the log and draft the recipient email."
      ],
      email: [
        "Review the generated Canada Post email.",
        "Add tracking, manifest, or pickup confirmation details if available.",
        "Open the draft and send after review."
      ]
    }
  },
  abCourier: {
    name: "AB Courier",
    short: "AB",
    section: "ltl",
    color: "#263c73",
    portal: "https://www.abcourier.com/",
    note: "LTL and courier freight",
    checklist: {
      pickup: [
        "Open AB Courier and confirm the pickup or order booking flow.",
        "Confirm pickup address, dock details, contact, freight count, and pickup window.",
        "Include vehicle or LTL requirements in notes before submitting.",
        "Save the order or pickup reference in the log."
      ],
      shipment: [
        "Open AB Courier and start the shipment/order workflow.",
        "Enter shipper, consignee, freight pieces, weight, dimensions, and service details.",
        "Confirm accessorials such as tailgate, appointment, dock, or inside pickup if needed.",
        "Save the order/tracking reference and draft the notification email."
      ],
      email: [
        "Review the generated AB Courier freight update.",
        "Add order, pickup, tracking, or appointment details if available.",
        "Open the draft and send after review."
      ]
    }
  },
  freightera: {
    name: "Freightera",
    short: "FR",
    section: "ltl",
    color: "#b56a16",
    portal: "https://www.freightera.com/",
    note: "LTL freight marketplace",
    checklist: {
      pickup: [
        "Open Freightera and find the booked freight shipment.",
        "Confirm pickup address, freight pieces, weight, dimensions, and pickup date.",
        "Check accessorials such as tailgate, residential, appointment, or limited access.",
        "Save the carrier pickup or booking reference in the log."
      ],
      shipment: [
        "Open Freightera and quote or book an LTL shipment.",
        "Enter origin, destination, pallet/piece count, weight, dimensions, and accessorials.",
        "Compare rates, select the carrier/service, and book after review.",
        "Save booking, BOL, and tracking details before drafting the email."
      ],
      email: [
        "Review the generated Freightera freight update.",
        "Add booking, BOL, pickup, or tracking details if available.",
        "Open the draft and send after review."
      ]
    }
  }
};

const carrierSections = [
  { id: "parcel", label: "Parcel" },
  { id: "ltl", label: "LTL" }
];

const state = {
  carrier: "ups",
  task: "pickup"
};

const storageKeys = {
  history: "shippingDesk.history",
  templates: "shippingDesk.templates"
};

const form = document.querySelector("#shippingForm");
const carrierList = document.querySelector("#carrierList");
const checklist = document.querySelector("#checklist");
const emailDraft = document.querySelector("#emailDraft");
const historyList = document.querySelector("#historyList");
const templateSelect = document.querySelector("#templateSelect");
const savedNotice = document.querySelector("#savedNotice");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formData() {
  return Object.fromEntries(new FormData(form).entries());
}

function setFormData(values) {
  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
  renderOutputs();
}

function getStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function flash(message) {
  savedNotice.textContent = message;
  window.clearTimeout(flash.timer);
  flash.timer = window.setTimeout(() => {
    savedNotice.textContent = "";
  }, 2200);
}

function carrierPortal() {
  return carriers[state.carrier].portal;
}

function renderCarriers() {
  carrierList.innerHTML = "";
  carrierSections.forEach((section) => {
    const sectionCarriers = Object.entries(carriers).filter(([, carrier]) => carrier.section === section.id);
    if (!sectionCarriers.length) return;

    const heading = document.createElement("div");
    heading.className = "carrier-section-title";
    heading.textContent = section.label;
    carrierList.append(heading);

    sectionCarriers.forEach(([id, carrier]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `carrier-button ${id === state.carrier ? "active" : ""}`;
      button.dataset.carrier = id;
      button.innerHTML = `
        <span class="carrier-logo" style="background:${carrier.color}">${carrier.short}</span>
        <span>
          <span class="carrier-name">${carrier.name}</span>
          <span class="carrier-note">${carrier.note}</span>
        </span>
      `;
      carrierList.append(button);
    });
  });
}

function taskCopy() {
  const carrier = carriers[state.carrier].name;
  const labels = {
    pickup: ["Pickup booking", `Book a ${carrier} pickup`],
    shipment: ["Shipment creation", `Create a ${carrier} shipment`],
    email: ["Email drafting", `Draft a ${carrier} update`]
  };
  return labels[state.task];
}

function renderHeader() {
  const [mode, title] = taskCopy();
  document.querySelector("#modeLabel").textContent = mode;
  document.querySelector("#taskTitle").textContent = title;
  document.querySelector("#statusPill").textContent = `${carriers[state.carrier].name} selected`;
}

function renderChecklist() {
  checklist.innerHTML = "";
  carriers[state.carrier].checklist[state.task].forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    checklist.append(li);
  });
}

function summaryText() {
  const data = formData();
  const carrier = carriers[state.carrier].name;
  const readyWindow = [
    data.readyDate || "TBD",
    data.readyTime || "",
    "to",
    data.closeTime || "TBD"
  ].filter(Boolean).join(" ");
  return [
    `${taskCopy()[1]}`,
    `Carrier: ${carrier}`,
    `Reference: ${data.reference || "TBD"}`,
    `Ready: ${readyWindow}`,
    `Contact: ${data.contactName || "TBD"} ${data.phone ? `(${data.phone})` : ""}`,
    `Email: ${data.contactEmail || "TBD"}`,
    `Pickup address: ${data.pickupAddress || "TBD"}`,
    `Destination: ${data.recipient || "TBD"}`,
    `Destination address: ${data.destinationAddress || "TBD"}`,
    `Packages: ${data.packages || "1"}`,
    `Weight: ${data.weight || "TBD"}`,
    `Dimensions: ${data.dimensions || "TBD"}`,
    `Service: ${data.service || "Standard"}`,
    `Notes: ${data.notes || "None"}`
  ].join("\n");
}

function buildEmailDraft() {
  const data = formData();
  const carrier = carriers[state.carrier].name;
  const ref = data.reference ? ` for ${data.reference}` : "";
  const ready = data.readyDate ? `${data.readyDate}${data.readyTime ? ` at ${data.readyTime}` : ""}` : "the requested pickup window";
  const close = data.closeTime ? ` The location closes at ${data.closeTime}.` : "";

  if (state.task === "shipment") {
    return `Hi ${data.contactName || "there"},\n\nA ${carrier} shipment${ref} is being prepared.\n\nService: ${data.service || "Standard"}\nPackages: ${data.packages || "1"}\nWeight: ${data.weight || "TBD"}\nDestination: ${data.recipient || data.destinationAddress || "TBD"}\n\nI will share the tracking number once the label is created.\n\nThank you.`;
  }

  if (state.task === "email") {
    return `Hi ${data.contactName || "there"},\n\nQuick shipping update${ref}: ${carrier} is the selected carrier.\n\nDetails:\n${summaryText()}\n\nThank you.`;
  }

  return `Hi ${data.contactName || "there"},\n\nA ${carrier} pickup${ref} has been prepared for ${ready}.${close}\n\nPackages: ${data.packages || "1"}\nWeight: ${data.weight || "TBD"}\nPickup address: ${data.pickupAddress || "TBD"}\n\nPlease have the package ready during the pickup window. I will send the confirmation number once it is booked.\n\nThank you.`;
}

function renderOutputs() {
  renderHeader();
  renderChecklist();
  emailDraft.value = buildEmailDraft();
}

async function copyText(text, label) {
  await navigator.clipboard.writeText(text);
  flash(`${label} copied`);
}

function openEmailDraft() {
  const data = formData();
  const subject = encodeURIComponent(`${carriers[state.carrier].name} ${state.task} ${data.reference || ""}`.trim());
  const body = encodeURIComponent(emailDraft.value);
  const to = encodeURIComponent(data.contactEmail || "");
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

function saveLogEntry() {
  const data = formData();
  const history = getStore(storageKeys.history);
  history.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    task: state.task,
    carrier: state.carrier,
    reference: data.reference || "No reference",
    recipient: data.recipient || data.contactName || "No recipient",
    notes: data.notes || "",
    summary: summaryText()
  });
  setStore(storageKeys.history, history.slice(0, 30));
  renderHistory();
  flash("Log saved");
}

function renderHistory() {
  const history = getStore(storageKeys.history);
  historyList.innerHTML = "";

  if (!history.length) {
    historyList.innerHTML = `<p class="carrier-note">No saved tasks yet.</p>`;
    return;
  }

  history.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "history-item";
    const date = new Date(entry.createdAt).toLocaleString();
    item.innerHTML = `
      <div>
        <strong>${carriers[entry.carrier]?.name || entry.carrier} ${entry.task}: ${entry.reference}</strong>
        <span>${entry.recipient} · ${date}</span>
      </div>
      <button class="ghost-button small" data-copy-log="${entry.id}">Copy</button>
    `;
    historyList.append(item);
  });
}

function saveTemplate() {
  const name = prompt("Template name");
  if (!name) return;
  const templates = getStore(storageKeys.templates);
  templates.unshift({
    id: crypto.randomUUID(),
    name,
    values: formData(),
    carrier: state.carrier,
    task: state.task
  });
  setStore(storageKeys.templates, templates.slice(0, 20));
  renderTemplates();
  flash("Template saved");
}

function renderTemplates() {
  const templates = getStore(storageKeys.templates);
  templateSelect.innerHTML = `<option value="">No saved template</option>`;
  templates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.name;
    templateSelect.append(option);
  });
}

function loadTemplate(id) {
  const template = getStore(storageKeys.templates).find((item) => item.id === id);
  if (!template) return;
  state.carrier = template.carrier || state.carrier;
  state.task = template.task || state.task;
  setFormData(template.values || {});
  document.querySelectorAll(".segment").forEach((button) => {
    const active = button.dataset.task === state.task;
    button.classList.toggle("active", active);
    button.setAttribute("aria-checked", String(active));
  });
  renderCarriers();
  renderOutputs();
}

function clearForm() {
  form.reset();
  form.elements.readyDate.value = today();
  form.elements.packages.value = "1";
  renderOutputs();
}

carrierList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-carrier]");
  if (!button) return;
  state.carrier = button.dataset.carrier;
  renderCarriers();
  renderOutputs();
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    state.task = button.dataset.task;
    document.querySelectorAll(".segment").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-checked", String(active));
    });
    renderOutputs();
  });
});

form.addEventListener("input", renderOutputs);
document.querySelector("#openPortal").addEventListener("click", () => window.open(carrierPortal(), "_blank", "noopener"));
document.querySelector("#copySummary").addEventListener("click", () => copyText(summaryText(), "Summary"));
document.querySelector("#copyChecklist").addEventListener("click", () => copyText([...checklist.children].map((li, index) => `${index + 1}. ${li.textContent}`).join("\n"), "Checklist"));
document.querySelector("#copyEmail").addEventListener("click", () => copyText(emailDraft.value, "Email"));
document.querySelector("#draftEmail").addEventListener("click", openEmailDraft);
document.querySelector("#saveLog").addEventListener("click", saveLogEntry);
document.querySelector("#saveTemplate").addEventListener("click", saveTemplate);
document.querySelector("#clearForm").addEventListener("click", clearForm);
document.querySelector("#clearLog").addEventListener("click", () => {
  localStorage.removeItem(storageKeys.history);
  renderHistory();
  flash("Log cleared");
});
templateSelect.addEventListener("change", () => loadTemplate(templateSelect.value));
historyList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-log]");
  if (!button) return;
  const entry = getStore(storageKeys.history).find((item) => item.id === button.dataset.copyLog);
  if (entry) copyText(entry.summary, "Log");
});

form.elements.readyDate.value = today();
renderCarriers();
renderTemplates();
renderOutputs();
renderHistory();
