"use client";

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
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <span className="bg-accent text-accent-foreground inline-block rounded-full px-3 py-1 text-sm font-medium">
          {strings.test.introBadge}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {strings.test.introTitle}
        </h1>
        <p className="text-muted-foreground text-balance">{strings.test.introDesc}</p>
      </div>

      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "border-border hover:bg-muted rounded-xl border p-4 text-left transition-colors",
              value === option.value &&
                "border-primary bg-accent text-accent-foreground hover:bg-accent",
            )}
          >
            <div className="text-lg font-semibold">{option.label}</div>
            <div className="text-muted-foreground text-sm">{option.desc}</div>
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="h-12 w-full text-base"
        disabled={value == null}
        onClick={onStart}
      >
        {strings.test.start}
      </Button>
    </div>
  );
}
