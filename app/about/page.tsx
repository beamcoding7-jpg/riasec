import type { Metadata } from "next";
import Link from "next/link";

import { HexagonMark } from "@/components/HexagonMark";
import { dimColors } from "@/components/results/dim-colors";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RIASEC_DIMENSIONS } from "@/lib/riasec";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const { about } = strings;

export const metadata: Metadata = {
  title: about.title,
  description: about.metaDescription,
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-10 duration-500">
          <div className="space-y-4 text-center">
            <HexagonMark
              showLetters
              animated
              title={strings.home.hexAlt}
              className="mx-auto w-32 sm:w-40"
            />
            <h1 className="text-3xl font-bold tracking-tight">{about.title}</h1>
            <p className="text-muted-foreground mx-auto max-w-prose leading-relaxed text-balance">
              {about.lead}
            </p>
          </div>

          {/* 6 มิติ */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">{about.dimsTitle}</h2>
            <div className="space-y-3">
              {RIASEC_DIMENSIONS.map((dim) => {
                const d = strings.riasec.dimensions[dim];
                return (
                  <Card key={dim} size="sm">
                    <CardContent className="flex gap-3">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-lg text-base font-bold text-black",
                          dimColors[dim].bg,
                        )}
                      >
                        {d.letter}
                      </span>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          {d.name}{" "}
                          <span className="text-muted-foreground text-xs font-normal">{d.en}</span>
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{d.blurb}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* หกเหลี่ยม — โชว์ signature จริงประกอบคำอธิบาย */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">{about.hexagonTitle}</h2>
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
              <HexagonMark showLetters className="w-36 shrink-0" />
              <p className="text-muted-foreground leading-relaxed">{about.hexagonBody}</p>
            </div>
          </section>
          {/* วิธีทำงาน */}
          <Section title={about.howTitle} body={about.howBody} />
          {/* Holland code */}
          <Section title={about.codeTitle} body={about.codeBody} />

          {/* CTA */}
          <Card className="bg-accent/40 ring-accent/60">
            <CardContent className="space-y-3 text-center">
              <div className="space-y-1">
                <h2 className="font-semibold">{about.ctaTitle}</h2>
                <p className="text-muted-foreground text-sm">{about.ctaBody}</p>
              </div>
              <Button asChild className="h-11">
                <Link href="/test">{about.ctaButton}</Link>
              </Button>
            </CardContent>
          </Card>

          <p className="text-muted-foreground text-center text-xs">{strings.riasec.source}</p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{body}</p>
    </section>
  );
}
