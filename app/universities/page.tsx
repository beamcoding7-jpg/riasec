import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";
import { UniversityDirectory } from "@/components/universities/UniversityDirectory";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: strings.universities.title,
  description: strings.universities.lead,
};

// directory มหาวิทยาลัย (RSC อ่าน content ผ่าน RLS public read) — filter/ค้นทำใน client island
export default async function UniversitiesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("universities")
    .select("name, slug, province, type, is_featured, website")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader width="5xl" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {strings.universities.title}
          </h1>
          <p className="text-muted-foreground text-sm">{strings.universities.lead}</p>
        </div>
        <UniversityDirectory universities={data ?? []} />
      </main>
    </div>
  );
}
