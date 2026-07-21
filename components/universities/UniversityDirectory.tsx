"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ExternalLink, Search, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { regionOfProvince, REGIONS, type Region } from "@/lib/th/regions";
import { strings } from "@/lib/strings";
import { cn } from "@/lib/utils";

// เฉพาะฟิลด์ที่หน้า directory ใช้ (ตรงกับ select ใน page.tsx)
type Uni = {
  name: string;
  slug: string;
  province: string | null;
  type: string | null;
  is_featured: boolean;
  website: string | null;
};

const s = strings.universities;

// island: ค้นชื่อ + กรองตามประเภท แล้วจัดกลุ่มตามภูมิภาค (client เพราะ interactive)
export function UniversityDirectory({ universities }: { universities: Uni[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  // ประเภทที่มีจริงในข้อมูล (chips สำหรับกรอง)
  const types = useMemo(
    () => Array.from(new Set(universities.map((u) => u.type).filter(Boolean) as string[])),
    [universities],
  );

  // filter → group by region → เรียง featured ก่อนในแต่ละกลุ่ม
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = universities.filter((u) => {
      if (type !== "all" && u.type !== type) return false;
      if (q && !u.name.toLowerCase().includes(q)) return false;
      return true;
    });

    const byRegion = new Map<Region | "other", Uni[]>();
    for (const u of filtered) {
      const r = regionOfProvince(u.province) ?? "other";
      const arr = byRegion.get(r) ?? [];
      arr.push(u);
      byRegion.set(r, arr);
    }
    for (const arr of byRegion.values()) {
      arr.sort(
        (a, b) =>
          Number(b.is_featured) - Number(a.is_featured) || a.name.localeCompare(b.name, "th"),
      );
    }

    const order: (Region | "other")[] = [...REGIONS, "other"];
    return order
      .filter((r) => byRegion.has(r))
      .map((r) => ({ region: r, items: byRegion.get(r)! }));
  }, [universities, query, type]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="space-y-6">
      {/* ค้นหา + กรองประเภท */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            inputMode="search"
            placeholder={s.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label={s.searchPlaceholder}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={type === "all"} onClick={() => setType("all")}>
            {s.filterAll}
          </FilterChip>
          {types.map((t) => (
            <FilterChip key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </FilterChip>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          {total} {s.countSuffix}
        </p>
      </div>

      {total === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
          {s.empty}
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.region} className="space-y-3">
              <h2 className="text-muted-foreground text-sm font-semibold">
                {strings.regions[g.region]} · {g.items.length}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {g.items.map((u) => (
                  <UniversityCard key={u.slug} u={u} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-11 rounded-full border px-4 text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card hover:bg-muted border-border",
      )}
    >
      {children}
    </button>
  );
}

function UniversityCard({ u }: { u: Uni }) {
  return (
    <Card size="sm" className={cn(u.is_featured && "bg-spark/5 ring-spark/30")}>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <p className="leading-tight font-medium">{u.name}</p>
            <p className="text-muted-foreground text-xs">
              {[u.province, u.type].filter(Boolean).join(" · ")}
            </p>
          </div>
          {u.is_featured && (
            <span className="bg-spark text-spark-foreground inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
              <Star className="size-3" />
              {s.featured}
            </span>
          )}
        </div>
        {u.website && (
          <a
            href={u.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link inline-flex min-h-11 items-center gap-1 text-xs hover:underline"
          >
            {s.visitSite}
            <ExternalLink className="size-3" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
