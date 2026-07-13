// ข้อมูลระดับเว็บ (URL/ชื่อ/คำอธิบาย) ใช้ร่วม metadata/sitemap/robots/OG image
// ลำดับ base URL: env ที่ตั้งเอง → VERCEL_URL (auto บน Vercel) → localhost (dev)
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const siteName = "RIASEC";

export const siteDescription =
  "แบบทดสอบค้นหาตัวเองตามทฤษฎี Holland RIASEC สำหรับนักเรียน ม.3–ม.6 พร้อมแนะนำสายการเรียน อาชีพ และมหาวิทยาลัยที่เหมาะกับคุณ — ฟรีทั้งหมด";
