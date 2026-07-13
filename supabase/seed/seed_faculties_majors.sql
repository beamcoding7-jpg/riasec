-- Phase 2 · Seed คณะ + สาขา ของ 15 มหาวิทยาลัยหลัก (เลือกสาขาเด่นที่ครอบทุก Holland code)
-- แหล่ง: เว็บทางการคณะ/มหาวิทยาลัย + ระบบ TCAS (mytcas.com)
-- โครงสร้าง: (A) คณะ  (B) สาขา (ชื่อมาตรฐาน ใช้ซ้ำข้ามมหาลัยได้)  (C) เติมเนื้อหาสาขาแบบ by-name (ลดการซ้ำ)
-- idempotent: faculties upsert (university_id,name); majors upsert (faculty_id,name)

-- ══════════ (A) คณะ ══════════
insert into faculties (university_id, name, slug) values
((select id from universities where slug='chula'),      'คณะวิศวกรรมศาสตร์',                  'chula-eng'),
((select id from universities where slug='chula'),      'คณะแพทยศาสตร์',                      'chula-med'),
((select id from universities where slug='chula'),      'คณะอักษรศาสตร์',                     'chula-arts'),
((select id from universities where slug='chula'),      'คณะพาณิชยศาสตร์และการบัญชี',         'chula-commerce'),
((select id from universities where slug='chula'),      'คณะครุศาสตร์',                       'chula-edu'),
((select id from universities where slug='mahidol'),    'คณะแพทยศาสตร์ศิริราชพยาบาล',         'mahidol-med'),
((select id from universities where slug='mahidol'),    'คณะเภสัชศาสตร์',                     'mahidol-pharm'),
((select id from universities where slug='mahidol'),    'คณะพยาบาลศาสตร์',                    'mahidol-nurse'),
((select id from universities where slug='mahidol'),    'คณะวิทยาศาสตร์',                     'mahidol-sci'),
((select id from universities where slug='thammasat'),  'คณะนิติศาสตร์',                      'tu-law'),
((select id from universities where slug='thammasat'),  'คณะพาณิชยศาสตร์และการบัญชี',         'tu-commerce'),
((select id from universities where slug='thammasat'),  'คณะรัฐศาสตร์',                       'tu-polsci'),
((select id from universities where slug='thammasat'),  'คณะศิลปศาสตร์',                      'tu-arts'),
((select id from universities where slug='kasetsart'),  'คณะเกษตร',                          'ku-agri'),
((select id from universities where slug='kasetsart'),  'คณะวิศวกรรมศาสตร์',                  'ku-eng'),
((select id from universities where slug='kasetsart'),  'คณะประมง',                          'ku-fish'),
((select id from universities where slug='kasetsart'),  'คณะบริหารธุรกิจ',                    'ku-biz'),
((select id from universities where slug='silpakorn'),  'คณะจิตรกรรม ประติมากรรมและภาพพิมพ์', 'su-paint'),
((select id from universities where slug='silpakorn'),  'คณะสถาปัตยกรรมศาสตร์',               'su-arch'),
((select id from universities where slug='silpakorn'),  'คณะมัณฑนศิลป์',                      'su-decor'),
((select id from universities where slug='silpakorn'),  'คณะดุริยางคศาสตร์',                  'su-music'),
((select id from universities where slug='swu'),        'คณะแพทยศาสตร์',                      'swu-med'),
((select id from universities where slug='swu'),        'คณะศึกษาศาสตร์',                     'swu-edu'),
((select id from universities where slug='swu'),        'คณะมนุษยศาสตร์',                     'swu-human'),
((select id from universities where slug='kmutt'),      'คณะวิศวกรรมศาสตร์',                  'kmutt-eng'),
((select id from universities where slug='kmutt'),      'คณะวิทยาศาสตร์',                     'kmutt-sci'),
((select id from universities where slug='kmitl'),      'คณะวิศวกรรมศาสตร์',                  'kmitl-eng'),
((select id from universities where slug='kmitl'),      'คณะสถาปัตยกรรม ศิลปะและการออกแบบ',   'kmitl-arch'),
((select id from universities where slug='kmitl'),      'คณะเทคโนโลยีสารสนเทศ',               'kmitl-it'),
((select id from universities where slug='kmutnb'),     'คณะวิศวกรรมศาสตร์',                  'kmutnb-eng'),
((select id from universities where slug='kmutnb'),     'คณะครุศาสตร์อุตสาหกรรม',             'kmutnb-edu'),
((select id from universities where slug='kmutnb'),     'คณะวิทยาศาสตร์ประยุกต์',             'kmutnb-sci'),
((select id from universities where slug='cmu'),        'คณะแพทยศาสตร์',                      'cmu-med'),
((select id from universities where slug='cmu'),        'คณะวิศวกรรมศาสตร์',                  'cmu-eng'),
((select id from universities where slug='cmu'),        'คณะบริหารธุรกิจ',                    'cmu-biz'),
((select id from universities where slug='cmu'),        'คณะมนุษยศาสตร์',                     'cmu-human'),
((select id from universities where slug='nu'),         'คณะแพทยศาสตร์',                      'nu-med'),
((select id from universities where slug='nu'),         'คณะวิศวกรรมศาสตร์',                  'nu-eng'),
((select id from universities where slug='nu'),         'คณะเภสัชศาสตร์',                     'nu-pharm'),
((select id from universities where slug='nu'),         'คณะศึกษาศาสตร์',                     'nu-edu'),
((select id from universities where slug='kku'),        'คณะแพทยศาสตร์',                      'kku-med'),
((select id from universities where slug='kku'),        'คณะวิศวกรรมศาสตร์',                  'kku-eng'),
((select id from universities where slug='kku'),        'คณะเกษตรศาสตร์',                     'kku-agri'),
((select id from universities where slug='kku'),        'คณะบริหารธุรกิจและการบัญชี',         'kku-biz'),
((select id from universities where slug='sut'),        'สำนักวิชาวิศวกรรมศาสตร์',            'sut-eng'),
((select id from universities where slug='sut'),        'สำนักวิชาแพทยศาสตร์',                'sut-med'),
((select id from universities where slug='sut'),        'สำนักวิชาวิทยาศาสตร์',               'sut-sci'),
((select id from universities where slug='psu'),        'คณะแพทยศาสตร์',                      'psu-med'),
((select id from universities where slug='psu'),        'คณะวิศวกรรมศาสตร์',                  'psu-eng'),
((select id from universities where slug='psu'),        'คณะวิทยาการจัดการ',                  'psu-mgmt'),
((select id from universities where slug='psu'),        'คณะพยาบาลศาสตร์',                    'psu-nurse'),
((select id from universities where slug='buu'),        'คณะแพทยศาสตร์',                      'buu-med'),
((select id from universities where slug='buu'),        'คณะวิศวกรรมศาสตร์',                  'buu-eng'),
((select id from universities where slug='buu'),        'คณะศึกษาศาสตร์',                     'buu-edu'),
((select id from universities where slug='buu'),        'คณะดนตรีและการแสดง',                 'buu-music')
on conflict (university_id, name) do update set slug = excluded.slug;

