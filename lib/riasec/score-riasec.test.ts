import { describe, expect, it } from "vitest";

import { RIASEC_DIMENSIONS } from "@/lib/riasec/constants";
import { scoreRiasec } from "@/lib/riasec/score-riasec";
import type { AnswerMap, QuestionMeta } from "@/lib/riasec/types";
import type { RiasecDimension } from "@/types";

// สร้างชุดคำถามจำนวนเท่ากันทุกด้าน (default 10 ข้อ/ด้าน = 60 ข้อ เหมือน seed จริง)
function makeQuestions(perDim = 10): QuestionMeta[] {
  const qs: QuestionMeta[] = [];
  for (const dim of RIASEC_DIMENSIONS) {
    for (let i = 0; i < perDim; i++) qs.push({ id: `${dim}-${i}`, dimension: dim });
  }
  return qs;
}

// ตอบทุกข้อของแต่ละด้านด้วยค่าคงที่ตาม byDim (ด้านที่ไม่ระบุ = ไม่ตอบ)
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

describe("scoreRiasec", () => {
  it("รวม raw ถูกต้อง และ normalize แบบ min-max (1→0%, 5→100%)", () => {
    const q = makeQuestions();
    const { raw, normalized, answeredCount } = scoreRiasec(
      q,
      answersByDim(q, { R: 5, I: 4, A: 3, S: 2, E: 1, C: 1 }),
    );

    expect(raw).toEqual({ R: 50, I: 40, A: 30, S: 20, E: 10, C: 10 });
    expect(normalized).toEqual({ R: 100, I: 75, A: 50, S: 25, E: 0, C: 0 });
    expect(answeredCount).toBe(60);
  });

  it("ตอบ 3 (เฉยๆ) ทุกข้อ → ทุกด้าน = 50%", () => {
    const q = makeQuestions();
    const { normalized, raw } = scoreRiasec(
      q,
      answersByDim(q, { R: 3, I: 3, A: 3, S: 3, E: 3, C: 3 }),
    );

    for (const dim of RIASEC_DIMENSIONS) {
      expect(raw[dim]).toBe(30);
      expect(normalized[dim]).toBe(50);
    }
  });

  it("ไม่ตอบเลย → raw/normalized = 0 ทุกด้าน ไม่มี NaN และ answeredCount = 0", () => {
    const q = makeQuestions();
    const { raw, normalized, answeredCount } = scoreRiasec(q, {});

    for (const dim of RIASEC_DIMENSIONS) {
      expect(raw[dim]).toBe(0);
      expect(normalized[dim]).toBe(0);
      expect(Number.isNaN(normalized[dim])).toBe(false);
    }
    expect(answeredCount).toBe(0);
  });

  it("ตอบไม่ครบ: ด้านที่ไม่ตอบ = 0, ด้านที่ตอบบางส่วน normalize เฉพาะข้อที่ตอบ", () => {
    const q = makeQuestions();
    // ตอบเฉพาะ 3 ข้อของด้าน R ด้วยค่า 5, 3, 1 (n=3, ผลรวม=9)
    const answers: AnswerMap = { "R-0": 5, "R-1": 3, "R-2": 1 };
    const { raw, normalized, answeredCount } = scoreRiasec(q, answers);

    expect(raw.R).toBe(9);
    // (9 − 3×1) / (3×4) × 100 = 6/12 × 100 = 50 (ไม่คิดข้อที่ไม่ตอบ)
    expect(normalized.R).toBe(50);
    expect(normalized.I).toBe(0);
    expect(answeredCount).toBe(3);
  });

  it("⭐ กันจำนวนข้อต่อด้านไม่เท่ากัน: จัดอันดับตามสัดส่วน ไม่ใช่ผลรวมดิบ", () => {
    // R มี 5 ข้อ (ตอบ 5 ทุกข้อ), I มี 10 ข้อ (ตอบ 4 ทุกข้อ)
    const questions: QuestionMeta[] = [
      ...Array.from({ length: 5 }, (_, i) => ({ id: `R-${i}`, dimension: "R" as RiasecDimension })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `I-${i}`,
        dimension: "I" as RiasecDimension,
      })),
    ];
    const answers: AnswerMap = {};
    for (const q of questions) answers[q.id] = q.dimension === "R" ? 5 : 4;

    const { raw, normalized } = scoreRiasec(questions, answers);

    expect(raw.R).toBe(25);
    expect(raw.I).toBe(40); // raw ของ I มากกว่า
    expect(normalized.R).toBe(100);
    expect(normalized.I).toBe(75);
    expect(normalized.R).toBeGreaterThan(normalized.I); // แต่สัดส่วนของ R สูงกว่า
  });
});
