import Link from "next/link";

import { HexagonMark } from "@/components/HexagonMark";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";

// Header ร่วม (server) — brand + ลิงก์ประวัติ/บัญชี ตามสถานะล็อกอิน + ปุ่มสลับธีม
// permanent → "บัญชี" ; anonymous/ยังไม่ล็อกอิน → "เข้าสู่ระบบ"
export async function SiteHeader({ width = "xl" }: { width?: "xl" | "5xl" }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isPermanent = !!user && !user.is_anonymous;

  return (
    <header
      className={cn(
        "mx-auto flex w-full items-center justify-between px-4 py-4 sm:px-6",
        width === "5xl" ? "max-w-5xl" : "max-w-xl",
      )}
    >
      <Link href="/" className="flex h-11 items-center gap-2 text-lg font-bold tracking-tight">
        <HexagonMark className="size-6 shrink-0" />
        {strings.common.appName}
      </Link>
      <nav className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild className="h-11 px-3">
          <Link href="/universities">{strings.common.universities}</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="h-11 px-3">
          <Link href="/history">{strings.common.history}</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="h-11 px-3">
          <Link href="/account">
            {isPermanent ? strings.common.account : strings.common.signIn}
          </Link>
        </Button>
        <ModeToggle />
      </nav>
    </header>
  );
}
