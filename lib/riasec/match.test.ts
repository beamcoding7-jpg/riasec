import { describe, expect, it } from "vitest";

import { matchEntities, USER_TOP_WEIGHTS, type MatchMapRow } from "./match";

// helper สร้างแถว map สั้น ๆ
const row = (
  entityId: string,
  dimension: MatchMapRow["dimension"],
  weight: number,
  reason = `${dimension}-reason`,
): MatchMapRow => ({ entityId, dimension, weight, reason });

describe("matchEntities", () => {
  it("คิดคะแนน = Σ (userWeight × map.weight) เฉพาะมิติใน top-3", () => {
    // ผู้ใช้ RIA → R=3, I=2, A=1 ; entity X: R(3), I(2)
    const [x] = matchEntities(["R", "I", "A"], [row("X", "R", 3), row("X", "I", 2)]);
    // R: 3×3=9, I: 2×2=4 → 13
    expect(x.score).toBe(13);
    // matches เรียง contribution มาก→น้อย → R (9) ก่อน I (4)
    expect(x.matches.map((m) => m.dimension)).toEqual(["R", "I"]);
    expect(x.matches[0].contribution).toBe(9);
  });

  it("ไม่นับมิติที่อยู่นอก top-3 ของผู้ใช้", () => {
    // ผู้ใช้ RIA ; entity Y: C(3) [นอก top-3 → ไม่นับ] + R(1)
    const [y] = matchEntities(["R", "I", "A"], [row("Y", "C", 3), row("Y", "R", 1)]);
    expect(y.score).toBe(3); // เฉพาะ R: 3×1
    expect(y.matches).toHaveLength(1);
    expect(y.matches[0].dimension).toBe("R");
  });

  it("entity ที่ไม่มีมิติตรงเลย → score 0 และยังอยู่ในผล (สำหรับกรณีแสดงทั้งหมด)", () => {
    const result = matchEntities(["R", "I", "A"], [row("Z", "S", 3), row("Z", "E", 2)]);
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(0);
    expect(result[0].matches).toHaveLength(0);
  });

  it("เรียง entity ตามคะแนนมาก→น้อย", () => {
    const result = matchEntities(
      ["R", "I", "A"],
      [row("low", "A", 1), row("high", "R", 3), row("mid", "I", 3)],
    );
    // high: 3×3=9, mid: 2×3=6, low: 1×1=1
    expect(result.map((e) => e.entityId)).toEqual(["high", "mid", "low"]);
  });

  it("tie-break deterministic: คะแนนเท่ากัน → เรียงตาม entityId (asc)", () => {
    // ทั้ง b และ a ได้ R(3) → score 9 เท่ากัน, contribution เดี่ยวเท่ากัน → entityId
    const result = matchEntities(["R", "I", "A"], [row("b", "R", 3), row("a", "R", 3)]);
    expect(result.map((e) => e.entityId)).toEqual(["a", "b"]);
  });

  it("จำกัดจำนวนด้วย limit (slice หลังเรียงแล้ว)", () => {
    const rows = [row("e1", "R", 3), row("e2", "I", 3), row("e3", "A", 3)];
    const result = matchEntities(["R", "I", "A"], rows, 2);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.entityId)).toEqual(["e1", "e2"]); // R(9) > I(6) > A(3)
  });

  it("rows ว่าง → คืน []", () => {
    expect(matchEntities(["R", "I", "A"], [])).toEqual([]);
  });

  it("topDims ว่าง → ทุก entity score 0", () => {
    const result = matchEntities([], [row("X", "R", 3), row("Y", "I", 2)]);
    expect(result.every((e) => e.score === 0)).toBe(true);
  });

  it("USER_TOP_WEIGHTS = [3,2,1] ตามอันดับ", () => {
    expect([...USER_TOP_WEIGHTS]).toEqual([3, 2, 1]);
  });
});
