import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { RiasecDimension } from "@/types";

import { dimColors } from "./dim-colors";

// สรุป "บุคลิกของคุณ" จาก top-3 ด้านเด่น — ชื่อไทย + คำอธิบายสั้น (RSC)
type Props = { topDims: RiasecDimension[] };

export function DimensionSummary({ topDims }: Props) {
  const top = topDims.slice(0, 3);
  const names = top.map((dim) => strings.riasec.dimensions[dim].name);

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">{strings.results.summaryTitle}</h2>
        <p className="text-muted-foreground text-sm">
          {strings.results.summaryLead}{" "}
          <span className="text-foreground font-semibold">{names.join(" · ")}</span>
        </p>
      </div>

      <ul className="space-y-3">
        {top.map((dim) => {
          const meta = strings.riasec.dimensions[dim];
          return (
            <li key={dim} className="flex gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-black",
                  dimColors[dim].bg,
                )}
              >
                {meta.letter}
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="font-semibold">
                  {meta.name}{" "}
                  <span className="text-muted-foreground text-xs font-normal">{meta.en}</span>
                </p>
                <p className="text-muted-foreground text-sm">{meta.blurb}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
