const carriers = {
  ups: {
    name: "UPS",
    short: "UPS",
    section: "parcel",
    color: "#7a4b21",
    portal: "https://wwwapps.ups.com/pickup/schedule?loc=en_CA",
    note: "Pickup and shipment portal",
    checklist: {
      pickup: [
        "Click Prepare UPS pickup.",
        "Confirm the UPS form matches the booking values.",
        "Stop on the UPS review or payment page before submitting.",
        "After staff manually submits and UPS accepts it, click Mark booked."
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
    name: "Purolator",
    short: "Puro",
    section: "parcel",
    color: "#225ca8",
    portal: "https://eshiponline.purolator.com/ShipOnline/pickup/SchedulePickup.aspx",
    note: "Pickup booking portal",
    checklist: {
      pickup: [
        "Click Prepare Purolator pickup and sign in if needed.",
        "Select the pickup date and pickup window.",
        "Stop on Purolator's final review step before submitting.",
        "After staff manually submits and Purolator accepts it, click Mark booked."
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
    name: "ShipSavvy Orders",
    short: "SS",
    section: "parcel",
    color: "#176b55",
    portal: "https://my.shipsavvy.com/shipping/create",
    note: "Create shipment orders",
    checklist: {
      pickup: [
        "Click Prepare ShipSavvy pickup and choose the relevant carrier or shipment.",
        "Confirm pickup location, package count, and pickup window.",
        "Stop on ShipSavvy's final review step before submitting.",
        "After staff manually submits and ShipSavvy accepts it, click Mark booked."
      ],
      shipment: [
        "Click Prepare ShipSavvy order.",
        "Use the provided delivery address plus box dimensions and weight.",
        "Confirm the ship-to/business address and shipment details on ShipSavvy.",
        "Stop before the final buy, pay, or create-label action."
      ],
      email: [
        "Review the generated email for the ShipSavvy shipment.",
        "Add tracking, label, pickup, or reference details if available.",
        "Open the draft and send after review."
      ]
    }
  },
  shipsavvyPickup: {
    name: "ShipSavvy Pickup",
    short: "SS",
    section: "parcel",
    color: "#176b55",
    portal: "https://my.shipsavvy.com/pickups/create/carrier",
    note: "Van pickup request",
    checklist: {
      pickup: [
        "Click Submit ShipSavvy Pickup.",
        "Select the carrier pickup option in ShipSavvy.",
        "Confirm the pickup date and pickup details.",
        "Stop before the final submit action."
      ],
      shipment: [
        "Use ShipSavvy Orders for shipment creation.",
        "Enter delivery address, package details, dimensions, and weight.",
        "Stop before the final buy, pay, or create-label action."
      ],
      email: [
        "Review the generated ShipSavvy pickup update.",
        "Add pickup confirmation details if available.",
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
        "Click Prepare Canada Post pickup.",
        "Confirm pickup address, contact, ready time, close time, package count, and service.",
        "Stop on Canada Post's final review step before submitting.",
        "After staff manually submits and Canada Post accepts it, click Mark booked."
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
        "Click Prepare AB Courier pickup and confirm the pickup or order booking flow.",
        "Confirm pickup address, dock details, contact, freight count, and pickup window.",
        "Stop on AB Courier's final review step before submitting.",
        "After staff manually submits and AB Courier accepts it, click Mark booked."
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
        "Click Prepare Freightera pickup and find the freight shipment.",
        "Confirm pickup address, freight pieces, weight, dimensions, and pickup date.",
        "Stop on Freightera's final review step before submitting.",
        "After staff manually submits and Freightera accepts it, click Mark booked."
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

const carrierWindowPresets = {
  ups: {
    defaultIndex: 1,
    windows: [
      { label: "12-2", start: "12:00", end: "14:00" },
      { label: "2-4", start: "14:00", end: "16:00" }
    ]
  },
  purolator: {
    defaultIndex: 0,
    windows: [
      { label: "10-5", start: "10:00", end: "17:00" }
    ]
  },
  canadaPost: {
    defaultIndex: 0,
    windows: [
      { label: "12-5", start: "12:00", end: "17:00" }
    ]
  }
};

const upsPreset = {
  trackingNumbers: [
    "1Z0XXXXXXXXXXXXX18",
    "1Z1XXXXXXXXXXXXX18",
    "1Z2XXXXXXXXXXXXX18"
  ],
  pickupAddressLines: [
    "YYZ PREP",
    "25 NEWKIRK CT",
    "BRAMPTON, ON, L6Z0B5",
    "CA"
  ],
  emailAddress: "hello@yyzprep.ca",
  companyName: "YYZ PREP",
  contactName: "YYZ PREP",
  country: "Canada",
  telephone: "6472500111",
  extension: "",
  addressLine2: "Unit 5",
  addressLine3: "Floor",
  packages: "30",
  service: "UPS Standard®",
  earliestPickupTime: "14:00",
  latestPickupTime: "16:00",
  preferredPickupLocation: "Warehouse",
  pickupReference: "",
  yourEmailAddress: "",
  notificationEmails: ["", "", "", "", ""],
  personalizedMessage: ""
};

const purolatorPreset = {
  companyName: "YYZ PREP",
  contactName: "ALI",
  country: "Canada",
  postalCode: "L6Z 0B5",
  city: "BRAMPTON",
  province: "Ontario",
  streetNumber: "25",
  suffix: "",
  streetName: "NEWKIRK",
  streetType: "Court",
  direction: "",
  suite: "5",
  floor: "",
  entryCode: "",
  address2: "",
  address3: "",
  phoneArea: "647",
  phoneNumber: "2500111",
  ext: "",
  validationAddress: "25 NEWKIRK Court, Suite 5, BRAMPTON, Ontario, Canada, L6Z 0B5",
  validationIssue: "Incorrect Street Name. NEWKIRK",
  validationAction: "Click Ignore. Do not use Save Changes."
};

const shipSavvyPreset = {
  businessAddressLines: [
    "YYZ PREP",
    "25 NEWKIRK CT, Unit 5",
    "BRAMPTON, ON, L6Z 0B5",
    "Canada"
  ]
};

const state = {
  carrier: "ups",
  task: "pickup"
};

const storageKeys = {
  history: "shippingDesk.history",
  templates: "shippingDesk.templates",
  activeBooking: "shippingDesk.activeBooking"
};

const form = document.querySelector("#shippingForm");
const carrierList = document.querySelector("#carrierList");
const activeOptions = document.querySelector(".simple-options");
const simpleWorkspace = document.querySelector(".simple-workspace");
const historyPanel = document.querySelector(".history-panel");
const checklist = document.querySelector("#checklist");
const emailDraft = document.querySelector("#emailDraft");
const historyList = document.querySelector("#historyList");
const pickupSummary = document.querySelector("#pickupSummary");
const templateSelect = document.querySelector("#templateSelect");
const savedNotice = document.querySelector("#savedNotice");
const referenceField = document.querySelector("#referenceField");
const referenceLabel = document.querySelector("#referenceLabel");
const optionsTitle = document.querySelector("#optionsTitle");
const pickupAddressLabel = document.querySelector("#pickupAddressLabel");
const destinationAddressLabel = document.querySelector("#destinationAddressLabel");
const upsPresetPanel = document.querySelector("#upsPresetPanel");
const upsOutputBlock = document.querySelector("#upsOutputBlock");
const upsValues = document.querySelector("#upsValues");
const purolatorPresetPanel = document.querySelector("#purolatorPresetPanel");
const purolatorOutputBlock = document.querySelector("#purolatorOutputBlock");
const purolatorValues = document.querySelector("#purolatorValues");
const emailOutputBlock = document.querySelector("#emailOutputBlock");
const checklistBlock = document.querySelector("#checklistBlock");
const draftEmailButton = document.querySelector("#draftEmail");
const copySummaryButton = document.querySelector("#copySummary");
const saveLogButton = document.querySelector("#saveLog");
const pickupDateLabel = document.querySelector("#pickupDateLabel");
const dateChoiceButtons = document.querySelectorAll("[data-date-choice]");
const timeWindowControl = document.querySelector(".time-window-control");
const timeWindowButtons = document.querySelector("#timeWindowButtons");
const readyTimeField = document.querySelector("#readyTimeField");
const closeTimeField = document.querySelector("#closeTimeField");

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

function localDate(dateValue) {
  return new Date(`${dateValue}T12:00:00`);
}

function nextWorkday() {
  const date = localDate(today());
  date.setDate(date.getDate() + 1);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return dateString(date);
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

function isUpsPickup() {
  return state.carrier === "ups" && state.task === "pickup";
}

function isPurolatorPickup() {
  return state.carrier === "purolator" && state.task === "pickup";
}

function isCarrierPickupPreset() {
  return isUpsPickup() || isPurolatorPickup();
}

function isPickupOnlyCarrier() {
  return state.carrier === "ups" || state.carrier === "purolator";
}

function isShipmentDefaultCarrier() {
  return state.carrier === "shipsavvy";
}

function isNoTimeCarrier() {
  return state.carrier === "shipsavvyPickup";
}

function isShipSavvyCarrier() {
  return state.carrier === "shipsavvy" || state.carrier === "shipsavvyPickup";
}

function submitButtonLabel() {
  if (state.carrier === "shipsavvyPickup") return "Submit ShipSavvy Pickup";
  if (state.task === "pickup") return `Submit ${carriers[state.carrier].name} pickup`;
  if (state.task === "shipment") return `Submit ${carriers[state.carrier].name} order`;
  return `Open ${carriers[state.carrier].name}`;
}

function actionTypeLabel() {
  if (state.carrier === "shipsavvyPickup") return "pickup";
  return state.task === "shipment" ? "order" : "pickup";
}

function setTask(task) {
  state.task = task;
  document.querySelectorAll(".segment").forEach((item) => {
    const active = item.dataset.task === state.task;
    item.classList.toggle("active", active);
    item.setAttribute("aria-checked", String(active));
  });
}

function upsInstructionText() {
  const skids = form.elements.skids?.value || "2";
  return `SPIKE pickup request for ${skids} skids`;
}

function applyUpsPreset() {
  if (state.carrier !== "ups") return;

  const values = {
    contactName: upsPreset.contactName,
    contactEmail: upsPreset.emailAddress,
    phone: upsPreset.telephone,
    pickupAddress: upsPreset.pickupAddressLines.join("\n"),
    packages: upsPreset.packages,
    service: "Standard",
    weight: "",
    dimensions: "",
    preferredLocation: upsPreset.preferredPickupLocation,
    upsPackages: upsPreset.packages,
    upsService: upsPreset.service
  };

  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    const isOldPackageDefault = key === "packages" && field.value === "1";
    if (!field.value || isOldPackageDefault) field.value = value;
  });

  if (form.elements.readyTime && !form.elements.readyTime.value) {
    form.elements.readyTime.value = upsPreset.earliestPickupTime;
  }
  if (form.elements.closeTime && !form.elements.closeTime.value) {
    form.elements.closeTime.value = upsPreset.latestPickupTime;
  }
  if (form.elements.skids && !form.elements.skids.value) {
    form.elements.skids.value = "2";
  }
  syncUpsAdvancedDefaults();
  syncUpsInstructions();
}

function syncUpsAdvancedDefaults() {
  const mappings = [
    ["advancedUpsPackages", "upsPackages"],
    ["advancedUpsService", "upsService"]
  ];

  mappings.forEach(([advancedId, hiddenName]) => {
    const advancedField = document.querySelector(`#${advancedId}`);
    const hiddenField = form.elements[hiddenName];
    if (!advancedField || !hiddenField) return;
    if (!advancedField.value) advancedField.value = hiddenField.value;
    hiddenField.value = advancedField.value;
  });
}

function syncUpsInstructions() {
  if (state.carrier !== "ups") return;
  const instruction = upsInstructionText();
  if (form.elements.upsSpecialInstructions) {
    form.elements.upsSpecialInstructions.value = instruction;
  }
  if (form.elements.notes) {
    form.elements.notes.value = instruction;
  }
}

function applyPurolatorPreset() {
  if (state.carrier !== "purolator") return;

  const values = {
    contactName: purolatorPreset.contactName,
    phone: `${purolatorPreset.phoneArea}${purolatorPreset.phoneNumber}`,
    pickupAddress: [
      purolatorPreset.companyName,
      `${purolatorPreset.streetNumber} ${purolatorPreset.streetName} ${purolatorPreset.streetType}`,
      `Suite ${purolatorPreset.suite}`,
      `${purolatorPreset.city}, ${purolatorPreset.province}, ${purolatorPreset.postalCode}`,
      purolatorPreset.country
    ].join("\n"),
    purolatorCompany: purolatorPreset.companyName,
    purolatorContact: purolatorPreset.contactName,
    purolatorPostal: purolatorPreset.postalCode,
    purolatorPhone: `${purolatorPreset.phoneArea} ${purolatorPreset.phoneNumber}`,
    purolatorStreetNumber: purolatorPreset.streetNumber,
    purolatorStreetName: purolatorPreset.streetName,
    purolatorStreetType: purolatorPreset.streetType,
    purolatorSuite: purolatorPreset.suite
  };

  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field && !field.value) field.value = value;
  });
}

function applyShipSavvyPreset() {
  if (!isShipSavvyCarrier()) return;
  const values = {
    pickupAddress: shipSavvyPreset.businessAddressLines.join("\n"),
    service: "Standard"
  };

  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field && !field.value) field.value = value;
  });
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
      const active = id === state.carrier;
      button.className = `carrier-button ${active ? "active" : ""}`;
      button.dataset.carrier = id;
      button.innerHTML = `
        <span class="carrier-logo" style="background:${carrier.color}">${carrier.short}</span>
        <span>
          <span class="carrier-name">${carrier.name}</span>
          <span class="carrier-note">${carrier.note}</span>
        </span>
        <span class="carrier-status">${active ? "Selected" : "Choose"}</span>
      `;
      carrierList.append(button);
    });
  });
}

