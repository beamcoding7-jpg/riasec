# ROADMAP.md — แผนการ build โปรเจกต์ RIASEC (แบ่งเป็น Phase)

> **เอกสารนี้คืออะไร**: แผนการทำงานจริงแบบทีละขั้นตอน แบ่งเป็น 8 Phase สำหรับ build เว็บแบบทดสอบ RIASEC
> **ใช้คู่กับ**: [`CLAUDE.md`](../CLAUDE.md) (กฎ/สถาปัตยกรรม/domain/data model) และ [`docs/CONTEXT.md`](./CONTEXT.md) (โจทย์ตั้งต้น)
>
> **วิธีใช้**:
> - แต่ละ task มี checkbox — ทำเสร็จเปลี่ยน `- [ ]` เป็น `- [x]` เพื่อ track ความคืบหน้า
> - **ทำทีละ Phase** เริ่ม Phase ถัดไปเมื่อ Phase ก่อนหน้าผ่าน **Definition of Done (DoD)** แล้วเท่านั้น
> - ภายใน Phase ทำ task ตามลำดับ (เว้นที่ระบุว่าขนานกันได้)
> - ทุก Phase ต้องยึดกฎใน `CLAUDE.md`: **ฟรีทั้งหมด**, **content จากแหล่งจริง (ห้ามแต่งเอง)**, **mobile-first**, **ทำทีละส่วนที่ตรวจสอบได้**

---

## ภาพรวม & Dependency ระหว่าง Phase

| Phase | ชื่อ | พึ่งพา (ต้องเสร็จก่อน) |
|---|---|---|
| 1 | Setup & Foundation | — |
| 2 | Data Layer & Seed ตั้งต้น | 1 |
| 3 | Scoring Engine (pure) | 1 *(ทำขนานกับ 2 ได้ — ไม่พึ่ง DB)* |
| 4 | Test-taking Flow (UI) | 2, 3 |
| 5 | Results & Recommendation | 2, 4 |
| 6 | Auth & History | 4, 5 |
| 7 | ขยายคลังข้อมูล | 2, 5 |
| 8 | Polish & Hardening | 1–7 |

**หลักลำดับข้อมูล** (จาก `CLAUDE.md §10`): ฟีเจอร์ใดจะ query ตารางไหน ตารางนั้นต้อง seed ให้พร้อม **ก่อน** เฟสที่ใช้
→ นี่คือเหตุผลที่ seed *featured content* (15 มหาลัยหลัก) อยู่ใน Phase 2 ไม่ใช่ Phase 7

---

## Phase 1 — Setup & Foundation

**🎯 Objective**: มีโครง Next.js ที่รันได้จริง เชื่อม Supabase + Vercel และมี guardrails (lint/type/test) พร้อมก่อนเขียน feature

**📋 Tasks**
- [ ] 1.1 **Provision external services** *(ผู้ใช้ช่วย login/สร้าง)*: สร้าง Supabase project, Vercel project, GitHub repo, Cloudflare Turnstile (site+secret key) — เก็บ URL/keys ไว้
- [ ] 1.2 **Scaffold**: `pnpm create next-app` (TypeScript strict, App Router, Tailwind, ESLint) + ตั้ง Prettier
- [ ] 1.3 **shadcn/ui init** + ติดตั้ง base components; ตั้ง theme **Indigo/Violet + accent** + dark mode (CSS variables); ฟอนต์ไทยผ่าน `next/font` (Noto Sans Thai / IBM Plex Sans Thai)
- [ ] 1.4 **Supabase clients**: `lib/supabase/server.ts` + `lib/supabase/client.ts` (`@supabase/ssr`) + `middleware.ts` refresh session
- [ ] 1.5 **Env & secrets**: `.env.local` (local), `.env.example` (commit), ตั้ง env บน Vercel; ตรวจ `.gitignore` ครอบ `.env*`
- [ ] 1.6 **Tooling**: ตั้ง Vitest + Playwright config; npm scripts `dev/build/lint/typecheck/test`
- [ ] 1.7 *(option)* **CI**: GitHub Actions รัน lint + typecheck + test + build บน PR

