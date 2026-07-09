# Recent Technical Changes: WhatsApp Free Automation

This document outlines the recent changes made to the TaskFlow backend to bypass Meta's billing restrictions and enable 100% free, automated WhatsApp messaging for the 1-week client trial.

## What Changed?
We successfully replaced the strict Meta Graph API with `whatsapp-web.js`. 
Instead of paying for approved templates via Meta Business Suite, the backend now spins up a hidden "WhatsApp Web" instance using Puppeteer. 

### Key Files Modified:
1. **`backend/src/services/whatsapp-automation.ts` [NEW]**
   - Handles the initialization of the headless WhatsApp client.
   - Generates the QR Code in the terminal.
   - Exports `sendWhatsAppAutomationMessage()` which sends raw text messages to any number for free.

2. **`backend/src/server.ts` [MODIFIED]**
   - Now imports and calls `initWhatsAppAutomation()` on server startup.

3. **`backend/src/routes/tasks.ts` [MODIFIED]**
   - Disconnected the old `sendTaskAssignedTemplate` function.
   - Replaced it with the new `sendWhatsAppAutomationMessage()`.
   - The original Meta code was left in the codebase (but unused) just in case the client ever decides to switch back to paid Meta APIs in the future.

4. **`.gitignore` [MODIFIED]**
   - Added `.wwebjs_auth` and `.wwebjs_cache` so that the local WhatsApp session tokens do not conflict when multiple developers pull the code.

## How to Test Locally
1. Run `npm run dev` in the backend.
2. Wait 15 seconds. A QR code will appear in the terminal.
3. Scan it using the WhatsApp app on your phone (Linked Devices).
4. Create a task in the UI. A message will instantly be sent from your phone!

## Deployment Notes
- **Linux Dependencies:** The production server MUST have Chromium dependencies installed to run the headless browser (`libnss3`, `libgbm1`, `libasound2`, etc.).
- **Session Storage:** The login session is saved locally in `.wwebjs_auth`. If deployed on an ephemeral "free tier" server (like Render or Heroku) that wipes its disk on restart, the client will have to scan the QR code repeatedly. See the consulting notes on how to fix this using AWS/GCP Free Tiers.
