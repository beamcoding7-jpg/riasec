import { dimColors } from "@/components/results/dim-colors";
import { RIASEC_DIMENSIONS } from "@/lib/riasec";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { RiasecDimension } from "@/types";

// ─────────────────────────────────────────────────────────────
// HexagonMark — "ตัวตน" (signature) ของแบรนด์: Holland Hexagon จริงตามทฤษฎี
// 6 มุม = R-I-A-S-E-C (ไล่ตามเข็มนาฬิกา R บนสุด) สีประจำด้านคงที่ทั้งเว็บ
// SVG ล้วน → ใช้ได้ใน Server Component; motion เป็น CSS class (เคารพ reduced-motion)
// ใช้ซ้ำ: โลโก้ header/footer, visual anchor ของ hero, และ reveal หน้าผล
// ─────────────────────────────────────────────────────────────

const CENTER = 50;
const RADIUS = 37;

// จุดมุมที่ index (R บนสุด) ที่รัศมี radius
function vertexAt(index: number, radius = RADIUS): { x: number; y: number } {
  const angle = ((-90 + index * 60) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
}

type Props = {
  className?: string;
  // แสดงตัวอักษร R/I/A/S/E/C ในแต่ละมุม (ใช้กับขนาดใหญ่ เช่น hero/reveal)
  showLetters?: boolean;
  // เน้นเฉพาะบางมิติ (เช่น top-3) → มุมอื่นหรี่ลง; ใช้ในโมเมนต์เผยผล
  highlight?: RiasecDimension[] | null;
  // assemble-in ตอนโหลด (มุมป็อปเข้าทีละมุม)
  animated?: boolean;
  // ถ้าให้ title = โหมด a11y (role=img + <title>); ถ้าไม่ให้ = ลายประดับ (aria-hidden)
  title?: string;
};

export function HexagonMark({
  className,
  showLetters = false,
  highlight = null,
  animated = false,
  title,
}: Props) {
  const dotR = showLetters ? 10 : 7;
  const decorative = !title;

  const verts = RIASEC_DIMENSIONS.map((dim, i) => {
    const p = vertexAt(i);
    const dimmed = !!highlight && !highlight.includes(dim);
    // ลำดับป็อป: โหมด reveal ไล่ตามลำดับ top-3, ปกติไล่ตามมุม
    const order = highlight ? highlight.indexOf(dim) : i;
    const popped = animated && !dimmed;
    return { dim, i, ...p, dimmed, order, popped };
  });

  const outline = verts.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("overflow-visible", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={title}
    >
      {!decorative && <title>{title}</title>}

      {/* เส้นแกนจากศูนย์กลาง (เฉพาะขนาดใหญ่) — ย้ำเอกลักษณ์ radar/hexagon */}
      {showLetters &&
        verts.map((v) => (
          <line
            key={`spoke-${v.dim}`}
            x1={CENTER}
            y1={CENTER}
            x2={v.x}
            y2={v.y}
            className="stroke-primary/15"
            strokeWidth={1}
          />
        ))}

      {/* กรอบหกเหลี่ยม + พื้นทินต์บางๆ ให้มีมิติ */}
      <polygon points={outline} className="fill-primary/5 stroke-primary/25" strokeWidth={1.5} />

      {/* มุมทั้ง 6 (สีประจำด้าน) + ตัวอักษรกำกับ (ถ้าเปิด) */}
      {verts.map((v) => {
        const meta = strings.riasec.dimensions[v.dim];
        return (
          <g
            key={v.dim}
            className={cn("hex-vertex", v.popped && "hex-vertex--pop", v.dimmed && "opacity-30")}
            style={v.popped ? { animationDelay: `${v.order * 90}ms` } : undefined}
          >
            <circle cx={v.x} cy={v.y} r={dotR} className={dimColors[v.dim].fill} />
            {showLetters && (
              <text
                x={v.x}
                y={v.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-black font-bold"
                style={{ fontSize: dotR }}
              >
                {meta.letter}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
