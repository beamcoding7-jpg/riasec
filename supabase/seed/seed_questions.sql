-- Phase 2 · Seed คำถาม RIASEC 60 ข้อ (10/ด้าน)
-- แหล่ง: O*NET Interest Profiler Short Form (Paper-and-Pencil v1), U.S. Dept. of Labor / O*NET — public domain
-- งาน: แปลไทย ปรับสำนวนให้ ม.3-6 เข้าใจ คงความหมายเดิม (CLAUDE.md §7.7) + เก็บต้นฉบับอังกฤษใน text_en
-- display_order: สลับด้าน R-I-A-S-E-C วนรอบ เพื่อไม่ให้คำถามแนวเดียวกันเรียงติดกัน (scoring รวมตาม dimension ไม่ขึ้นกับ order)
-- idempotent: upsert บน display_order (คง id เดิมเมื่อ re-run)

insert into riasec_questions (text, text_en, dimension, display_order, source) values
-- รอบ 1
('ต่อประกอบตู้ครัว', 'Build kitchen cabinets', 'R', 1, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('คิดค้นยาชนิดใหม่', 'Develop a new medicine', 'I', 2, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เขียนหนังสือหรือบทละคร', 'Write books or plays', 'A', 3, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('สอนท่าออกกำลังกายให้ใครสักคน', 'Teach an individual an exercise routine', 'S', 4, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ซื้อขายหุ้นและพันธบัตร', 'Buy and sell stocks and bonds', 'E', 5, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ทำสเปรดชีตด้วยโปรแกรมคอมพิวเตอร์', 'Develop a spreadsheet using computer software', 'C', 6, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 2
('ก่ออิฐหรือปูกระเบื้อง', 'Lay brick or tile', 'R', 7, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ศึกษาวิธีลดมลพิษทางน้ำ', 'Study ways to reduce water pollution', 'I', 8, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เล่นเครื่องดนตรี', 'Play a musical instrument', 'A', 9, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ช่วยเหลือคนที่มีปัญหาส่วนตัวหรือปัญหาทางอารมณ์', 'Help people with personal or emotional problems', 'S', 10, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('บริหารร้านค้าปลีก', 'Manage a retail store', 'E', 11, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ตรวจทานเอกสารหรือแบบฟอร์ม', 'Proofread records or forms', 'C', 12, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 3
('ซ่อมเครื่องใช้ไฟฟ้าในบ้าน', 'Repair household appliances', 'R', 13, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ทำการทดลองทางเคมี', 'Conduct chemical experiments', 'I', 14, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('แต่งเพลงหรือเรียบเรียงดนตรี', 'Compose or arrange music', 'A', 15, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ให้คำแนะนำเรื่องอาชีพแก่ผู้อื่น', 'Give career guidance to people', 'S', 16, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เปิดร้านเสริมสวยหรือร้านตัดผม', 'Operate a beauty salon or barber shop', 'E', 17, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ติดตั้งซอฟต์แวร์ให้คอมพิวเตอร์ทั้งเครือข่ายขนาดใหญ่', 'Install software across computers on a large network', 'C', 18, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 4
('เพาะเลี้ยงปลาในโรงเพาะฟัก', 'Raise fish in a fish hatchery', 'R', 19, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ศึกษาการเคลื่อนที่ของดาวเคราะห์', 'Study the movement of planets', 'I', 20, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('วาดรูป', 'Draw pictures', 'A', 21, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ทำกายภาพบำบัดฟื้นฟูให้ผู้ป่วย', 'Perform rehabilitation therapy', 'S', 22, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('บริหารแผนกหนึ่งในบริษัทใหญ่', 'Manage a department within a large company', 'E', 23, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ใช้เครื่องคิดเลขคำนวณตัวเลข', 'Operate a calculator', 'C', 24, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 5
('ประกอบชิ้นส่วนอิเล็กทรอนิกส์', 'Assemble electronic parts', 'R', 25, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ตรวจตัวอย่างเลือดด้วยกล้องจุลทรรศน์', 'Examine blood samples using a microscope', 'I', 26, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('สร้างเทคนิคพิเศษให้ภาพยนตร์', 'Create special effects for movies', 'A', 27, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ทำงานอาสาสมัครให้องค์กรไม่แสวงหากำไร', 'Do volunteer work at a non-profit organization', 'S', 28, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เริ่มต้นธุรกิจของตัวเอง', 'Start your own business', 'E', 29, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('บันทึกข้อมูลการรับ-ส่งสินค้า', 'Keep shipping and receiving records', 'C', 30, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 6
('ขับรถบรรทุกส่งพัสดุตามบ้านและออฟฟิศ', 'Drive a truck to deliver packages to offices and homes', 'R', 31, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('สืบหาสาเหตุของเหตุเพลิงไหม้', 'Investigate the cause of a fire', 'I', 32, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('วาดฉากประกอบการแสดงละคร', 'Paint sets for plays', 'A', 33, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('สอนเด็ก ๆ เล่นกีฬา', 'Teach children how to play sports', 'S', 34, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เจรจาต่อรองสัญญาทางธุรกิจ', 'Negotiate business contracts', 'E', 35, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('คำนวณค่าจ้างพนักงาน', 'Calculate the wages of employees', 'C', 36, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 7
('ตรวจสอบคุณภาพชิ้นส่วนก่อนจัดส่ง', 'Test the quality of parts before shipment', 'R', 37, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('พัฒนาวิธีพยากรณ์อากาศให้แม่นยำขึ้น', 'Develop a way to better predict the weather', 'I', 38, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เขียนบทภาพยนตร์หรือรายการโทรทัศน์', 'Write scripts for movies or television shows', 'A', 39, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('สอนภาษามือให้ผู้ที่หูหนวกหรือมีปัญหาการได้ยิน', 'Teach sign language to people who are deaf or hard of hearing', 'S', 40, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เป็นตัวแทนว่าความให้ลูกความในคดี', 'Represent a client in a lawsuit', 'E', 41, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ตรวจนับสต็อกสินค้าด้วยเครื่องสแกนมือถือ', 'Inventory supplies using a hand-held computer', 'C', 42, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 8
('ซ่อมและติดตั้งกุญแจ', 'Repair and install locks', 'R', 43, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ทำงานในห้องแล็บชีววิทยา', 'Work in a biology lab', 'I', 44, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('เต้นแจ๊สหรือแท็ป', 'Perform jazz or tap dance', 'A', 45, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ช่วยนำกิจกรรมบำบัดแบบกลุ่ม', 'Help conduct a group therapy session', 'S', 46, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ทำการตลาดให้เสื้อผ้าคอลเลกชันใหม่', 'Market a new line of clothing', 'E', 47, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('บันทึกการชำระค่าเช่า', 'Record rent payments', 'C', 48, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 9
('ตั้งค่าและควบคุมเครื่องจักรเพื่อผลิตสินค้า', 'Set up and operate machines to make products', 'R', 49, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('คิดค้นสารทดแทนน้ำตาล', 'Invent a replacement for sugar', 'I', 50, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ร้องเพลงในวงดนตรี', 'Sing in a band', 'A', 51, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ดูแลเด็กที่สถานรับเลี้ยงเด็ก', 'Take care of children at a day-care center', 'S', 52, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ขายสินค้าในห้างสรรพสินค้า', 'Sell merchandise at a department store', 'E', 53, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('จัดทำบันทึกสต็อกสินค้า', 'Keep inventory records', 'C', 54, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
-- รอบ 10
('ดับไฟป่า', 'Put out forest fires', 'R', 55, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ตรวจวิเคราะห์ในห้องแล็บเพื่อวินิจฉัยโรค', 'Do laboratory tests to identify diseases', 'I', 56, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ตัดต่อภาพยนตร์', 'Edit movies', 'A', 57, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('สอนหนังสือระดับมัธยมปลาย', 'Teach a high-school class', 'S', 58, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('บริหารร้านขายเสื้อผ้า', 'Manage a clothing store', 'E', 59, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain'),
('ประทับตรา คัดแยก และแจกจ่ายจดหมายขององค์กร', 'Stamp, sort, and distribute mail for an organization', 'C', 60, 'O*NET Interest Profiler Short Form (v1), U.S. DoL/O*NET — public domain')
on conflict (display_order) do update set
  text = excluded.text,
  text_en = excluded.text_en,
  dimension = excluded.dimension,
  source = excluded.source,
  active = true;