-- ══════════ (B) สาขา (ชื่อมาตรฐาน) ══════════
insert into majors (faculty_id, name) values
((select id from faculties where slug='chula-eng'),      'วิศวกรรมโยธา'),
((select id from faculties where slug='chula-med'),      'แพทยศาสตร์'),
((select id from faculties where slug='chula-arts'),     'อักษรศาสตร์'),
((select id from faculties where slug='chula-commerce'), 'การบัญชี'),
((select id from faculties where slug='chula-edu'),      'ครุศาสตร์'),
((select id from faculties where slug='mahidol-med'),    'แพทยศาสตร์'),
((select id from faculties where slug='mahidol-pharm'),  'เภสัชศาสตร์'),
((select id from faculties where slug='mahidol-nurse'),  'พยาบาลศาสตร์'),
((select id from faculties where slug='mahidol-sci'),    'วิทยาศาสตร์'),
((select id from faculties where slug='tu-law'),         'นิติศาสตร์'),
((select id from faculties where slug='tu-commerce'),    'การบัญชี'),
((select id from faculties where slug='tu-polsci'),      'รัฐศาสตร์'),
((select id from faculties where slug='tu-arts'),        'ภาษาอังกฤษ'),
((select id from faculties where slug='ku-agri'),        'เกษตรศาสตร์'),
((select id from faculties where slug='ku-eng'),         'วิศวกรรมเครื่องกล'),
((select id from faculties where slug='ku-fish'),        'ประมง'),
((select id from faculties where slug='ku-biz'),         'การตลาด'),
((select id from faculties where slug='su-paint'),       'ทัศนศิลป์'),
((select id from faculties where slug='su-arch'),        'สถาปัตยกรรม'),
((select id from faculties where slug='su-decor'),       'ออกแบบนิเทศศิลป์'),
((select id from faculties where slug='su-music'),       'ดุริยางคศาสตร์'),
((select id from faculties where slug='swu-med'),        'แพทยศาสตร์'),
((select id from faculties where slug='swu-edu'),        'การศึกษา'),
((select id from faculties where slug='swu-human'),      'จิตวิทยา'),
((select id from faculties where slug='kmutt-eng'),      'วิศวกรรมเครื่องกล'),
((select id from faculties where slug='kmutt-eng'),      'วิศวกรรมคอมพิวเตอร์'),
((select id from faculties where slug='kmutt-sci'),      'วิทยาการคอมพิวเตอร์'),
((select id from faculties where slug='kmitl-eng'),      'วิศวกรรมไฟฟ้า'),
((select id from faculties where slug='kmitl-arch'),     'สถาปัตยกรรม'),
((select id from faculties where slug='kmitl-it'),       'เทคโนโลยีสารสนเทศ'),
((select id from faculties where slug='kmutnb-eng'),     'วิศวกรรมเครื่องกล'),
((select id from faculties where slug='kmutnb-edu'),     'ครุศาสตร์อุตสาหกรรม'),
((select id from faculties where slug='kmutnb-sci'),     'วิทยาการคอมพิวเตอร์'),
((select id from faculties where slug='cmu-med'),        'แพทยศาสตร์'),
((select id from faculties where slug='cmu-eng'),        'วิศวกรรมโยธา'),
((select id from faculties where slug='cmu-biz'),        'บริหารธุรกิจ'),
((select id from faculties where slug='cmu-human'),      'จิตวิทยา'),
((select id from faculties where slug='nu-med'),         'แพทยศาสตร์'),
((select id from faculties where slug='nu-eng'),         'วิศวกรรมโยธา'),
((select id from faculties where slug='nu-pharm'),       'เภสัชศาสตร์'),
((select id from faculties where slug='nu-edu'),         'ศึกษาศาสตร์'),
((select id from faculties where slug='kku-med'),        'แพทยศาสตร์'),
((select id from faculties where slug='kku-eng'),        'วิศวกรรมเครื่องกล'),
((select id from faculties where slug='kku-agri'),       'เกษตรศาสตร์'),
((select id from faculties where slug='kku-biz'),        'การบัญชี'),
((select id from faculties where slug='sut-eng'),        'วิศวกรรมเครื่องกล'),
((select id from faculties where slug='sut-med'),        'แพทยศาสตร์'),
((select id from faculties where slug='sut-sci'),        'วิทยาศาสตร์'),
((select id from faculties where slug='psu-med'),        'แพทยศาสตร์'),
((select id from faculties where slug='psu-eng'),        'วิศวกรรมโยธา'),
((select id from faculties where slug='psu-mgmt'),       'บริหารธุรกิจ'),
((select id from faculties where slug='psu-nurse'),      'พยาบาลศาสตร์'),
((select id from faculties where slug='buu-med'),        'แพทยศาสตร์'),
((select id from faculties where slug='buu-eng'),        'วิศวกรรมเครื่องกล'),
((select id from faculties where slug='buu-edu'),        'การศึกษา'),
((select id from faculties where slug='buu-music'),      'ดนตรีและการแสดง')
on conflict (faculty_id, name) do nothing;

