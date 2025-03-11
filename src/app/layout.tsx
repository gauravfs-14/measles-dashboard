import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MapDataProvider } from "@/context/MapDataContext";
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
  title: "Texas Measles Dashboard (2025)",
  description:
    "Interactive dashboard showing measles cases and vaccination rates across Texas counties in 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MapDataProvider>{children}</MapDataProvider>
      </body>
    </html>
  );
}
