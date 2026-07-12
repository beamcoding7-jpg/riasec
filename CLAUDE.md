# CLAUDE.md — คู่มือการทำงานสำหรับโปรเจกต์ RIASEC

> ไฟล์นี้คือ **Project Memory** เฉพาะโปรเจกต์นี้ Claude Code จะอ่านทุกครั้งที่เปิดโปรเจกต์
> ทำงาน **คู่กับ** global `~/.claude/CLAUDE.md` (ซึ่งดูแลเรื่องภาษา/สไตล์การสื่อสาร/permission/ข้อความ commit อยู่แล้ว)
> ไฟล์นี้ **ไม่เขียนซ้ำ** กฎ global แต่จะเพิ่มเฉพาะความรู้และกฎที่เจาะจงกับโปรเจกต์นี้
> เมื่อกฎขัดกัน ให้ยึดไฟล์นี้ก่อน (เพราะเจาะจงกว่า)

---

## 1. ภาพรวมโปรเจกต์

**เว็บแบบทดสอบค้นหาตัวเองด้วยทฤษฎี Holland RIASEC** สำหรับนักเรียนไทย **ม.3 – ม.6**
เป้าหมาย: ให้นักเรียนทำแบบทดสอบแล้วได้ **แนวทางอนาคต** ที่จับต้องได้ ไม่ใช่แค่รู้ผลบุคลิกภาพ

**ผลลัพธ์ที่ผู้ใช้ต้องได้รับ:**
1. **คะแนน RIASEC 6 ด้าน + Holland code** (เช่น `RIA`) พร้อมคำอธิบายบุคลิกภาพ
2. **สายการเรียน ม.ปลาย** (สำหรับ ม.3) — พร้อมเหตุผลว่า *ทำไมถึงเหมาะ* และข้อดี
3. **อาชีพที่เหมาะ** — พร้อมเหตุผล + กดเข้าไปดูได้ว่าอาชีพนั้น *ทำอะไร เกี่ยวกับอะไร*
4. **มหาลัย / คณะ / สาขา** (อิงบริบทไทย) — เรียนอะไรบ้าง ต่อยอดอาชีพอะไรได้

**กฎเหล็กของโปรเจกต์: ทุกอย่างต้องฟรี ไม่มีค่าใช้จ่าย** (ดูข้อ 7.1)

**การตัดสินใจหลักที่ยืนยันแล้ว (บันทึกไว้เพื่อไม่ต้องถามซ้ำ):**
- **Auth**: ล็อกอินแบบ *optional* — ทำเทสได้โดยไม่ต้องล็อกอิน, ล็อกอิน (Google/email) เพื่อบันทึกประวัติผล
- **Recommendation engine**: *Rule-based + ฐานข้อมูลคัดสรร* (ไม่ใช้ LLM, ไม่มีค่า API, ผลนิ่ง)
- **Theme**: *Indigo/Violet + accent สดใส* รองรับ dark mode
- **ภาษา**: *ไทยอย่างเดียว (MVP)* — ยังไม่ตั้ง i18n framework แต่แยก content ออกจาก code
- **แหล่ง Content**: คำถามจาก *O*NET Interest Profiler* (แปลไทย), อาชีพ/มหาลัยจาก *ข้อมูลจริง* — **ห้ามแต่งเอง** (ดูข้อ 7.7)

---

## 2. Domain Knowledge: ทฤษฎี RIASEC (Holland Code)

RIASEC แบ่งบุคลิกภาพเชิงอาชีพเป็น **6 ด้าน** คนเราเป็นส่วนผสมของทุกด้าน แต่จะเด่นบางด้าน
ผลลัพธ์คือ **Holland code = ตัวอักษร 3 ตัวของด้านที่คะแนนสูงสุด** เรียงจากมากไปน้อย (เช่น `SEC`, `RIA`)