function taskCopy() {
  const carrier = carriers[state.carrier].name;
  const labels = {
    pickup: ["Pickup prep", `Prepare a ${carrier} pickup`],
    shipment: ["Shipment prep", `Prepare a ${carrier} order`],
    email: ["Email drafting", `Draft a ${carrier} update`]
  };
  return labels[state.task];
}

function renderHeader() {
  const [mode, title] = taskCopy();
  document.querySelector("#modeLabel").textContent = mode;
  document.querySelector("#taskTitle").textContent = title;
  document.querySelector("#statusPill").textContent = `${carriers[state.carrier].name} selected`;
  referenceLabel.textContent = isCarrierPickupPreset() ? "Pickup confirmation" : "Reference / order";
  form.elements.reference.placeholder = isCarrierPickupPreset() ? "Add after booking" : "Order 1842";
  referenceField.hidden = isCarrierPickupPreset();
  optionsTitle.textContent = state.carrier === "shipsavvy" ? "Order details" : "Pickup details";
  pickupAddressLabel.textContent = state.carrier === "shipsavvy" ? "Business / warehouse address" : "Pickup address";
  destinationAddressLabel.textContent = state.carrier === "shipsavvy" ? "Delivery address" : "Destination address";
  readyTimeField.hidden = isNoTimeCarrier();
  closeTimeField.hidden = isNoTimeCarrier();
}

