import { strings } from "@/lib/strings";

import { RecommendationCard, type Recommendation } from "./RecommendationCard";

// หมวดคำแนะนำ 1 หมวด (สาย / อาชีพ / สาขา) — หัวข้อ + list การ์ด + empty state
type Props = {
  title: string;
  description?: string;
  items: Recommendation[];
};

export function RecommendationSection({ title, description, items }: Props) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-sm">
          {strings.results.emptyRecs}
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      )}
    </section>
  );
}
