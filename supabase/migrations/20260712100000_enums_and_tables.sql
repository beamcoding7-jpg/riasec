-- Phase 2 · Data Layer — enums + ตารางหลัก + FK + index
-- Data model อ้างอิง CLAUDE.md §4 (ปรับ: riasec_*_map ใช้ `dimension` แทน `holland_code` — ดู comment ท้ายไฟล์)

-- มิติ RIASEC (R/I/A/S/E/C) ใช้ร่วมกันทั้งคำถามและ mapping
create type riasec_dimension as enum ('R', 'I', 'A', 'S', 'E', 'C');

-- ── คลังคำถามแบบทดสอบ (O*NET Interest Profiler แปลไทย — CLAUDE.md §7.7) ──
create table riasec_questions (
  id            uuid primary key default gen_random_uuid(),
  text          text not null,                       -- คำถามภาษาไทย (ปรับสำนวน ม.3-6)
  text_en       text,                                -- ต้นฉบับอังกฤษ O*NET (provenance/ตรวจสอบ)
  dimension     riasec_dimension not null,
  display_order int not null,                        -- ลำดับแสดงผล ('order' เป็น reserved word)
  active        boolean not null default true,
  source        text not null,
  created_at    timestamptz not null default now(),
  unique (display_order)
);

-- ── ผลการทำเทส — ผูกกับ auth.uid() เสมอ (anonymous ก็มี uid) ──
create table test_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  answers     jsonb not null,                        -- คำตอบดิบ { "questionId": 1..5 }
  scores      jsonb,                                 -- คะแนน 6 ด้านหลังคำนวณ
  holland_code text,                                 -- เช่น 'RIA' (top-3)
  grade_level text not null check (grade_level in ('m3', 'm4_6')),
  created_at  timestamptz not null default now()
);

-- ── สายการเรียน ม.ปลาย (หลักสูตรแกนกลาง สพฐ.) ──
create table study_tracks (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  why_suitable  text,
  source        text,
  display_order int
);

-- ── คลังอาชีพ (holland_code = code ของอาชีพเอง จาก O*NET) ──
create table careers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  holland_code text,                                 -- 3 ตัวของอาชีพ เช่น 'IRE'
  short_desc   text,
  detail       text,
  source       text,
  created_at   timestamptz not null default now()
);

-- ── มหาลัยไทย (15 หลัก = is_featured) ──
create table universities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  province    text,
  type        text,                                  -- รัฐ/ในกำกับ/เอกชน/ราชภัฏ/ราชมงคล
  is_featured boolean not null default false,
  website     text,
  created_at  timestamptz not null default now()
);

-- ── คณะ ──
create table faculties (
  id            uuid primary key default gen_random_uuid(),
  university_id uuid not null references universities (id) on delete cascade,
  name          text not null,
  slug          text,
  unique (university_id, name)
);

-- ── สาขา ──
create table majors (
  id            uuid primary key default gen_random_uuid(),
  faculty_id    uuid not null references faculties (id) on delete cascade,
  name          text not null,
  what_you_learn text,
  career_paths  text,
  source        text,
  unique (faculty_id, name)
);

-- ── Mapping: มิติเดียว → entity + weight + reason ──
create table riasec_track_map (
  id        uuid primary key default gen_random_uuid(),
  dimension riasec_dimension not null,
  track_id  uuid not null references study_tracks (id) on delete cascade,
  weight    int not null default 1,
  reason    text not null,
  unique (dimension, track_id)
);

create table riasec_career_map (
  id        uuid primary key default gen_random_uuid(),
  dimension riasec_dimension not null,
  career_id uuid not null references careers (id) on delete cascade,
  weight    int not null default 1,
  reason    text not null,
  unique (dimension, career_id)
);

create table riasec_major_map (
  id        uuid primary key default gen_random_uuid(),
  dimension riasec_dimension not null,
  major_id  uuid not null references majors (id) on delete cascade,
  weight    int not null default 1,
  reason    text not null,
  unique (dimension, major_id)
);

-- ── Indexes: FK ที่ยังไม่มี index (unique(dimension, entity_id) ครอบ dimension อยู่แล้ว) ──
create index idx_test_sessions_user_id on test_sessions (user_id);
create index idx_test_sessions_created_at on test_sessions (created_at desc);
create index idx_faculties_university_id on faculties (university_id);
create index idx_majors_faculty_id on majors (faculty_id);
create index idx_track_map_track_id on riasec_track_map (track_id);
create index idx_career_map_career_id on riasec_career_map (career_id);
create index idx_major_map_major_id on riasec_major_map (major_id);

-- ── Semantics ของ mapping (ปรับจาก CLAUDE.md §4) ──
comment on column riasec_track_map.dimension is 'มิติ RIASEC เดียว (R/I/A/S/E/C) ที่เหมาะกับสายนี้; matching รวม weight × position ของ top-3 ผู้ใช้ (ปรับจาก holland_code 3 ตัว เพื่อเลี่ยง 120-permutation)';
comment on column riasec_career_map.dimension is 'มิติ RIASEC เดียวที่เหมาะกับอาชีพนี้ (ดู riasec_track_map.dimension)';
comment on column riasec_major_map.dimension is 'มิติ RIASEC เดียวที่เหมาะกับสาขานี้ (ดู riasec_track_map.dimension)';
comment on column careers.holland_code is 'Holland code 3 ตัวของอาชีพเอง (จาก O*NET) — เป็น attribute แสดงผล ไม่ใช่ key ที่ใช้ match';
