-- Phase 7 · เพิ่ม majors.slug สำหรับ detail route /majors/[slug]
-- slug = <ชื่อสาขา ascii>-<uni-slug> (unique เพราะต่อท้ายด้วยมหาลัย) — backfill ใน seed_faculties_majors.sql
-- unique index รับ null ได้หลายแถว (Postgres) → สร้างก่อน backfill ปลอดภัย
alter table majors add column if not exists slug text;
create unique index if not exists majors_slug_key on majors (slug);
