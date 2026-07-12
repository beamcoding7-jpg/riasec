import { describe, expect, it } from "vitest";

import { gradeLevelSchema, submitTestSchema } from "@/lib/test/schema";

// uuid ตัวอย่างที่ถูก format (ใช้เป็น key ของ answers)
const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("gradeLevelSchema", () => {
  it("รับเฉพาะ m3 / m4_6", () => {
    expect(gradeLevelSchema.parse("m3")).toBe("m3");
    expect(gradeLevelSchema.parse("m4_6")).toBe("m4_6");
  });

  it("ปฏิเสธค่าช่วงชั้นอื่น", () => {
    expect(gradeLevelSchema.safeParse("m1").success).toBe(false);
    expect(gradeLevelSchema.safeParse("").success).toBe(false);
  });
});

describe("submitTestSchema", () => {
  it("ผ่านเมื่อ answers + gradeLevel ถูกต้อง", () => {
    const result = submitTestSchema.safeParse({
      answers: { [UUID]: 5 },
      gradeLevel: "m3",
    });
    expect(result.success).toBe(true);
  });

  it("ปฏิเสธเมื่อ gradeLevel ไม่ถูกต้อง", () => {
    expect(submitTestSchema.safeParse({ answers: { [UUID]: 5 }, gradeLevel: "x" }).success).toBe(
      false,
    );
  });

  it("ปฏิเสธเมื่อค่า Likert อยู่นอกช่วง 1–5", () => {
    expect(submitTestSchema.safeParse({ answers: { [UUID]: 6 }, gradeLevel: "m3" }).success).toBe(
      false,
    );
  });

  it("ปฏิเสธเมื่อ key ของ answers ไม่ใช่ uuid", () => {
    expect(
      submitTestSchema.safeParse({ answers: { "not-a-uuid": 3 }, gradeLevel: "m3" }).success,
    ).toBe(false);
  });
});
