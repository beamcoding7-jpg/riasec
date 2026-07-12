import type { Metadata } from "next";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { RIASEC_DIMENSIONS } from "@/lib/riasec";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import type { RiasecDimension } from "@/types";

export const metadata: Metadata = {
  title: strings.results.title,
};

// สีประจำแต่ละด้าน RIASEC (ตรงกับ CSS variables ใน globals.css)
const dimColorClass: Record<RiasecDimension, string> = {
  R: "bg-riasec-r",
  I: "bg-riasec-i",
  A: "bg-riasec-a",
  S: "bg-riasec-s",
  E: "bg-riasec-e",
  C: "bg-riasec-c",
};

type Props = { params: Promise<{ sessionId: string }> };

export default async function ResultsPage({ params }: Props) {
  const { sessionId } = await params;
  const supabase = await createClient();

  // อ่านเฉพาะของเจ้าของ — RLS (auth.uid() = user_id) กันเห็นผลคนอื่น
  // maybeSingle: ไม่พบ/ไม่ใช่เจ้าของ → null (ไม่ error); sessionId ผิด format → error
  const { data: session, error } = await supabase
    .from("test_sessions")
    .select("holland_code, scores")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !session) {
    return (
      <ResultsShell>
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{strings.results.notFound}</h1>
            <p className="text-muted-foreground">{strings.results.notFoundDesc}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="h-11">
              <Link href="/test">{strings.results.retake}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11">
              <Link href="/">{strings.common.home}</Link>
            </Button>
          </div>
        </div>
      </ResultsShell>
    );
  }

  const scores = (session.scores ?? {}) as Partial<Record<RiasecDimension, number>>;
  const hollandLetters = (session.holland_code ?? "").split("") as RiasecDimension[];

  return (
    <ResultsShell>
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{strings.results.title}</h1>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">{strings.results.hollandLabel}</p>
            <div className="flex items-center justify-center gap-2">
              {hollandLetters.map((letter, i) => (
                <span
                  key={`${letter}-${i}`}
                  className={`flex size-12 items-center justify-center rounded-xl text-2xl font-bold text-white ${dimColorClass[letter]}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-medium">{strings.results.scoresTitle}</h2>
          <div className="space-y-3">
            {RIASEC_DIMENSIONS.map((dim) => {
              const value = scores[dim] ?? 0;
              return (
                <div key={dim} className="flex items-center gap-3">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${dimColorClass[dim]}`}
                  >
                    {dim}
                  </span>
                  <div className="bg-muted h-2.5 flex-1 overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full ${dimColorClass[dim]}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-9 text-right font-mono text-sm">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <p className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-center text-sm">
          {strings.results.note}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline" className="h-11">
            <Link href="/test">{strings.results.retake}</Link>
          </Button>
          <Button asChild variant="outline" className="h-11">
            <Link href="/">{strings.common.home}</Link>
          </Button>
        </div>
      </div>
    </ResultsShell>
  );
}

// เปลือกหน้า (header + container) ใช้ร่วมทั้งกรณีพบ/ไม่พบผล
function ResultsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {strings.common.appName}
        </Link>
        <ModeToggle />
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-6">
        {children}
      </main>
    </div>
  );
}
