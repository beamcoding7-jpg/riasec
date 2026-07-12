import { Card, CardContent } from "@/components/ui/card";
import { strings } from "@/lib/strings";

type Props = { text: string };

// การ์ดแสดงคำถามหนึ่งข้อ (กิจกรรมจาก O*NET แปลไทย) + prompt กำกับ
export function QuestionCard({ text }: Props) {
  return (
    <Card className="w-full [--card-spacing:--spacing(6)]">
      <CardContent className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm">{strings.test.prompt}</p>
        <p className="text-xl font-semibold text-balance sm:text-2xl">{text}</p>
      </CardContent>
    </Card>
  );
}
