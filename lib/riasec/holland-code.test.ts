import { describe, expect, it } from "vitest";

import { rankDimensions, toHollandCode } from "@/lib/riasec/holland-code";
import type { RiasecScores } from "@/lib/riasec/types";

// helper สร้าง RiasecScores โดยด้านที่ไม่ระบุ = 0
const scores = (partial: Partial<RiasecScores>): RiasecScores => ({
  R: 0,
  I: 0,
  A: 0,
  S: 0,
  E: 0,
  C: 0,
  ...partial,
});

describe("rankDimensions", () => {
  it("เรียงจากคะแนนมาก→น้อย", () => {
    expect(rankDimensions(scores({ R: 100, I: 75, A: 50, S: 25, E: 10, C: 5 }))).toEqual([
      "R",
      "I",
      "A",
      "S",
      "E",
      "C",
    ]);
  });

  it("คะแนนเท่ากันทุกด้าน → เรียงตาม canonical order (R,I,A,S,E,C)", () => {
    expect(rankDimensions(scores({ R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 }))).toEqual([
      "R",
      "I",
      "A",
      "S",
      "E",
      "C",
    ]);
  });

  it("เสมอกันที่อันดับ 3 (A=S) → เลือก A ก่อน S ตาม canonical (deterministic)", () => {
    const ranking = rankDimensions(scores({ R: 100, I: 75, A: 50, S: 50 }));
    expect(ranking[2]).toBe("A");
    expect(ranking[3]).toBe("S");
  });

  it("ไม่แก้ไข array คะแนนเดิม (คืน array ใหม่)", () => {
    const s = scores({ R: 10, I: 20 });
    rankDimensions(s);
    expect(s).toEqual(scores({ R: 10, I: 20 }));
  });
});

describe("toHollandCode", () => {
  it("เอา top-3 ตัวแรกมาต่อกัน", () => {
    expect(toHollandCode(["S", "E", "C", "R", "I", "A"])).toBe("SEC");
    expect(toHollandCode(["R", "I", "A", "S", "E", "C"])).toBe("RIA");
  });
});
