import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Health check: ยืนยันว่าแอปเชื่อมต่อ Supabase ได้จริง (ไม่เปิดเผยข้อมูลผู้ใช้)
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // "Auth session missing" คือสถานะปกติตอนยังไม่ล็อกอิน = ถือว่าเชื่อมต่อได้
  if (error && !/session|missing|Unauthorized|JWT/i.test(error.message)) {
    return NextResponse.json({ ok: false, reason: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, authenticated: Boolean(data.user) });
}
