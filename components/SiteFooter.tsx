import Link from "next/link";

import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";

// Footer ร่วมทุกหน้า (server) — brand + ลิงก์นำทาง + เครดิตแหล่งอ้างอิง (§7.7)
// width ให้ตรงกับ container ของแต่ละหน้า (หน้าเนื้อหาแคบ = xl, หน้ากว้าง = 5xl)
export function SiteFooter({ width = "xl" }: { width?: "xl" | "5xl" }) {
  return (
    <footer className="border-border/60 mt-16 border-t">
      <div
        className={cn(
          "text-muted-foreground mx-auto w-full px-4 py-8 text-sm sm:px-6",
          width === "5xl" ? "max-w-5xl" : "max-w-xl",
        )}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-1.5">
            <p className="text-foreground font-bold">{strings.common.appName}</p>
            <p className="text-xs leading-relaxed">{strings.footer.tagline}</p>
          </div>

          <nav className="flex flex-col gap-2" aria-label="ลิงก์ส่วนท้าย">
            <Link href="/test" className="hover:text-foreground transition-colors">
              {strings.footer.startTest}
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              {strings.footer.about}
            </Link>
            <Link href="/universities" className="hover:text-foreground transition-colors">
              {strings.footer.universities}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {strings.footer.privacy}
            </Link>
          </nav>
        </div>

        <div className="border-border/60 mt-6 space-y-1 border-t pt-6 text-xs">
          <p>{strings.footer.sourceCredit}</p>
          <p>
            {strings.footer.freeLine} · {strings.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
