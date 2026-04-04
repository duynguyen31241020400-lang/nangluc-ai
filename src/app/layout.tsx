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
      <head><script type='text/javascript' nonce='cix+cTFmtHKSKDtvN6OooA==' src='https://aistudio.google.com/js8RjBJ97T5-sBc-oz0Y85k-aHqL7--W6bq4gHGDaxXrtTJLCM6cx12k-T6HfciIH566hGJGZXHN7Hchn5Qg3ZTMXKqRuD0rrnCxOcSr2JqK2I_kvD1q8q0J_O6XcrS0HiUYeaFNFcyKey643hQtCyJz9wS6MTEv_SuwQcSSMv5CYqZo_7dRBg77PqNY-q8Yp_dzz4i_gzmet2dWTc2OLwYgB-W5nTPK9O8CyTu3-_OPHnKoygPs6l2Bp_sGuVkfLD-MTGVzeTbu-UxFj2MBK_1oQiis34Ri_jvdJ2k0uJKl19OR-EYsE8-oncJbMiNMiGx0qBYWZUowLdb56mnvyP60f1c8AX49tf4Fy2e3DV8pRuS8xe-62txxdi__KA4AaBduGq2wYKxSoFM3lZP2X92GRMVCqjnUNrfLwZw2KvxD5SNsZMV35OVTyEJRhSe1zYqW-Nw8I5aTmMiSGcQ6VXnj1NowwRpzP-FQHH2OBGV4xCEuBQMMsR4He3y8m1I1DQRgvIJW5T5Ctrp5NzauXJi9szVVO3p4djbl1UnYTw2MzajFs7ahNDOjuivGZAQnrYfFVgS_3nTsjdirdM5rjt_OJw3Sau6B_5ZbAvwips7Naxgl-g'></script>
        <link rel="manifest" href="/manifest.json"/>
        <meta name="theme-color" content="#2563eb"/>
        <script dangerouslysetinnerhtml="{{" __html:="" `="" if="" ('serviceworker'="" in="" navigator)="" {="" window.addeventlistener('load',="" function()="" {="" navigator.serviceworker.register('="" sw.js');="" });="" }="" `,="" }}=""/>
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
