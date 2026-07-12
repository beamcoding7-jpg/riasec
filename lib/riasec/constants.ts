// ค่าคงที่หลักของ scoring engine — แยกไว้ใช้ร่วมทั้ง engine, schema และ test

// ลำดับ canonical ของ 6 มิติ RIASEC (R-I-A-S-E-C ตาม hexagon ของ Holland)
// ใช้เป็น (1) ลำดับ iterate ที่ deterministic (2) ตัว tie-break เมื่อคะแนนเสมอกัน
export const RIASEC_DIMENSIONS = ["R", "I", "A", "S", "E", "C"] as const;

// ช่วงคะแนน Likert ต่อ 1 ข้อ (1 = ไม่ชอบมาก … 5 = ชอบมาก)
export const LIKERT_MIN = 1;
export const LIKERT_MAX = 5;

// Holland code = ตัวอักษร 3 ตัวของด้านคะแนนสูงสุด
export const HOLLAND_CODE_LENGTH = 3;
