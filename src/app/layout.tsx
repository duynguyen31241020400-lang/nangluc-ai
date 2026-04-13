import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import ErrorBoundary from "@/src/components/ui/ErrorBoundary";
import FeedbackButton from "@/src/components/ui/FeedbackButton";

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
          <FeedbackButton />
        </ErrorBoundary>
        <Script id="lumiq-service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').catch(function () {
                  // Competition prototype: best effort only.
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
