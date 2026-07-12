import type { RiasecDimension } from "@/types";

// คลาสสีประจำแต่ละด้าน RIASEC ใช้ร่วม radar/summary/card
// ⚠️ ต้องเขียนชื่อคลาสเต็ม (ห้าม `bg-riasec-${dim}`) — Tailwind JIT ตรวจจับเฉพาะ literal string
// อ้าง token --color-riasec-* ที่เปิดไว้ใน @theme (globals.css)
export const dimColors: Record<
  RiasecDimension,
  { bg: string; text: string; fill: string; border: string }
> = {
  R: { bg: "bg-riasec-r", text: "text-riasec-r", fill: "fill-riasec-r", border: "border-riasec-r" },
  I: { bg: "bg-riasec-i", text: "text-riasec-i", fill: "fill-riasec-i", border: "border-riasec-i" },
  A: { bg: "bg-riasec-a", text: "text-riasec-a", fill: "fill-riasec-a", border: "border-riasec-a" },
  S: { bg: "bg-riasec-s", text: "text-riasec-s", fill: "fill-riasec-s", border: "border-riasec-s" },
  E: { bg: "bg-riasec-e", text: "text-riasec-e", fill: "fill-riasec-e", border: "border-riasec-e" },
  C: { bg: "bg-riasec-c", text: "text-riasec-c", fill: "fill-riasec-c", border: "border-riasec-c" },
};
