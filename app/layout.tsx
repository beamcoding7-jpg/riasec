import type { Metadata } from "next";
import { Noto_Sans_Thai, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { strings } from "@/lib/strings";

// ฟอนต์ไทยหลัก (self-host โดย next/font) — ผูกกับ --font-sans ที่ theme ใช้
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  display: "swap",
});

// ฟอนต์ mono สำหรับตัวเลข/โค้ด (เช่น คะแนน RIASEC)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const defaultTitle = "RIASEC — ค้นหาตัวเอง ค้นหาอนาคต";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s · RIASEC",
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName,
    title: defaultTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${notoSansThai.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip link (a11y) — ข้ามแถบนำทางไปเนื้อหาหลักด้วยคีย์บอร์ด */}
          <a
            href="#main-content"
            className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:outline-none"
          >
            {strings.a11y.skipToContent}
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