**📦 Deliverables**: repo รันได้, หน้า landing เปล่าที่มี theme+ฟอนต์, Supabase/Vercel เชื่อมแล้ว

**✅ Verification / DoD**
- `pnpm dev` เปิดหน้าได้ · `pnpm typecheck && pnpm lint && pnpm test && pnpm build` เขียวทั้งหมด
- Vercel **preview deployment** build ผ่าน
- ping Supabase (query ทดสอบ) สำเร็จจากฝั่ง server

---

## Phase 2 — Data Layer & Seed ตั้งต้น

**🎯 Objective**: มี schema ครบ + RLS + seed ข้อมูลพอให้ทั้ง flow ทำงานได้จริง (คำถาม + featured content)

**📋 Tasks**
- [x] 2.1 **ออกแบบ schema** จาก data model (`CLAUDE.md §4`): ทุกตาราง + `enum` dimension (R/I/A/S/E/C) + FK + index ที่จำเป็น
- [x] 2.2 **Migrations**: สร้างทุกตารางเป็นไฟล์ใน `supabase/migrations/` (`20260712100000_enums_and_tables`, `..._rls_policies`)
- [x] 2.3 **RLS policies**: content สาธารณะ `select` ได้; `test_sessions` ใช้ `auth.uid() = user_id` (CRUD ครบ) — *restrictive `is_anonymous` policy เลื่อนไป Phase 6 (ยังไม่มี action เฉพาะ permanent)*
- [x] 2.4 **เปิด Anonymous Sign-in** (ผู้ใช้เปิด provider ใน dashboard แล้ว — Phase 4 เรียกตอนกดส่ง) — *Turnstile ยังเลื่อนไป Phase 8 (hardening)*
- [x] 2.5 **Seed คำถาม**: O*NET Interest Profiler **60 ข้อ (10/ด้าน)** → แปลไทย + ปรับสำนวนให้ ม.3–6 → `riasec_questions` (เก็บ `text_en` + `source`)
- [x] 2.6 **Seed featured content**: 6 `study_tracks`, 36 `careers`, 15 มหาลัย + 55 คณะ + 56 สาขา + `*_map` ครบ 3 ตาราง พร้อม `reason` — ครอบทุก Holland code (120 perm ไม่ว่าง)
- [ ] 2.7 **Cron cleanup**: `pg_cron` ลบ anonymous > 30 วัน — *เลื่อนไป Phase 8 (hardening); `pg_cron`/`pg_net` ยังไม่ติดตั้ง*
- [x] 2.8 **Generate types**: `generate_typescript_types` → `types/database.ts` + `types/index.ts` (helper) + ผูก `<Database>` เข้า Supabase clients
- [x] 2.9 **Advisors**: `get_advisors` security = สะอาด; performance = มีแค่ INFO `unused_index` (ไม่มี ERROR)

**📦 Deliverables**: schema + RLS + seed (คำถาม + featured) + generated types

**✅ Verification / DoD**
- Query recommendation จำลอง (holland_code → สาย/อาชีพ/สาขา) **คืนผลจริงจาก seed**
- ทดสอบ RLS: anonymous user เห็น/แก้ได้เฉพาะ session ของตัวเอง (ข้ามผู้ใช้ไม่ได้)
- `get_advisors` ไม่มีระดับ ERROR ค้าง

---

## Phase 3 — Scoring Engine (pure) &nbsp;·&nbsp; *ทำขนานกับ Phase 2 ได้*

**🎯 Objective**: `lib/riasec/` คำนวณคะแนน 6 ด้าน + Holland code ถูกต้อง **deterministic** และมี unit test ครบ

