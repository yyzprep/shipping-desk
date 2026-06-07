const UPS_DEFAULTS = {
  companyName: "YYZ PREP",
  contactName: "YYZ PREP",
  email: "hello@yyzprep.ca",
  telephone: "6472500111",
  addressLine2: "Unit 5",
  addressLine3: "Floor",
  packages: "30",
  service: "UPS Standard",
  preferredLocation: "Warehouse",
  overweight: "No",
  prePrintedLabels: "Yes"
};

function setNativeValue(element, value) {
  if (!element || value === undefined || value === null) return false;
  const proto = element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
  if (descriptor?.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function chooseSelect(element, wanted) {
  if (!element || element.tagName !== "SELECT") return false;
  const normalized = String(wanted).toLowerCase();
  const option = [...element.options].find((item) => {
    return item.textContent.trim().toLowerCase().includes(normalized)
      || String(item.value).toLowerCase().includes(normalized);
  });
  if (!option) return false;
  element.value = option.value;
  element.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function textIncludes(element, label) {
  return element.textContent.trim().toLowerCase().includes(label.toLowerCase());
}

function fieldNear(label, selector = "input, textarea, select") {
  const labels = [...document.querySelectorAll("label, legend, span, div, td, th, p")]
    .filter((element) => textIncludes(element, label));
  for (const element of labels) {
    const forId = element.getAttribute("for");
    if (forId) {
      const linked = document.getElementById(forId);
      if (linked?.matches(selector)) return linked;
    }
    const nearby = element.parentElement?.querySelector(selector)
      || element.closest("tr, fieldset, section, div")?.querySelector(selector);
    if (nearby) return nearby;
  }
  return null;
}

function clickNear(label, value) {
  const containers = [...document.querySelectorAll("label, div, td, fieldset")]
    .filter((element) => textIncludes(element, label));
  for (const container of containers) {
    const controls = [...container.querySelectorAll("input[type='radio'], input[type='checkbox'], button")];
    const target = controls.find((control) => {
      const controlText = control.closest("label")?.textContent || control.value || control.getAttribute("aria-label") || "";
      return controlText.toLowerCase().includes(String(value).toLowerCase());
    }) || controls[0];
    if (target) {
      target.click();
      return true;
    }
  }
  return false;
}

function fillText(label, value) {
  const field = fieldNear(label, "input:not([type='radio']):not([type='checkbox']), textarea");
  return setNativeValue(field, value);
}

function fillSelect(label, value) {
  return chooseSelect(fieldNear(label, "select"), value);
}

function fillTime(label, timeValue) {
  if (!timeValue) return false;
  const [hourText, minuteText = "00"] = timeValue.split(":");
  let hour = Number(hourText);
  const meridiem = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  const container = [...document.querySelectorAll("fieldset, div, tr")]
    .find((element) => textIncludes(element, label));
  if (!container) return false;

  const selects = [...container.querySelectorAll("select")];
  const inputs = [...container.querySelectorAll("input:not([type='radio']):not([type='checkbox'])")];
  const controls = [...selects, ...inputs];
  if (controls[0]?.tagName === "SELECT") chooseSelect(controls[0], String(hour).padStart(2, "0"));
  else setNativeValue(controls[0], String(hour).padStart(2, "0"));
  if (controls[1]?.tagName === "SELECT") chooseSelect(controls[1], minuteText);
  else setNativeValue(controls[1], minuteText);
  clickNear(label, meridiem);
  return true;
}

function fillUpsPickup(booking) {
  const skids = booking.skids || "2";
  const instruction = `SPIKE pickup request for ${skids} skids`;

  clickNear("pre-printed UPS Shipping Labels", UPS_DEFAULTS.prePrintedLabels);
  fillText("Company or Name", UPS_DEFAULTS.companyName);
  fillText("Contact Name", UPS_DEFAULTS.contactName);
  fillText("Telephone", UPS_DEFAULTS.telephone);
  fillText("Address Line 2", UPS_DEFAULTS.addressLine2);
  fillText("Address Line 3", UPS_DEFAULTS.addressLine3);
  fillSelect("Package(s) in Your Pickup", UPS_DEFAULTS.packages);
  fillText("Package(s) in Your Pickup", UPS_DEFAULTS.packages);
  clickNear("UPS Domestic Services", UPS_DEFAULTS.service);
  clickNear("Items that weigh more than 32 Kg", UPS_DEFAULTS.overweight);
  fillSelect("Pickup Date", booking.pickupDate);
  fillTime("Earliest Pickup Time", booking.readyTime);
  fillTime("Latest Preferred Pickup Time", booking.closeTime);
  fillSelect("Preferred Pickup Location", UPS_DEFAULTS.preferredLocation);
  fillText("Special Instructions", instruction);
}

function injectPanel(booking) {
  if (!booking || booking.carrier !== "ups" || document.querySelector("#shipping-desk-helper")) return;

  const panel = document.createElement("div");
  panel.id = "shipping-desk-helper";
  panel.innerHTML = `
    <button type="button">Fill UPS pickup</button>
    <span>${booking.pickupDate || "No date"} ${booking.readyTime || ""}-${booking.closeTime || ""}</span>
  `;
  panel.style.cssText = [
    "position:fixed",
    "right:16px",
    "bottom:16px",
    "z-index:2147483647",
    "display:flex",
    "gap:8px",
    "align-items:center",
    "padding:10px",
    "border:1px solid #d9e0e4",
    "border-radius:8px",
    "background:#fff",
    "box-shadow:0 12px 30px rgba(0,0,0,.18)",
    "font:13px system-ui,sans-serif",
    "color:#172026"
  ].join(";");
  panel.querySelector("button").style.cssText = "min-height:34px;border:0;border-radius:6px;background:#176b55;color:#fff;font-weight:800;padding:0 12px;cursor:pointer";
  panel.querySelector("button").addEventListener("click", () => fillUpsPickup(booking));
  document.body.append(panel);
}

chrome.storage.local.get("shippingDeskPendingBooking", ({ shippingDeskPendingBooking }) => {
  injectPanel(shippingDeskPendingBooking);
});
