"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { submitTest } from "@/app/(test)/test/actions";
import { Turnstile } from "@/components/Turnstile";
import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";
import type { GradeLevel } from "@/lib/test/schema";
import { turnstileEnabled } from "@/lib/turnstile";

import { GradeIntro } from "./GradeIntro";
import { LikertScale } from "./LikertScale";
import { QuestionCard } from "./QuestionCard";
import { TestProgress } from "./TestProgress";

// เฉพาะข้อมูลที่ client ต้องใช้แสดงผล (dimension คำนวณฝั่ง server เท่านั้น)
export type TestQuestion = { id: string; text: string };

const AUTO_ADVANCE_MS = 220; // หน่วงสั้น ๆ ให้เห็นไฮไลต์ก่อนเลื่อนข้อถัดไป

export function TestFlow({ questions }: { questions: TestQuestion[] }) {
  const total = questions.length;
  const [phase, setPhase] = useState<"intro" | "quiz">("intro");
  const [grade, setGrade] = useState<GradeLevel | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // เคลียร์ timer ค้างตอน unmount
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === total;
  const isLast = index === total - 1;
  const currentAnswered = answers[current.id] != null;

  function handleSelect(value: number) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    setError(null);
    // auto-advance เฉพาะข้อที่ไม่ใช่ข้อสุดท้าย (ข้อสุดท้ายให้ผู้ใช้กด "ดูผลลัพธ์" เอง)
    if (!isLast) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(
        () => setIndex((i) => Math.min(i + 1, total - 1)),
        AUTO_ADVANCE_MS,
      );
    }
  }

  function goBack() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setIndex((i) => Math.max(i - 1, 0));
  }

  function goNext() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function handleSubmit() {
    if (!grade || !isComplete) {
      setError(strings.test.incomplete);
      return;
    }
    // เมื่อเปิด Turnstile ต้องได้ token ก่อนส่ง (กัน bot สร้าง anonymous user)
    if (turnstileEnabled && !captchaToken) {
      setError(strings.common.captchaRequired);
      return;
    }
    setError(null);
    startTransition(async () => {
      // สำเร็จ → server redirect ไปหน้าผล (ไม่คืนค่า); ล้มเหลว → { error }
      const res = await submitTest({
        answers,
        gradeLevel: grade,
        captchaToken: captchaToken ?? undefined,
      });
      if (res?.error) setError(res.error);
    });
  }

  if (phase === "intro") {
    return <GradeIntro value={grade} onChange={setGrade} onStart={() => setPhase("quiz")} />;
  }

  return (
    <div className="space-y-6">
      <TestProgress current={index + 1} total={total} />

      {/* key = id ของคำถาม → re-mount ทุกครั้งที่เปลี่ยนข้อ ให้คำถาม "เลื่อนเข้า" ทีละข้อ */}
      <div
        key={current.id}
        className="animate-in fade-in slide-in-from-bottom-1 space-y-6 duration-300"
      >
        <QuestionCard text={current.text} />
        <LikertScale
          name={current.id}
          value={answers[current.id] ?? null}
          onSelect={handleSelect}
        />
      </div>

      {/* Turnstile โผล่เฉพาะข้อสุดท้าย (ตอนใกล้ submit) และเฉพาะเมื่อเปิด flag */}
      {isLast && <Turnstile onToken={setCaptchaToken} />}

      {error && <p className="text-destructive text-center text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="h-12 flex-1 text-base"
          onClick={goBack}
          disabled={index === 0 || isPending}
        >
          {strings.test.back}
        </Button>
        {isLast ? (
          <Button
            className="h-12 flex-1 text-base"
            onClick={handleSubmit}
            disabled={!isComplete || isPending}
          >
            {isPending ? strings.test.submitting : strings.test.submit}
          </Button>
        ) : (
          <Button
            className="h-12 flex-1 text-base"
            onClick={goNext}
            disabled={!currentAnswered || isPending}
          >
            {strings.test.next}
          </Button>
        )}
      </div>
    </div>
  );
}
