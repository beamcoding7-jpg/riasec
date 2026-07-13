-- Supabase grant EXECUTE ให้ anon/authenticated เป็น default บน public function
-- ฟังก์ชันนี้เป็น admin-only (เรียกโดย cron เท่านั้น) → revoke ออกให้หมด กัน exposure ผ่าน /rest/v1/rpc
revoke all on function public.delete_old_anonymous_users() from anon, authenticated;