| รหัส | ชื่อ | บุคลิก / ชอบทำ | ตัวอย่างอาชีพ |
|---|---|---|---|
| **R** | Realistic (นักปฏิบัติ) | ลงมือทำ ใช้เครื่องมือ/เครื่องจักร งานช่าง กลางแจ้ง รูปธรรม | วิศวกร, ช่างเทคนิค, นักกีฬา, เกษตร |
| **I** | Investigative (นักคิดวิเคราะห์) | วิจัย วิเคราะห์ แก้ปัญหา วิทย์-คณิต ค้นคว้า | นักวิทยาศาสตร์, หมอ, โปรแกรมเมอร์, นักวิจัย |
| **A** | Artistic (นักสร้างสรรค์) | ศิลปะ จินตนาการ อิสระ การแสดงออก ออกแบบ | ดีไซเนอร์, ศิลปิน, นักเขียน, สถาปนิก |
| **S** | Social (นักสังคม) | ช่วยเหลือ สอน ดูแล ทำงานกับคน | ครู, พยาบาล, นักจิตวิทยา, นักสังคมสงเคราะห์ |
| **E** | Enterprising (นักบริหาร) | โน้มน้าว นำ ขาย ริเริ่มธุรกิจ | ผู้ประกอบการ, นักการตลาด, นักกฎหมาย, ผู้จัดการ |
| **C** | Conventional (นักจัดระบบ) | ระเบียบ ข้อมูล ตัวเลข เอกสาร ทำตามกฎ | นักบัญชี, เจ้าหน้าที่ธุรการ, นักวิเคราะห์ข้อมูล |

**Hexagon model**: ทั้ง 6 ด้านเรียงเป็นหกเหลี่ยม (R-I-A-S-E-C) ด้านที่อยู่ติดกันคล้ายกัน ด้านตรงข้ามต่างกันมาก
→ ใช้เป็นแนวคิดในการแสดงผล **radar/hexagon chart** และในการจับคู่ (ด้านที่ติดกันให้ match กันได้บ้าง)

**Flow การคำนวณ (สรุป):**
1. ผู้ใช้ตอบคำถาม (Likert เช่น 1–5 "ไม่ชอบมาก → ชอบมาก") แต่ละคำถามผูกกับ 1 dimension
2. รวมคะแนนต่อด้าน → normalize เป็นสัดส่วน (กันจำนวนคำถามต่อด้านไม่เท่ากัน)
3. จัดอันดับ → เอา **top 3** เป็น Holland code
4. เอา Holland code (และช่วงชั้น ม.3 vs ม.ปลาย) ไป **map** กับตารางแนะนำใน DB

**การ map แตกต่างตามช่วงชั้น:**
- **ม.3** → เน้นแนะนำ *สายการเรียน ม.ปลาย* (เช่น วิทย์-คณิต, ศิลป์-คำนวณ, ศิลป์-ภาษา, ศิลป์-สังคม, สายอาชีพ/ปวช.) + อาชีพเป็นภาพกว้าง
- **ม.4–ม.6** → เน้นแนะนำ *อาชีพ + มหาลัย/คณะ/สาขา* ที่เจาะจงขึ้น

---

## 3. Tech Stack (เลือกแบบมืออาชีพ + ฟรีทั้งหมด)

