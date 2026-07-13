import { Loader2 } from "lucide-react";

import { strings } from "@/lib/strings";

// Loading UI ระดับราก — โชว์ระหว่าง route/RSC กำลังโหลด
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <Loader2 className="text-primary size-8 animate-spin" aria-hidden="true" />
      <p className="text-muted-foreground text-sm">{strings.common.loading}</p>
    </div>
  );
}
