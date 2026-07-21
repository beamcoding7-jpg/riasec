import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HexagonMark } from "@/components/HexagonMark";
import { dimColors } from "@/components/results/dim-colors";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RIASEC_DIMENSIONS } from "@/lib/riasec";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const { home } = strings;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader width="5xl" />

      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero — หกเหลี่ยม RIASEC เป็น visual anchor (mobile: บนสุด, desktop: ขวา) */}
        <section className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
            <div className="animate-in fade-in slide-in-from-bottom-3 order-2 space-y-6 text-center duration-700 lg:order-1 lg:text-left">
              <div className="space-y-5">
                <span className="bg-accent text-accent-foreground inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                  {home.heroBadge}
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                  {home.heroTitleLead} <span className="text-primary">{home.heroTitleAccent}</span>
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance lg:mx-0">
                  {home.heroLead}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="lg" variant="brand" asChild className="h-12 px-6 text-base">
                  <Link href="/test">
                    {home.ctaStart}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-6 text-base">
                  <Link href="/about">{home.ctaAbout}</Link>
                </Button>
              </div>

              <p className="text-muted-foreground text-sm">{home.trustLine}</p>
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <HexagonMark
                showLetters
                animated
                title={home.hexAlt}
                className="w-52 sm:w-72 lg:w-full lg:max-w-md"
              />
            </div>
          </div>
        </section>

        {/* วิธีใช้งาน 3 ขั้น */}
        <section className="bg-muted/40 border-border/60 border-y">
          <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <div className="mb-10 space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{home.howTitle}</h2>
              <p className="text-muted-foreground">{home.howLead}</p>
            </div>
            <ol className="grid gap-5 sm:grid-cols-3">
              {home.steps.map((step, i) => (
                <li key={step.title}>
                  <Card className="h-full">
                    <CardContent className="space-y-3">
                      <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full font-bold">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6 มิติ RIASEC */}
        <section className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="mb-10 space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{home.dimsTitle}</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">{home.dimsLead}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RIASEC_DIMENSIONS.map((dim) => {
              const d = strings.riasec.dimensions[dim];
              return (
                <Card key={dim} className="h-full">
                  <CardContent className="flex gap-3">
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-black",
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

        {/* CTA ปิดท้าย — บล็อก gradient แบรนด์ + หกเหลี่ยมจางเป็นพื้นหลัง */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <Card className="bg-brand-gradient relative overflow-hidden border-transparent text-white ring-transparent">
            <HexagonMark className="pointer-events-none absolute -top-10 -right-10 w-56 opacity-20 sm:w-72" />
            <CardContent className="relative flex flex-col items-center gap-5 py-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                {home.footerCta}
              </h2>
              <Button size="lg" variant="secondary" asChild className="h-12 px-6 text-base">
                <Link href="/test">
                  {home.ctaStart}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <SiteFooter width="5xl" />
    </div>
  );
}
