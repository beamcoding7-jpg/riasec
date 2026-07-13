import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";

// 404 — เรนเดอร์ใน layout หลัก (มี ThemeProvider) จึงใช้ SiteHeader ได้
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-16 text-center"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-primary text-5xl font-bold">404</p>
            <h1 className="text-2xl font-bold tracking-tight">{strings.notFound.title}</h1>
            <p className="text-muted-foreground">{strings.notFound.desc}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="h-11">
              <Link href="/">{strings.notFound.home}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11">
              <Link href="/test">{strings.notFound.test}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