| ชั้น | เทคโนโลยี | เหตุผล |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript (strict)** | คู่มาตรฐานของ Vercel + Supabase; RSC ลด client JS โหลดเร็วบนมือถือ |
| Package manager | **pnpm** | เร็ว ประหยัดพื้นที่ เป็นมาตรฐานทีม |
| UI / Styling | **Tailwind CSS + shadcn/ui** | UX/UI ระดับ senior, ฟรี, owns-the-code ปรับ theme ได้เต็มที่ |
| Animation | **Framer Motion (`motion`)** | ไมโครอินเทอแรกชัน/ทรานสิชันลื่น |
| Icons | **lucide-react** | ชุดไอคอนมาตรฐานของ shadcn |
| Font ไทย | **`next/font` + Noto Sans Thai / IBM Plex Sans Thai** | อ่านง่ายบนมือถือ, ฟรี, self-host (ไม่พึ่ง external) |
| Database | **Supabase Postgres + Row Level Security** | กำหนดมาแล้ว |
| Auth | **Supabase Auth ผ่าน `@supabase/ssr`** | optional login: Anonymous Sign-in → `linkIdentity()` เป็น Google/email (ดู 7.2) |
| Forms / Validation | **React Hook Form + Zod** | schema เดียวใช้ validate ทั้ง client และ server |
| Charts (RIASEC) | **SVG radar เขียนเอง** (หลัก); Recharts เป็นทางเลือก | เบา ไม่ลาก client lib ใหญ่ เข้ากับ mobile-first; radar ต้องมีตัวเลข/ตารางกำกับ (a11y) |
| Testing | **Vitest** (unit) + **Playwright** (e2e เฉพาะ flow สำคัญ) | เน้น scoring engine + flow ทำเทส→ดูผล |
| Lint / Format | **ESLint + Prettier** | มาตรฐาน; ยึด config ในโปรเจกต์เมื่อมีแล้ว |
| Deploy | **Vercel** | กำหนดมาแล้ว |

> **กฎ dependency**: ก่อนเพิ่ม library/บริการใหม่ ต้องเช็คว่าอยู่ใน **free tier** จริง และไม่มี hard limit ที่จะทำให้เกิดค่าใช้จ่าย ถ้าไม่แน่ใจ **ให้ถามก่อน** อย่าเพิ่มเอง

---

## 4. สถาปัตยกรรม (Architecture)

**หลักการสำคัญ 5 ข้อ:**

1. **Scoring engine = pure functions** — โค้ดคำนวณคะแนน RIASEC และหา Holland code อยู่ใน `lib/riasec/`
   ต้องเป็นฟังก์ชันบริสุทธิ์ (input → output, ไม่มี side effect, ไม่ผูก DB/UI/network) เพื่อ **unit test ได้ 100%**
2. **Recommendation = ข้อมูลใน DB ไม่ใช่ if-else ในโค้ด** — การจับคู่ Holland code → สาย/อาชีพ/สาขา
   ทำผ่าน **ตาราง mapping ใน Supabase** (มี match weight + เหตุผล) ดึงด้วย Server Components
3. **Content-as-data** — คำถาม, อาชีพ, มหาลัย, คณะ, สาขา, คำอธิบาย = **ข้อมูลใน DB/seed** ห้าม hardcode ยาวๆ ในคอมโพเนนต์ (แก้เนื้อหาต้องไม่ต้องแก้โค้ด)
4. **อ่านข้อมูลด้วย Server Components, เขียนด้วย Server Actions** — บันทึกผลเทสผ่าน Server Action; ผูกกับ `auth.uid()` **เสมอ** — ตอนกดส่งคำตอบโดยยังไม่ล็อกอิน เรียก `signInAnonymously()` ใน Server Action (สร้าง uid ตอน submit เท่านั้น เพื่อไม่สร้าง anon ให้คนที่เริ่มแล้วไม่ทำจบ), ตอนล็อกอิน upgrade เป็นบัญชีถาวรด้วย `linkIdentity()`/`updateUser()` → **ผลเทสเดิมตามไปเอง (uid ไม่เปลี่ยน)** (ดู 7.2)
5. **Security by default** — RLS เปิดทุกตาราง; `service_role` key ใช้ฝั่ง server เท่านั้น ห้ามหลุดไป client

### Data model (ระดับ high-level)

