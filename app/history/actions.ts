"use server";

import { revalidatePath } from "next/cache";

import { sessionIdSchema } from "@/lib/auth/schema";
import { createClient } from "@/lib/supabase/server";

// ลบผลรายรายการ (right to erasure ระดับข้อมูล — §7.8)
// RLS policy "own sessions - delete" คุมให้ลบได้เฉพาะของตัวเอง; validate id ก่อน (ไม่เชื่อ client §7.4)
export async function deleteSession(sessionId: string) {
  const parsed = sessionIdSchema.safeParse(sessionId);
  if (!parsed.success) return;

  const supabase = await createClient();
  // ถ้า id ไม่ใช่ของเจ้าของ RLS จะลบ 0 แถวเอง (ไม่ error) — ปลอดภัยโดยดีไซน์
  const { error } = await supabase.from("test_sessions").delete().eq("id", parsed.data);
  if (error) throw new Error("ลบผลไม่สำเร็จ");

  revalidatePath("/history");
}
