"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

// ปุ่มสลับธีมสว่าง/มืด — สลับไอคอนด้วย CSS (dark:) จึงไม่ต้องพึ่ง mounted state
// (กัน hydration mismatch โดยไม่ต้อง setState ใน effect)
export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="สลับธีมสว่าง/มืด"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden size-5 dark:block" />
      <Moon className="block size-5 dark:hidden" />
      <span className="sr-only">สลับธีมสว่าง/มืด</span>
    </Button>
  );
}