function updatePickupDateDisplay() {
  if (!pickupDateLabel || !form.elements.readyDate.value) return;
  const selectedDate = form.elements.readyDate.value;
  pickupDateLabel.textContent = formatUpsDate(selectedDate);
  dateChoiceButtons.forEach((button) => {
    const choiceDate = button.dataset.dateChoice === "nextWorkday" ? nextWorkday() : today();
    button.classList.toggle("active", selectedDate === choiceDate);
  });
}

function updatePickupWindowButtons() {
  document.querySelectorAll("[data-window-start][data-window-end]").forEach((button) => {
    const active = form.elements.readyTime.value === button.dataset.windowStart
      && form.elements.closeTime.value === button.dataset.windowEnd;
    button.classList.toggle("active", active);
  });
}

function renderPickupWindowPresets() {
  const preset = carrierWindowPresets[state.carrier];
  const windows = preset?.windows || [];
  timeWindowControl.hidden = isNoTimeCarrier() || !windows.length;
  timeWindowButtons.innerHTML = windows.map((windowPreset) => `
    <button type="button" class="quick-button" data-window-start="${windowPreset.start}" data-window-end="${windowPreset.end}">
      ${windowPreset.label}
    </button>
  `).join("");
}

function applyCarrierDefaultWindow() {
  if (isNoTimeCarrier()) {
    form.elements.readyTime.value = "";
    form.elements.closeTime.value = "";
    return;
  }
  const preset = carrierWindowPresets[state.carrier];
  if (!preset?.windows?.length) return;
  const defaultWindow = preset.windows[preset.defaultIndex || 0] || preset.windows[0];
  form.elements.readyTime.value = defaultWindow.start;
  form.elements.closeTime.value = defaultWindow.end;
}

