// รวมคะแนนต่อด้าน (raw) + normalize แบบ min-max — pure function ไม่มี side effect
import { LIKERT_MAX, LIKERT_MIN, RIASEC_DIMENSIONS } from "./constants";
import type { AnswerMap, QuestionMeta, RiasecScores } from "./types";

// ผลการให้คะแนนก่อนจัดอันดับ
export type ScoreBreakdown = {
  raw: RiasecScores; // ผลรวม Likert ดิบต่อด้าน
  normalized: RiasecScores; // min-max 0–100 แบบ "ยังไม่ปัด" — ใช้จัดอันดับเพื่อกัน tie ปลอม
  answeredCount: number; // จำนวนข้อที่ตอบจริง
};

// สร้าง object คะแนนเปล่า {R:0, I:0, ...} จาก RIASEC_DIMENSIONS (single source of truth)
function emptyScores(): RiasecScores {
  return Object.fromEntries(RIASEC_DIMENSIONS.map((dim) => [dim, 0])) as RiasecScores;
}

// รวมคะแนนต่อด้าน แล้ว normalize ตามจำนวนข้อ "ที่ตอบจริง" (กันจำนวนคำถามต่อด้านไม่เท่ากัน)
export function scoreRiasec(questions: QuestionMeta[], answers: AnswerMap): ScoreBreakdown {
  const sum = emptyScores();
  const count = emptyScores(); // นับเฉพาะข้อที่ตอบ → เป็นตัวหารของ normalize
  let answeredCount = 0;

  for (const q of questions) {
    const value = answers[q.id];
    // ข้ามข้อที่ไม่ได้ตอบ (undefined/null) — ไม่นับทั้งเศษและส่วน
    if (value == null) continue;
    sum[q.dimension] += value;
    count[q.dimension] += 1;
    answeredCount += 1;
  }

  const raw = emptyScores();
  const normalized = emptyScores();
  const span = LIKERT_MAX - LIKERT_MIN; // ช่วงคะแนนต่อข้อ (= 4)

  for (const dim of RIASEC_DIMENSIONS) {
    const n = count[dim];
    raw[dim] = sum[dim];
    // min-max: (ผลรวม − n×min) / (n×span) × 100 ; ด้านที่ไม่มีข้อตอบเลย → 0 (กันหารศูนย์/NaN)
    normalized[dim] = n === 0 ? 0 : ((sum[dim] - n * LIKERT_MIN) / (n * span)) * 100;
  }

  return { raw, normalized, answeredCount };
}
