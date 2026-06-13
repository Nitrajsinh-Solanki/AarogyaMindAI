import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AarogyaMind — Your Calm in Exam Chaos",
  description:
    "AI-powered mental wellness companion for NEET, JEE, UPSC, CAT, GATE students. Daily mood check-ins, AI support, and weekly insights.",
  keywords: [
    "NEET wellness",
    "JEE mental health",
    "UPSC stress management",
    "student mental health AI",
    "exam stress",
    "AarogyaMind",
  ],
  authors: [{ name: "AarogyaMind" }],
  openGraph: {
    title: "AarogyaMind — Your Calm in Exam Chaos",
    description:
      "AI-powered mental wellness companion for competitive exam students.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AarogyaMind — Your Calm in Exam Chaos",
    description:
      "AI-powered mental wellness companion for competitive exam students.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AarogyaMind",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        {children}
      </body>
    </html>
  );
}
