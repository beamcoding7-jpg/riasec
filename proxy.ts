import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 ใช้ proxy.ts แทน middleware.ts (convention ใหม่)
// รีเฟรช Supabase session ทุก request ก่อนเข้าถึงหน้า
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // จับทุก path ยกเว้น static assets และไฟล์รูป (ลดการรันที่ไม่จำเป็น)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