function setPickupDate(choice) {
  form.elements.readyDate.value = choice === "nextWorkday" ? nextWorkday() : today();
  updatePickupDateDisplay();
  renderOutputs();
}

function setPickupWindow(start, end) {
  form.elements.readyTime.value = start;
  form.elements.closeTime.value = end;
  updatePickupWindowButtons();
  renderOutputs();
}

function renderChecklist() {
  checklist.innerHTML = "";
  carriers[state.carrier].checklist[state.task].forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    checklist.append(li);
  });
}

function formatUpsDate(dateValue) {
  if (!dateValue) return "TBD";
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatUpsTime(timeValue) {
  if (!timeValue) return "TBD";
  const [hourText, minuteText] = timeValue.split(":");
  const hour = Number(hourText);
  const minute = minuteText || "00";
  const displayHour = hour % 12 || 12;
  const meridiem = hour >= 12 ? "PM" : "AM";
  return `${String(displayHour).padStart(2, "0")}:${minute} ${meridiem}`;
}

function buildUpsValues() {
  const data = formData();
  const specialInstructions = data.upsSpecialInstructions || upsInstructionText();

  return [
    "1 Shipping Label Questions",
    "Do you have pre-printed UPS Shipping Labels for your shipment?: Yes",
    "Optional tracking numbers:",
    upsPreset.trackingNumbers.join("\n"),
    "",
    "2 Pickup Information and Location",
    "Pickup Address:",
    upsPreset.pickupAddressLines.join("\n"),
    `E-mail Address: ${upsPreset.emailAddress}`,
    `Company or Name: ${upsPreset.companyName}`,
    `Country or Territory: ${upsPreset.country}`,
    `Contact Name: ${upsPreset.contactName}`,
    `Telephone: ${upsPreset.telephone}`,
    `Ext.: ${upsPreset.extension}`,
    `Address Line 2: ${upsPreset.addressLine2}`,
    `Address Line 3: ${upsPreset.addressLine3}`,
    "Residential Address: No",
    "",
    "3 Service and Package Information",
    `Package(s) in Your Pickup: ${data.upsPackages || upsPreset.packages}`,
    "UPS Domestic Services: UPS Standard®",
    "UPS International Services: None",
    "Items that weigh more than 32 Kg.?: No",
    "",
    "4 Pickup Date and Time",
    `Pickup Date: ${formatUpsDate(data.readyDate)}`,
    `Earliest Pickup Time: ${formatUpsTime(data.readyTime || upsPreset.earliestPickupTime)}`,
    `Latest Preferred Pickup Time: ${formatUpsTime(data.closeTime || upsPreset.latestPickupTime)}`,
    `Preferred Pickup Location: ${data.preferredLocation || upsPreset.preferredPickupLocation}`,
    `Pickup Reference: ${upsPreset.pickupReference}`,
    `Special Instructions: ${specialInstructions}`,
    "",
    "6 Pickup Notifications",
    `Your E-mail Address: ${upsPreset.yourEmailAddress}`,
    "E-mail Addresses:",
    upsPreset.notificationEmails.join("\n"),
    `Personalized message: ${upsPreset.personalizedMessage}`
  ].join("\n");
}

function buildPurolatorValues() {
  const data = formData();

  return [
    "Purolator pickup booking link",
    carriers.purolator.portal,
    "",
    "Edit Address",
    `Company/Name: ${data.purolatorCompany || purolatorPreset.companyName}`,
    `Contact Name: ${data.purolatorContact || purolatorPreset.contactName}`,
    `Country: ${purolatorPreset.country}`,
    `Postal Code: ${data.purolatorPostal || purolatorPreset.postalCode}`,
    `City: ${purolatorPreset.city}`,
    `Province: ${purolatorPreset.province}`,
    `Street Number: ${data.purolatorStreetNumber || purolatorPreset.streetNumber}`,
    `Suffix: ${purolatorPreset.suffix}`,
    `Street Name: ${data.purolatorStreetName || purolatorPreset.streetName}`,
    `Street Type: ${data.purolatorStreetType || purolatorPreset.streetType}`,
    `Direction: ${purolatorPreset.direction}`,
    `Suite #: ${data.purolatorSuite || purolatorPreset.suite}`,
    `Floor #: ${purolatorPreset.floor}`,
    `Entry Code / Buzz #: ${purolatorPreset.entryCode}`,
    `Address 2: ${purolatorPreset.address2}`,
    `Address 3: ${purolatorPreset.address3}`,
    `Phone Number: ${data.purolatorPhone || `${purolatorPreset.phoneArea} ${purolatorPreset.phoneNumber}`}`,
    `Ext: ${purolatorPreset.ext}`,
    "",
    "Address Finder Validation",
    `Validation address shown: ${purolatorPreset.validationAddress}`,
    `Issue shown: ${purolatorPreset.validationIssue}`,
    `Action: ${purolatorPreset.validationAction}`,
    "Then, once back on Edit Address, click Save.",
    "",
    "Pickup Date and Time",
    `Pickup Date: ${formatUpsDate(data.readyDate)}`,
    `Ready Time: ${formatUpsTime(data.readyTime)}`,
    `Close Time: ${formatUpsTime(data.closeTime)}`
  ].join("\n");
}

function presetCopyText() {
  if (isUpsPickup()) return buildUpsValues();
  if (isPurolatorPickup()) return buildPurolatorValues();
  return summaryText();
}

function presetCopyLabel() {
  if (isUpsPickup()) return "UPS values";
  if (isPurolatorPickup()) return "Purolator values";
  return "Summary";
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
    ...(state.carrier === "ups" ? [
      `Skids: ${data.skids || "2"}`,
      `Preferred pickup location: ${data.preferredLocation || upsPreset.preferredPickupLocation}`
    ] : []),
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
  if (isPickupOnlyCarrier() && state.task !== "pickup") {
    setTask("pickup");
  }
  if (isShipmentDefaultCarrier() && state.task !== "shipment") {
    setTask("shipment");
  }
  if (state.carrier === "ups") {
    applyUpsPreset();
  }
  if (state.carrier === "purolator") {
    applyPurolatorPreset();
  }
  if (isShipSavvyCarrier()) {
    applyShipSavvyPreset();
  }
  renderHeader();
  renderChecklist();
  renderPickupWindowPresets();
  const showUpsPreset = isUpsPickup();
  const showPurolatorPreset = isPurolatorPickup();
  upsPresetPanel.hidden = !showUpsPreset;
  upsOutputBlock.hidden = !showUpsPreset;
  purolatorPresetPanel.hidden = !showPurolatorPreset;
  purolatorOutputBlock.hidden = !showPurolatorPreset;
  checklistBlock.hidden = true;
  emailOutputBlock.hidden = true;
  draftEmailButton.hidden = true;
  document.querySelector("#openPortal").textContent = submitButtonLabel();
  copySummaryButton.hidden = true;
  saveLogButton.hidden = true;
  copySummaryButton.textContent = isCarrierPickupPreset() ? `Copy ${carriers[state.carrier].name} values` : "Copy booking info";
  saveLogButton.textContent = state.task === "pickup" ? "Mark booked" : "Mark created";
  document.querySelectorAll(".generic-fields").forEach((element) => {
    element.hidden = isCarrierPickupPreset();
  });
  document.querySelectorAll(".segment").forEach((button) => {
    const disabled = isPickupOnlyCarrier() && button.dataset.task !== "pickup";
    const shipmentOnly = isShipmentDefaultCarrier() && button.dataset.task !== "shipment";
    const isDisabled = disabled || shipmentOnly;
    button.disabled = isDisabled;
    button.setAttribute("aria-disabled", String(isDisabled));
  });
  upsValues.textContent = showUpsPreset ? buildUpsValues() : "";
  purolatorValues.textContent = showPurolatorPreset ? buildPurolatorValues() : "";
  emailDraft.value = buildEmailDraft();
  updatePickupDateDisplay();
  updatePickupWindowButtons();
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

function bookingStatus(entry) {
  if (entry.status === "picked-up" || entry.status === "completed") return "picked-up";
  if (entry.status === "needs-rebook") return "needs-rebook";
  if (entry.pickupDate && entry.pickupDate < today()) return "missed";
  return entry.status || "booking";
}

function statusLabel(status) {
  const labels = {
    booking: "Ready for review",
    booked: "Booked",
    created: "Created",
    missed: "Missed",
    "needs-rebook": "Needs rebook",
    "picked-up": "Picked up"
  };
  return labels[status] || "Booked";
}

function statusClass(status) {
  return status.replace(/[^a-z0-9]+/g, "-");
}

function formatPickupWindow(entry) {
  return [
    entry.pickupDate || "No date",
    entry.readyTime || "",
    "to",
    entry.closeTime || ""
  ].filter(Boolean).join(" ");
}

function compactDateLabel(dateValue) {
  if (!dateValue) return "No date";
  if (dateValue === today()) return "Today";
  const tomorrow = localDate(today());
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateValue === dateString(tomorrow)) return "Tomorrow";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(localDate(dateValue));
}

function compactTimeWindow(entry) {
  if (entry.carrier === "shipsavvyPickup") return "";
  if (!entry.readyTime && !entry.closeTime) return "No time set";
  return [entry.readyTime || "?", entry.closeTime || "?"].join("-");
}

function createPickupEntry(status = "booking") {
  const data = formData();
  const carrierName = carriers[state.carrier].name;
  const notes = isUpsPickup()
    ? data.upsSpecialInstructions || upsInstructionText()
    : isPurolatorPickup()
      ? "Purolator pickup"
      : data.notes || "";

  return {
    id: makeId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    task: state.task,
    carrier: state.carrier,
    carrierName,
    status,
    reference: data.reference || "No confirmation yet",
    recipient: data.recipient || data.contactName || upsPreset.companyName || "No recipient",
    pickupDate: data.readyDate || "",
    readyTime: isNoTimeCarrier() ? "" : data.readyTime || "",
    closeTime: isNoTimeCarrier() ? "" : data.closeTime || "",
    skids: data.skids || "",
    notes,
    summary: presetCopyText(),
    bookingUrl: carrierPortal()
  };
}

function savePickupEntry(entry) {
  const history = getStore(storageKeys.history).filter((item) => item.id !== entry.id);
  history.unshift(entry);
  setStore(storageKeys.history, history.slice(0, 30));
  localStorage.setItem(storageKeys.activeBooking, JSON.stringify(entry));
  renderHistory();
  return entry;
}

function startPickupBooking() {
  const entry = savePickupEntry(createPickupEntry("booking"));
  window.postMessage({ type: "SHIPPING_DESK_BOOKING", booking: entry }, "*");
  flash(`${carriers[state.carrier].name} ${actionTypeLabel()} prepared for review`);
  window.setTimeout(() => {
    window.location.href = entry.bookingUrl;
  }, 100);
}

function markBookingConfirmed() {
  let activeBooking = null;
  try {
    activeBooking = JSON.parse(localStorage.getItem(storageKeys.activeBooking));
  } catch {
    activeBooking = null;
  }

  const history = getStore(storageKeys.history);
  const existing = activeBooking && history.find((entry) => entry.id === activeBooking.id);
  const entry = existing
    ? { ...existing, status: state.task === "shipment" ? "created" : "booked", updatedAt: new Date().toISOString(), summary: presetCopyText() }
    : createPickupEntry(state.task === "shipment" ? "created" : "booked");

  savePickupEntry(entry);
  flash(state.task === "shipment" ? "Order marked created" : "Pickup marked booked");
}

function renderPickupSummary(history) {
  if (!pickupSummary) return;

  const liveEntries = history.filter((entry) => bookingStatus(entry) !== "picked-up");
  const todayEntries = liveEntries.filter((entry) => entry.pickupDate === today());
  const upcomingEntries = liveEntries.filter((entry) => entry.pickupDate > today());
  const attentionEntries = liveEntries.filter((entry) => ["missed", "needs-rebook"].includes(bookingStatus(entry)));
  const pickedUpEntries = history.filter((entry) => bookingStatus(entry) === "picked-up");

  pickupSummary.innerHTML = `
    <div class="summary-stat">
      <strong>${todayEntries.length}</strong>
      <span>Today</span>
    </div>
    <div class="summary-stat">
      <strong>${upcomingEntries.length}</strong>
      <span>Upcoming</span>
    </div>
    <div class="summary-stat ${attentionEntries.length ? "attention" : ""}">
      <strong>${attentionEntries.length}</strong>
      <span>Needs attention</span>
    </div>
    <div class="summary-stat">
      <strong>${pickedUpEntries.length}</strong>
      <span>Picked up</span>
    </div>
  `;
}

function renderHistory() {
  const history = getStore(storageKeys.history);
  renderPickupSummary(history);
  historyList.innerHTML = "";
  historyList.className = "history-list";

  if (!history.length) {
    historyList.innerHTML = `<p class="summary-empty">No pickups or orders prepared yet.</p>`;
    return;
  }

  const groups = [
    {
      label: "Today",
      entries: history.filter((entry) => bookingStatus(entry) !== "picked-up" && bookingStatus(entry) !== "missed" && entry.pickupDate === today())
    },
    {
      label: "Upcoming",
      entries: history.filter((entry) => bookingStatus(entry) !== "picked-up" && bookingStatus(entry) !== "missed" && entry.pickupDate > today())
    },
    {
      label: "Needs attention",
      entries: history.filter((entry) => ["missed", "needs-rebook"].includes(bookingStatus(entry)))
    },
    {
      label: "Picked up",
      entries: history.filter((entry) => bookingStatus(entry) === "picked-up")
    }
  ];

  historyList.className = "summary-board";

  groups.forEach((group) => {
    const column = document.createElement("section");
    column.className = "summary-column";
    column.innerHTML = `
      <div class="summary-column-heading">
        <h4>${group.label}</h4>
        <span>${group.entries.length}</span>
      </div>
    `;
    group.entries.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "summary-card";
      const status = bookingStatus(entry);
      const entryLabel = entry.task === "shipment" ? "order" : "pickup";
      const doneStatus = entry.task === "shipment" ? "created" : "booked";
      const doneLabel = entry.task === "shipment" ? "Created" : "Booked";
      const carrierName = carriers[entry.carrier]?.name || entry.carrier;
      const meta = [
        compactDateLabel(entry.pickupDate),
        compactTimeWindow(entry),
        entry.skids ? `${entry.skids} skids` : ""
      ].filter(Boolean).join(" · ");
      item.innerHTML = `
        <div class="summary-card-top">
          <strong>${carrierName}</strong>
          <span class="status-chip ${statusClass(status)}">${statusLabel(status)}</span>
        </div>
        <span class="summary-card-type">${entryLabel}</span>
        <span class="summary-card-meta">${meta}</span>
        <div class="summary-card-actions">
          <button class="ghost-button small" data-set-status="${entry.id}" data-status="${doneStatus}">${doneLabel}</button>
          <button class="ghost-button small" data-set-status="${entry.id}" data-status="picked-up">Picked up</button>
        </div>
      `;
      column.append(item);
    });
    if (!group.entries.length) {
      const empty = document.createElement("p");
      empty.className = "summary-column-empty";
      empty.textContent = "Nothing here";
      column.append(empty);
    }
    historyList.append(column);
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
  if (isPickupOnlyCarrier()) {
    setTask("pickup");
  }
  if (isShipmentDefaultCarrier()) {
    setTask("shipment");
  }
  applyCarrierDefaultWindow();
  renderCarriers();
  renderOutputs();
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    setTask(button.dataset.task);
    renderOutputs();
  });
});

