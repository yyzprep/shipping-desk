window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.type !== "SHIPPING_DESK_BOOKING") return;

  chrome.storage.local.set({
    shippingDeskPendingBooking: event.data.booking
  }, () => {
    window.postMessage({
      type: "SHIPPING_DESK_BOOKING_SAVED",
      requestId: event.data.requestId
    }, "*");
  });
});