**📋 Tasks**
- [x] 3.1 **Types**: `QuestionMeta`, `AnswerMap`, `RiasecScores`, `RiasecResult` + Zod `answerMapSchema` (shared client/server)
- [x] 3.2 `score-riasec.ts`: รวมคะแนนต่อด้าน + normalize **min-max 0–100** (นับตามข้อที่ตอบจริง → กันจำนวนคำถามต่อด้านไม่เท่ากัน)
- [x] 3.3 `holland-code.ts`: จัดอันดับ → top 3, **tie-break ด้วย canonical order R-I-A-S-E-C** (deterministic)
- [x] 3.4 **Edge cases**: ตอบไม่ครบ, ไม่ตอบเลย, ทุกด้านเท่ากัน, คะแนนเสมอ, จำนวนข้อไม่เท่ากัน
- [x] 3.5 **Vitest**: 23 tests เขียว (score/holland/compute/schema) ครอบทุก edge case

**📦 Deliverables**: scoring module (pure, ไม่ผูก DB/UI/network) + test suite

**✅ Verification / DoD**
- `pnpm test` เขียว · ครอบ edge case ครบ
- ป้อน input ชุดที่รู้ผลล่วงหน้า → ได้ Holland code ตรงตามคาด

---

## Phase 4 — Test-taking Flow (UI)

**🎯 Objective**: ผู้ใช้ทำแบบทดสอบบนมือถือได้ลื่น ไม่น่าเบื่อ และบันทึกผลได้

**📋 Tasks**
- [x] 4.1 เรียก **Anonymous Sign-in** ตอนกดส่งคำตอบ (ใน Server Action ก่อน insert) — ได้ `auth.uid()` *(Turnstile เลื่อน Phase 8)*
- [x] 4.2 หน้าเลือก **ช่วงชั้น** (ม.3 / ม.4–ม.6) → เก็บ `grade_level` (`GradeIntro`)
- [x] 4.3 **UI ทำเทส**: ทีละคำถาม + progress bar + Likert (แตะง่าย/คีย์บอร์ด) + auto-advance + ย้อนกลับ *(resume ค้างไว้ เลื่อน Phase 6)*
- [x] 4.4 **บันทึกผล**: Zod (`submitTestSchema`) → Server Action คำนวณฝั่ง server ด้วย scoring engine (Phase 3) → เขียน `test_sessions` (answers/scores/holland_code)
- [x] 4.5 จัดการ **loading / error / empty** states + หน้า `/results/[sessionId]` เวอร์ชัน minimal (Holland code + คะแนน 6 ด้าน; Phase 5 เพิ่ม radar/คำแนะนำ)

**📦 Deliverables**: flow `app/(test)/test/` + `app/results/[sessionId]/` + `components/test/*` → สร้าง `test_sessions` จริง

**✅ Verification / DoD**
- [x] ทำเทสจริงบน **mobile viewport** จนจบ (headless e2e: ตอบครบ 60 → Holland `RIA`, คะแนน 100 ทุกด้าน ถูกต้อง)
- [x] session ถูกบันทึกใน DB ผูกกับ `auth.uid()` (ยืนยัน `is_anonymous=true` แล้วลบ cleanup)
- [x] ทำเทสจบ → redirect ไป `/results/[sessionId]`; RLS กันเห็นผลคนอื่น (`maybeSingle` → "ไม่พบผล")
- [x] `pnpm test` (29) / `typecheck` / `lint` / `format:check` / `build` เขียวครบ

---

## Phase 5 — Results & Recommendation

**🎯 Objective**: หน้าแสดงผลสวย เข้าใจง่าย พร้อมคำแนะนำ 3 ชั้น (สาย/อาชีพ/สาขา) ที่มีเหตุผลกำกับ

