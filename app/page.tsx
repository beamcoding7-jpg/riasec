import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

// 6 ด้าน RIASEC — ใช้ตรวจว่าสีประจำด้าน + ฟอนต์ไทยแสดงผลถูก (หน้านี้ชั่วคราวสำหรับ Phase 1)
const riasecDimensions = [
  { key: "r", label: "R", th: "นักปฏิบัติ" },
  { key: "i", label: "I", th: "นักคิดวิเคราะห์" },
  { key: "a", label: "A", th: "นักสร้างสรรค์" },
  { key: "s", label: "S", th: "นักสังคม" },
  { key: "e", label: "E", th: "นักบริหาร" },
  { key: "c", label: "C", th: "นักจัดระบบ" },
] as const;

const dimensionColor: Record<string, string> = {
  r: "bg-riasec-r",
  i: "bg-riasec-i",
  a: "bg-riasec-a",
  s: "bg-riasec-s",
  e: "bg-riasec-e",
  c: "bg-riasec-c",
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">RIASEC</span>
        <ModeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <div className="space-y-5">
          <span className="bg-accent text-accent-foreground inline-block rounded-full px-4 py-1.5 text-sm font-medium">
            แบบทดสอบค้นหาตัวเองสำหรับ ม.3–ม.6
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            ค้นหาตัวเอง <span className="text-primary">ค้นหาอนาคต</span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance">
            ทำแบบทดสอบตามทฤษฎี Holland RIASEC แล้วรับคำแนะนำสายการเรียน อาชีพ
            และมหาวิทยาลัยที่เหมาะกับตัวคุณ — ฟรีทั้งหมด
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/test">เริ่มทำแบบทดสอบ</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">RIASEC คืออะไร</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {riasecDimensions.map((d) => (
            <div key={d.key} className="flex flex-col items-center gap-1.5">
              <span
                className={`flex size-12 items-center justify-center rounded-xl text-lg font-bold text-white ${dimensionColor[d.key]}`}
              >
                {d.label}
              </span>
              <span className="text-muted-foreground text-xs">{d.th}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-muted-foreground mx-auto w-full max-w-5xl px-6 py-6 text-center text-sm">
        กำลังพัฒนา · Phase 1 Foundation
      </footer>
    </div>
  );
}
