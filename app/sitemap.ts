import type { MetadataRoute } from "next";

import { createAnonClient } from "@/lib/supabase/anon";
import { siteUrl } from "@/lib/site";

// sitemap.xml — หน้า static + slug อาชีพ/สาขาทั้งหมด (ให้ crawler เจอหน้า detail)
// ใช้ anon client อ่าน slug สาธารณะ (ไม่ผูก cookie)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAnonClient();
  const [{ data: careers }, { data: majors }] = await Promise.all([
    supabase.from("careers").select("slug"),
    supabase.from("majors").select("slug"),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/privacy",
    "/universities",
    "/test",
  ].map((path) => ({ url: `${siteUrl}${path}`, lastModified: now }));

  const careerRoutes: MetadataRoute.Sitemap = (careers ?? [])
    .filter((c): c is { slug: string } => Boolean(c.slug))
    .map((c) => ({ url: `${siteUrl}/careers/${c.slug}`, lastModified: now }));

  const majorRoutes: MetadataRoute.Sitemap = (majors ?? [])
    .filter((m): m is { slug: string } => Boolean(m.slug))
    .map((m) => ({ url: `${siteUrl}/majors/${m.slug}`, lastModified: now }));

  return [...staticRoutes, ...careerRoutes, ...majorRoutes];
}
