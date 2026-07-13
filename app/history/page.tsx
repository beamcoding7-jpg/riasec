import type { Metadata } from "next";
import Link from "next/link";

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

// 1 แถวประวัติ — badge Holland + ช่วงชั้น + วันที่ + ปุ่มดูผล/ลบ
function HistoryRow({
  row,
}: {
  row: { id: string; created_at: string; holland_code: string | null; grade_level: string };
}) {
  const letters = (row.holland_code ?? "").split("").filter(isDimension);
  const grade = row.grade_level === "m3" ? "m3" : "m4_6";
  const date = new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(row.created_at));

  return (
    <li>
      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="flex gap-1">
            {letters.map((d, i) => (
              <span
                key={`${d}-${i}`}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-sm font-bold text-white",
                  dimColors[d].bg,
                )}
              >
                {d}
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{strings.results.gradeBadge[grade]}</p>
            <p className="text-muted-foreground text-xs">{date}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/results/${row.id}`}>{strings.history.open}</Link>
          </Button>
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
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{strings.history.title}</h1>
            <p className="text-muted-foreground text-sm">{strings.history.lead}</p>
          </div>

          {/* ชวนล็อกอินเมื่อยังเป็น anonymous และมีผลอยู่ (ผลจะหายถ้าล้างเบราว์เซอร์) */}
          {isAnonymous && rows.length > 0 && (
            <div className="bg-accent/50 flex flex-col gap-2 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">{strings.history.anonBannerText}</p>
              <Button asChild size="sm" className="shrink-0">
                <Link href="/account">{strings.history.anonBannerCta}</Link>
              </Button>
            </div>
          )}

          {rows.length === 0 ? (
            <div className="space-y-4 py-12 text-center">
              <p className="text-muted-foreground">{strings.history.empty}</p>
              <Button asChild className="h-11">
                <Link href="/test">{strings.history.emptyCta}</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map((row) => (
                <HistoryRow key={row.id} row={row} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
