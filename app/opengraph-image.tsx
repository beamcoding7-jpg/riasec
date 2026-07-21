import { ImageResponse } from "next/og";

// OG image แบบ dynamic (next/og) — signature = หกเหลี่ยม Holland (R-I-A-S-E-C) เป็นพระเอก
// geometry เดียวกับ components/HexagonMark (CENTER 50, RADIUS 37, R บนสุด ไล่ตามเข็ม)
// จงใจใช้ข้อความ Latin + สี sRGB (satori ไม่มีฟอนต์ไทย/ไม่รู้จัก oklch var)
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

const CENTER = 50;
const RADIUS = 37;
const HEX_SIZE = 340; // px ของหกเหลี่ยมบน canvas
const DOT = 60; // กล่องตัวอักษรครอบวงกลม (r=10 viewBox ≈ 68px จริง)

// จุดมุมที่ index (R บนสุด) — คืนพิกัดในระบบ viewBox 0–100
const verts = letters.map((l, i) => {
  const angle = ((-90 + i * 60) * Math.PI) / 180;
  return {
    ...l,
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
});
const outline = verts.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(" ");

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
        gap: 28,
        background: "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {/* หกเหลี่ยม: กรอบ+ก้าน วาดด้วย <svg>, ตัวอักษรวางทับด้วย div (เรนเดอร์คมชัด) */}
      <div style={{ position: "relative", width: HEX_SIZE, height: HEX_SIZE, display: "flex" }}>
        <svg
          width={HEX_SIZE}
          height={HEX_SIZE}
          viewBox="0 0 100 100"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {verts.map((v, i) => (
            <line
              key={`spoke-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={v.x}
              y2={v.y}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={1}
            />
          ))}
          <polygon
            points={outline}
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={1.5}
          />
          {verts.map((v, i) => (
            <circle key={`dot-${i}`} cx={v.x} cy={v.y} r={10} fill={v.bg} />
          ))}
        </svg>
        {verts.map((v, i) => (
          <div
            key={`letter-${i}`}
            style={{
              position: "absolute",
              left: (v.x / 100) * HEX_SIZE - DOT / 2,
              top: (v.y / 100) * HEX_SIZE - DOT / 2,
              width: DOT,
              height: DOT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: "#000",
            }}
          >
            {v.c}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: 4 }}>RIASEC</div>

      <div style={{ display: "flex", fontSize: 36, opacity: 0.95 }}>
        Find Yourself · Find Your Future
      </div>

      <div style={{ display: "flex", fontSize: 24, opacity: 0.8 }}>
        Holland RIASEC · career-interest test · free
      </div>
    </div>,
    { ...size },
  );
}
