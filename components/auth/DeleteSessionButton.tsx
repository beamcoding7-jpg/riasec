"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { deleteSession } from "@/app/history/actions";
import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";

// ปุ่มลบผลรายรายการ — กดครั้งแรกเผยยืนยัน inline (ไม่ใช้ window.confirm), กดยืนยันจึงลบจริง
export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          className="h-11"
          disabled={pending}
          onClick={() => startTransition(async () => void (await deleteSession(sessionId)))}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : strings.history.delete}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-11"
          disabled={pending}
          onClick={() => setConfirming(false)}
        >
          {strings.common.cancel}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="size-11"
      aria-label={strings.history.delete}
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