**📋 Tasks**
- [x] 5.1 **SVG radar** 6 ด้าน (`RiasecRadar`) + แถบคะแนน/ตัวเลขกำกับ + `aria-label` (a11y) + ใช้ **6 สี RIASEC** คงที่ (`dim-colors`)
- [x] 5.2 สรุป **Holland code** + **บุคลิกภาพ top-3** (`DimensionSummary`) — ชื่อไทย/คำอธิบาย 6 ด้านอยู่ใน `lib/strings.ts` (theory Holland/O*NET §7.6)
- [x] 5.3 **การ์ดคำแนะนำ**: สายเรียน (ม.3, สาย 6) / อาชีพ (10) / สาขา (ม.4–6, 10) — matching `matchEntities` (pure, tested) จาก `*_map` + แสดง `reason` **"ทำไมถึงเหมาะกับคุณ"**
- [~] 5.4 รายละเอียด **แสดง inline ในการ์ด `<details>`** (อาชีพทำอะไร · เรียนอะไร · ต่อยอดอาชีพ) — *หน้า detail แยก route เลื่อนไป Phase 7*
- [~] 5.5 ลิงก์ผล `/results/[uuid]` (เดายาก) มีแล้ว — *OG image / ปุ่มแชร์ เลื่อนไป Phase 8 (SEO/hardening)*

**📦 Deliverables**: `app/results/[sessionId]/` + หน้า detail อาชีพ/สาขา

**✅ Verification / DoD**
- ทำเทส → เห็นผล + คำแนะนำจริงจาก DB **ครบทั้ง 4 อย่างตาม `CLAUDE.md §1`** (คะแนน+code / สาย / อาชีพ+เหตุผล / มหาลัย-คณะ-สาขา)
- ตรวจผ่านบน mobile + a11y (radar มี text alternative)

---

## Phase 6 — Auth & History

**🎯 Objective**: ผู้ใช้ล็อกอินเพื่อเก็บประวัติได้ และ upgrade จาก anonymous โดยไม่เสียผลเดิม

**📋 Tasks**
- [ ] 6.1 **ล็อกอิน** Google OAuth + email ผ่าน `linkIdentity()` (upgrade anonymous → permanent, uid เดิมคงอยู่)
- [ ] 6.2 จัดการ **identity conflict** (กรณี email ซ้ำกับบัญชีเดิม) ตามแนวทาง Supabase
- [ ] 6.3 หน้า **`/history`**: แสดงผลย้อนหลังของผู้ใช้ (RLS เห็นเฉพาะเจ้าของ)
- [ ] 6.4 **ลบข้อมูล/บัญชี** (right to erasure) + หน้า **Privacy Policy** *(ดู `CLAUDE.md §7.8`)*

**📦 Deliverables**: auth flow + `/history` + privacy page

**✅ Verification / DoD**
- ทำเทสแบบ anonymous → ล็อกอิน → **ผลเทสเดิมยังอยู่**
- ดู history ได้, ลบข้อมูลได้จริง
- RLS กันไม่ให้เห็นผลของผู้ใช้อื่น

---

## Phase 7 — ขยายคลังข้อมูล

**🎯 Objective**: ข้อมูลครบและเยอะพอสำหรับใช้งานจริง (ไม่ใช่แค่ featured)

**📋 Tasks**
- [ ] 7.1 เติม **มหาลัยทั่วประเทศที่เหลือ** (ชื่อ + ข้อมูลพื้นฐาน: ที่ตั้ง/ประเภท)
- [ ] 7.2 เพิ่ม **อาชีพให้เยอะ/ครบทุก Holland code** (จากแหล่งจริง: O*NET / กรมการจัดหางาน)
- [ ] 7.3 เพิ่ม **mapping + `reason`** ให้ครอบคลุมทุก Holland code
- [ ] 7.4 **QA คุณภาพเนื้อหาไทย**: สำนวน, ความถูกต้อง, ตรวจ `source` ทุกรายการ

**📦 Deliverables**: seed ชุดสมบูรณ์

**✅ Verification / DoD**
- สุ่ม Holland code หลายแบบ → **ไม่มีอันไหนได้คำแนะนำว่างเปล่า**
- เนื้อหาผ่าน QA (ภาษา + แหล่งอ้างอิงครบ)

---