-- ══════════ (C) เติมเนื้อหาสาขา (by-name — ครอบทุกมหาลัยที่มีสาขานั้น) ══════════
update majors m set what_you_learn = c.wyl, career_paths = c.cp, source = 'หลักสูตรจริง + TCAS (mytcas.com)'
from (values
  ('วิศวกรรมโยธา', 'คำนวณและออกแบบโครงสร้าง วัสดุ การก่อสร้าง สำรวจ และบริหารงานก่อสร้าง', 'วิศวกรโยธา ผู้รับเหมา ที่ปรึกษาโครงการ วิศวกรสำรวจ'),
  ('วิศวกรรมเครื่องกล', 'กลศาสตร์ อุณหพลศาสตร์ การออกแบบเครื่องจักรและระบบเชิงกล', 'วิศวกรเครื่องกล วิศวกรโรงงาน วิศวกรออกแบบผลิตภัณฑ์'),
  ('วิศวกรรมไฟฟ้า', 'ระบบไฟฟ้า อิเล็กทรอนิกส์ การควบคุม และพลังงาน', 'วิศวกรไฟฟ้า วิศวกรระบบควบคุม วิศวกรพลังงาน'),
  ('วิศวกรรมคอมพิวเตอร์', 'ฮาร์ดแวร์ ซอฟต์แวร์ ระบบเครือข่าย และการเขียนโปรแกรม', 'วิศวกรคอมพิวเตอร์ นักพัฒนาซอฟต์แวร์ วิศวกรระบบฝังตัว'),
  ('วิทยาการคอมพิวเตอร์', 'อัลกอริทึม โครงสร้างข้อมูล การเขียนโปรแกรม และปัญญาประดิษฐ์', 'นักพัฒนาซอฟต์แวร์ นักวิทยาศาสตร์ข้อมูล วิศวกร AI'),
  ('เทคโนโลยีสารสนเทศ', 'การจัดการระบบสารสนเทศ ฐานข้อมูล เครือข่าย และการพัฒนาแอป', 'ผู้ดูแลระบบไอที นักวิเคราะห์ระบบ นักพัฒนาแอป'),
  ('แพทยศาสตร์', 'วิทยาศาสตร์การแพทย์ การตรวจวินิจฉัย และการรักษาผู้ป่วยทั้งภาคทฤษฎีและคลินิก', 'แพทย์ แพทย์เฉพาะทาง อาจารย์แพทย์ นักวิจัยการแพทย์'),
  ('เภสัชศาสตร์', 'ยาและสารออกฤทธิ์ การผลิตและควบคุมคุณภาพยา และการบริบาลเภสัชกรรม', 'เภสัชกรโรงพยาบาล/ร้านยา เภสัชกรอุตสาหกรรม นักวิจัยยา'),
  ('พยาบาลศาสตร์', 'การพยาบาลและดูแลผู้ป่วยทุกช่วงวัย ทั้งภาคทฤษฎีและฝึกปฏิบัติในโรงพยาบาล', 'พยาบาลวิชาชีพ พยาบาลเฉพาะทาง พยาบาลชุมชน'),
  ('วิทยาศาสตร์', 'วิทยาศาสตร์พื้นฐาน (ชีววิทยา เคมี ฟิสิกส์ คณิตศาสตร์) และการวิจัย', 'นักวิทยาศาสตร์ นักวิจัย ครูวิทยาศาสตร์ ผู้ควบคุมคุณภาพ'),
  ('เกษตรศาสตร์', 'การผลิตพืชและสัตว์ ดิน เทคโนโลยีการเกษตร และการจัดการฟาร์ม', 'นักวิชาการเกษตร นักปรับปรุงพันธุ์ ผู้จัดการฟาร์ม เกษตรกรยุคใหม่'),
  ('ประมง', 'การเพาะเลี้ยงสัตว์น้ำ การจัดการทรัพยากรประมง และวิทยาศาสตร์ทางทะเล', 'นักวิชาการประมง ผู้จัดการฟาร์มเพาะเลี้ยง นักวิจัยทางทะเล'),
  ('อักษรศาสตร์', 'ภาษา วรรณคดี ปรัชญา ประวัติศาสตร์ และการสื่อสารข้ามวัฒนธรรม', 'นักแปล นักเขียน บรรณาธิการ ครูภาษา งานสื่อและวัฒนธรรม'),
  ('ภาษาอังกฤษ', 'ทักษะภาษาอังกฤษเชิงลึก ภาษาศาสตร์ วรรณคดี และการสื่อสาร', 'นักแปล ล่าม ครูภาษาอังกฤษ งานต่างประเทศ งานสื่อสาร'),
  ('ทัศนศิลป์', 'จิตรกรรม ประติมากรรม ภาพพิมพ์ และการสร้างสรรค์งานศิลปะ', 'ศิลปิน นักออกแบบ ภัณฑารักษ์ ครูศิลปะ'),
  ('สถาปัตยกรรม', 'การออกแบบอาคารและพื้นที่ โครงสร้าง วัสดุ และการเขียนแบบ', 'สถาปนิก นักออกแบบเมือง มัณฑนากร ที่ปรึกษาการออกแบบ'),
  ('ออกแบบนิเทศศิลป์', 'การออกแบบกราฟิก แบรนด์ สื่อโฆษณา และงานภาพเพื่อการสื่อสาร', 'กราฟิกดีไซเนอร์ อาร์ตไดเรกเตอร์ นักออกแบบแบรนด์'),
  ('ดุริยางคศาสตร์', 'ทฤษฎีดนตรี การบรรเลง การประพันธ์ และการผลิตดนตรี', 'นักดนตรี นักประพันธ์เพลง ครูดนตรี โปรดิวเซอร์'),
  ('ดนตรีและการแสดง', 'ดนตรี การแสดง และศิลปะการนำเสนอบนเวที', 'นักดนตรี นักแสดง ผู้กำกับการแสดง ครูศิลปะการแสดง'),
  ('ครุศาสตร์', 'ศาสตร์การสอน จิตวิทยาการเรียนรู้ การออกแบบหลักสูตร และการฝึกสอน', 'ครู อาจารย์ นักออกแบบการเรียนรู้ นักวิชาการศึกษา'),
  ('ศึกษาศาสตร์', 'ศาสตร์การสอน จิตวิทยาการเรียนรู้ และการฝึกประสบการณ์วิชาชีพครู', 'ครู อาจารย์ นักวิชาการศึกษา นักแนะแนว'),
  ('การศึกษา', 'ศาสตร์การสอน การพัฒนาผู้เรียน และการฝึกปฏิบัติการสอน', 'ครู อาจารย์ นักพัฒนาการศึกษา'),
  ('ครุศาสตร์อุตสาหกรรม', 'การสอนสายช่าง/เทคโนโลยี ผสมทักษะวิศวกรรมกับการถ่ายทอดความรู้', 'ครูอาชีวศึกษา ครูช่าง นักฝึกอบรมเทคนิค'),
  ('จิตวิทยา', 'พฤติกรรมและกระบวนการทางจิตใจ การให้คำปรึกษา และการวิจัยพฤติกรรม', 'นักจิตวิทยา นักให้คำปรึกษา ฝ่ายทรัพยากรบุคคล นักวิจัย'),
  ('นิติศาสตร์', 'กฎหมายแพ่ง อาญา มหาชน และการให้เหตุผลทางกฎหมาย', 'ทนายความ ผู้พิพากษา อัยการ นิติกร ที่ปรึกษากฎหมาย'),
  ('รัฐศาสตร์', 'การเมืองการปกครอง ความสัมพันธ์ระหว่างประเทศ และการบริหารรัฐกิจ', 'นักการทูต ข้าราชการ นักวิเคราะห์นโยบาย นักการเมือง'),
  ('การตลาด', 'พฤติกรรมผู้บริโภค กลยุทธ์การตลาด แบรนด์ และการตลาดดิจิทัล', 'นักการตลาด นักวางแผนแบรนด์ นักการตลาดดิจิทัล'),
  ('บริหารธุรกิจ', 'การจัดการ การเงิน การตลาด และการเป็นผู้ประกอบการ', 'ผู้จัดการ นักวิเคราะห์ธุรกิจ ผู้ประกอบการ เจ้าหน้าที่องค์กร'),
  ('การบัญชี', 'การบัญชีการเงิน บัญชีบริหาร ภาษี และการสอบบัญชี', 'นักบัญชี ผู้สอบบัญชี ที่ปรึกษาภาษี นักวิเคราะห์การเงิน')
) as c(name, wyl, cp)
where m.name = c.name;

