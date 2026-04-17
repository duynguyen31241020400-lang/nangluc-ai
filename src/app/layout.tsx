import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ErrorBoundary from "@/src/components/ui/ErrorBoundary";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Lumiq AI | Competition Prototype",
  description: "Prototype đánh giá năng lực và gợi ý lộ trình học Toán lớp 10 cho IU Startup Demo Day 2026.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
