import { describe, expect, it } from "vitest";

import { computeRiasecResult } from "@/lib/riasec";
import { RIASEC_DIMENSIONS } from "@/lib/riasec/constants";
import type { AnswerMap, QuestionMeta } from "@/lib/riasec/types";
import type { RiasecDimension } from "@/types";

function makeQuestions(perDim = 10): QuestionMeta[] {
  const qs: QuestionMeta[] = [];
  for (const dim of RIASEC_DIMENSIONS) {
    for (let i = 0; i < perDim; i++) qs.push({ id: `${dim}-${i}`, dimension: dim });
  }
  return qs;
}

function answersByDim(
  questions: QuestionMeta[],
  byDim: Partial<Record<RiasecDimension, number>>,
): AnswerMap {
  const answers: AnswerMap = {};
  for (const q of questions) {
    const v = byDim[q.dimension];
    if (v !== undefined) answers[q.id] = v;
  }
  return answers;
}

describe("computeRiasecResult", () => {
  it("calibration: input ที่รู้ผลล่วงหน้า → Holland code + scores ตรงตามคาด", () => {
    const q = makeQuestions();
    const result = computeRiasecResult(q, answersByDim(q, { R: 5, I: 4, A: 3, S: 2, E: 1, C: 1 }));

    expect(result.raw).toEqual({ R: 50, I: 40, A: 30, S: 20, E: 10, C: 10 });
    expect(result.scores).toEqual({ R: 100, I: 75, A: 50, S: 25, E: 0, C: 0 });
    expect(result.ranking).toEqual(["R", "I", "A", "S", "E", "C"]);
    expect(result.hollandCode).toBe("RIA");
    expect(result.answeredCount).toBe(60);
  });

  it("ทุกด้านเท่ากัน → scores 50 ทุกด้าน, Holland code = RIA (canonical)", () => {
    const q = makeQuestions();
    const result = computeRiasecResult(q, answersByDim(q, { R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 }));

    for (const dim of RIASEC_DIMENSIONS) expect(result.scores[dim]).toBe(50);
    expect(result.hollandCode).toBe("RIA");
  });

  it("ไม่ตอบเลย → scores 0 ทุกด้าน, answeredCount 0, Holland code = RIA, ไม่มี NaN", () => {
    const q = makeQuestions();
    const result = computeRiasecResult(q, {});

    for (const dim of RIASEC_DIMENSIONS) {
      expect(result.scores[dim]).toBe(0);
      expect(Number.isNaN(result.scores[dim])).toBe(false);
    }
    expect(result.answeredCount).toBe(0);
    expect(result.hollandCode).toBe("RIA");
  });

  it("ลำดับ array คำถามไม่มีผล (order independent)", () => {
    const q = makeQuestions();
    const answers = answersByDim(q, { R: 5, I: 4, A: 3, S: 2, E: 1, C: 1 });

    const forward = computeRiasecResult(q, answers);
    const reversed = computeRiasecResult([...q].reverse(), answers);

    expect(reversed).toEqual(forward);
  });

  it("โดดเด่นด้านเดียว (R สูง ที่เหลือต่ำ) → Holland code ขึ้นต้นด้วย R", () => {
    const q = makeQuestions();
    const result = computeRiasecResult(q, answersByDim(q, { R: 5, I: 1, A: 1, S: 1, E: 1, C: 1 }));

    expect(result.scores.R).toBe(100);
    expect(result.hollandCode[0]).toBe("R");
    expect(result.ranking[0]).toBe("R");
  });

  it("invariants: scores ∈ [0,100], ranking เป็น permutation ครบ 6, hollandCode ยาว 3", () => {
    const q = makeQuestions();
    const cases: Partial<Record<RiasecDimension, number>>[] = [
      { R: 5, I: 4, A: 3, S: 2, E: 1, C: 1 },
      { R: 1, I: 2, A: 3, S: 4, E: 5, C: 3 },
      { C: 5, E: 5, S: 1 },
      {},
    ];

    for (const byDim of cases) {
      const { scores, ranking, hollandCode } = computeRiasecResult(q, answersByDim(q, byDim));

      for (const dim of RIASEC_DIMENSIONS) {
        expect(scores[dim]).toBeGreaterThanOrEqual(0);
        expect(scores[dim]).toBeLessThanOrEqual(100);
      }
      expect(ranking).toHaveLength(6);
      expect([...ranking].sort()).toEqual([...RIASEC_DIMENSIONS].sort());
      expect(hollandCode).toHaveLength(3);
    }
  });
});
