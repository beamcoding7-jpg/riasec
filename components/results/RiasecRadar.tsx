import { RIASEC_DIMENSIONS } from "@/lib/riasec";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { RiasecDimension } from "@/types";

import { dimColors } from "./dim-colors";

// Radar/hexagon chart แบบ SVG เขียนเอง (CLAUDE.md §3) — RSC ล้วน ไม่มี client JS
// a11y: role=img + aria-label สรุปตัวเลข (คู่กับแถบคะแนนใต้กราฟในหน้าผล)

const SIZE = 220; // viewBox
const CENTER = SIZE / 2;
const MAX_R = 82; // รัศมีวงนอกสุด (เผื่อระยะให้ label)
const LABEL_R = MAX_R + 15;
const RINGS = [25, 50, 75, 100]; // วงระดับคะแนน

// จุดบนแกนที่ i (R บนสุด, ไล่ตามเข็มนาฬิกา R-I-A-S-E-C) ที่รัศมี radius
function pointAt(index: number, radius: number): { x: number; y: number } {
  const angle = ((-90 + index * 60) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
}

function polygonPoints(radius: number): string {
  return RIASEC_DIMENSIONS.map((_, i) => {
    const p = pointAt(i, radius);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

type Props = { scores: Partial<Record<RiasecDimension, number>> };

export function RiasecRadar({ scores }: Props) {
  const dims = RIASEC_DIMENSIONS.map((dim, i) => {
    const value = clamp(scores[dim] ?? 0);
    const meta = strings.riasec.dimensions[dim];
    const dataPt = pointAt(i, (value / 100) * MAX_R);
    const labelPt = pointAt(i, LABEL_R);
    return { dim, value, meta, dataPt, labelPt, i };
  });

  const dataPolygon = dims
    .map(({ dataPt }) => `${dataPt.x.toFixed(1)},${dataPt.y.toFixed(1)}`)
    .join(" ");

  const ariaLabel = `${strings.results.radarTitle}: ${dims
    .map(({ meta, value }) => `${meta.name} ${value}`)
    .join(", ")}`;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-auto w-full max-w-[280px]"
      role="img"
      aria-label={ariaLabel}
    >
      {/* วงระดับคะแนน (rings) */}
      {RINGS.map((level) => (
        <polygon
          key={level}
          points={polygonPoints((level / 100) * MAX_R)}
          className="stroke-border/70 fill-none"
          strokeWidth={1}
        />
      ))}

      {/* เส้นแกนจากจุดศูนย์กลางไปแต่ละมุม */}
      {dims.map(({ dim }, i) => {
        const end = pointAt(i, MAX_R);
        return (
          <line
            key={dim}
            x1={CENTER}
            y1={CENTER}
            x2={end.x}
            y2={end.y}
            className="stroke-border/70"
            strokeWidth={1}
          />
        );
      })}

      {/* รูปหลายเหลี่ยมของคะแนนจริง */}
      <polygon
        points={dataPolygon}
        className="fill-primary/20 stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* จุดยอดแต่ละด้าน (สีประจำด้าน) */}
      {dims.map(({ dim, dataPt }) => (
        <circle key={dim} cx={dataPt.x} cy={dataPt.y} r={3} className={dimColors[dim].fill} />
      ))}

      {/* ตัวอักษรกำกับด้าน (สีประจำด้าน) */}
      {dims.map(({ dim, meta, labelPt }) => {
        const anchor = labelPt.x > CENTER + 4 ? "start" : labelPt.x < CENTER - 4 ? "end" : "middle";
        return (
          <text
            key={dim}
            x={labelPt.x}
            y={labelPt.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className={cn("text-[13px] font-bold", dimColors[dim].fill)}
          >
            {meta.letter}
          </text>
        );
      })}
    </svg>
  );
}
