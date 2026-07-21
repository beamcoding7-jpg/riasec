"use client";

import { useState, type FormEvent } from "react";
import { Loader2, MailCheck } from "lucide-react";

import { HexagonMark } from "@/components/HexagonMark";
import { Turnstile } from "@/components/Turnstile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailSchema } from "@/lib/auth/schema";
import { createClient } from "@/lib/supabase/client";
import { strings } from "@/lib/strings";
import { turnstileEnabled } from "@/lib/turnstile";

// โหมด: upgrade = ผูกอีเมลกับ anonymous เดิม (uid ไม่เปลี่ยน ผลตามไป) / signin = เข้าบัญชีเดิม
type Mode = "upgrade" | "signin";

const s = strings.account;

// ฟอร์มเข้าสู่ระบบด้วย magic link — client island เพราะมี state หลายขั้น + เรียก supabase browser client
// flow: กรอกอีเมล → ส่งลิงก์ → ผู้ใช้กดลิงก์ในอีเมล (ไปที่ /auth/confirm verify แล้ว redirect เอง)
// anonymous เริ่มที่โหมด upgrade (ค่าเริ่มต้น) แต่สลับไป signin ได้ถ้ามีบัญชีอยู่แล้ว
export function AuthForm({
  isAnonymous,
  linkError = false,
}: {
  isAnonymous: boolean;
  linkError?: boolean;
}) {
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>(isAnonymous ? "upgrade" : "signin");
  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState(""); // อีเมล normalize แล้วที่ส่งลิงก์ไป (แสดงในหน้ายืนยัน)
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  // linkError = ลิงก์ที่ /auth/confirm verify ไม่ผ่าน (route ส่ง ?error=link กลับมา)
  const [error, setError] = useState<string | null>(linkError ? s.errLinkFailed : null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // ส่งลิงก์เข้าสู่ระบบ — upgrade ใช้ updateUser (ผูกอีเมลกับ uid เดิม), signin ใช้ signInWithOtp
  async function sendLink(targetEmail: string): Promise<boolean> {
    // signInWithOtp คือ endpoint ที่ Supabase CAPTCHA คุม → ต้องมี token เมื่อเปิด Turnstile
    if (turnstileEnabled && mode === "signin" && !captchaToken) {
      setError(strings.common.captchaRequired);
      return false;
    }
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
          options: {
            shouldCreateUser: !isAnonymous,
            captchaToken: captchaToken ?? undefined,
          },
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

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(s.errInvalidEmail);
      return;
    }
    const ok = await sendLink(parsed.data);
    if (ok) {
      setSentEmail(parsed.data);
      setSent(true);
    }
  }

  function switchMode() {
    setMode((m) => (m === "upgrade" ? "signin" : "upgrade"));
    setSent(false);
    setError(null);
  }

  function backToEmail() {
    setSent(false);
    setError(null);
  }

  const title = mode === "upgrade" ? s.upgradeTitle : s.signInTitle;
  const lead = mode === "upgrade" ? s.upgradeLead : s.signInLead;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <div className="space-y-3 text-center">
        <HexagonMark className="mx-auto w-16" />
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">{sent ? s.linkSentTitle : title}</h1>
          <p className="text-muted-foreground text-sm">{sent ? s.linkSentLead : lead}</p>
        </div>
      </div>

      <Card>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSend} className="space-y-4" noValidate>
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

              {/* CAPTCHA เฉพาะ signin (endpoint ที่ Supabase คุม); โผล่เมื่อเปิด flag */}
              {mode === "signin" && <Turnstile onToken={setCaptchaToken} />}

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button type="submit" className="h-11 w-full" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {pending ? s.sending : s.sendLink}
              </Button>

              {isAnonymous && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-11"
                    onClick={switchMode}
                  >
                    {mode === "upgrade" ? s.switchToSignIn : s.switchToUpgrade}
                  </Button>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <span className="bg-accent text-accent-foreground flex size-14 items-center justify-center rounded-full">
                  <MailCheck className="size-7" aria-hidden />
                </span>
              </div>

              <p className="text-muted-foreground text-sm">
                {s.linkSentBody} <span className="text-foreground font-medium">{sentEmail}</span>
              </p>
              <p className="text-muted-foreground text-xs">{s.linkSentHint}</p>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-11"
                  onClick={() => sendLink(sentEmail)}
                  disabled={pending}
                >
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {s.resend}
                </Button>
                <span className="text-muted-foreground text-xs">·</span>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-11"
                  onClick={backToEmail}
                  disabled={pending}
                >
                  {s.changeEmail}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
