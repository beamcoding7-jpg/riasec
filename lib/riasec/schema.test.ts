import { describe, expect, it } from "vitest";

import { answerMapSchema, likertValueSchema } from "@/lib/riasec/schema";

const UUID = "123e4567-e89b-12d3-a456-426614174000";

describe("likertValueSchema", () => {
  it("รับค่า 1–5", () => {
    for (const v of [1, 2, 3, 4, 5]) expect(likertValueSchema.safeParse(v).success).toBe(true);
  });

  it("ปฏิเสธค่านอกช่วง / ไม่ใช่จำนวนเต็ม / ไม่ใช่ตัวเลข", () => {
    for (const v of [0, 6, 3.5, "3", null]) {
      expect(likertValueSchema.safeParse(v).success).toBe(false);
    }
  });
});

describe("answerMapSchema", () => {
  it("รับ map ที่ key เป็น uuid และ value เป็น Likert 1–5", () => {
    expect(answerMapSchema.safeParse({ [UUID]: 3 }).success).toBe(true);
  });

  it("ปฏิเสธเมื่อ key ไม่ใช่ uuid", () => {
    expect(answerMapSchema.safeParse({ "not-a-uuid": 3 }).success).toBe(false);
  });

  it("ปฏิเสธเมื่อ value นอกช่วง Likert", () => {
    expect(answerMapSchema.safeParse({ [UUID]: 6 }).success).toBe(false);
  });
});
