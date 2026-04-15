import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MK Netters & MK Dons Tournament",
  description:
    "Live standings, results and fixtures for the MK Netters & MK Dons weekend tournament.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mk-cream text-mk-ink dark:bg-[#070b15] dark:text-zinc-100">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
