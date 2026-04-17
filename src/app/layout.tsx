import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

import ErrorBoundary from "@/src/components/ui/ErrorBoundary";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumiq AI | Competition Prototype",
  description: "Prototype đánh giá năng lực và gợi ý lộ trình học Toán lớp 10 cho IU Startup Demo Day 2026.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#881337" />
      </head>
      <body className={`${inter.className} ${fraunces.variable} bg-[var(--background)] text-[var(--foreground)]`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
