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

const HELPER_VERSION = "0.2.0";
let upsAutomationTimer = null;
let upsAutomationStarted = false;

function setNativeValue(element, value) {
  if (!element || value === undefined || value === null) return false;
  const win = element.ownerDocument?.defaultView || window;
  const proto = element.tagName === "TEXTAREA"
    ? win.HTMLTextAreaElement?.prototype || Object.getPrototypeOf(element)
    : win.HTMLInputElement?.prototype || Object.getPrototypeOf(element);
  const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
  element.focus?.();
  descriptor?.set ? descriptor.set.call(element, value) : element.setAttribute("value", value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.blur?.();
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
  const win = element.ownerDocument?.defaultView || window;
  const descriptor = Object.getOwnPropertyDescriptor(win.HTMLSelectElement?.prototype || Object.getPrototypeOf(element), "value");
  element.focus?.();
  descriptor?.set ? descriptor.set.call(element, option.value) : element.setAttribute("value", option.value);
  option.selected = true;
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.blur?.();
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

function isUpsPaymentOrReviewPage() {
  return location.pathname.includes("/pickup/processinfo")
    || /select payment method|payment|review/i.test(document.title)
    || textIncludes(document.body, "Select Payment Method");
}

function upsPageStage() {
  if (isUpsPaymentOrReviewPage()) return "payment_or_review";
  if (isClassicPickupPage()) return "pickup_entry";
  if (textIncludes(document.body, "Use Classic App") || textIncludes(document.body, "Use Classic View")) return "modern_entry";
  return "unknown";
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

function clickControl(control) {
  if (!control) return false;
  control.focus?.();
  control.click();
  control.dispatchEvent(new Event("input", { bubbles: true }));
  control.dispatchEvent(new Event("change", { bubbles: true }));
  control.blur?.();
  return true;
}

function serviceText(element) {
  const labelledBy = element.getAttribute?.("aria-labelledby");
  const labelText = labelledBy
    ? labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || "").join(" ")
    : "";
  const explicitLabel = element.id ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent || "" : "";
  return [
    visibleText(element),
    element.id,
    element.name,
    element.value,
    element.getAttribute?.("for"),
    element.getAttribute?.("aria-label"),
    labelText,
    explicitLabel,
    element.closest?.("label, li, div")?.textContent
  ].filter(Boolean).join(" ").toLowerCase();
}

function clickLabelOrControlByText(patterns, root = document) {
  const controls = [...root.querySelectorAll("input[type='checkbox'], input[type='radio'], button, label, a")]
    .filter(isVisible);
  const target = controls.find((control) => {
    const text = serviceText(control);
    return patterns.some((pattern) => text.includes(pattern.toLowerCase()));
  });
  if (!target) return false;
  const linked = target.tagName === "LABEL" && target.getAttribute("for")
    ? document.getElementById(target.getAttribute("for"))
    : target;
  return clickControl(linked);
}

function selectUpsStandardService() {
  clickControl(document.getElementById("domSrvButtonId"));
  clickLabelOrControlByText(["UPS Domestic Services", "domSrvButtonId"], document.getElementById("srvModuleDiv") || document);
  const serviceRoot = document.getElementById("domSrvDiv") || document.getElementById("srvModuleDiv") || document;
  return clickLabelOrControlByText([
    "UPS Standard",
    "Standard",
    "UPS Standard®",
    "Ground"
  ], serviceRoot);
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
  setTextById("trkNbrAreaId", "");
  setTextById("addrMDCompanyId", UPS_DEFAULTS.companyName);
  setTextById("addrMDCustNameId", UPS_DEFAULTS.contactName);
  setTextById("addressId", UPS_DEFAULTS.addressLine1);
  setTextById("addrMDRoomId", UPS_DEFAULTS.addressLine2);
  setTextById("addrMDFloorId", UPS_DEFAULTS.addressLine3);
  setTextById("pd2Id", UPS_DEFAULTS.city);
  selectById("pd1", UPS_DEFAULTS.province);
  setTextById("postalcode", UPS_DEFAULTS.postalCode);
  setTextById("addrMDPhoneId", UPS_DEFAULTS.telephone);
  const standardSelected = selectUpsStandardService();
  selectById("dtotalpkgs", UPS_DEFAULTS.packages);
  clickById("radioWeight70N");
  selectById("pickupdate", formatClassicDateValue(booking.pickupDate));
  setClassicTime("ready", booking.readyTime);
  setClassicTime("close", booking.closeTime);
  selectById("pickuppoint", UPS_DEFAULTS.preferredLocation);
  setTextById("spInstrId", instruction);
  return standardSelected;
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
  const standardSelected = fillClassicUpsPickup(booking, instruction);
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
  return standardSelected;
}

function runUpsAutomation(booking) {
  if (!booking || booking.carrier !== "ups") return;
  if (isUpsPaymentOrReviewPage()) {
    updateHelperStatus("Reached UPS payment/review page. Stop here and review before final submit.");
    return;
  }
  if (upsAutomationStarted && upsAutomationTimer) {
    window.clearTimeout(upsAutomationTimer);
  }
  upsAutomationStarted = true;

  clearUpsOverlays();
  if (!isClassicPickupPage() && switchToClassicView()) {
    window.setTimeout(confirmClassicView, 700);
    window.setTimeout(confirmClassicView, 1600);
    window.setTimeout(confirmClassicView, 3000);
  } else if (!isClassicPickupPage()) {
    confirmClassicView();
  }

  const runFill = (shouldAdvance = false) => {
    if (!isClassicPickupPage()) {
      confirmClassicView();
    } else {
      const standardSelected = fillUpsPickup(booking);
      updateHelperStatus(standardSelected ? "UPS Standard selected" : "Filled page 1. UPS Standard was not available.");
      if (shouldAdvance) clickUpsNextToReview();
    }
  };

  window.setTimeout(() => runFill(false), 900);
  upsAutomationTimer = window.setTimeout(() => runFill(true), 2800);
}

function clickUpsNextToReview() {
  const nextButton = [...document.querySelectorAll("input[type='button'], button")]
    .find((button) => isVisible(button) && visibleText(button).trim().toLowerCase() === "next");
  if (!nextButton) {
    updateHelperStatus("Filled what I could. UPS Next was not available.");
    return false;
  }
  clickControl(nextButton);
  updateHelperStatus("Clicked UPS Next. Review UPS validation before final submit.");
  return true;
}

function updateHelperStatus(message) {
  const panel = document.querySelector("#shipping-desk-helper");
  const small = panel?.querySelector("small");
  if (small) small.textContent = message;
}

function upsDebugSnapshot(booking) {
  const serviceRoot = document.getElementById("domSrvDiv");
  const serviceControls = [...document.querySelectorAll("#srvModuleDiv input, #srvModuleDiv select, #srvModuleDiv button, #srvModuleDiv label")]
    .map((element) => ({
      tag: element.tagName,
      type: element.type || "",
      id: element.id || "",
      name: element.name || "",
      value: element.value || "",
      text: visibleText(element).slice(0, 120),
      disabled: Boolean(element.disabled),
      checked: Boolean(element.checked)
    }));
  const fields = [
    "radioShippingY",
    "trkNbrAreaId",
    "addrMDCompanyId",
    "addrMDCustNameId",
    "addressId",
    "addrMDRoomId",
    "addrMDFloorId",
    "pd2Id",
    "pd1",
    "postalcode",
    "addrMDPhoneId",
    "dtotalpkgs",
    "selectedServices",
    "pickupdate",
    "readyHours",
    "readyMinutes",
    "readyAMId",
    "readyPMId",
    "closeHours",
    "closeMinutes",
    "closeAMId",
    "closePMId",
    "pickuppoint",
    "spInstrId"
  ].map((id) => {
    const element = document.getElementById(id);
    return {
      id,
      exists: Boolean(element),
      value: element?.value || "",
      disabled: Boolean(element?.disabled),
      checked: Boolean(element?.checked)
    };
  });

  return {
    helperVersion: HELPER_VERSION,
    pageStage: upsPageStage(),
    url: location.href,
    title: document.title,
    hasBooking: Boolean(booking),
    booking,
    isClassicPickupPage: isClassicPickupPage(),
    isUpsPaymentOrReviewPage: isUpsPaymentOrReviewPage(),
    bodyTextSample: document.body?.innerText?.trim().replace(/\s+/g, " ").slice(0, 1200) || "",
    domSrvDivText: serviceRoot?.textContent?.trim().replace(/\s+/g, " ").slice(0, 500) || "",
    domSrvDivHtml: serviceRoot?.innerHTML?.slice(0, 1500) || "",
    serviceControls,
    fields,
    visibleErrors: [...document.querySelectorAll("[id*=Error], .ups-error, .error, [role='alert']")]
      .map((element) => ({
        id: element.id || "",
        text: element.textContent.trim().replace(/\s+/g, " ").slice(0, 250),
        display: getComputedStyle(element).display
      }))
      .filter((item) => item.text && item.display !== "none")
  };
}

function copyUpsDebug(booking) {
  const text = JSON.stringify(upsDebugSnapshot(booking), null, 2);
  navigator.clipboard?.writeText(text)
    .then(() => updateHelperStatus("Copied UPS debug. Paste it to Codex."))
    .catch(() => {
      updateHelperStatus("Could not copy debug. Open console or screenshot the panel.");
      console.log("Assistant Hub UPS debug", text);
    });
}

function bookingFromWindowName() {
  if (!window.name?.startsWith("assistantHubBooking:")) return null;
  try {
    return JSON.parse(decodeURIComponent(window.name.replace("assistantHubBooking:", "")));
  } catch {
    return null;
  }
}

function bookingFromUrl() {
  const encoded = new URLSearchParams(location.search).get("assistantHubBooking");
  if (!encoded) return null;
  try {
    const booking = JSON.parse(decodeURIComponent(encoded));
    const cleanUrl = new URL(location.href);
    cleanUrl.searchParams.delete("assistantHubBooking");
    history.replaceState(null, "", cleanUrl.toString());
    return booking;
  } catch {
    return null;
  }
}

function injectPanel(booking) {
  if (document.querySelector("#shipping-desk-helper")) return;

  const panel = document.createElement("div");
  panel.id = "shipping-desk-helper";
  panel.innerHTML = `
    <strong>Assistant Hub Helper v${HELPER_VERSION}</strong>
    <button type="button" data-ups-action="fill">${isUpsPaymentOrReviewPage() ? "Review UPS" : booking?.carrier === "ups" ? "Fill UPS" : "Assistant Hub loaded"}</button>
    <button type="button" data-ups-action="debug">Copy UPS debug</button>
    <span>${booking?.carrier === "ups" ? `${booking.pickupDate || "No date"} ${booking.readyTime || ""}-${booking.closeTime || ""}` : "No UPS booking data found"}</span>
    <small>${isUpsPaymentOrReviewPage() ? "Reached UPS payment/review page. Stop here before final submit." : booking?.carrier === "ups" ? "Manual mode: click Fill UPS once, then copy debug if Standard is missing." : "Submit from Assistant Hub again if this should be a UPS pickup."}</small>
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
  panel.querySelectorAll("button").forEach((button) => {
    button.style.cssText = "min-height:34px;border:0;border-radius:6px;background:#176b55;color:#fff;font-weight:800;padding:0 12px;cursor:pointer";
  });
  panel.querySelector("strong").style.cssText = "font-size:12px;color:#63717b";
  panel.querySelector("small").style.cssText = "color:#63717b;line-height:1.35";
  panel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ups-action]");
    if (!button) return;
    if (button.dataset.upsAction === "fill") runUpsAutomation(booking);
    if (button.dataset.upsAction === "debug") copyUpsDebug(booking);
  });
  document.body.append(panel);
}

chrome.storage.local.get("shippingDeskPendingBooking", ({ shippingDeskPendingBooking }) => {
  const pendingBooking = bookingFromUrl() || bookingFromWindowName() || shippingDeskPendingBooking;
  injectPanel(pendingBooking);
  updateHelperStatus(isUpsPaymentOrReviewPage() ? "Reached UPS payment/review page. Stop here before final submit." : "Loaded. Click Fill UPS once.");
});
