import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client ฝั่ง server (RSC / Server Actions / Route Handlers)
// สร้างใหม่ทุก request เพราะผูกกับ cookies ของ request นั้น
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // ถูกเรียกจาก Server Component (เขียน cookie ไม่ได้) — ปล่อยผ่าน
            // เพราะ middleware เป็นตัว refresh session cookie ให้อยู่แล้ว
          }
        },
      },
    },
  );
}