-- ══════════ Phase 7 · เพิ่มคณะ/สาขา (เน้นมิติ A/E/C/S ที่ยังบาง) + backfill slug ══════════
-- แหล่ง: เว็บทางการคณะ/มหาวิทยาลัย + TCAS (mytcas.com)

-- (A7) คณะใหม่
insert into faculties (university_id, name, slug) values
((select id from universities where slug='chula'),     'คณะนิเทศศาสตร์',           'chula-comm'),
((select id from universities where slug='thammasat'), 'คณะเศรษฐศาสตร์',           'tu-econ'),
((select id from universities where slug='thammasat'), 'คณะสังคมสงเคราะห์ศาสตร์',   'tu-socialwork'),
((select id from universities where slug='mahidol'),   'คณะสาธารณสุขศาสตร์',       'mahidol-ph'),
((select id from universities where slug='buu'),       'คณะโลจิสติกส์',            'buu-logistics')
on conflict (university_id, name) do update set slug = excluded.slug;

-- (B7) สาขาใหม่ (ชื่อมาตรฐาน)
insert into majors (faculty_id, name) values
((select id from faculties where slug='chula-comm'),     'นิเทศศาสตร์'),
((select id from faculties where slug='tu-econ'),        'เศรษฐศาสตร์'),
((select id from faculties where slug='tu-socialwork'),  'สังคมสงเคราะห์ศาสตร์'),
((select id from faculties where slug='mahidol-ph'),     'สาธารณสุขศาสตร์'),
((select id from faculties where slug='buu-logistics'),  'การจัดการโลจิสติกส์'),
((select id from faculties where slug='chula-commerce'), 'สถิติ'),
((select id from faculties where slug='tu-commerce'),    'การเงิน'),
((select id from faculties where slug='tu-polsci'),      'ความสัมพันธ์ระหว่างประเทศ'),
((select id from faculties where slug='psu-mgmt'),       'การจัดการการท่องเที่ยวและการบริการ'),
((select id from faculties where slug='su-decor'),       'การออกแบบภายใน')
on conflict (faculty_id, name) do nothing;