| ตาราง | ฟิลด์หลัก | หมายเหตุ |
|---|---|---|
| `riasec_questions` | `text`, `dimension` (R/I/A/S/E/C), `order`, `active`, `source` | คลังคำถาม (จาก O*NET IP แปลไทย — ดู 7.7) |
| `test_sessions` | `user_id` (= `auth.uid()`, NOT NULL), `answers` jsonb, `scores` jsonb, `holland_code`, `grade_level`, `created_at` | ผลการทำเทส (anonymous ก็มี uid เสมอ — ดู 7.2) |
| `study_tracks` | `name`, `description`, `why_suitable`, `source` | สายการเรียน ม.ปลาย (อ้างหลักสูตรแกนกลาง/สพฐ.) |
| `careers` | `name`, `holland_code`, `short_desc`, `detail`, `source` | คลังอาชีพ (จำนวน**มาก**, อ้าง O*NET/ไทย — ดู 7.7) |
| `universities` | `name`, `province`, `type`, `is_featured` | มหาลัยไทย **ครบทั่วประเทศ**; `is_featured`=true สำหรับ 15 หลัก (ดู 7.7) |
| `faculties` | `university_id`, `name` | คณะ |
| `majors` | `faculty_id`, `name`, `what_you_learn`, `career_paths` | สาขา + ต่อยอดอาชีพ |
| `riasec_track_map` | `dimension` (R/I/A/S/E/C), `track_id`, `weight`, `reason` | map → สาย |
| `riasec_career_map` | `dimension` (R/I/A/S/E/C), `career_id`, `weight`, `reason` | map → อาชีพ |
| `riasec_major_map` | `dimension` (R/I/A/S/E/C), `major_id`, `weight`, `reason` | map → สาขา |

> **หมายเหตุ (ตัดสินใจ Phase 2):** `*_map` map ที่ระดับ **1 มิติ** (`dimension`) ไม่ใช่ Holland code 3 ตัว — เลี่ยงปัญหา 120 permutation และครอบทุกผลลัพธ์ได้ deterministic. Matching (Phase 5): คะแนน entity = Σ(position_weight ของ top-3 ผู้ใช้ × `weight`) เฉพาะมิติที่ตรง. ส่วน `careers.holland_code` (3 ตัวของอาชีพเอง จาก O*NET) ยังคงไว้เป็น attribute แสดงผล
> ตาราง `*_map` เก็บ **`reason`** ไว้อธิบายว่า "ทำไมมิตินี้ถึงเหมาะกับสิ่งนี้" — เนื้อหานี้คือหัวใจของฟีเจอร์ ต้องมีเสมอ

---

## 5. โครงสร้างโฟลเดอร์ & Naming

```
app/                    # routes (RSC เป็นหลัก)
  (test)/               # flow ทำแบบทดสอบ
  results/[sessionId]/  # หน้าแสดงผล + คำแนะนำ
  history/              # ประวัติผล (ต้องล็อกอิน)
components/ui/          # shadcn primitives (generated)
components/             # feature components (PascalCase)
lib/riasec/             # scoring engine (pure) + matching helpers
lib/supabase/           # server.ts / client.ts (@supabase/ssr factories)
lib/                    # utils ทั่วไป
supabase/migrations/    # SQL migrations (ไฟล์, ตามลำดับเวลา)
supabase/seed/          # seed content (คำถาม/อาชีพ/มหาลัย)
types/                  # generated types + shared types
```

**Naming convention:**
- ไฟล์คอมโพเนนต์: `PascalCase.tsx` (เช่น `QuestionCard.tsx`)
- ไฟล์ util/logic: **`kebab-case.ts`** (ฟันธง — เช่น `holland-code.ts`, `score-riasec.ts`)
- ตาราง/คอลัมน์ DB: `snake_case`
- ตัวแปร/ฟังก์ชัน: `camelCase`; type/interface: `PascalCase`

---

## 6. Coding Convention

