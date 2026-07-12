// จัดอันดับ 6 ด้าน + สร้าง Holland code — pure, deterministic
import { HOLLAND_CODE_LENGTH, RIASEC_DIMENSIONS } from "./constants";
import type { RiasecDimension } from "@/types";
import type { RiasecScores } from "./types";

// canonical index ของแต่ละมิติ (R=0 … C=5) — ใช้ tie-break เมื่อคะแนนเสมอ
const CANONICAL_INDEX = Object.fromEntries(RIASEC_DIMENSIONS.map((dim, i) => [dim, i])) as Record<
  RiasecDimension,
  number
>;

// จัดอันดับด้านจากคะแนนมาก→น้อย; เสมอกัน → เรียงตาม canonical order (ผลเดิมเสมอสำหรับ input เดิม)
export function rankDimensions(scores: RiasecScores): RiasecDimension[] {
  return [...RIASEC_DIMENSIONS].sort((a, b) => {
    const byScore = scores[b] - scores[a]; // คะแนนมากอยู่ก่อน
    if (byScore !== 0) return byScore;
    return CANONICAL_INDEX[a] - CANONICAL_INDEX[b]; // เสมอ → ตาม canonical
  });
}

// รวม top-3 ของอันดับเป็น Holland code เช่น ["R","I","A",...] → "RIA"
export function toHollandCode(ranking: RiasecDimension[]): string {
  return ranking.slice(0, HOLLAND_CODE_LENGTH).join("");
}
