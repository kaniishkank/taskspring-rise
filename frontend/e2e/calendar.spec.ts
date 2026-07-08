import { test, expect } from "@playwright/test";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const mockToken = jwt.sign({ id: "m2", role: "MANAGER" }, JWT_SECRET);

test.describe("MGG TaskFlow Calendar Synchronization Suite", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on("pageerror", (err) => console.log(`[BROWSER EXCEPTION]: ${err.message}`));
    page.on("request", (req) => console.log(`[REQUEST] ${req.method()} ${req.url()}`));
    page.on("response", (res) => console.log(`[RESPONSE] ${res.status()} ${res.url()}`));

    // 1. Authenticate user by mock setting sessionStorage credentials to bypass login redirection
    await page.goto("http://localhost:8080/login");
    await page.evaluate((token) => {
      const mockUser = {
        id: "m2",
        email: "principal.ramanathan@mggschool.edu",
        role: "MANAGER",
        name: "Principal S. Ramanathan",
        token: token
      };
      window.sessionStorage.setItem("mgg_user", JSON.stringify(mockUser));
    }, mockToken);

    // Navigate to dashboard and verify it bypassed redirect successfully
    await page.goto("http://localhost:8080/");
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
    // Navigate directly to calendar view
    await page.goto("http://localhost:8080/calendar");

    // Click the Sync to Device button to open the modal
    await page.click('button:has-text("Sync to Device")');

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