## Phase 8 — Polish & Hardening (production-ready)

**🎯 Objective**: ขัดเกลาให้พร้อมปล่อยใช้จริง (คุณภาพ UX + ปลอดภัย + เร็ว)

**📋 Tasks**
- [ ] 8.1 **Animation** (Framer Motion) micro-interactions / transitions
- [ ] 8.2 **Dark mode** ครบทุกหน้า
- [ ] 8.3 **a11y audit** (Lighthouse / axe) + แก้ประเด็นที่พบ
- [ ] 8.4 **SEO**: metadata ทุกหน้าสาธารณะ + `sitemap.xml` + OG images
- [ ] 8.5 **Security**: ทวน RLS ครบทุกตาราง, Turnstile ทำงาน, cron cleanup ทำงาน, `get_advisors` เขียว
- [ ] 8.6 **Performance**: Core Web Vitals, image/font optimize, ลด bundle
- [ ] 8.7 **Deploy production** + ทดสอบ end-to-end บนโปรดักชันจริง

**📦 Deliverables**: เว็บ production ที่ใช้งานได้จริง

**✅ Verification / DoD**
- Lighthouse ผ่านเกณฑ์ (performance/a11y/SEO/best-practices)
- Playwright **e2e เขียว** (flow ทำเทส→ผล→คำแนะนำ + login→history)
- ทดสอบ end-to-end บน production ผ่าน

---

## ตารางสรุปความคืบหน้า

| Phase | ชื่อ | สถานะ | Definition of Done (ย่อ) |
|---|---|---|---|
| 1 | Setup & Foundation | ✅ เสร็จ | ทุก command เขียว + production deploy ผ่าน |
| 2 | Data Layer & Seed ตั้งต้น | ✅ เสร็จ | recommendation query คืนผลจริง (120 perm ไม่ว่าง) + RLS ผ่าน |
| 3 | Scoring Engine (pure) | ✅ เสร็จ | 23 tests เขียว + Holland code ถูกต้อง (deterministic) |
| 4 | Test-taking Flow (UI) | ✅ เสร็จ | ทำเทส mobile ครบ → บันทึก session (anon) → ไปหน้าผลเบื้องต้น (e2e ผ่าน) |
| 5 | Results & Recommendation | ✅ เสร็จ | radar + บุคลิก + คำแนะนำสาย/อาชีพ/สาขา + เหตุผลจาก DB (e2e m3+m4_6 ผ่าน) |
| 6 | Auth & History | ☐ ยังไม่เริ่ม | upgrade anonymous ไม่เสียผล + history + ลบได้ |
| 7 | ขยายคลังข้อมูล | ☐ ยังไม่เริ่ม | ไม่มี Holland code ไหนคำแนะนำว่างเปล่า |
| 8 | Polish & Hardening | ☐ ยังไม่เริ่ม | Lighthouse ผ่าน + e2e เขียว + prod ผ่าน |

> อัปเดตช่อง "สถานะ" เป็น `🔄 กำลังทำ` / `✅ เสร็จ` เมื่อความคืบหน้าเปลี่ยน

---

## หมายเหตุ

- แผนนี้ยึดกฎทั้งหมดใน [`CLAUDE.md`](../CLAUDE.md): **ฟรีทั้งหมด**, **content จากแหล่งจริง (ห้ามแต่งเอง)**, **rule-based ไม่เรียก LLM**, **mobile-first + a11y**, **ทุกคำแนะนำต้องบอก "ทำไมถึงเหมาะ"**
- **Manual steps ที่ผู้ใช้ต้องทำเอง** (Claude สั่งรันแทนไม่ได้): login `supabase` / `vercel` CLI, สร้าง project/repo, ออก Turnstile keys — จะแจ้งเป็นจุดๆ ใน Phase 1
- ปรับแผนได้เมื่อเจอข้อจำกัดจริงระหว่างทาง — อัปเดตไฟล์นี้ให้ตรงกับสิ่งที่ทำจริงเสมอ
