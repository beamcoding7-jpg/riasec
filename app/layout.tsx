import type { Metadata } from "next";
import { Noto_Sans_Thai, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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

export const metadata: Metadata = {
  title: {
    default: "RIASEC — ค้นหาตัวเอง ค้นหาอนาคต",
    template: "%s · RIASEC",
  },
  description:
    "แบบทดสอบค้นหาตัวเองตามทฤษฎี Holland RIASEC สำหรับนักเรียน ม.3–ม.6 พร้อมแนะนำสายการเรียน อาชีพ และมหาวิทยาลัยที่เหมาะกับคุณ",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
