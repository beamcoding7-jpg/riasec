import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { RiasecDimension } from "@/types";

import { dimColors } from "./dim-colors";

// เนื้อหา 1 ส่วนในการ์ด (เช่น "เรียนอะไรบ้าง", "ต่อยอดอาชีพ")
export type RecommendationBody = { label: string; text: string };

// view-model 1 การ์ดคำแนะนำ (สาย/อาชีพ/สาขา)
export type Recommendation = {
  id: string;
  title: string;
  badgeDim: RiasecDimension | null; // มิติที่แมตช์ที่สุด (null = ไม่มีมิติตรงใน top-3)
  subtitle: string | null;
  why: string | null; // เหตุผล "ทำไมถึงเหมาะกับคุณ" (จาก *_map.reason)
  body: RecommendationBody[];
  href?: string; // ลิงก์ไปหน้า detail (อาชีพ/สาขา) — สายเรียนไม่มี detail route (Phase 7)
};

// การ์ดขยายได้ด้วย native <details> — zero client JS (RSC-first §6)
export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const color = rec.badgeDim ? dimColors[rec.badgeDim] : null;
  const letter = rec.badgeDim ? strings.riasec.dimensions[rec.badgeDim].letter : null;

  return (
    <details
      className={cn(
        "bg-card group overflow-hidden rounded-xl border border-l-4",
        color ? color.border : "border-l-border",
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
        {letter && color && (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-black",
              color.bg,
            )}
          >
            {letter}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="leading-tight font-semibold">{rec.title}</p>
          {rec.subtitle && <p className="text-muted-foreground truncate text-sm">{rec.subtitle}</p>}
        </div>
        <ChevronDown className="text-muted-foreground size-5 shrink-0 transition-transform group-open:rotate-180" />
      </summary>

      <div className="space-y-3 px-4 pb-4">
        {rec.why && (
          <div className="bg-accent/50 rounded-lg p-3">
            <p className="text-accent-foreground text-xs font-semibold">
              {strings.results.whyLabel}
            </p>
            <p className="mt-1 text-sm">{rec.why}</p>
          </div>
        )}
        {rec.body.map((section) => (
          <div key={section.label}>
            <p className="text-muted-foreground text-xs font-semibold">{section.label}</p>
            <p className="mt-1 text-sm leading-relaxed">{section.text}</p>
          </div>
        ))}
        {rec.href && (
          <Link
            href={rec.href}
            className="text-link inline-flex min-h-11 items-center gap-1 text-sm font-medium hover:underline"
          >
            {strings.results.detailLink}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </details>
  );
}
