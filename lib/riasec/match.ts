// จับคู่ผลผู้ใช้ (top-3 มิติ) กับ entity (สาย/อาชีพ/สาขา) ผ่านตาราง *_map — pure, deterministic
// สูตร: score(entity) = Σ (userWeight × map.weight) เฉพาะมิติที่อยู่ใน top-3 ของผู้ใช้ (CLAUDE.md §4)
import { RIASEC_DIMENSIONS } from "./constants";
import type { RiasecDimension } from "@/types";

// weight ตามอันดับความสนใจของผู้ใช้: อันดับ 1 = 3, อันดับ 2 = 2, อันดับ 3 = 1
// mirror สเกล weight ของ entity ใน *_map (มิติหลัก=3 รอง=2 สาม=1) ให้ทั้งสองฝั่งอยู่สเกลเดียวกัน
export const USER_TOP_WEIGHTS = [3, 2, 1] as const;

// canonical index ของมิติ (R=0 … C=5) — ใช้ tie-break ให้ deterministic
const CANONICAL_INDEX = Object.fromEntries(RIASEC_DIMENSIONS.map((d, i) => [d, i])) as Record<
  RiasecDimension,
  number
>;

// 1 แถวจากตาราง *_map (แบน) — entityId = track_id / career_id / major_id
export type MatchMapRow = {
  entityId: string;
  dimension: RiasecDimension;
  weight: number;
  reason: string;
};

// มิติ 1 รายการที่ entity ตรงกับ top-3 ของผู้ใช้
export type DimensionMatch = {
  dimension: RiasecDimension;
  contribution: number; // userWeight × map.weight
  reason: string;
};

// ผล matching ของ 1 entity
export type MatchedEntity = {
  entityId: string;
  score: number; // Σ contribution ของทุกมิติที่ตรง
  matches: DimensionMatch[]; // เรียง contribution มาก→น้อย (matches[0] = มิติที่ตรงที่สุด → ใช้ badge/reason)
};

// map มิติ → userWeight จาก top-3 (index 0..2); มิตินอก top-3 = undefined (ไม่นับคะแนน)
function userWeightByDimension(
  topDims: RiasecDimension[],
): Partial<Record<RiasecDimension, number>> {
  const weights: Partial<Record<RiasecDimension, number>> = {};
  topDims.slice(0, USER_TOP_WEIGHTS.length).forEach((dim, i) => {
    // กันมิติซ้ำใน topDims (ไม่ควรเกิดกับ holland_code จริง) — เก็บ weight ของอันดับแรกสุด
    if (weights[dim] == null) weights[dim] = USER_TOP_WEIGHTS[i];
  });
  return weights;
}

// จับคู่ + จัดอันดับ entity ตามความเหมาะกับ top-3 ของผู้ใช้
// tie-break entity (deterministic): score ↓ → contribution เดี่ยวสูงสุด ↓ → entityId ↑
export function matchEntities(
  topDims: RiasecDimension[],
  rows: MatchMapRow[],
  limit?: number,
): MatchedEntity[] {
  const userWeight = userWeightByDimension(topDims);

  // รวมทีละ entity — entity ที่ไม่มีมิติตรงเลยก็ยังอยู่ในผล (score 0) เผื่อกรณี "แสดงทั้งหมด" (m3 สาย 6)
  const byEntity = new Map<string, MatchedEntity>();
  for (const row of rows) {
    let entity = byEntity.get(row.entityId);
    if (!entity) {
      entity = { entityId: row.entityId, score: 0, matches: [] };
      byEntity.set(row.entityId, entity);
    }
    const w = userWeight[row.dimension];
    if (w == null) continue; // มิตินอก top-3 — ไม่นับ
    const contribution = w * row.weight;
    entity.score += contribution;
    entity.matches.push({ dimension: row.dimension, contribution, reason: row.reason });
  }

  const result = [...byEntity.values()];

  // เรียงมิติภายในแต่ละ entity: contribution มาก→น้อย, เสมอ → canonical order
  for (const entity of result) {
    entity.matches.sort((a, b) => {
      if (b.contribution !== a.contribution) return b.contribution - a.contribution;
      return CANONICAL_INDEX[a.dimension] - CANONICAL_INDEX[b.dimension];
    });
  }

  // เรียง entity ตามความเหมาะ
  result.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aTop = a.matches[0]?.contribution ?? 0;
    const bTop = b.matches[0]?.contribution ?? 0;
    if (bTop !== aTop) return bTop - aTop;
    return a.entityId < b.entityId ? -1 : a.entityId > b.entityId ? 1 : 0;
  });

  return limit != null ? result.slice(0, limit) : result;
}
