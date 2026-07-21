"use client";

import { Check } from "lucide-react";

import { HexagonMark } from "@/components/HexagonMark";
import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";
import type { GradeLevel } from "@/lib/test/schema";

type Props = {
  value: GradeLevel | null;
  onChange: (grade: GradeLevel) => void;
  onStart: () => void;
};

// ตัวเลือกช่วงชั้น — ต้องเลือกก่อนเริ่ม (grade_level บังคับใน DB + ใช้ปรับคำแนะนำ Phase 5)
const options: { value: GradeLevel; label: string; desc: string }[] = [
  { value: "m3", label: strings.test.gradeM3Label, desc: strings.test.gradeM3Desc },
  { value: "m4_6", label: strings.test.gradeM46Label, desc: strings.test.gradeM46Desc },
];

export function GradeIntro({ value, onChange, onStart }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 space-y-8 duration-500">
      <div className="space-y-4 text-center">
        <HexagonMark
          showLetters
          animated
          title={strings.home.hexAlt}
          className="mx-auto w-28 sm:w-32"
        />
        <span className="bg-accent text-accent-foreground inline-block rounded-full px-3 py-1 text-sm font-medium">
          {strings.test.introBadge}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {strings.test.introTitle}
        </h1>
        <p className="text-muted-foreground text-balance">{strings.test.introDesc}</p>
      </div>

      <div className="grid gap-3">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={cn(
                "rounded-xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] active:scale-[0.99]",
                selected
                  ? "border-primary bg-accent text-accent-foreground shadow-lift ring-primary ring-2"
                  : "border-border hover:bg-muted hover:shadow-soft",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-lg font-semibold">{option.label}</div>
                  <div className="text-muted-foreground text-sm">{option.desc}</div>
                </div>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border",
                  )}
                >
                  {selected && <Check className="size-4" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <Button
          size="lg"
          className="h-12 w-full text-base"
          disabled={value == null}
          onClick={onStart}
        >
          {strings.test.start}
        </Button>
        <p className="text-muted-foreground text-center text-xs">{strings.test.introTimeHint}</p>
      </div>
    </div>
  );
}
