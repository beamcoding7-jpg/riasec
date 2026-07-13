import { describe, expect, it } from "vitest";

import { regionOfProvince, REGIONS } from "./regions";

describe("regionOfProvince", () => {
  it("จับคู่จังหวัดตัวอย่างเข้าภูมิภาคถูกต้อง", () => {
    expect(regionOfProvince("กรุงเทพมหานคร")).toBe("bangkok");
    expect(regionOfProvince("นครปฐม")).toBe("bangkok"); // ปริมณฑล
    expect(regionOfProvince("พระนครศรีอยุธยา")).toBe("central");
    expect(regionOfProvince("เชียงใหม่")).toBe("north");
    expect(regionOfProvince("พิษณุโลก")).toBe("north"); // เหนือตอนล่าง
    expect(regionOfProvince("ขอนแก่น")).toBe("northeast");
    expect(regionOfProvince("ชลบุรี")).toBe("east");
    expect(regionOfProvince("ราชบุรี")).toBe("west");
    expect(regionOfProvince("สงขลา")).toBe("south");
  });

  it("trim ช่องว่างรอบ ๆ ก่อนจับคู่", () => {
    expect(regionOfProvince("  เชียงราย ")).toBe("north");
  });

  it("คืน null เมื่อไม่รู้จัก/ว่าง", () => {
    for (const bad of ["", "   ", "Nowhere", null, undefined]) {
      expect(regionOfProvince(bad)).toBeNull();
    }
  });

  it("ทุก region key อยู่ในลิสต์ REGIONS", () => {
    const keys = new Set(REGIONS);
    for (const p of ["กรุงเทพมหานคร", "เชียงใหม่", "ขอนแก่น", "ชลบุรี", "ราชบุรี", "สงขลา"]) {
      expect(keys.has(regionOfProvince(p)!)).toBe(true);
    }
  });
});
