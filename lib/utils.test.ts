import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

// Smoke test ยืนยันว่า toolchain (Vitest + alias @/*) ทำงาน และ cn() รวม class ถูก
describe("cn", () => {
  it("รวม class และตัด falsy ออก", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("merge tailwind class ที่ชนกัน โดยตัวหลังชนะ", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
