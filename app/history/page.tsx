import type { Metadata } from "next";
import Link from "next/link";

import { HexagonMark } from "@/components/HexagonMark";
import { SiteHeader } from "@/components/SiteHeader";
import { DeleteSessionButton } from "@/components/auth/DeleteSessionButton";
import { dimColors } from "@/components/results/dim-colors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RIASEC_DIMENSIONS } from "@/lib/riasec";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { RiasecDimension } from "@/types";

export const metadata: Metadata = { title: strings.history.title };

function isDimension(c: string): c is RiasecDimension {
  return (RIASEC_DIMENSIONS as readonly string[]).includes(c);
}

// 1 แถวประวัติ — mini-hexagon (desktop) + badge Holland + ช่วงชั้น + วันที่ + ปุ่มลบ
// ส่วนข้อมูลเป็นลิงก์เดียวไปหน้าผล (tap target ใหญ่); ปุ่มลบแยกออกนอกลิงก์ (กัน nested interactive)
function HistoryRow({
  row,
  index,
}: {
  row: { id: string; created_at: string; holland_code: string | null; grade_level: string };
  index: number;
}) {
  const letters = (row.holland_code ?? "").split("").filter(isDimension);
  const grade = row.grade_level === "m3" ? "m3" : "m4_6";
  const date = new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(row.created_at));

  return (
    <li
      className="animate-in fade-in slide-in-from-bottom-1 duration-300"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <Card className="has-[a:hover]:shadow-lift transition-[box-shadow,transform] duration-200 has-[a:hover]:-translate-y-0.5">
        <CardContent className="flex items-center gap-3">
          <Link
            href={`/results/${row.id}`}
            className="group focus-visible:ring-ring/60 flex min-w-0 flex-1 items-center gap-3 rounded-lg outline-none focus-visible:ring-2"
          >
            {letters.length > 0 && (
              <HexagonMark highlight={letters} className="hidden w-10 shrink-0 sm:block" />
            )}
            <div className="flex gap-1">
              {letters.map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-sm font-bold text-black",
                    dimColors[d].bg,
                  )}
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="group-hover:text-primary text-sm font-medium">
                {strings.results.gradeBadge[grade]}
              </p>
              <p className="text-muted-foreground text-xs">{date}</p>
            </div>
          </Link>
          <DeleteSessionButton sessionId={row.id} />
        </CardContent>
      </Card>
    </li>
  );
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS "own sessions - select" คืนเฉพาะของเจ้าของ (anonymous หรือ permanent)
  const { data: sessions } = await supabase
    .from("test_sessions")
    .select("id, created_at, holland_code, grade_level")
    .order("created_at", { ascending: false });

  const rows = sessions ?? [];
  const isAnonymous = !!user?.is_anonymous;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{strings.history.title}</h1>
            <p className="text-muted-foreground text-sm">{strings.history.lead}</p>
          </div>

          {/* ชวนล็อกอินเมื่อยังเป็น anonymous และมีผลอยู่ (ผลจะหายถ้าล้างเบราว์เซอร์) */}
          {isAnonymous && rows.length > 0 && (
            <div className="bg-accent/60 ring-accent/70 shadow-soft flex flex-col gap-2 rounded-xl p-3 ring-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-accent-foreground text-sm">{strings.history.anonBannerText}</p>
              <Button asChild size="sm" className="h-11 shrink-0">
                <Link href="/account">{strings.history.anonBannerCta}</Link>
              </Button>
            </div>
          )}

          {rows.length === 0 ? (
            <div className="space-y-5 py-12 text-center">
              <HexagonMark className="mx-auto w-20 opacity-60" />
              <div className="space-y-1.5">
                <h2 className="text-lg font-semibold">{strings.history.emptyTitle}</h2>
                <p className="text-muted-foreground text-sm">{strings.history.emptyDesc}</p>
              </div>
              <Button asChild variant="brand" className="h-11">
                <Link href="/test">{strings.history.emptyCta}</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map((row, i) => (
                <HistoryRow key={row.id} row={row} index={i} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
