import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";
import { strings } from "@/lib/strings";

const { privacy } = strings;

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.intro,
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{privacy.title}</h1>
            <p className="text-muted-foreground text-sm">{privacy.updated}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{privacy.intro}</p>

          <div className="space-y-4">
            {privacy.sections.map((section) => (
              <Card key={section.title} size="sm">
                <CardContent className="space-y-2">
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{section.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">{privacy.contactTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{privacy.contactBody}</p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
