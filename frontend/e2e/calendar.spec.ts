import { test, expect } from "@playwright/test";

test.describe("MGG TaskFlow Calendar Synchronization Suite", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Authenticate user by mock setting sessionStorage credentials to bypass login redirection
    await page.goto("http://localhost:8080/login");
    await page.fill('input[type="email"]', "priya@mgg.edu.in");
    await page.fill('input[type="password"]', "password123");
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
    await page.click('button[value="calendar"]');

    // Wait for the download event and trigger the click on "Sync Automatically"
    const downloadPromise = page.waitForEvent("download");
    await page.click('button:has-text("Sync Automatically")');
    const download = await downloadPromise;

    // Verify the downloaded file matches standard iCalendar extension (.ics)
    expect(download.suggestedFilename()).toContain(".ics");
  });
});