-- (C7) เนื้อหาสาขาใหม่ (by-name)
update majors m set what_you_learn = c.wyl, career_paths = c.cp, source = 'หลักสูตรจริง + TCAS (mytcas.com)'
from (values
  ('นิเทศศาสตร์', 'การสื่อสารมวลชน วารสารศาสตร์ โฆษณา ประชาสัมพันธ์ และสื่อดิจิทัล', 'นักสื่อสารมวลชน ครีเอทีฟ นักประชาสัมพันธ์ ผู้ผลิตคอนเทนต์'),
  ('เศรษฐศาสตร์', 'ทฤษฎีเศรษฐศาสตร์ การวิเคราะห์ตลาด นโยบายเศรษฐกิจ และเศรษฐมิติ', 'นักเศรษฐศาสตร์ นักวิเคราะห์ นักวางแผนนโยบาย เจ้าหน้าที่ธนาคาร'),
  ('สังคมสงเคราะห์ศาสตร์', 'การช่วยเหลือกลุ่มเปราะบาง สวัสดิการสังคม และการพัฒนาชุมชน', 'นักสังคมสงเคราะห์ นักพัฒนาชุมชน เจ้าหน้าที่องค์กรพัฒนาเอกชน'),
  ('สาธารณสุขศาสตร์', 'การป้องกันโรค ส่งเสริมสุขภาพ อนามัยสิ่งแวดล้อม และระบาดวิทยา', 'นักวิชาการสาธารณสุข นักระบาดวิทยา เจ้าหน้าที่ส่งเสริมสุขภาพ'),
  ('การจัดการโลจิสติกส์', 'การจัดการโซ่อุปทาน คลังสินค้า การขนส่ง และการค้าระหว่างประเทศ', 'นักวางแผนโลจิสติกส์ ผู้จัดการคลังสินค้า เจ้าหน้าที่นำเข้า-ส่งออก'),
  ('สถิติ', 'ความน่าจะเป็น การวิเคราะห์ข้อมูล และสถิติประยุกต์', 'นักสถิติ นักวิเคราะห์ข้อมูล นักวิทยาศาสตร์ข้อมูล นักคณิตศาสตร์ประกันภัย'),
  ('การเงิน', 'การเงินองค์กร การลงทุน ตลาดทุน และการบริหารความเสี่ยง', 'นักวิเคราะห์การเงิน วาณิชธนกร ที่ปรึกษาการลงทุน เจ้าหน้าที่การเงิน'),
  ('ความสัมพันธ์ระหว่างประเทศ', 'การเมืองระหว่างประเทศ การทูต กฎหมายระหว่างประเทศ และองค์การโลก', 'นักการทูต เจ้าหน้าที่องค์การระหว่างประเทศ นักวิเคราะห์นโยบายต่างประเทศ'),
  ('การจัดการการท่องเที่ยวและการบริการ', 'ธุรกิจท่องเที่ยว โรงแรม งานบริการ และการจัดการอีเวนต์', 'ผู้จัดการโรงแรม ผู้ประกอบการท่องเที่ยว มัคคุเทศก์ นักวางแผนอีเวนต์'),
  ('การออกแบบภายใน', 'การออกแบบพื้นที่ภายใน วัสดุ แสง สี และเฟอร์นิเจอร์', 'นักออกแบบภายใน มัณฑนากร นักออกแบบนิทรรศการ')
) as c(name, wyl, cp)
where m.name = c.name;

