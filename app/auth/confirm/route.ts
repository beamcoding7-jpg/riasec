import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

// Route ยืนยัน magic link — Supabase ส่งลิงก์ในอีเมลชี้มาที่นี่พร้อม token_hash + type
// ตั้งใจใช้ verifyOtp({ token_hash }) แทน exchangeCodeForSession (PKCE):
// token_hash ไม่ผูก code verifier ใน cookie ของ browser ที่กดขอ → เปิดลิงก์ข้ามเครื่อง/ข้ามแอปอีเมลได้
// (กลุ่มเป้าหมายคือวัยรุ่นมือถือที่มักเปิดอีเมลในแอป Gmail ซึ่งเป็นคนละ browser กับตอนขอ)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // ป้องกัน open redirect: รับเฉพาะ path ภายในเว็บ (ขึ้นต้น "/" ตัวเดียว ไม่ใช่ "//" ที่เป็น protocol-relative)
  const nextParam = searchParams.get("next") ?? "/history";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/history";

  if (tokenHash && type) {
    const supabase = await createClient();
    // สำเร็จ = session ใหม่ถูกเขียนลง cookie แล้ว (กรณี email_change: uid เดิมคงอยู่ → ผลเทสตามไปเอง)
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      redirect(next);
    }
  }

  // ลิงก์หมดอายุ/ถูกใช้ไปแล้ว/พารามิเตอร์ไม่ครบ → กลับหน้าบัญชีพร้อมแจ้ง error
  redirect("/account?error=link");
}
