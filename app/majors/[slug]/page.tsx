import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import type { RiasecDimension } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("majors")
    .select("name, what_you_learn")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return { title: strings.majors.notFound };
  const description = data.what_you_learn ?? undefined;
  const ogTitle = `${data.name} · RIASEC`;
  return {
    title: data.name,
    description,
    openGraph: { title: ogTitle, description },
    twitter: { title: ogTitle, description },
  };
}

export default async function MajorDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: major } = await supabase
    .from("majors")
    .select(
      "id, name, what_you_learn, career_paths, source, faculty:faculties(name, university:universities(name, province, website))",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!major) {
    return (
      <DetailShell>
        <div className="space-y-6 py-10 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{strings.majors.notFound}</h1>
            <p className="text-muted-foreground">{strings.majors.notFoundDesc}</p>
          </div>
          <Button asChild className="h-11">
            <Link href="/test">{strings.majors.ctaTest}</Link>
          </Button>
        </div>
      </DetailShell>
    );
  }

  const uni = major.faculty?.university ?? null;
  const facultyLine = [major.faculty?.name, uni?.name].filter(Boolean).join(" · ");

  // มิติหลักของสาขา → อาชีพที่เกี่ยวข้อง
  const { data: topDim } = await supabase
    .from("riasec_major_map")
    .select("dimension")
    .eq("major_id", major.id)
    .order("weight", { ascending: false })
    .limit(1)
    .maybeSingle();

  const relatedCareers = topDim ? await getRelatedCareers(supabase, topDim.dimension) : [];

  return (
    <DetailShell>
      <div className="space-y-8">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2 h-11">
            <Link href="/history">← {strings.majors.backToResults}</Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{major.name}</h1>
          {facultyLine && (
            <p className="text-muted-foreground">
              {strings.majors.atUniversity} {facultyLine}
              {uni?.province ? ` · ${uni.province}` : ""}
            </p>
          )}
          {uni?.website && (
            <a
              href={uni.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link inline-flex min-h-11 items-center gap-1 text-sm hover:underline"
            >
              {strings.universities.visitSite}
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>

        {major.what_you_learn && (
          <Card>
            <CardContent className="space-y-2">
              <h2 className="text-sm font-semibold">{strings.majors.learnLabel}</h2>
              <p className="text-sm leading-relaxed">{major.what_you_learn}</p>
            </CardContent>
          </Card>
        )}

        {major.career_paths && (
          <Card>
            <CardContent className="space-y-2">
              <h2 className="text-sm font-semibold">{strings.majors.pathsLabel}</h2>
              <p className="text-sm leading-relaxed">{major.career_paths}</p>
            </CardContent>
          </Card>
        )}

        {relatedCareers.length > 0 && (
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{strings.majors.relatedCareers}</h2>
              <p className="text-muted-foreground text-sm">{strings.majors.relatedCareersDesc}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedCareers.map((c) => (
                <Link key={c.slug} href={`/careers/${c.slug}`}>
                  <Card
                    size="sm"
                    className="hover:ring-primary/40 h-full min-h-11 transition-[box-shadow]"
                  >
                    <CardContent>
                      <p className="leading-tight font-medium">{c.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {major.source && (
          <p className="text-muted-foreground text-xs">แหล่งอ้างอิง: {major.source}</p>
        )}
      </div>
    </DetailShell>
  );
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function getRelatedCareers(supabase: Supabase, dim: RiasecDimension) {
  const { data } = await supabase
    .from("riasec_career_map")
    .select("weight, career:careers(name, slug)")
    .eq("dimension", dim)
    .order("weight", { ascending: false })
    .limit(30);

  const seen = new Set<string>();
  const out: { name: string; slug: string }[] = [];
  for (const row of data ?? []) {
    const c = row.career;
    if (!c?.slug || seen.has(c.name)) continue;
    seen.add(c.name);
    out.push({ name: c.name, slug: c.slug });
    if (out.length >= 6) break;
  }
  return out;
}

function DetailShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
