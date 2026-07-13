"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";

// Error boundary ระดับราก (client) — Next.js ส่ง error + reset ให้
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // log ไว้ช่วย debug (ไม่โชว์รายละเอียด error ให้ผู้ใช้)
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{strings.errorPage.title}</h1>
          <p className="text-muted-foreground">{strings.errorPage.desc}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="h-11">
            {strings.errorPage.retry}
          </Button>
          <Button asChild variant="outline" className="h-11">
            <Link href="/">{strings.errorPage.home}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
