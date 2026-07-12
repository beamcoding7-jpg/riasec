"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

import { deleteAccount } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";

// ปุ่มลบบัญชี — บังคับติ๊กยืนยันก่อน (กันลบพลาด) แล้วเรียก Server Action (service_role)
// สำเร็จ → action redirect ออกไปเอง; ล้มเหลว → แสดง error inline
export function DeleteAccountButton() {
  const [confirmed, setConfirmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="accent-destructive mt-0.5 size-4"
        />
        <span>{strings.account.dangerConfirm}</span>
      </label>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button
        variant="destructive"
        className="h-11 w-full"
        disabled={!confirmed || pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            try {
              await deleteAccount();
            } catch {
              setError(strings.common.error);
            }
          })
        }
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? strings.account.deleting : strings.account.dangerButton}
      </Button>
    </div>
  );
}
