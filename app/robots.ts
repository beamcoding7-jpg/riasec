import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

// robots.txt — อนุญาต crawl เนื้อหาสาธารณะ, กันหน้าข้อมูลผู้ใช้ (บัญชี/ประวัติ/ผลรายบุคคล)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/history", "/results/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
