import type { RiasecDimension } from "@/types";

// คลาสสีประจำแต่ละด้าน RIASEC ใช้ร่วม radar/summary/card
// ⚠️ ต้องเขียนชื่อคลาสเต็ม (ห้าม `bg-riasec-${dim}`) — Tailwind JIT ตรวจจับเฉพาะ literal string
// อ้าง token --color-riasec-* ที่เปิดไว้ใน @theme (globals.css)
export const dimColors: Record<
  RiasecDimension,
  { bg: string; text: string; fill: string; stroke: string; border: string }
> = {
  R: { bg: "bg-riasec-r", text: "text-riasec-r", fill: "fill-riasec-r", stroke: "stroke-riasec-r", border: "border-riasec-r" }, // prettier-ignore
  I: { bg: "bg-riasec-i", text: "text-riasec-i", fill: "fill-riasec-i", stroke: "stroke-riasec-i", border: "border-riasec-i" }, // prettier-ignore
  A: { bg: "bg-riasec-a", text: "text-riasec-a", fill: "fill-riasec-a", stroke: "stroke-riasec-a", border: "border-riasec-a" }, // prettier-ignore
  S: { bg: "bg-riasec-s", text: "text-riasec-s", fill: "fill-riasec-s", stroke: "stroke-riasec-s", border: "border-riasec-s" }, // prettier-ignore
  E: { bg: "bg-riasec-e", text: "text-riasec-e", fill: "fill-riasec-e", stroke: "stroke-riasec-e", border: "border-riasec-e" }, // prettier-ignore
  C: { bg: "bg-riasec-c", text: "text-riasec-c", fill: "fill-riasec-c", stroke: "stroke-riasec-c", border: "border-riasec-c" }, // prettier-ignore
};
