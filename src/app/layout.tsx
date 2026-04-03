import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
});

export const metadata: Metadata = {
  title: "WorthAI — Know your numbers. Own your future.",
  description: "A context-aware AI financial advisor that knows your exact income, expenses, debts, and savings.",
  icons: {
    icon: "/icon.svg",
  },
  keywords: ["finance", "AI advisor", "budgeting", "financial health", "WorthAI"],
  openGraph: {
    title: "WorthAI | Know your numbers. Own your future.",
    description: "Meet your personal AI financial advisor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${josefin.variable} h-full dark`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5699722362845664"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-background text-foreground font-josefin min-h-screen flex flex-col selection:bg-primary/30">
        <div className="noise-overlay" />
        <div className="mesh-gradient" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
