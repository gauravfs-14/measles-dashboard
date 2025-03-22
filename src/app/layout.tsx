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
  title: "Texas Measles Outbreak (2025) Dashboard",
  description:
    "A comprehensive dashboard application for visualizing and analyzing measles outbreak data. This project provides public health officials, researchers, and the general public with up-to-date information on measles cases, vaccination rates, and outbreak predictions.",
  openGraph: {
    title: "Texas Measles Outbreak (2025) Dashboard",
    description:
      "A comprehensive dashboard application for visualizing and analyzing measles outbreak data. This project provides public health officials, researchers, and the general public with up-to-date information on measles cases, vaccination rates, and outbreak predictions.",
    images: [
      {
        url: "/og-img.png",
        width: 1200,
        height: 630,
        alt: "Texas Measles Dashboard Preview",
      },
    ],
  },
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
