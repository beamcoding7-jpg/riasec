// จับคู่จังหวัด → ภูมิภาค สำหรับจัดกลุ่มมหาวิทยาลัยในหน้า directory
// แยก "กรุงเทพฯ และปริมณฑล" เป็นกลุ่มเดียว เพราะมหาลัยกระจุกที่นี่มากที่สุด (ช่วยผู้ใช้หาเร็วขึ้น)
// pure — ไม่มี side effect, unit test ได้ (lib/riasec pattern §4)

export const REGIONS = [
  "bangkok",
  "central",
  "north",
  "northeast",
  "east",
  "west",
  "south",
] as const;
export type Region = (typeof REGIONS)[number];

// province (ภาษาไทย) → region key. ครบ 77 จังหวัด (เผื่อข้อมูลอนาคต)
const PROVINCE_REGION: Record<string, Region> = {
  // กรุงเทพฯ และปริมณฑล
  กรุงเทพมหานคร: "bangkok",
  นนทบุรี: "bangkok",
  ปทุมธานี: "bangkok",
  สมุทรปราการ: "bangkok",
  สมุทรสาคร: "bangkok",
  นครปฐม: "bangkok",
  // ภาคกลาง
  พระนครศรีอยุธยา: "central",
  อ่างทอง: "central",
  ลพบุรี: "central",
  สิงห์บุรี: "central",
  ชัยนาท: "central",
  สระบุรี: "central",
  นครนายก: "central",
  สมุทรสงคราม: "central",
  สุพรรณบุรี: "central",
  นครสวรรค์: "central",
  อุทัยธานี: "central",
  // ภาคเหนือ (รวมเหนือตอนล่าง ตามความเข้าใจทั่วไป)
  เชียงใหม่: "north",
  เชียงราย: "north",
  ลำปาง: "north",
  ลำพูน: "north",
  แม่ฮ่องสอน: "north",
  น่าน: "north",
  พะเยา: "north",
  แพร่: "north",
  อุตรดิตถ์: "north",
  พิษณุโลก: "north",
  สุโขทัย: "north",
  ตาก: "north",
  เพชรบูรณ์: "north",
  กำแพงเพชร: "north",
  พิจิตร: "north",
  // ภาคตะวันออกเฉียงเหนือ (อีสาน)
  กาฬสินธุ์: "northeast",
  ขอนแก่น: "northeast",
  ชัยภูมิ: "northeast",
  นครพนม: "northeast",
  นครราชสีมา: "northeast",
  บึงกาฬ: "northeast",
  บุรีรัมย์: "northeast",
  มหาสารคาม: "northeast",
  มุกดาหาร: "northeast",
  ยโสธร: "northeast",
  ร้อยเอ็ด: "northeast",
  เลย: "northeast",
  ศรีสะเกษ: "northeast",
  สกลนคร: "northeast",
  สุรินทร์: "northeast",
  หนองคาย: "northeast",
  หนองบัวลำภู: "northeast",
  อุดรธานี: "northeast",
  อุบลราชธานี: "northeast",
  อำนาจเจริญ: "northeast",
  // ภาคตะวันออก
  จันทบุรี: "east",
  ฉะเชิงเทรา: "east",
  ชลบุรี: "east",
  ตราด: "east",
  ปราจีนบุรี: "east",
  ระยอง: "east",
  สระแก้ว: "east",
  // ภาคตะวันตก
  กาญจนบุรี: "west",
  ประจวบคีรีขันธ์: "west",
  เพชรบุรี: "west",
  ราชบุรี: "west",
  // ภาคใต้
  กระบี่: "south",
  ชุมพร: "south",
  ตรัง: "south",
  นครศรีธรรมราช: "south",
  นราธิวาส: "south",
  ปัตตานี: "south",
  พังงา: "south",
  พัทลุง: "south",
  ภูเก็ต: "south",
  ระนอง: "south",
  สตูล: "south",
  สงขลา: "south",
  สุราษฎร์ธานี: "south",
  ยะลา: "south",
};

// คืน region ของจังหวัด — null ถ้าไม่รู้จัก (หน้า directory จับไป bucket "อื่น ๆ")
export function regionOfProvince(province: string | null | undefined): Region | null {
  if (!province) return null;
  return PROVINCE_REGION[province.trim()] ?? null;
}
