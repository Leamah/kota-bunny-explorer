import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppwritePing from "./components/AppwritePing";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kota & Bunny Explorer | Find the Best Street Food in Mzansi",
  description:
    "Discover the best Kota spots and Bunny Chow joints across South Africa. Community-rated, street-approved.",
  keywords: [
    "Best Kota in Johannesburg",
    "Best Kota in Soshanguve",
    "Bunny Chow Durban",
    "South African street food",
    "township food guide",
  ],
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
      <body className="min-h-full flex flex-col bg-mzansi-cream text-mzansi-black">
        <AppwritePing />
        <div className="ndebele-border" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-mzansi-black text-white py-8">
          <div className="ndebele-border mb-6" />
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="heading-bold text-mzansi-yellow text-lg">
              Kota &amp; Bunny Explorer
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Made with love for Mzansi street food culture
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
