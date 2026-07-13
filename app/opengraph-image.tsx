import { ImageResponse } from "next/og";

// OG image แบบ dynamic (next/og) — ใช้เป็นภาพแชร์ default ของทั้งเว็บ
// ออกแบบด้วย 6 ตัวอักษร RIASEC (สีประจำด้าน = identity ที่ไม่ผูกภาษา) + wordmark
// จงใจใช้ข้อความ Latin เพื่อเรนเดอร์ได้เสถียร (satori ไม่มีฟอนต์ไทย built-in)
export const alt = "RIASEC — ค้นหาตัวเอง ค้นหาอนาคต";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const letters: { c: string; bg: string }[] = [
  { c: "R", bg: "#e05252" },
  { c: "I", bg: "#4d7cc7" },
  { c: "A", bg: "#cc3d94" },
  { c: "S", bg: "#2fa866" },
  { c: "E", bg: "#dd9130" },
  { c: "C", bg: "#2f9aa2" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        background: "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 20 }}>
        {letters.map((l) => (
          <div
            key={l.c}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: l.bg,
              fontSize: 52,
              fontWeight: 800,
            }}
          >
            {l.c}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", fontSize: 128, fontWeight: 800, letterSpacing: 4 }}>
        RIASEC
      </div>

      <div style={{ display: "flex", fontSize: 40, opacity: 0.95 }}>
        Find Yourself · Find Your Future
      </div>

      <div style={{ display: "flex", fontSize: 26, opacity: 0.8 }}>
        Holland RIASEC · career-interest test · free
      </div>
    </div>,
    { ...size },
  );
}
