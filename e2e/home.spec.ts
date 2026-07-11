import { expect, test } from "@playwright/test";

// Placeholder e2e: ยืนยันหน้าแรกโหลดได้และแสดงหัวข้อภาษาไทย
// (flow ทำเทส→เห็นผล จะเพิ่มใน Phase 4–5)
test("หน้าแรกโหลดได้และมีหัวข้อภาษาไทย", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /ค้นหาตัวเอง/ })).toBeVisible();
});
