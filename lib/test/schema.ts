import { z } from "zod";

import { answerMapSchema } from "@/lib/riasec/schema";

// ช่วงชั้นผู้ทำเทส — ต้องตรงกับ CHECK ใน DB (test_sessions.grade_level)
// m3 = ม.3 (เน้นแนะนำสายการเรียน), m4_6 = ม.4–6 (เน้นอาชีพ/มหาลัย)
export const gradeLevelSchema = z.enum(["m3", "m4_6"]);
export type GradeLevel = z.infer<typeof gradeLevelSchema>;

// payload ที่ client ส่งตอนกดส่งคำตอบ — validate ที่ขอบทั้ง client และ server (CLAUDE.md §6/§7.4)
// answers reuse จาก scoring engine (key = questionId uuid, value = Likert 1–5)
export const submitTestSchema = z.object({
  answers: answerMapSchema,
  gradeLevel: gradeLevelSchema,
  // token จาก Turnstile (ถ้าเปิดใช้) — ส่งต่อให้ signInAnonymously กัน bot สร้าง anon รัว (§7.2)
  captchaToken: z.string().optional(),
});
export type SubmitTestInput = z.infer<typeof submitTestSchema>;
