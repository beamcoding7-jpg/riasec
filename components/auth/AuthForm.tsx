"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailSchema, otpSchema } from "@/lib/auth/schema";
import { createClient } from "@/lib/supabase/client";
import { strings } from "@/lib/strings";

// โหมด: upgrade = ผูกอีเมลกับ anonymous เดิม (uid ไม่เปลี่ยน ผลตามไป) / signin = เข้าบัญชีเดิม
type Mode = "upgrade" | "signin";
type Step = "email" | "code";

const s = strings.account;

// ฟอร์มเข้าสู่ระบบด้วย Email OTP — client island เพราะต้องมี state หลายขั้น + เรียก supabase browser client
// anonymous เริ่มที่โหมด upgrade (ค่าเริ่มต้น) แต่สลับไป signin ได้ถ้ามีบัญชีอยู่แล้ว
export function AuthForm({ isAnonymous }: { isAnonymous: boolean }) {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>(isAnonymous ? "upgrade" : "signin");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState(""); // อีเมล normalize แล้วที่ส่งรหัสไป (ใช้ตอน verify)
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ส่งรหัส OTP — upgrade ใช้ updateUser (ผูกอีเมล), signin ใช้ signInWithOtp
  async function sendCode(targetEmail: string): Promise<boolean> {
    setPending(true);
    setError(null);
    try {
      if (mode === "upgrade") {
        const { error } = await supabase.auth.updateUser({ email: targetEmail });
        if (error) {
          // อีเมลถูกผูกกับบัญชีอื่นแล้ว → แนะนำให้ไปโหมด signin
          setError(
            /already|exist|registered|taken/i.test(error.message)
              ? s.errEmailTaken
              : s.errSendFailed,
          );
          return false;
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: targetEmail,
          // anonymous ที่กด "มีบัญชีอยู่แล้ว" ต้องเป็นบัญชีที่มีจริง (กันสร้างบัญชีซ้ำโดยไม่ตั้งใจ)
          options: { shouldCreateUser: !isAnonymous },
        });
        if (error) {
          setError(s.errSendFailed);
          return false;
        }
      }
      return true;
    } catch {
      setError(s.errSendFailed);
      return false;
    } finally {
      setPending(false);
    }
  }

  async function handleSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(s.errInvalidEmail);
      return;
    }
    const ok = await sendCode(parsed.data);
    if (ok) {
      setSentEmail(parsed.data);
      setCode("");
      setStep("code");
    }
  }

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = otpSchema.safeParse(code);
    if (!parsed.success) {
      setError(s.errInvalidCode);
      return;
    }
    setPending(true);
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: sentEmail,
        token: parsed.data,
        type: mode === "upgrade" ? "email_change" : "email",
      });
      if (error) {
        setError(s.errVerifyFailed);
        return;
      }
      // สำเร็จ — session ใหม่ถูกเขียนลง cookie แล้ว; refresh ให้ RSC/header เห็นสถานะใหม่ แล้วพาไปดูประวัติ
      router.push("/history");
      router.refresh();
    } catch {
      setError(s.errVerifyFailed);
    } finally {
      setPending(false);
    }
  }

  function switchMode() {
    setMode((m) => (m === "upgrade" ? "signin" : "upgrade"));
    setStep("email");
    setCode("");
    setError(null);
  }

  function changeEmail() {
    setStep("email");
    setCode("");
    setError(null);
  }

  const title = mode === "upgrade" ? s.upgradeTitle : s.signInTitle;
  const lead = mode === "upgrade" ? s.upgradeLead : s.signInLead;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{lead}</p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">{s.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              placeholder={s.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              disabled={pending}
            />
          </div>

          {mode === "signin" && isAnonymous && (
            <p className="text-muted-foreground text-xs">{s.signInNote}</p>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? s.sending : s.sendCode}
          </Button>

          {isAnonymous && (
            <div className="text-center">
              <Button type="button" variant="link" size="sm" onClick={switchMode}>
                {mode === "upgrade" ? s.switchToSignIn : s.switchToUpgrade}
              </Button>
            </div>
          )}
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4" noValidate>
          <p className="text-muted-foreground text-center text-sm">
            {s.codeSentLead} <span className="text-foreground font-medium">{sentEmail}</span>
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="code">{s.codeLabel}</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={10}
              placeholder={s.codePlaceholder}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="text-center font-mono text-lg tracking-[0.3em] placeholder:tracking-normal"
              aria-invalid={!!error}
              disabled={pending}
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? s.verifying : s.verify}
          </Button>

          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => sendCode(sentEmail)}
              disabled={pending}
            >
              {s.resend}
            </Button>
            <span className="text-muted-foreground text-xs">·</span>
            <Button type="button" variant="link" size="sm" onClick={changeEmail} disabled={pending}>
              {s.changeEmail}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
