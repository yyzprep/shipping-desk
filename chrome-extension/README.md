# Shipping Desk Helper

This is the bridge that lets Shipping Desk carry pickup details into logged-in carrier pages.

## Install for testing

1. Open Chrome and go to `chrome://extensions`.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select this `chrome-extension` folder.
5. Open Shipping Desk, click `Book UPS pickup`, then open or switch to UPS.

When a UPS booking is pending, the extension shows a `Fill UPS pickup` button on UPS pages. The helper fills the stable YYZ PREP defaults plus the selected pickup date, ready time, close time, and skids instruction. UPS form selectors may need one tuning pass after testing inside the logged-in UPS page.
