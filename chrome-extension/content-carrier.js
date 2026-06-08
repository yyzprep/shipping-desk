function carrierName(id) {
  const names = {
    purolator: "Purolator",
    shipsavvy: "ShipSavvy Orders",
    shipsavvyPickup: "ShipSavvy Pickup",
    canadaPost: "Canada Post",
    abCourier: "AB Courier",
    freightera: "Freightera"
  };
  return names[id] || "Carrier";
}

function bookingLines(booking) {
  const itemLabel = booking.task === "shipment" ? "order" : "pickup";
  return [
    `${carrierName(booking.carrier)} ${itemLabel}`,
    `Date: ${booking.pickupDate || "Not set"}`,
    `Ready: ${booking.readyTime || "Not set"}`,
    `Close: ${booking.closeTime || "Not set"}`,
    booking.skids ? `Skids: ${booking.skids}` : "",
    booking.notes ? `Notes: ${booking.notes}` : "",
    "",
    "Stop before the final submit, book, pay, or confirm button."
  ].filter(Boolean);
}

function injectPanel(booking) {
  if (!booking || booking.carrier === "ups" || document.querySelector("#shipping-desk-helper")) return;
  const itemLabel = booking.task === "shipment" ? "order" : "pickup";

  const panel = document.createElement("div");
  panel.id = "shipping-desk-helper";
  panel.innerHTML = `
    <button type="button" data-helper-close aria-label="Close Assistant Hub helper">x</button>
    <strong>${carrierName(booking.carrier)} ${itemLabel} prep</strong>
    <span>${booking.pickupDate || "No date"} ${booking.readyTime || ""}-${booking.closeTime || ""}</span>
    <button type="button">Copy ${itemLabel} values</button>
    <small>Prepare the page, then stop before final submit/payment.</small>
  `;
  panel.style.cssText = [
    "position:fixed",
    "right:16px",
    "bottom:16px",
    "z-index:2147483647",
    "display:grid",
    "gap:6px",
    "max-width:280px",
    "padding:18px 12px 12px",
    "border:1px solid #d9e0e4",
    "border-radius:8px",
    "background:#fff",
    "box-shadow:0 12px 30px rgba(0,0,0,.18)",
    "font:13px system-ui,sans-serif",
    "color:#172026"
  ].join(";");
  panel.querySelector("[data-helper-close]").style.cssText = "position:absolute;top:5px;left:5px;width:17px;height:17px;border:0;border-radius:4px;background:transparent;color:#63717b;font-size:12px;line-height:17px;font-weight:700;padding:0;cursor:pointer";
  panel.querySelector("button:not([data-helper-close])").style.cssText = "min-height:34px;border:0;border-radius:6px;background:#176b55;color:#fff;font-weight:800;padding:0 12px;cursor:pointer";
  panel.querySelector("small").style.cssText = "color:#63717b;line-height:1.35";
  panel.querySelector("[data-helper-close]").addEventListener("click", () => {
    panel.remove();
  });
  panel.querySelector("button:not([data-helper-close])").addEventListener("click", () => {
    navigator.clipboard.writeText(bookingLines(booking).join("\n"));
  });
  document.body.append(panel);
}

chrome.storage.local.get("shippingDeskPendingBooking", ({ shippingDeskPendingBooking }) => {
  injectPanel(shippingDeskPendingBooking);
});
