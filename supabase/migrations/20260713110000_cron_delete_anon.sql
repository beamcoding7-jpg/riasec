-- เปิด pg_cron สำหรับตั้งเวลางานเบื้องหลัง (ลบ anonymous user เก่า — §7.2)
create extension if not exists pg_cron;

-- ฟังก์ชันลบ anonymous user ที่ยังไม่ผูกบัญชีถาวรภายใน 30 วัน
-- test_sessions.user_id → auth.users(id) ON DELETE CASCADE จึงลบผลตามให้อัตโนมัติ
create or replace function public.delete_old_anonymous_users()
returns void
language sql
security definer
set search_path = ''
as $func$
  delete from auth.users
  where is_anonymous is true
    and created_at < now() - interval '30 days';
$func$;

-- กันไม่ให้ client เรียกผ่าน RPC (ฟังก์ชัน security definer)
revoke all on function public.delete_old_anonymous_users() from public;

comment on function public.delete_old_anonymous_users() is
  'ลบ anonymous user ที่ไม่ได้ผูกบัญชีถาวรภายใน 30 วัน (เรียกโดย pg_cron รายวัน) — Phase 8';

-- ตั้ง cron รายวัน 03:30 UTC (~10:30 น. ไทย) — upsert ตามชื่อ job
select cron.schedule(
  'delete-old-anonymous-users',
  '30 3 * * *',
  $cron$ select public.delete_old_anonymous_users(); $cron$
);