- **TypeScript strict** เปิดเต็ม — ห้าม `any` โดยไม่มีเหตุผล; ใช้ type ที่ generate จาก Supabase (`generate_typescript_types`)
- **RSC-first**: ใช้ Server Component เป็นค่าเริ่มต้น ใส่ `"use client"` เฉพาะเมื่อจำเป็น (state, event, animation)
- **Validation ด้วย Zod** ทุกจุดที่รับ input จากผู้ใช้/ภายนอก; แชร์ schema ระหว่าง client/server
- **Error handling**: จัดการ error ของ Supabase ทุกครั้ง (อย่าปล่อย `error` ทิ้ง); มี loading/error/empty state ในหน้า UI
- **คอมโพเนนต์เล็ก แยกหน้าที่ชัด**; แยก logic ออกจาก presentation
- **คอมเมนต์**: syntax/ชื่อเป็นอังกฤษ คำอธิบายเป็นไทย (ตาม global CLAUDE.md) — คอมเมนต์ที่ "ทำไม" มากกว่า "ทำอะไร"

---

## 7. กฎการทำงานเฉพาะโปรเจกต์ (สำคัญที่สุด)

### 7.1 กฎ "ฟรีทั้งหมด" 🚫💸
- **ห้าม** เพิ่มบริการ/แพ็กเกจที่มีค่าใช้จ่าย หรือที่ free tier จำกัดจนเสี่ยงเกิดเงิน โดยไม่ถามก่อน
- ยึด free tier ของ **Supabase + Vercel** เป็นหลัก; ระวัง limit (DB size, bandwidth, edge invocations)
- Recommendation ใช้ **rule-based จาก DB** เท่านั้น — **ไม่เรียก LLM/AI API** ในการสร้างผลลัพธ์ (นี่คือเหตุผลหลักที่เลือกวิธีนี้)

### 7.2 Supabase workflow
- แก้ schema ผ่าน **migration เป็นไฟล์** ใน `supabase/migrations/` เสมอ (ไม่แก้มือบน dashboard แล้วลืมบันทึก)
- ใช้ **Supabase MCP tools** ได้ (`list_tables`, `apply_migration`, `execute_sql`, `get_advisors`, `generate_typescript_types`); ก่อนแก้ schema เรียก `list_tables` ดูโครงสร้างจริงก่อน
- **RLS เปิดทุกตารางเสมอ** — content สาธารณะอ่านได้; `test_sessions` ใช้ `auth.uid() = user_id` (เห็น/แก้เฉพาะเจ้าของ)
- **Auth = optional login ผ่าน Anonymous Sign-in**:
  - ตอนกดส่งคำตอบ (ยังไม่ล็อกอิน) เรียก `signInAnonymously()` **ใน Server Action ก่อน insert** → ได้ `auth.uid()` จริง (RLS ทำงานได้; สร้าง anon ตอน submit เท่านั้น — ลด bloat); ล็อกอินภายหลังใช้ `linkIdentity()` → uid เดิมคงอยู่ ผลเทสตามไปเอง
  - anonymous ใช้ role `authenticated` เหมือน permanent → ถ้าต้องจำกัดบางการกระทำเฉพาะ permanent ใช้ **restrictive policy** เช็ค `is_anonymous` ใน `auth.jwt()` (ref: advisor lint 0012)
  - เปิด **CAPTCHA / Cloudflare Turnstile** (ฟรี) กัน bad actor สร้าง anonymous user รัวจน DB บวม
  - ตั้ง **cron ลบ anonymous users เก่า** (เช่น > 30 วัน) ด้วย `pg_cron` หรือ Vercel Cron — Supabase ไม่มี auto-cleanup
- หลังแก้ schema ให้ **regenerate types** แล้วอัปเดต `types/`
- ตรวจ `get_advisors` (security/performance) หลังเปลี่ยน schema สำคัญ

### 7.3 Vercel workflow
- ทุก secret อยู่ใน **Environment Variables บน Vercel** + `.env.local` (local) — คนละชุดตาม environment
- ตัวแปรฝั่ง client ต้องขึ้นต้น `NEXT_PUBLIC_`; `service_role` **ห้าม** เป็น `NEXT_PUBLIC_`
- ใช้ preview deployment ตรวจงานก่อน promote ขึ้น production

