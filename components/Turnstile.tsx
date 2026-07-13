"use client";

import { useCallback, useRef } from "react";
import Script from "next/script";

import { turnstileSiteKey } from "@/lib/turnstile";

// Type ย่อของ Cloudflare Turnstile JS API (เท่าที่ใช้)
type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "auto" | "light" | "dark";
      size?: "normal" | "flexible" | "compact";
    },
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

// Widget Turnstile ที่ใช้ซ้ำได้ — ส่ง token กลับผ่าน onToken (null = ยังไม่ได้/หมดอายุ)
// เรนเดอร์เฉพาะเมื่อมี site key (flag เปิด) มิฉะนั้นคืน null
export function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  const renderWidget = useCallback(() => {
    if (rendered.current || !containerRef.current || !window.turnstile || !turnstileSiteKey) return;
    rendered.current = true;
    window.turnstile.render(containerRef.current, {
      sitekey: turnstileSiteKey,
      theme: "auto",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
  }, [onToken]);

  if (!turnstileSiteKey) return null;

  return (
    <>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" onReady={renderWidget} />
      <div ref={containerRef} className="flex min-h-[65px] justify-center" />
    </>
  );
}
