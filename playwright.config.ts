import { defineConfig, devices } from "@playwright/test";

// Playwright สำหรับ e2e เฉพาะ flow สำคัญ (ทำเทส → เห็นผล, ล็อกอิน) — ดู CLAUDE.md §9
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // รัน dev server อัตโนมัติเวลาเทส (ใช้ตัวที่รันอยู่ถ้ามี ยกเว้นบน CI)
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