### 7.4 Security
- **ห้าม commit** secret/`.env*` (ยกเว้น `.env.example`); ตรวจ `.gitignore` ให้ครอบคลุมก่อน commit แรก
- `service_role` key ใช้เฉพาะฝั่ง server เท่านั้น
- validate ทุก input ด้วย Zod; อย่าเชื่อ client

### 7.5 Scoring engine
- ต้องเป็น **pure function** และ **มี unit test (Vitest)** ครอบ edge case (คะแนนเสมอ, ตอบไม่ครบ, ทุกด้านเท่ากัน)
- ตรรกะการให้คะแนน/จัดอันดับต้อง **deterministic** — input เดิมให้ผลเดิมเสมอ

### 7.6 Content & UX
- **Content เป็น data** — เพิ่ม/แก้อาชีพ-มหาลัย-คำถาม ต้องทำที่ DB/seed ไม่ใช่ hardcode ในคอมโพเนนต์
- **UI copy รวมศูนย์** — ข้อความ UI ไทย (ปุ่ม/label/ข้อความระบบ) เก็บที่เดียว (เช่น `lib/strings.ts`) ไม่กระจายใน JSX — เผื่อแก้/เพิ่มภาษาภายหลัง
- **Mobile-first + a11y** — กลุ่มเป้าหมายเป็นวัยรุ่นที่ใช้มือถือเป็นหลัก; ปุ่มแตะง่าย, contrast ผ่าน, ใช้คีย์บอร์ด/ scroll ได้ลื่น
- **คุณภาพเนื้อหาไทย** — น้ำเสียง *ให้กำลังใจ เป็นกันเอง เข้าใจง่าย* เหมาะกับวัยรุ่น; ทุกคำแนะนำต้องบอก **"ทำไมถึงเหมาะ"** เสมอ ไม่ใช่โยนผลลัพธ์ลอยๆ

### 7.7 แหล่งที่มาของ Content & ความถูกต้องของข้อมูล ⚠️ (สำคัญมาก)

> **หลักการสูงสุด: ห้ามแต่ง/มโนข้อมูลขึ้นเอง** — คำถาม, อาชีพ, มหาลัย/คณะ/สาขา ทุกอย่างต้องมาจาก **แหล่งจริงที่อ้างอิงได้** (งานวิจัย/หน่วยงานทางการ/เว็บทางการ) และเก็บ **provenance (แหล่งอ้างอิง)** กำกับไว้ในฟิลด์ `source` เสมอ ถ้าหาแหล่งจริงไม่ได้ → **ถามก่อน อย่าเดา**

**1) คำถามแบบทดสอบ RIASEC**
- ฐานหลัก: **O*NET Interest Profiler** (public domain โดย O*NET / U.S. Dept. of Labor) — ผ่านการวิจัย/validate, ใช้ฟรีถูกลิขสิทธิ์ 100%
- รูปแบบ: Likert ("Dislike → Like", เช่น 1–5); ชุดสั้น **60 ข้อ (10 ข้อ/ด้าน)** หรือชุดยาว 180 ข้อ
- งานคือ **แปลเป็นไทย + ปรับสำนวนให้เหมาะกับนักเรียน ม.3–ม.6** โดย **คงความหมายเดิม ไม่บิดเบือน**
- 🚫 **ห้ามใช้** แบบวัดมีลิขสิทธิ์: Holland *Self-Directed Search (SDS)*, *Strong Interest Inventory* ฯลฯ (ผิดทั้งกฎฟรีและลิขสิทธิ์)

**2) อาชีพแนะนำ — ทำให้ "เยอะ"**
- สร้างคลังอาชีพ **จำนวนมาก** ครอบคลุมทุก Holland code
- Holland code + รายละเอียดอาชีพ อ้างจากแหล่งจริง: **O*NET occupations** (มี RIASEC code ให้อยู่แล้ว), ข้อมูล **กรมการจัดหางาน / กระทรวงแรงงาน** ของไทย, แหล่งอาชีพทางการอื่น
- แต่ละอาชีพต้องมี "ทำอะไร / เกี่ยวกับอะไร" ที่มาจากข้อมูลจริง ปรับเป็นบริบทไทยและภาษาที่วัยรุ่นเข้าใจ

