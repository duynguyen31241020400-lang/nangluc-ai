import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ErrorBoundary from "@/src/components/ui/ErrorBoundary";
import FeedbackButton from "@/src/components/ui/FeedbackButton";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "NangLuc AI - Học tập thích ứng",
  description: "Nền tảng học tập AI dành cho học sinh K-12 Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
          <FeedbackButton />
        </ErrorBoundary>
      </body>
    </html>
  );
}
