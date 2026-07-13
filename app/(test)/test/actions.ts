"use server";

import { redirect } from "next/navigation";

import { computeRiasecResult, type QuestionMeta } from "@/lib/riasec";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { submitTestSchema, type SubmitTestInput } from "@/lib/test/schema";
import type { Json } from "@/types/database";

type SubmitResult = { error: string };

// รับคำตอบ → (validate → ensure session → คำนวณฝั่ง server → บันทึก) → redirect ไปหน้าผล
// คืนค่า { error } เมื่อล้มเหลว; สำเร็จจะ redirect (throw) ไม่คืนค่า
export async function submitTest(input: SubmitTestInput): Promise<SubmitResult | undefined> {
  // 1) validate ที่ขอบ — อย่าเชื่อ client (§7.4)
  const parsed = submitTestSchema.safeParse(input);
  if (!parsed.success) return { error: strings.test.incomplete };
  const { answers, gradeLevel, captchaToken } = parsed.data;

  const supabase = await createClient();

  // 2) ต้องมี session ก่อน insert (RLS ต้อง role authenticated) —
  //    ยังไม่ล็อกอิน → สร้าง anonymous user ตอนนี้เท่านั้น (ลด anon ที่เริ่มแล้วไม่ทำจบ)
  const { data: userData } = await supabase.auth.getUser();
  let userId = userData.user?.id;
  if (!userId) {
    // ส่ง captchaToken ให้ Supabase ตรวจ (เมื่อเปิด CAPTCHA protection) — กัน bot สร้าง anon รัว
    const { data: anon, error: anonError } = await supabase.auth.signInAnonymously(
      captchaToken ? { options: { captchaToken } } : undefined,
    );
    if (anonError || !anon.user) return { error: strings.test.error };
    userId = anon.user.id;
  }

  // 3) โหลดคำถาม active เป็น source of truth แล้วคำนวณเอง (ไม่เชื่อ scores จาก client)
  const { data: questions, error: questionsError } = await supabase
    .from("riasec_questions")
    .select("id, dimension")
    .eq("active", true);
  if (questionsError || !questions || questions.length === 0) {
    return { error: strings.test.error };
  }

  const metas: QuestionMeta[] = questions.map((q) => ({ id: q.id, dimension: q.dimension }));

  // เช็คว่า answers ตอบครบทุกข้อ active และไม่มี key แปลกปลอม
  const validIds = new Set(metas.map((m) => m.id));
  const allKeysValid = Object.keys(answers).every((id) => validIds.has(id));
  const isComplete = metas.every((m) => answers[m.id] != null);
  if (!allKeysValid || !isComplete) return { error: strings.test.incomplete };

  // 4) คำนวณผล (pure, deterministic)
  const result = computeRiasecResult(metas, answers);

  // 5) บันทึกผล — user_id ผูก auth.uid() เสมอ
  const { data: inserted, error: insertError } = await supabase
    .from("test_sessions")
    .insert({
      user_id: userId,
      answers: answers as Json,
      scores: result.scores as Json,
      holland_code: result.hollandCode,
      grade_level: gradeLevel,
    })
    .select("id")
    .single();
  if (insertError || !inserted) return { error: strings.test.error };

  // 6) สำเร็จ → ไปหน้าผล (redirect โยน NEXT_REDIRECT — ต้องอยู่นอก try/catch)
  redirect(`/results/${inserted.id}`);
}
