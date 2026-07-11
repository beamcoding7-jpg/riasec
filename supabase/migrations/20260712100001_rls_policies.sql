-- Phase 2 · RLS policies (CLAUDE.md §4 หลักการ 5, §7.2)
-- Content สาธารณะ: อ่านได้ทุกคน เขียนไม่ได้ (ผ่าน service_role/migration เท่านั้น)
-- test_sessions: เจ้าของเท่านั้น (auth.uid() = user_id) — anonymous ก็เป็น role authenticated

-- เปิด RLS ทุกตาราง
alter table riasec_questions   enable row level security;
alter table test_sessions      enable row level security;
alter table study_tracks       enable row level security;
alter table careers            enable row level security;
alter table universities       enable row level security;
alter table faculties          enable row level security;
alter table majors             enable row level security;
alter table riasec_track_map   enable row level security;
alter table riasec_career_map  enable row level security;
alter table riasec_major_map   enable row level security;

-- ── Content สาธารณะ: select ได้ทั้ง anon + authenticated ──
create policy "public read" on riasec_questions  for select to anon, authenticated using (true);
create policy "public read" on study_tracks      for select to anon, authenticated using (true);
create policy "public read" on careers           for select to anon, authenticated using (true);
create policy "public read" on universities      for select to anon, authenticated using (true);
create policy "public read" on faculties         for select to anon, authenticated using (true);
create policy "public read" on majors            for select to anon, authenticated using (true);
create policy "public read" on riasec_track_map  for select to anon, authenticated using (true);
create policy "public read" on riasec_career_map for select to anon, authenticated using (true);
create policy "public read" on riasec_major_map  for select to anon, authenticated using (true);

-- ── test_sessions: CRUD เฉพาะเจ้าของ ((select auth.uid()) = initplan optimization) ──
create policy "own sessions - select" on test_sessions
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "own sessions - insert" on test_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "own sessions - update" on test_sessions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- DELETE รองรับ right to erasure (CLAUDE.md §7.8)
create policy "own sessions - delete" on test_sessions
  for delete to authenticated using ((select auth.uid()) = user_id);
