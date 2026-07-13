import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

// Client อ่านข้อมูลสาธารณะแบบไม่ผูก cookie/session — ใช้ใน sitemap (RLS อนุญาต public read เนื้อหา)
// แยกจาก lib/supabase/server.ts (cookie-based) เพื่อเลี่ยงทำให้ route กลายเป็น dynamic โดยไม่จำเป็น
export function createAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
