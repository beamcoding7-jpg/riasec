import type { Metadata } from "next";
import Link from "next/link";

import { HexagonMark } from "@/components/HexagonMark";
import { DimensionSummary } from "@/components/results/DimensionSummary";
import { dimColors } from "@/components/results/dim-colors";
import { RecommendationSection } from "@/components/results/RecommendationSection";
import { RiasecRadar } from "@/components/results/RiasecRadar";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RIASEC_DIMENSIONS, rankDimensions } from "@/lib/riasec";
import { getCareerRecs, getMajorRecs, getTrackRecs } from "@/lib/results/recommendations";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { RiasecDimension } from "@/types";

// ผลเป็นข้อมูลส่วนบุคคล — กัน search engine index (§7.8)
export const metadata: Metadata = {
  title: strings.results.title,
  robots: { index: false, follow: false },
};

// จำนวนคำแนะนำต่อหมวด
const LIMITS = { tracks: 6, careers: 10, majors: 10 } as const;

function isDimension(c: string): c is RiasecDimension {
  return (RIASEC_DIMENSIONS as readonly string[]).includes(c);
}

type Props = { params: Promise<{ sessionId: string }> };

export default async function ResultsPage({ params }: Props) {
  const { sessionId } = await params;
  const supabase = await createClient();

  // อ่านเฉพาะของเจ้าของ — RLS (auth.uid() = user_id) กันเห็นผลคนอื่น
  const { data: session, error } = await supabase
    .from("test_sessions")
    .select("holland_code, scores, grade_level")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !session) {
    return (
      <ResultsShell center>
        <div className="space-y-6 text-center">
          <div className="space-y-3">
            <HexagonMark className="mx-auto w-20 opacity-60" />
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

  // สถานะล็อกอิน — โชว์ CTA ชวนเก็บผลเฉพาะตอนยังเป็น anonymous
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAnonymous = !!user?.is_anonymous;

  const scores = (session.scores ?? {}) as Partial<Record<RiasecDimension, number>>;

  // top-3 ของผู้ใช้ = holland_code (authoritative จากตอน submit); fallback = จัดอันดับจาก scores
  let topDims = (session.holland_code ?? "").split("").filter(isDimension);
  if (topDims.length < 3) {
    const full = Object.fromEntries(RIASEC_DIMENSIONS.map((d) => [d, scores[d] ?? 0])) as Record<
      RiasecDimension,
      number
    >;
    topDims = rankDimensions(full).slice(0, 3);
  }

  const grade = session.grade_level === "m3" ? "m3" : "m4_6";

  // ดึงคำแนะนำตามช่วงชั้น (CLAUDE.md §2)
  // m3 → สาย + อาชีพภาพกว้าง ; m4_6 → อาชีพ + คณะ/สาขา
  const [tracks, careers, majors] =
    grade === "m3"
      ? await Promise.all([
          getTrackRecs(supabase, topDims, LIMITS.tracks),
          getCareerRecs(supabase, topDims, LIMITS.careers),
          Promise.resolve([]),
        ])
      : await Promise.all([
          Promise.resolve([]),
          getCareerRecs(supabase, topDims, LIMITS.careers),
          getMajorRecs(supabase, topDims, LIMITS.majors),
        ]);

  return (
    <ResultsShell>
      <div className="space-y-10">
        {/* หัวเรื่อง + Holland code — โมเมนต์เผยผล: หกเหลี่ยมเน้น 3 ด้านเด่น */}
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 text-center duration-500">
          <span className="bg-secondary text-secondary-foreground inline-block rounded-full px-3 py-1 text-xs font-medium">
            {strings.results.gradeBadge[grade]}
          </span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{strings.results.title}</h1>
          <HexagonMark
            showLetters
            animated
            highlight={topDims}
            title={`${strings.results.hollandLabel}: ${topDims.join("")}`}
            className="mx-auto w-44 sm:w-52"
          />
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">{strings.results.hollandLabel}</p>
            <div className="flex items-center justify-center gap-2">
              {topDims.map((dim, i) => (
                <span
                  key={`${dim}-${i}`}
                  className={cn(
                    "shadow-soft flex size-12 items-center justify-center rounded-xl text-2xl font-bold text-black",
                    dimColors[dim].bg,
                  )}
                >
                  {dim}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Radar + แถบคะแนน 6 ด้าน */}
        <Card>
          <CardContent className="space-y-6">
            <RiasecRadar scores={scores} />
            <div className="space-y-3">
              <h2 className="text-sm font-medium">{strings.results.scoresTitle}</h2>
              {RIASEC_DIMENSIONS.map((dim) => {
                const value = scores[dim] ?? 0;
                return (
                  <div key={dim} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-black",
                        dimColors[dim].bg,
                      )}
                    >
                      {dim}
                    </span>
                    <div className="bg-muted h-2.5 flex-1 overflow-hidden rounded-full">
                      <div
                        className={cn("h-full rounded-full", dimColors[dim].bg)}
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
          </CardContent>
        </Card>

        {/* บุคลิกของคุณ (top-3) */}
        <DimensionSummary topDims={topDims} />

        {/* คำแนะนำตามช่วงชั้น */}
        {grade === "m3" ? (
          <>
            <RecommendationSection
              title={strings.results.sectionTracks}
              description={strings.results.sectionTracksDesc}
              items={tracks}
            />
            <RecommendationSection
              title={strings.results.sectionCareersBroad}
              description={strings.results.sectionCareersBroadDesc}
              items={careers}
            />
          </>
        ) : (
          <>
            <RecommendationSection
              title={strings.results.sectionCareers}
              description={strings.results.sectionCareersDesc}
              items={careers}
            />
            <RecommendationSection
              title={strings.results.sectionMajors}
              description={strings.results.sectionMajorsDesc}
              items={majors}
            />
          </>
        )}

        {/* CTA ชวนล็อกอินเก็บผล — เฉพาะตอนยังไม่ล็อกอิน (§7.8 ไม่บังคับ) */}
        {isAnonymous && (
          <Card className="bg-accent/40 ring-accent/60">
            <CardContent className="space-y-3 text-center">
              <div className="space-y-1">
                <h2 className="font-semibold">{strings.results.saveCtaTitle}</h2>
                <p className="text-muted-foreground text-sm">{strings.results.saveCtaDesc}</p>
              </div>
              <Button asChild className="h-11">
                <Link href="/account">{strings.results.saveCtaButton}</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <p className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-center text-sm">
          {strings.results.note}
        </p>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline" className="h-11">
              <Link href="/test">{strings.results.retake}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11">
              <Link href="/">{strings.common.home}</Link>
            </Button>
          </div>
          <div className="text-center">
            <Button asChild variant="link" size="sm" className="h-11">
              <Link href="/history">{strings.results.historyLink}</Link>
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-center text-xs">{strings.riasec.source}</p>
      </div>
    </ResultsShell>
  );
}

// เปลือกหน้า (header + container) ใช้ร่วมทั้งกรณีพบ/ไม่พบผล
function ResultsShell({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          "mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8",
          center && "justify-center",
        )}
      >
        {children}
      </main>
    </div>
  );
}
