import type { Metadata } from "next";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { TestFlow, type TestQuestion } from "@/components/test/TestFlow";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: "ทำแบบทดสอบ",
  description: "ตอบคำถามความสนใจ 60 ข้อ เพื่อค้นหา Holland code และแนวทางอนาคตที่เหมาะกับคุณ",
};

// ดึงคำถาม active เรียงตาม display_order ฝั่ง server (RSC) แล้วส่งให้ client wizard
export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("riasec_questions")
    .select("id, text")
    .eq("active", true)
    .order("display_order", { ascending: true });

  const questions: TestQuestion[] | null = data;

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {strings.common.appName}
        </Link>
        <ModeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-6">
        {error ? (
          <p className="text-muted-foreground text-center">{strings.test.loadError}</p>
        ) : !questions || questions.length === 0 ? (
          <p className="text-muted-foreground text-center">{strings.test.empty}</p>
        ) : (
          <TestFlow questions={questions} />
        )}
      </main>
    </div>
  );
}
