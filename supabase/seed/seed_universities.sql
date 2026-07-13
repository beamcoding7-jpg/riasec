-- Phase 2 · Seed 15 มหาวิทยาลัยหลัก (is_featured = true)
-- แหล่ง: เว็บทางการมหาวิทยาลัย + ระบบ TCAS (mytcas.com)
-- idempotent: upsert บน slug

insert into universities (name, slug, province, type, is_featured, website) values
('จุฬาลงกรณ์มหาวิทยาลัย', 'chula', 'กรุงเทพมหานคร', 'รัฐ', true, 'https://www.chula.ac.th'),
('มหาวิทยาลัยมหิดล', 'mahidol', 'นครปฐม', 'รัฐ', true, 'https://www.mahidol.ac.th'),
('มหาวิทยาลัยธรรมศาสตร์', 'thammasat', 'ปทุมธานี', 'รัฐ', true, 'https://www.tu.ac.th'),
('มหาวิทยาลัยเกษตรศาสตร์', 'kasetsart', 'กรุงเทพมหานคร', 'รัฐ', true, 'https://www.ku.ac.th'),
('มหาวิทยาลัยศิลปากร', 'silpakorn', 'นครปฐม', 'รัฐ', true, 'https://www.su.ac.th'),
('มหาวิทยาลัยศรีนครินทรวิโรฒ', 'swu', 'กรุงเทพมหานคร', 'รัฐ', true, 'https://www.swu.ac.th'),
('มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี', 'kmutt', 'กรุงเทพมหานคร', 'รัฐ', true, 'https://www.kmutt.ac.th'),
('สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', 'kmitl', 'กรุงเทพมหานคร', 'รัฐ', true, 'https://www.kmitl.ac.th'),
('มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 'kmutnb', 'กรุงเทพมหานคร', 'รัฐ', true, 'https://www.kmutnb.ac.th'),
('มหาวิทยาลัยเชียงใหม่', 'cmu', 'เชียงใหม่', 'รัฐ', true, 'https://www.cmu.ac.th'),
('มหาวิทยาลัยนเรศวร', 'nu', 'พิษณุโลก', 'รัฐ', true, 'https://www.nu.ac.th'),
('มหาวิทยาลัยขอนแก่น', 'kku', 'ขอนแก่น', 'รัฐ', true, 'https://www.kku.ac.th'),
('มหาวิทยาลัยเทคโนโลยีสุรนารี', 'sut', 'นครราชสีมา', 'รัฐ', true, 'https://www.sut.ac.th'),
('มหาวิทยาลัยสงขลานครินทร์', 'psu', 'สงขลา', 'รัฐ', true, 'https://www.psu.ac.th'),
('มหาวิทยาลัยบูรพา', 'buu', 'ชลบุรี', 'รัฐ', true, 'https://www.buu.ac.th')
on conflict (slug) do update set
  name = excluded.name, province = excluded.province, type = excluded.type,
  is_featured = excluded.is_featured, website = excluded.website;

-- Phase 7 · เติมมหาวิทยาลัยหลักที่คนแข่งเข้าเยอะ (ทั้งรัฐ/เปิด/เอกชน/ราชภัฏ/ราชมงคล) — is_featured=false
-- แหล่ง: รายชื่อสถาบันอุดมศึกษาทางการ (อว.) + เว็บทางการมหาวิทยาลัย + TCAS (mytcas.com)
-- type vocab: รัฐ / เปิด / เอกชน / ราชภัฏ / ราชมงคล (คงชุดเดิม 15 แห่งเป็น 'รัฐ')
insert into universities (name, slug, province, type, is_featured, website) values
-- ── รัฐ / ในกำกับ (นับรวมเป็น 'รัฐ') ──
('มหาวิทยาลัยแม่ฟ้าหลวง', 'mfu', 'เชียงราย', 'รัฐ', false, 'https://www.mfu.ac.th'),
('มหาวิทยาลัยมหาสารคาม', 'msu', 'มหาสารคาม', 'รัฐ', false, 'https://www.msu.ac.th'),
('มหาวิทยาลัยวลัยลักษณ์', 'wu', 'นครศรีธรรมราช', 'รัฐ', false, 'https://www.wu.ac.th'),
('มหาวิทยาลัยพะเยา', 'up', 'พะเยา', 'รัฐ', false, 'https://www.up.ac.th'),
('มหาวิทยาลัยอุบลราชธานี', 'ubu', 'อุบลราชธานี', 'รัฐ', false, 'https://www.ubu.ac.th'),
('มหาวิทยาลัยแม่โจ้', 'mju', 'เชียงใหม่', 'รัฐ', false, 'https://www.mju.ac.th'),
('มหาวิทยาลัยทักษิณ', 'tsu', 'สงขลา', 'รัฐ', false, 'https://www.tsu.ac.th'),
('มหาวิทยาลัยสวนดุสิต', 'dusit', 'กรุงเทพมหานคร', 'รัฐ', false, 'https://www.dusit.ac.th'),
-- ── มหาวิทยาลัยเปิด ──
('มหาวิทยาลัยรามคำแหง', 'ru', 'กรุงเทพมหานคร', 'เปิด', false, 'https://www.ru.ac.th'),
('มหาวิทยาลัยสุโขทัยธรรมาธิราช', 'stou', 'นนทบุรี', 'เปิด', false, 'https://www.stou.ac.th'),
-- ── เอกชน (แถวหน้า คนนิยม) ──
('มหาวิทยาลัยอัสสัมชัญ', 'abac', 'สมุทรปราการ', 'เอกชน', false, 'https://www.au.edu'),
('มหาวิทยาลัยกรุงเทพ', 'bu', 'ปทุมธานี', 'เอกชน', false, 'https://www.bu.ac.th'),
('มหาวิทยาลัยรังสิต', 'rsu', 'ปทุมธานี', 'เอกชน', false, 'https://www.rsu.ac.th'),
('มหาวิทยาลัยศรีปทุม', 'spu', 'กรุงเทพมหานคร', 'เอกชน', false, 'https://www.spu.ac.th'),
('มหาวิทยาลัยหอการค้าไทย', 'utcc', 'กรุงเทพมหานคร', 'เอกชน', false, 'https://www.utcc.ac.th'),
('มหาวิทยาลัยธุรกิจบัณฑิตย์', 'dpu', 'กรุงเทพมหานคร', 'เอกชน', false, 'https://www.dpu.ac.th'),
('สถาบันการจัดการปัญญาภิวัฒน์', 'pim', 'นนทบุรี', 'เอกชน', false, 'https://www.pim.ac.th'),
('มหาวิทยาลัยเทคโนโลยีมหานคร', 'mut', 'กรุงเทพมหานคร', 'เอกชน', false, 'https://www.mut.ac.th'),
('มหาวิทยาลัยพายัพ', 'payap', 'เชียงใหม่', 'เอกชน', false, 'https://www.payap.ac.th'),
('มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ', 'hcu', 'สมุทรปราการ', 'เอกชน', false, 'https://www.hcu.ac.th'),
('มหาวิทยาลัยสยาม', 'siam', 'กรุงเทพมหานคร', 'เอกชน', false, 'https://www.siam.edu'),
('มหาวิทยาลัยเกษมบัณฑิต', 'kbu', 'กรุงเทพมหานคร', 'เอกชน', false, 'https://www.kbu.ac.th'),
('วิทยาลัยดุสิตธานี', 'dtc', 'กรุงเทพมหานคร', 'เอกชน', false, 'https://www.dtc.ac.th'),
-- ── ราชภัฏ (ตัวหลักคนนิยม) ──
('มหาวิทยาลัยราชภัฏสวนสุนันทา', 'ssru', 'กรุงเทพมหานคร', 'ราชภัฏ', false, 'https://www.ssru.ac.th'),
('มหาวิทยาลัยราชภัฏจันทรเกษม', 'chandra', 'กรุงเทพมหานคร', 'ราชภัฏ', false, 'https://www.chandra.ac.th'),
('มหาวิทยาลัยราชภัฏบ้านสมเด็จเจ้าพระยา', 'bsru', 'กรุงเทพมหานคร', 'ราชภัฏ', false, 'https://www.bsru.ac.th'),
('มหาวิทยาลัยราชภัฏพระนคร', 'pnru', 'กรุงเทพมหานคร', 'ราชภัฏ', false, 'https://www.pnru.ac.th'),
('มหาวิทยาลัยราชภัฏวไลยอลงกรณ์ ในพระบรมราชูปถัมภ์', 'vru', 'ปทุมธานี', 'ราชภัฏ', false, 'https://www.vru.ac.th'),
('มหาวิทยาลัยราชภัฏเชียงใหม่', 'cmru', 'เชียงใหม่', 'ราชภัฏ', false, 'https://www.cmru.ac.th'),
('มหาวิทยาลัยราชภัฏนครราชสีมา', 'nrru', 'นครราชสีมา', 'ราชภัฏ', false, 'https://www.nrru.ac.th'),
-- ── ราชมงคล (9 แห่ง) ──
('มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี', 'rmutt', 'ปทุมธานี', 'ราชมงคล', false, 'https://www.rmutt.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ', 'rmutk', 'กรุงเทพมหานคร', 'ราชมงคล', false, 'https://www.rmutk.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร', 'rmutp', 'กรุงเทพมหานคร', 'ราชมงคล', false, 'https://www.rmutp.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์', 'rmutr', 'นครปฐม', 'ราชมงคล', false, 'https://www.rmutr.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ', 'rmutsb', 'พระนครศรีอยุธยา', 'ราชมงคล', false, 'https://www.rmutsb.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก', 'rmutto', 'ชลบุรี', 'ราชมงคล', false, 'https://www.rmutto.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา', 'rmutl', 'เชียงใหม่', 'ราชมงคล', false, 'https://www.rmutl.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน', 'rmuti', 'นครราชสีมา', 'ราชมงคล', false, 'https://www.rmuti.ac.th'),
('มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย', 'rmutsv', 'สงขลา', 'ราชมงคล', false, 'https://www.rmutsv.ac.th')
on conflict (slug) do update set
  name = excluded.name, province = excluded.province, type = excluded.type,
  is_featured = excluded.is_featured, website = excluded.website;
