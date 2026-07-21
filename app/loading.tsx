import { HexagonMark } from "@/components/HexagonMark";
import { strings } from "@/lib/strings";

// Loading UI ระดับราก — หกเหลี่ยม RIASEC เต้นเป็น loader ประจำแบรนด์ (แทน spinner ทั่วไป)
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <HexagonMark pulse className="w-16" />
      <p className="text-muted-foreground text-sm">{strings.common.loading}</p>
    </div>
  );
}
