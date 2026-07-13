import type { Metadata } from "next";
import Link from "next/link";

import { dimColors } from "@/components/results/dim-colors";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RIASEC_DIMENSIONS } from "@/lib/riasec";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { RiasecDimension } from "@/types";

type Props = { params: Promise<{ slug: string }> };

function isDimension(c: string): c is RiasecDimension {
  return (RIASEC_DIMENSIONS as readonly string[]).includes(c);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("careers")
    .select("name, short_desc")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return { title: strings.careers.notFound };
  return { title: data.name, description: data.short_desc ?? undefined };
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: career } = await supabase
    .from("careers")
    .select("name, holland_code, short_desc, detail, source")
    .eq("slug", slug)
    .maybeSingle();

  if (!career) {
    return (
      <DetailShell>
        <div className="space-y-6 py-10 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{strings.careers.notFound}</h1>
            <p className="text-muted-foreground">{strings.careers.notFoundDesc}</p>
          </div>
          <Button asChild className="h-11">
            <Link href="/test">{strings.careers.ctaTest}</Link>
          </Button>
        </div>
      </DetailShell>
    );
  }

  const codeDims = (career.holland_code ?? "").split("").filter(isDimension);
  const primaryDim = codeDims[0] ?? null;

  // สาขาที่เกี่ยวข้อง = สาขาที่ map กับมิติหลักของอาชีพนี้ (dedupe ตามชื่อ)
  const relatedMajors = primaryDim ? await getRelatedMajors(supabase, primaryDim) : [];

  return (
    <DetailShell>
      <div className="space-y-8">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2 h-8">
            <Link href="/history">← {strings.careers.backToResults}</Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{career.name}</h1>
          {career.short_desc && <p className="text-muted-foreground">{career.short_desc}</p>}
        </div>

        {/* Holland code ของอาชีพ */}
        {codeDims.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium">{strings.careers.hollandLabel}</h2>
            <div className="flex flex-wrap gap-2">
              {codeDims.map((dim, i) => {
                const d = strings.riasec.dimensions[dim];
                return (
                  <span
                    key={`${dim}-${i}`}
                    className="bg-card ring-foreground/10 inline-flex items-center gap-2 rounded-lg py-1.5 pr-3 pl-1.5 text-sm ring-1"
                  >
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md text-xs font-bold text-white",
                        dimColors[dim].bg,
                      )}
                    >
                      {dim}
                    </span>
                    {d.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* รายละเอียด */}
        {career.detail && (
          <Card>
            <CardContent className="space-y-2">
              <h2 className="text-sm font-semibold">{strings.careers.aboutLabel}</h2>
              <p className="text-sm leading-relaxed">{career.detail}</p>
            </CardContent>
          </Card>
        )}

        {/* สาขาที่เกี่ยวข้อง */}
        {relatedMajors.length > 0 && (
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{strings.careers.relatedMajors}</h2>
              <p className="text-muted-foreground text-sm">{strings.careers.relatedMajorsDesc}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedMajors.map((m) => (
                <Link key={m.slug} href={`/majors/${m.slug}`}>
                  <Card size="sm" className="hover:ring-primary/40 h-full transition-[box-shadow]">
                    <CardContent>
                      <p className="leading-tight font-medium">{m.name}</p>
                      {m.university && (
                        <p className="text-muted-foreground text-xs">{m.university}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {career.source && (
          <p className="text-muted-foreground text-xs">แหล่งอ้างอิง: {career.source}</p>
        )}
      </div>
    </DetailShell>
  );
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function getRelatedMajors(supabase: Supabase, dim: RiasecDimension) {
  const { data } = await supabase
    .from("riasec_major_map")
    .select("weight, major:majors(name, slug, faculty:faculties(university:universities(name)))")
    .eq("dimension", dim)
    .order("weight", { ascending: false })
    .limit(40);

  const seen = new Set<string>();
  const out: { name: string; slug: string; university: string | null }[] = [];
  for (const row of data ?? []) {
    const m = row.major;
    if (!m?.slug || seen.has(m.name)) continue;
    seen.add(m.name);
    out.push({ name: m.name, slug: m.slug, university: m.faculty?.university?.name ?? null });
    if (out.length >= 6) break;
  }
  return out;
}

function DetailShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
