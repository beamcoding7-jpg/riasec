// ข้อมูลระดับเว็บ (URL/ชื่อ/คำอธิบาย) ใช้ร่วม metadata/sitemap/robots/OG image
// ลำดับ base URL: env ที่ตั้งเอง (custom domain) → production alias คงที่ → per-deploy URL → localhost (dev)
// สำคัญ: ต้องเลือก VERCEL_PROJECT_PRODUCTION_URL (โดเมน production คงที่+สาธารณะ) ก่อน VERCEL_URL
// เพราะ VERCEL_URL คือ URL เฉพาะ deploy ที่ถูก Vercel SSO ปิดกั้น + เปลี่ยนทุกครั้ง
// → ถ้าใช้ VERCEL_URL, sitemap/OG/canonical จะชี้ URL ที่ Google crawl ไม่ได้
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const siteName = "RIASEC";

export const siteDescription =
  "แบบทดสอบค้นหาตัวเองตามทฤษฎี Holland RIASEC สำหรับนักเรียน ม.3–ม.6 พร้อมแนะนำสายการเรียน อาชีพ และมหาวิทยาลัยที่เหมาะกับคุณ — ฟรีทั้งหมด";
