// UI copy ภาษาไทยรวมศูนย์ (CLAUDE.md §7.6) — เพิ่ม/แก้ข้อความที่นี่ที่เดียว
// แยก content ออกจาก JSX เผื่อรองรับหลายภาษาภายหลัง
export const strings = {
  common: {
    appName: "RIASEC",
    tagline: "ค้นหาตัวเอง ค้นหาอนาคต",
    startTest: "เริ่มทำแบบทดสอบ",
    loading: "กำลังโหลด...",
    error: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง",
  },
} as const;

export type Strings = typeof strings;