**3) มหาลัย / คณะ / สาขา — ครบทั่วประเทศ, เน้นละเอียด 15 หลัก**
- **ครอบคลุมมหาลัยทั่วประเทศไทย** อย่างน้อย: ชื่อ + ข้อมูลพื้นฐาน (ที่ตั้ง/ประเภท)
- **ทำละเอียดก่อน 15 มหาลัยหลัก** (`is_featured`) — คณะ/สาขา/เรียนอะไร/ต่อยอดอาชีพ:

  | # | มหาลัย | # | มหาลัย |
  |---|---|---|---|
  | 1 | จุฬาลงกรณ์มหาวิทยาลัย | 9 | มจพ. (KMUTNB) |
  | 2 | มหิดล | 10 | เชียงใหม่ |
  | 3 | ธรรมศาสตร์ | 11 | นเรศวร |
  | 4 | เกษตรศาสตร์ | 12 | ขอนแก่น |
  | 5 | ศิลปากร | 13 | เทคโนโลยีสุรนารี |
  | 6 | ศรีนครินทรวิโรฒ (มศว) | 14 | สงขลานครินทร์ |
  | 7 | มจธ. (KMUTT) | 15 | บูรพา |
  | 8 | สจล. (KMITL) | | |

- อ้างอิงจาก **เว็บทางการของมหาลัย/คณะ, ระบบ TCAS (mytcas), หลักสูตรจริง** — ชื่อคณะ/สาขาต้องตรงกับของจริง ห้ามเดา

### 7.8 ความเป็นส่วนตัว & PDPA (กลุ่มเป้าหมายเป็นผู้เยาว์) 🔒

> ผู้ใช้เป็นนักเรียน ม.3–6 (ผู้เยาว์) — ระวังข้อมูลส่วนบุคคลเป็นพิเศษ ยึดหลัก **minimal** สำหรับ MVP

- **Data minimization** — เก็บเท่าที่จำเป็นจริง (ผลเทส; email เฉพาะเมื่อผู้ใช้เลือกล็อกอิน) ไม่เก็บ PII เกินจำเป็น
- **ไม่บังคับ email/ข้อมูลส่วนตัวเพื่อทำเทส** (สอดคล้อง optional login)
- มี **หน้า Privacy Policy** + แจ้งวัตถุประสงค์การเก็บข้อมูลด้วยภาษาที่วัยรุ่นเข้าใจง่าย
- ผู้ใช้ **ขอลบข้อมูล/บัญชีได้** (right to erasure) — รองรับใน flow บัญชี
- **ไม่แชร์/ขาย** ข้อมูลผลทดสอบให้บุคคลที่สาม

---

## 8. Design System

- **สีหลัก**: Indigo/Violet (เช่น `indigo-600` / `violet-600`) + **accent สดใส** (เช่น amber/pink) สำหรับ CTA และไฮไลต์
- **Dark mode**: รองรับตั้งแต่แรก (Tailwind `dark:` + CSS variables ผ่าน shadcn theme)
- **6 สี RIASEC**: กำหนดสีประจำแต่ละด้าน (R/I/A/S/E/C) ให้คงที่ทั้งเว็บ ใช้ใน radar chart, badge, การ์ดผลลัพธ์
- **Typography**: ฟอนต์ไทยอ่านง่าย, ขนาดตัวอักษร/line-height เผื่อการอ่านบนมือถือ
- **หลัก UX**: โมบายเฟิสต์, โหลดเร็ว (RSC + optimize), flow ทำเทสไม่น่าเบื่อ (progress bar, ทีละคำถาม/กลุ่ม), หน้า **ผลลัพธ์ต้องเข้าใจง่ายและสวย** (radar + สรุป + การ์ดคำแนะนำที่กดขยายได้)
- **SEO / metadata** — ตั้งผ่าน Next.js Metadata API ทุกหน้าสาธารณะ (title/description/OG image) เพื่อให้ค้นเจอใน Google + แชร์ผลลัพธ์แล้วสวย
- อ้างอิงแนวทางดีไซน์เพิ่มเติมได้จาก skill `shadcn` และ `frontend-design`

