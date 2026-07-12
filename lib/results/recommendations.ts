// Server helper: ดึง mapping+entity → จับคู่ด้วย matchEntities (pure) → คืน view-model การ์ด
// อ่านอย่างเดียวจากตาราง content (RLS = public read); ไม่ trust ข้อมูลจาก client
import { matchEntities, type MatchMapRow } from "@/lib/riasec";
import { strings } from "@/lib/strings";
import type { createClient } from "@/lib/supabase/server";
import type { RiasecDimension } from "@/types";

import type { Recommendation, RecommendationBody } from "@/components/results/RecommendationCard";

type Supabase = Awaited<ReturnType<typeof createClient>>;

// รวมขั้นตอนซ้ำ: แปลง map rows + entity lookup → Recommendation[] เรียงตามความเหมาะ
function buildRecommendations<E extends { id: string }>(
  topDims: RiasecDimension[],
  limit: number,
  mapRows: { dimension: RiasecDimension; weight: number; reason: string; entity: E | null }[],
  toCard: (entity: E, why: string | null, badgeDim: RiasecDimension | null) => Recommendation,
): Recommendation[] {
  const rows: MatchMapRow[] = [];
  const entities = new Map<string, E>();
  for (const r of mapRows) {
    if (!r.entity) continue;
    rows.push({
      entityId: r.entity.id,
      dimension: r.dimension,
      weight: r.weight,
      reason: r.reason,
    });
    if (!entities.has(r.entity.id)) entities.set(r.entity.id, r.entity);
  }

  return matchEntities(topDims, rows, limit).flatMap((matched) => {
    const entity = entities.get(matched.entityId);
    if (!entity) return [];
    const best = matched.matches[0];
    return [toCard(entity, best?.reason ?? null, best?.dimension ?? null)];
  });
}

// สายการเรียน ม.ปลาย (m3)
export async function getTrackRecs(
  supabase: Supabase,
  topDims: RiasecDimension[],
  limit: number,
): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from("riasec_track_map")
    .select("dimension, weight, reason, track:study_tracks(id, name, description, why_suitable)");
  if (error || !data) return [];

  return buildRecommendations(
    topDims,
    limit,
    data.map((r) => ({
      dimension: r.dimension,
      weight: r.weight,
      reason: r.reason,
      entity: r.track,
    })),
    (t, why, badgeDim) => ({
      id: t.id,
      title: t.name,
      badgeDim,
      subtitle: t.description,
      why,
      body: t.why_suitable
        ? [{ label: strings.results.trackHighlightLabel, text: t.why_suitable }]
        : [],
    }),
  );
}

// อาชีพ (ใช้ทั้ง m3 ภาพกว้าง + m4_6)
export async function getCareerRecs(
  supabase: Supabase,
  topDims: RiasecDimension[],
  limit: number,
): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from("riasec_career_map")
    .select("dimension, weight, reason, career:careers(id, name, short_desc, detail)");
  if (error || !data) return [];

  return buildRecommendations(
    topDims,
    limit,
    data.map((r) => ({
      dimension: r.dimension,
      weight: r.weight,
      reason: r.reason,
      entity: r.career,
    })),
    (c, why, badgeDim) => ({
      id: c.id,
      title: c.name,
      badgeDim,
      subtitle: c.short_desc,
      why,
      body: c.detail ? [{ label: strings.results.careerDetailLabel, text: c.detail }] : [],
    }),
  );
}

// คณะ/สาขา (m4_6) — พร้อมบริบทคณะ·มหาลัย
export async function getMajorRecs(
  supabase: Supabase,
  topDims: RiasecDimension[],
  limit: number,
): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from("riasec_major_map")
    .select(
      "dimension, weight, reason, major:majors(id, name, what_you_learn, career_paths, faculty:faculties(name, university:universities(name, province)))",
    );
  if (error || !data) return [];

  return buildRecommendations(
    topDims,
    limit,
    data.map((r) => ({
      dimension: r.dimension,
      weight: r.weight,
      reason: r.reason,
      entity: r.major,
    })),
    (m, why, badgeDim) => {
      const facultyName = m.faculty?.name ?? null;
      const uniName = m.faculty?.university?.name ?? null;
      const subtitle = [facultyName, uniName].filter(Boolean).join(" · ") || null;
      const body: RecommendationBody[] = [];
      if (m.what_you_learn)
        body.push({ label: strings.results.majorLearnLabel, text: m.what_you_learn });
      if (m.career_paths)
        body.push({ label: strings.results.majorPathsLabel, text: m.career_paths });
      return { id: m.id, title: m.name, badgeDim, subtitle, why, body };
    },
  );
}
