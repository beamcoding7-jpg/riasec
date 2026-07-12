// Zod schema ของ input auth — validate ที่ขอบทั้ง client และ server (CLAUDE.md §6/§7.4)
// อย่าเชื่อ client: email/otp/sessionId ต้องผ่าน schema ก่อนเรียก Supabase ทุกครั้ง
import { z } from "zod";

// อีเมลสำหรับล็อกอิน/ผูกบัญชี — trim + lowercase "ก่อน" ตรวจรูปแบบ (pipe) กันช่องว่าง/ตัวพิมพ์ไม่ตรงตอน verify
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

// OTP ตัวเลขล้วนที่ Supabase ส่งไปทางอีเมล — ความยาวปรับได้ 6–10 หลักตาม "Email OTP Length"
// ของโปรเจกต์ (ห้าม hardcode 6 — โปรเจกต์นี้ตั้งไว้ 8; ยืนยันจาก admin.generateLink)
export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6,10}$/);

// id ของ test_session (uuid) — validate ก่อนลบ (ไม่เชื่อ client)
export const sessionIdSchema = z.uuid();
