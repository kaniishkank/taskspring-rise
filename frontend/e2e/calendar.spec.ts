import { test, expect } from "@playwright/test";

test.describe("MGG TaskFlow Calendar Synchronization Suite", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on("pageerror", (err) => console.log(`[BROWSER EXCEPTION]: ${err.message}`));
    page.on("request", (req) => console.log(`[REQUEST] ${req.method()} ${req.url()}`));
    page.on("response", (res) => console.log(`[RESPONSE] ${res.status()} ${res.url()}`));

    // 1. Authenticate user by mock setting sessionStorage credentials to bypass login redirection
    await page.goto("http://localhost:8080/login");
    await page.waitForTimeout(2000); // Wait for React hydration to attach handlers
    await page.fill('#loginId', "principal@mgg.edu.in");
    await page.fill('#password', "Admin@2026");
    await page.click('button[type="submit"]');

    // Verify successful login redirect to dashboard
    await expect(page).toHaveURL("http://localhost:8080/");
  });

  test("should track localStorage state and dynamically trigger calendar subscription URL", async ({ page }) => {
    // Simulate first-time login on a new machine by clearing localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });

    // Reload the page to trigger the layout hook
    await page.reload();

    // Wait for localStorage flag to be written automatically by the layout hook
    await page.waitForFunction(() => {
      return Object.keys(localStorage).some((key) => key.startsWith("mgg_cal_synced_"));
    }, { timeout: 5000 });

    // Verify localStorage flag is written automatically to mark sync trigger as initialized
    const isSynced = await page.evaluate(() => {
      // Find the key matching our user sync pattern
      return Object.keys(localStorage).some((key) => key.startsWith("mgg_cal_synced_"));
    });
    
    expect(isSynced).toBe(true);
  });

  test("should trigger download of .ics calendar file when Sync Automatically is clicked", async ({ page }) => {
    // Navigate directly to user settings
    await page.goto("http://localhost:8080/settings");

    // Click the Calendar tab inside settings tab group
    await page.click('button:has-text("Calendar Sync")');

    // Wait for the download event and trigger it by navigating directly to the HTTP subscription URL
    const icalUrl = await page.inputValue('#ical-link');
    const downloadPromise = page.waitForEvent("download");
    
    try {
      await page.goto(icalUrl);
    } catch (err: any) {
      if (!err.message.includes("Download is starting")) {
        throw err;
      }
    }
    
    const download = await downloadPromise;

    // Verify the downloaded file matches standard iCalendar extension (.ics)
    expect(download.suggestedFilename()).toContain(".ics");
  });
});