-- (D7) backfill slug ทุกสาขา = <ascii ของชื่อ>-<uni-slug> (unique เพราะต่อท้ายมหาลัย)
update majors m
set slug = a.ascii || '-' || u.slug
from faculties f, universities u, (values
  ('วิศวกรรมโยธา','civil-eng'), ('วิศวกรรมเครื่องกล','mech-eng'), ('วิศวกรรมไฟฟ้า','elec-eng'),
  ('วิศวกรรมคอมพิวเตอร์','comp-eng'), ('วิทยาการคอมพิวเตอร์','comp-sci'), ('เทคโนโลยีสารสนเทศ','it'),
  ('แพทยศาสตร์','medicine'), ('เภสัชศาสตร์','pharmacy'), ('พยาบาลศาสตร์','nursing'),
  ('วิทยาศาสตร์','science'), ('เกษตรศาสตร์','agriculture'), ('ประมง','fisheries'),
  ('อักษรศาสตร์','liberal-arts'), ('ภาษาอังกฤษ','english'), ('ทัศนศิลป์','visual-arts'),
  ('สถาปัตยกรรม','architecture'), ('ออกแบบนิเทศศิลป์','communication-design'),
  ('ดุริยางคศาสตร์','music'), ('ดนตรีและการแสดง','music-performance'),
  ('ครุศาสตร์','education'), ('ศึกษาศาสตร์','edu-science'), ('การศึกษา','edu-studies'),
  ('ครุศาสตร์อุตสาหกรรม','industrial-edu'), ('จิตวิทยา','psychology'), ('นิติศาสตร์','law'),
  ('รัฐศาสตร์','political-science'), ('การตลาด','marketing'), ('บริหารธุรกิจ','business-admin'),
  ('การบัญชี','accounting'), ('นิเทศศาสตร์','communication-arts'), ('เศรษฐศาสตร์','economics'),
  ('สังคมสงเคราะห์ศาสตร์','social-work'), ('สาธารณสุขศาสตร์','public-health'),
  ('การจัดการโลจิสติกส์','logistics'), ('สถิติ','statistics'), ('การเงิน','finance'),
  ('ความสัมพันธ์ระหว่างประเทศ','international-relations'),
  ('การจัดการการท่องเที่ยวและการบริการ','tourism-hospitality'), ('การออกแบบภายใน','interior-design')
) as a(name, ascii)
where m.faculty_id = f.id and f.university_id = u.id and m.name = a.name;
