# Mahatma Global Gateway TaskFlow
## Windows OS Startup Notification & Calendar Sync Guide

This guide explains how to enable and use the native Windows desktop alerts and calendar integration for MGG TaskFlow. Share these steps with your staff members so they can set it up on their personal or work computers.

---

### Part 1: Windows OS Startup Notifications
This feature pops up native Windows desktop alerts displaying new, upcoming, or overdue tasks immediately when you turn on your computer or log into Windows.

#### How to Enable (One-Click Setup):
1. **Log in** to your account at **[http://localhost:8080](http://localhost:8080)**.
2. Click on the **Settings** gear icon in the top-right corner.
3. Select the **Notifications** tab.
4. Scroll down to the **Windows OS Startup Notifications** section.
5. Click the **Register OS Startup Alerts** button.
6. A Windows User Account Control (UAC) popup will appear on your desktop asking to run Windows PowerShell as Administrator. Click **Yes** to authorize the installer.
7. **That's it!** The system will automatically configure itself.

#### How It Works (Technical Details):
* A silent background task named `MGGStartupNotifier` is registered in your **Windows Task Scheduler**.
* Every time you boot your PC or log into Windows, this task waits for 30 seconds (to let your desktop load), pings the TaskFlow server, and pops up native OS Toast Notifications for your specific assignments.
* To prevent annoying duplicates, once a notification pops up, the database flags it so you won't see the same popup on subsequent reboots.

---

### Part 2: Dynamic Calendar Integration
This feature automatically syncs your task deadlines directly into your built-in Windows Calendar, Outlook, Google Calendar, or Apple Calendar.

#### How to Enable:
1. Log in and navigate to **Settings** ➔ **Calendar Sync** tab.
2. Choose one of the two options:

##### Option A: Automatic Sync (Recommended)
1. Click the **Sync Automatically** button.
2. The browser will download your calendar file (`tasks.ics`).
3. Simply **click the downloaded file** at the bottom or top of your browser.
4. Windows will launch your default Calendar app (Windows Calendar or Outlook) and automatically import/link all of your task deadlines.

##### Option B: Subscribe via Link (For Google Calendar or Outlook Web)
1. Click the **Copy Link** button to copy your custom iCalendar URL to your clipboard.
2. Open your preferred calendar app:
   * **Google Calendar**: Next to *Other calendars* on the left sidebar, click the `+` icon ➔ select **From URL** ➔ Paste the copied link ➔ click **Add Calendar**.
   * **Outlook.com / Web App**: Click **Add Calendar** ➔ select **Subscribe from web** ➔ Paste the link ➔ click **Import**.

---

### Troubleshooting
* **Server Status**: The desktop notifications and calendar feed require the local backend server to be running (`npm run dev` in the backend folder). If the server is offline, the notifier script will fail silently without throwing errors.
* **Administrator Rights**: If the automatic setup button doesn't trigger the UAC prompt, open PowerShell as Administrator and run the installer manually from the project folder:
  ```powershell
  powershell.exe -ExecutionPolicy Bypass -File .\install_notifier_task.ps1
  ```
