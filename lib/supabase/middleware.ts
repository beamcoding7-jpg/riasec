import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresh Supabase session ทุก request แล้วส่ง cookie ที่อัปเดตกลับไป
// (จำเป็นเพราะ Server Components เขียน cookie เองไม่ได้)
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // สำคัญ: ห้ามแทรกโค้ดระหว่าง createServerClient กับ getUser()
  // getUser() จะ refresh token ที่หมดอายุ (ซึ่งไปเรียก setAll เขียน cookie ใหม่)
  await supabase.auth.getUser();

  return supabaseResponse;
}
