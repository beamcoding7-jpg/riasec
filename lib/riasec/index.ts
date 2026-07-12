// จุดเข้าเดียว (barrel) ของ scoring engine — Phase 4/5 import จากที่นี่
import { RIASEC_DIMENSIONS } from "./constants";
import { rankDimensions, toHollandCode } from "./holland-code";
import { scoreRiasec } from "./score-riasec";
import type { AnswerMap, QuestionMeta, RiasecResult, RiasecScores } from "./types";

// ปัด normalized เป็นจำนวนเต็ม 0–100 สำหรับเก็บ/แสดง (การจัดอันดับใช้ค่า unrounded ไปแล้ว)
function roundScores(scores: RiasecScores): RiasecScores {
  return Object.fromEntries(
    RIASEC_DIMENSIONS.map((dim) => [dim, Math.round(scores[dim])]),
  ) as RiasecScores;
}

// คำนวณผล RIASEC ครบชุดจากคำถาม + คำตอบ — pure, deterministic
export function computeRiasecResult(questions: QuestionMeta[], answers: AnswerMap): RiasecResult {
  const { raw, normalized, answeredCount } = scoreRiasec(questions, answers);
  const ranking = rankDimensions(normalized); // จัดอันดับด้วยค่า unrounded
  const hollandCode = toHollandCode(ranking);
  const scores = roundScores(normalized);

  return { raw, scores, ranking, hollandCode, answeredCount };
}

// re-export ส่วนที่ให้เฟสอื่นใช้
export * from "./constants";
export * from "./types";
export * from "./schema";
export { scoreRiasec, type ScoreBreakdown } from "./score-riasec";
export { rankDimensions, toHollandCode } from "./holland-code";
