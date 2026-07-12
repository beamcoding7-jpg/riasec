"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type Props = {
  // ต้อง unique ต่อคำถาม เพื่อไม่ให้ radio id ชนกันเมื่อสลับข้อ
  name: string;
  value: number | null;
  onSelect: (value: number) => void;
};

// สเกล Likert 5 ระดับ — ปุ่มเต็มความกว้างแตะง่ายบนมือถือ, a11y ผ่าน radio-group ของ radix
export function LikertScale({ name, value, onSelect }: Props) {
  return (
    <RadioGroup
      // ส่ง "" (ไม่ใช่ undefined) เมื่อยังไม่ตอบ เพื่อให้ radio group เป็น controlled ตลอด
      // มิฉะนั้น radix จะสลับเป็น uncontrolled แล้วจำค่าเดิมข้ามข้อ → คลิกซ้ำค่าเดิมไม่ยิง onValueChange
      value={value != null ? String(value) : ""}
      onValueChange={(v) => onSelect(Number(v))}
      aria-label={strings.test.prompt}
      className="gap-2.5"
    >
      {strings.test.likertLabels.map((label, i) => {
        const optionValue = i + 1; // index 0–4 → ค่า 1–5
        const id = `${name}-${optionValue}`;
        return (
          <Label
            key={optionValue}
            htmlFor={id}
            className={cn(
              "border-border flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-base font-normal transition-colors",
              "hover:bg-muted",
              // ไฮไลต์ทั้งแถวเมื่อ radio ข้างในถูกเลือก (radix ใส่ data-checked ที่ item)
              "has-[[data-checked]]:border-primary has-[[data-checked]]:bg-accent has-[[data-checked]]:text-accent-foreground has-[[data-checked]]:font-medium",
            )}
          >
            <RadioGroupItem id={id} value={String(optionValue)} />
            <span>{label}</span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
