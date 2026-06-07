const UPS_DEFAULTS = {
  companyName: "YYZ PREP",
  contactName: "YYZ PREP",
  email: "hello@yyzprep.ca",
  telephone: "6472500111",
  addressLine1: "25 NEWKIRK CT",
  addressLine2: "Unit 5",
  addressLine3: "Floor",
  city: "BRAMPTON",
  province: "Ontario",
  postalCode: "L6Z0B5",
  packages: "30",
  service: "UPS Standard",
  preferredLocation: "Warehouse",
  overweight: "No",
  prePrintedLabels: "Yes",
  classicReason: "Missing features in the new app"
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

function isVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
}

function fieldNear(label, selector = "input, textarea, select") {
  const attributeMatch = [...document.querySelectorAll(selector)]
    .find((field) => {
      const text = [
        field.getAttribute("aria-label"),
        field.getAttribute("placeholder"),
        field.name,
        field.id
      ].filter(Boolean).join(" ").toLowerCase();
      return isVisible(field) && text.includes(label.toLowerCase());
    });
  if (attributeMatch) return attributeMatch;

  const labels = [...document.querySelectorAll("label, legend, span, div, td, th, p")]
    .filter((element) => isVisible(element) && textIncludes(element, label));
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

function visibleText(element) {
  return [
    element.textContent,
    element.value,
    element.getAttribute("aria-label"),
    element.getAttribute("title")
  ].filter(Boolean).join(" ").trim();
}

function clickByText(patterns) {
  const controls = [...document.querySelectorAll("button, a, input[type='button'], input[type='submit']")];
  const target = controls.find((control) => {
    const text = visibleText(control).toLowerCase();
    return isVisible(control) && patterns.some((pattern) => text.includes(pattern.toLowerCase()));
  });
  if (!target) return false;
  target.click();
  return true;
}

function clearUpsOverlays() {
  clickByText(["Accept All Cookies", "Essential Cookies Only"]);
}

function switchToClassicView() {
  return clickByText(["Use Classic App", "Use Classic View"]);
}

function confirmClassicView() {
  const modal = [...document.querySelectorAll("[role='dialog'], .modal, .ups-modal, .overlay, .modal-content")]
    .find((element) => isVisible(element) && visibleText(element).toLowerCase().includes("classic"));
  if (modal) {
    const reasonSelect = [...modal.querySelectorAll("select")][0];
    chooseSelect(reasonSelect, UPS_DEFAULTS.classicReason);
    const reasonText = [...modal.querySelectorAll("textarea, input:not([type='hidden']):not([type='button']):not([type='submit'])")]
      .find((field) => {
        const text = [
          field.getAttribute("aria-label"),
          field.getAttribute("placeholder")
        ].filter(Boolean).join(" ").toLowerCase();
        return text.includes("reason") || text.includes("details");
      });
    setNativeValue(reasonText, "Need classic pickup notes and pickup location fields.");
  }
  const controls = modal
    ? [...modal.querySelectorAll("button, a, input[type='button']")]
    : [...document.querySelectorAll("button, a, input[type='button']")]
        .filter((control) => visibleText(control).toLowerCase().includes("classic"));
  const target = controls.find((control) => {
    const text = visibleText(control).toLowerCase();
    return isVisible(control) && ["proceed", "continue", "confirm", "yes", "use classic"].some((pattern) => text.includes(pattern));
  });
  if (!target) return false;
  target.click();
  return true;
}

function isClassicPickupPage() {
  return location.href.includes("client=IPR") || textIncludes(document.body, "Enter Pickup Information");
}

function fillText(label, value) {
  const field = fieldNear(label, "input:not([type='radio']):not([type='checkbox']), textarea");
  return setNativeValue(field, value);
}

function fillSelect(label, value) {
  return chooseSelect(fieldNear(label, "select"), value);
}

function setTextById(id, value) {
  return setNativeValue(document.getElementById(id), value);
}

function selectById(id, value) {
  return chooseSelect(document.getElementById(id), value);
}

function clickById(id) {
  const field = document.getElementById(id);
  if (!field) return false;
  field.click();
  return true;
}

function setClassicTime(prefix, timeValue) {
  if (!timeValue) return false;
  const [hourText, minuteText = "00"] = timeValue.split(":");
  let hour = Number(hourText);
  const meridiem = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  const hourId = prefix === "ready" ? "readyHours" : "closeHours";
  const minuteId = prefix === "ready" ? "readyMinutes" : "closeMinutes";
  const amId = prefix === "ready" ? "readyAMId" : "closeAMId";
  const pmId = prefix === "ready" ? "readyPMId" : "closePMId";
  selectById(hourId, String(hour));
  selectById(minuteId, minuteText);
  clickById(meridiem === "PM" ? pmId : amId);
  return true;
}

function fillClassicUpsPickup(booking, instruction) {
  clickById("radioShippingY");
  setTextById("addrMDCompanyId", UPS_DEFAULTS.companyName);
  setTextById("addrMDCustNameId", UPS_DEFAULTS.contactName);
  setTextById("addressId", UPS_DEFAULTS.addressLine1);
  setTextById("addrMDRoomId", UPS_DEFAULTS.addressLine2);
  setTextById("addrMDFloorId", UPS_DEFAULTS.addressLine3);
  setTextById("pd2Id", UPS_DEFAULTS.city);
  selectById("pd1", UPS_DEFAULTS.province);
  setTextById("postalcode", UPS_DEFAULTS.postalCode);
  setTextById("addrMDPhoneId", UPS_DEFAULTS.telephone);
  selectById("dtotalpkgs", UPS_DEFAULTS.packages);
  clickById("radioWeight70N");
  selectById("pickupdate", formatClassicDateValue(booking.pickupDate));
  setClassicTime("ready", booking.readyTime);
  setClassicTime("close", booking.closeTime);
  selectById("pickuppoint", UPS_DEFAULTS.preferredLocation);
  setTextById("spInstrId", instruction);
}

function formatClassicDateValue(dateValue) {
  if (!dateValue) return "";
  const [year, month, day] = dateValue.split("-");
  return `${year}${String(Number(month) - 1).padStart(2, "0")}${day}`;
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

  clearUpsOverlays();
  fillClassicUpsPickup(booking, instruction);
  clickNear("pre-printed UPS Shipping Labels", UPS_DEFAULTS.prePrintedLabels);
  fillText("Company or Name", UPS_DEFAULTS.companyName);
  fillText("Company", UPS_DEFAULTS.companyName);
  fillText("Contact Name", UPS_DEFAULTS.contactName);
  fillText("Contact", UPS_DEFAULTS.contactName);
  fillText("Telephone", UPS_DEFAULTS.telephone);
  fillText("Phone Number", UPS_DEFAULTS.telephone);
  fillText("Email", UPS_DEFAULTS.email);
  fillText("Street Address", UPS_DEFAULTS.addressLine1);
  fillText("Address Line 1", UPS_DEFAULTS.addressLine1);
  fillText("City", UPS_DEFAULTS.city);
  fillSelect("Province", UPS_DEFAULTS.province);
  fillText("Zip Code", UPS_DEFAULTS.postalCode);
  fillText("Postal Code", UPS_DEFAULTS.postalCode);
  fillText("Address Line 2", UPS_DEFAULTS.addressLine2);
  fillText("Apartment, Suite", UPS_DEFAULTS.addressLine2);
  fillText("Address Line 3", UPS_DEFAULTS.addressLine3);
  fillText("Floor", UPS_DEFAULTS.addressLine3);
  fillSelect("Package(s) in Your Pickup", UPS_DEFAULTS.packages);
  fillText("Package(s) in Your Pickup", UPS_DEFAULTS.packages);
  fillText("Package(s) in your pickup", UPS_DEFAULTS.packages);
  clickNear("UPS Domestic Services", UPS_DEFAULTS.service);
  clickNear("Items that weigh more than 32 Kg", UPS_DEFAULTS.overweight);
  fillSelect("Pickup Date", booking.pickupDate);
  fillTime("Earliest Pickup Time", booking.readyTime);
  fillTime("Latest Preferred Pickup Time", booking.closeTime);
  fillSelect("Preferred Pickup Location", UPS_DEFAULTS.preferredLocation);
  fillText("Special Instructions", instruction);
}

function runUpsAutomation(booking) {
  if (!booking || booking.carrier !== "ups") return;

  clearUpsOverlays();
  if (!isClassicPickupPage() && switchToClassicView()) {
    window.setTimeout(confirmClassicView, 700);
    window.setTimeout(confirmClassicView, 1600);
    window.setTimeout(confirmClassicView, 3000);
  } else if (!isClassicPickupPage()) {
    confirmClassicView();
  }

  let attempts = 0;
  const fillTimer = window.setInterval(() => {
    attempts += 1;
    if (!isClassicPickupPage()) {
      confirmClassicView();
    } else {
      fillUpsPickup(booking);
    }
    if (attempts >= 20) window.clearInterval(fillTimer);
  }, 1000);
}

function injectPanel(booking) {
  if (!booking || booking.carrier !== "ups" || document.querySelector("#shipping-desk-helper")) return;

  const panel = document.createElement("div");
  panel.id = "shipping-desk-helper";
  panel.innerHTML = `
    <button type="button">Retry UPS fill</button>
    <span>${booking.pickupDate || "No date"} ${booking.readyTime || ""}-${booking.closeTime || ""}</span>
    <small>Fills known fields only. Stop before final submit/payment.</small>
  `;
  panel.style.cssText = [
    "position:fixed",
    "right:16px",
    "bottom:16px",
    "z-index:2147483647",
    "display:grid",
    "gap:6px",
    "max-width:300px",
    "padding:10px",
    "border:1px solid #d9e0e4",
    "border-radius:8px",
    "background:#fff",
    "box-shadow:0 12px 30px rgba(0,0,0,.18)",
    "font:13px system-ui,sans-serif",
    "color:#172026"
  ].join(";");
  panel.querySelector("button").style.cssText = "min-height:34px;border:0;border-radius:6px;background:#176b55;color:#fff;font-weight:800;padding:0 12px;cursor:pointer";
  panel.querySelector("small").style.cssText = "color:#63717b;line-height:1.35";
  panel.querySelector("button").addEventListener("click", () => runUpsAutomation(booking));
  document.body.append(panel);
}

chrome.storage.local.get("shippingDeskPendingBooking", ({ shippingDeskPendingBooking }) => {
  injectPanel(shippingDeskPendingBooking);
  runUpsAutomation(shippingDeskPendingBooking);
});
