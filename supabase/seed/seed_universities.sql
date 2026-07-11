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