---

## 9. Testing Policy

- **Vitest (บังคับ)**: scoring engine + matching logic ใน `lib/riasec/` — ครอบ edge case
- **Playwright (เฉพาะ flow สำคัญ)**: ทำแบบทดสอบครบ → เห็นผล → เห็นคำแนะนำ; และ flow ล็อกอินเพื่อบันทึกประวัติ
- UI ทั่วไป/คอมโพเนนต์เล็ก ไม่ต้องเขียน test เว้นแต่ร้องขอ (ตาม global CLAUDE.md ข้อ 8)

---

## 10. Build Roadmap (ลำดับการสร้าง)

1. **Setup** — scaffold Next.js + TS + Tailwind + shadcn + ESLint/Prettier + pnpm; ตั้งค่า Supabase client (`@supabase/ssr`); `.env.example`; `.gitignore`
2. **Data & schema + seed ตั้งต้น** — migration ทุกตาราง + RLS + seed **คำถาม** (O*NET IP แปลไทย — ดู 7.7) + seed **featured content**: `study_tracks`, `careers`, และคณะ/สาขาของ **15 มหาลัยหลัก** + ตาราง `*_map` (พอให้ recommendation ทำงานได้จริง); generate types
3. **Scoring engine** — `lib/riasec/` (pure) + unit test
4. **Test UI** — flow ทำแบบทดสอบ (mobile-first, progress, ทีละคำถาม); เรียก **Anonymous Sign-in** ตอนกดส่งคำตอบ (ใน Server Action)
5. **Results & recommendation** — SVG radar + สรุป Holland code + การ์ดสาย/อาชีพ/สาขา (ดึง mapping จาก DB) + เหตุผล "ทำไมถึงเหมาะ"
6. **Auth & history** — upgrade anonymous → permanent (`linkIdentity` Google/email), บันทึก/ดูประวัติผล, ลบข้อมูลได้
7. **ขยายคลังข้อมูล** — เติมมหาลัย**ทั่วประเทศที่เหลือ** (ชื่อ+พื้นฐาน) + เพิ่มอาชีพให้เยอะ/ครบ + หน้า detail อาชีพ/สาขา (จากแหล่งจริง — ดู 7.7)
8. **Polish & hardening** — animation, dark mode, a11y, SEO metadata, CAPTCHA/Turnstile + cron ลบ anonymous เก่า, performance, deploy production

> เริ่มเฟสถัดไปเมื่อเฟสก่อนหน้าตรวจแล้วใช้งานได้จริง (ตาม global CLAUDE.md: ทำทีละส่วนที่ตรวจสอบได้)
> **หลักลำดับข้อมูล**: ฟีเจอร์ใดจะ query ตารางไหน ตารางนั้นต้อง seed ให้พร้อม **ก่อน** เฟสที่ใช้ (กัน forward dependency แบบเฟส 5 ต้องใช้ข้อมูลมหาลัย)

---

## 11. หมายเหตุ

- ไฟล์นี้เสริม global `~/.claude/CLAUDE.md` — เรื่อง **ภาษาไทยในการตอบ, โค้ดเป็นอังกฤษ, thinking process, permission, ข้อความ commit ภาษาไทย** ให้ยึดตาม global (ไม่เขียนซ้ำที่นี่)
- เมื่อโจทย์ไม่ชัดหรือกระทบเยอะ **ถามก่อนพร้อมเสนอทางเลือก** อย่าเดาแล้วลงมือ
- อ้างอิงบริบทตั้งต้นได้ที่ `docs/CONTEXT.md`