form.addEventListener("input", (event) => {
  if (state.carrier === "ups" && event.target.id?.startsWith("advancedUps")) {
    syncUpsAdvancedDefaults();
  }
  if (state.carrier === "ups" && event.target.name === "skids") {
    syncUpsInstructions();
  }
  renderOutputs();
});
dateChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => setPickupDate(button.dataset.dateChoice));
});
timeWindowButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-window-start][data-window-end]");
  if (!button) return;
  setPickupWindow(button.dataset.windowStart, button.dataset.windowEnd);
});
document.querySelector("#openPortal").addEventListener("click", startPickupBooking);
document.querySelector("#copySummary").addEventListener("click", () => copyText(presetCopyText(), presetCopyLabel()));
document.querySelector("#copyChecklist").addEventListener("click", () => copyText([...checklist.children].map((li, index) => `${index + 1}. ${li.textContent}`).join("\n"), "Checklist"));
document.querySelector("#copyUpsValues").addEventListener("click", () => copyText(buildUpsValues(), "UPS values"));
document.querySelector("#copyPurolatorValues").addEventListener("click", () => copyText(buildPurolatorValues(), "Purolator values"));
document.querySelector("#copyEmail").addEventListener("click", () => copyText(emailDraft.value, "Email"));
document.querySelector("#draftEmail").addEventListener("click", openEmailDraft);
document.querySelector("#saveLog").addEventListener("click", markBookingConfirmed);
document.querySelector("#saveTemplate").addEventListener("click", saveTemplate);
document.querySelector("#clearForm").addEventListener("click", clearForm);
document.querySelector("#clearLog").addEventListener("click", () => {
  localStorage.removeItem(storageKeys.history);
  localStorage.removeItem(storageKeys.activeBooking);
  renderHistory();
  flash("Summary cleared");
});
templateSelect.addEventListener("change", () => loadTemplate(templateSelect.value));
historyList.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy-log]");
  if (copyButton) {
    const entry = getStore(storageKeys.history).find((item) => item.id === copyButton.dataset.copyLog);
    if (entry) copyText(entry.summary, "Log");
    return;
  }

  const statusButton = event.target.closest("[data-set-status]");
  if (!statusButton) return;
  const history = getStore(storageKeys.history).map((entry) => {
    if (entry.id !== statusButton.dataset.setStatus) return entry;
    return {
      ...entry,
      status: statusButton.dataset.status,
      updatedAt: new Date().toISOString()
    };
  });
  setStore(storageKeys.history, history);
  renderHistory();
  flash("Pickup status updated");
});

form.elements.readyDate.value = today();
renderCarriers();
renderTemplates();
renderOutputs();
renderHistory();
