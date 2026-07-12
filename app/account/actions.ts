"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// ออกจากระบบ — เคลียร์ session cookie แล้วกลับหน้าแรก (ใช้เป็น <form action={signOut}>)
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ลบบัญชีถาวร (right to erasure — CLAUDE.md §7.8)
// client ลบ auth.users ของตัวเองไม่ได้ → ต้องใช้ service_role admin ฝั่ง server
export async function deleteAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // uid มาจาก session ฝั่ง server เท่านั้น — ไม่รับ id จาก client (กันลบบัญชีคนอื่น §7.4)
  if (!user) redirect("/account");

  const admin = createAdminClient();
  // ลบ auth.users → test_sessions ของผู้ใช้ cascade ตามไป (FK on delete cascade)
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw new Error("ลบบัญชีไม่สำเร็จ");

  // สำคัญ: การลบ user ไม่ทำให้ token เดิมใช้ไม่ได้ทันที → ต้อง signOut เคลียร์ cookie ด้วย (skill supabase)
  await supabase.auth.signOut();
  redirect("/");
}
