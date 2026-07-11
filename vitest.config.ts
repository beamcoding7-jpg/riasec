import { defineConfig } from "vitest/config";

// Vitest สำหรับ unit test (โดยเฉพาะ scoring engine ใน lib/riasec/ ที่เป็น pure function)
export default defineConfig({
  // resolve alias @/* จาก tsconfig โดยตรง (Vite รองรับ native แล้ว ไม่ต้องใช้ plugin)
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    // กันชนกับ Playwright (e2e/) และ build output
    exclude: ["**/node_modules/**", "**/.next/**", "**/e2e/**"],
  },
});
