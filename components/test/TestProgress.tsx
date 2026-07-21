import { HexagonMark } from "@/components/HexagonMark";
import { Progress } from "@/components/ui/progress";
import { strings } from "@/lib/strings";

type Props = { current: number; total: number };

// เลือกข้อความให้กำลังใจตาม % ความคืบหน้า (ไม่เกี่ยวกับคะแนน — แค่ momentum)
function cheerFor(pct: number): string {
  const c = strings.test.cheer;
  if (pct >= 90) return c.almost;
  if (pct >= 75) return c.threeQuarter;
  if (pct >= 50) return c.half;
  if (pct >= 25) return c.quarter;
  return c.start;
}

// แถบความคืบหน้า + ตัวเลข "ข้อ X / N" + หกเหลี่ยม "ชาร์จ" ตามความคืบหน้า (mobile-first)
export function TestProgress({ current, total }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  // หกเหลี่ยมสว่างขึ้นตามความคืบหน้ารวม (uniform ทั้งดวง = พลังงานสะสม ไม่ผูกคะแนนรายมิติ)
  const charge = 0.4 + (pct / 100) * 0.6;
  return (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>{`${strings.test.progressPrefix} ${current} / ${total}`}</span>
        <span className="flex items-center gap-2 font-mono">
          {Math.round(pct)}%
          <span
            aria-hidden
            style={{ opacity: charge }}
            className="inline-flex transition-opacity duration-500"
          >
            <HexagonMark className="w-5" />
          </span>
        </span>
      </div>
      <Progress value={pct} className="h-2" />
      <p className="text-muted-foreground text-center text-xs">{cheerFor(pct)}</p>
    </div>
  );
}
