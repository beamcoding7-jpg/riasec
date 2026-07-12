import { describe, expect, it } from "vitest";

import { emailSchema, otpSchema, sessionIdSchema } from "./schema";

describe("emailSchema", () => {
  it("รับอีเมลที่ถูกต้องและ normalize (trim + lowercase)", () => {
    expect(emailSchema.parse("  Student@Example.COM ")).toBe("student@example.com");
  });

  it("ปฏิเสธอีเมลที่ผิดรูปแบบ", () => {
    for (const bad of ["", "not-an-email", "a@b", "foo@", "@bar.com"]) {
      expect(emailSchema.safeParse(bad).success).toBe(false);
    }
  });
});

describe("otpSchema", () => {
  it("รับรหัสตัวเลขล้วน 6–10 หลัก (trim ช่องว่างรอบ ๆ)", () => {
    expect(otpSchema.parse(" 123456 ")).toBe("123456"); // 6 หลัก (ค่า default)
    expect(otpSchema.parse("12345678")).toBe("12345678"); // 8 หลัก (โปรเจกต์นี้)
    expect(otpSchema.parse("1234567890")).toBe("1234567890"); // 10 หลัก (ขอบบน)
  });

  it("ปฏิเสธรหัสที่สั้น/ยาวเกินช่วง หรือมีอักขระที่ไม่ใช่ตัวเลข", () => {
    for (const bad of ["12345", "12345678901", "12a456", "abcdef", ""]) {
      expect(otpSchema.safeParse(bad).success).toBe(false);
    }
  });
});

describe("sessionIdSchema", () => {
  it("รับ uuid ที่ถูกต้อง", () => {
    expect(sessionIdSchema.safeParse("2f9e5b3a-1c2d-4e5f-8a9b-0c1d2e3f4a5b").success).toBe(true);
  });

  it("ปฏิเสธค่าที่ไม่ใช่ uuid", () => {
    for (const bad of ["", "123", "not-a-uuid", "2f9e5b3a-1c2d-4e5f-8a9b"]) {
      expect(sessionIdSchema.safeParse(bad).success).toBe(false);
    }
  });
});
