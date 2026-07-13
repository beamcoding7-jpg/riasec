// Cloudflare Turnstile (CAPTCHA ฟรี) — เปิดใช้เมื่อมี site key เท่านั้น (§7.2)
// ถ้าไม่ตั้ง NEXT_PUBLIC_TURNSTILE_SITE_KEY → flag ปิด, flow ทำงานเหมือนเดิมทุกอย่าง
// การเปิดใช้จริงต้อง: ใส่ site key ที่นี่ + ใส่ secret + เปิด CAPTCHA ใน Supabase Auth dashboard
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const turnstileEnabled = Boolean(turnstileSiteKey);
