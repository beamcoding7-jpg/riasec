// Type contracts ของ scoring engine — pure type เท่านั้น (ไม่มี runtime import)
import type { RiasecDimension } from "@/types";

// metadata ของคำถามที่ engine ต้องใช้ (มาจากตาราง riasec_questions — Phase 4 โหลดแล้วส่งเข้ามา)
export type QuestionMeta = {
  id: string;
  dimension: RiasecDimension;
};

// คำตอบของผู้ใช้: questionId (uuid) → คะแนน Likert 1–5
export type AnswerMap = Record<string, number>;

// คะแนนต่อด้านครบ 6 มิติ (ใช้ได้ทั้ง raw และ normalized)
export type RiasecScores = Record<RiasecDimension, number>;

// ผลลัพธ์รวมของ engine — Phase 4 เอา scores/hollandCode ไปเก็บลง test_sessions
export type RiasecResult = {
  raw: RiasecScores; // ผลรวม Likert ดิบต่อด้าน
  scores: RiasecScores; // min-max 0–100 (จำนวนเต็ม) — เก็บลง test_sessions.scores + วาด radar
  ranking: RiasecDimension[]; // 6 ด้านเรียงมาก→น้อย (tie-break ด้วย canonical order)
  hollandCode: string; // top-3 เช่น "RIA" — เก็บลง test_sessions.holland_code
  answeredCount: number; // จำนวนข้อที่ตอบจริง
};
