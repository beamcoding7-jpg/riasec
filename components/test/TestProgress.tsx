import { Progress } from "@/components/ui/progress";
import { strings } from "@/lib/strings";

type Props = { current: number; total: number };

// แถบความคืบหน้า + ตัวเลข "ข้อ X / N" (mobile-first, ให้ผู้ทำเห็นว่าเหลืออีกเท่าไหร่)
export function TestProgress({ current, total }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>{`${strings.test.progressPrefix} ${current} / ${total}`}</span>
        <span className="font-mono">{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
