import "./globals.css";
import { readDB } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function generateMetadata() { const s = readDB().settings; return { title: `${s.storeName} | سوبر ماركت أونلاين`, description: s.tagline }; }
export default function RootLayout({ children }) {
  const s = readDB().settings;
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ "--c": s.color }}>{children}</body>
    </html>
  );
}
