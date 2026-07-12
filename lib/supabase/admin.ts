import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

// Supabase client แบบ service_role — ใช้เฉพาะฝั่ง server สำหรับงาน admin เท่านั้น
// (ตอนนี้ใช้ลบบัญชีผู้ใช้ตัวเองผ่าน Server Action — client ลบ auth.users ของตัวเองไม่ได้)
// ⚠️ คีย์นี้ bypass RLS ทั้งหมด: `import "server-only"` กันไม่ให้หลุดเข้า client bundle,
//    และ SUPABASE_SERVICE_ROLE_KEY ต้องไม่มี NEXT_PUBLIC_ นำหน้า (CLAUDE.md §7.3/§7.4)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ยังไม่ได้ตั้งค่า (ต้องมีสำหรับงาน admin ฝั่ง server)",
    );
  }

  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    // ไม่ต้องเก็บ/รีเฟรช session เพราะเป็น client ชั่วคราวต่อ 1 request
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
