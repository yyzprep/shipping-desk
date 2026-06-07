# Assistant Hub Helper

This is the bridge that lets Assistant Hub carry pickup details into logged-in carrier pages.

The rule for every carrier is: prepare the pickup details, then stop before the final submit, confirm, book, or payment action. Staff should review the final carrier page manually before booking.

## Install for testing

1. Open Chrome and go to `chrome://extensions`.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select this `chrome-extension` folder.
5. Open Assistant Hub, click `Submit pickup`, then open or switch to the carrier tab.

When a UPS booking is pending, the extension shows a `Retry UPS fill` button on UPS pages. The helper fills the stable YYZ PREP defaults plus the selected pickup date, ready time, close time, and skids instruction. It does not click final submit, book, confirm, or payment buttons.

For Purolator, ShipSavvy, Canada Post, AB Courier, and Freightera, the extension currently shows a carrier pickup values panel with a copy button. Once each logged-in form is tested, we can add the same field-filling behavior carrier by carrier while still stopping before final submission.
