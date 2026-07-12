// Zod schema ของคำตอบ — shared client/server (§6); Phase 4 ใช้ validate input ก่อนเรียก engine
import { z } from "zod";

import { LIKERT_MAX, LIKERT_MIN } from "./constants";

// คะแนน Likert 1 ข้อ: จำนวนเต็ม 1–5
export const likertValueSchema = z.number().int().min(LIKERT_MIN).max(LIKERT_MAX);

// answers ทั้งชุด: key = uuid ของคำถาม, value = คะแนน Likert
export const answerMapSchema = z.record(z.uuid(), likertValueSchema);
