import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppwritePing from "./components/AppwritePing";
import Navbar from "./components/Navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kotabunny.co.za"),
  title: {
    default: "Kota & Bunny Explorer | Best Kota Street Food in South Africa",
    template: "%s | Kota & Bunny Explorer",
  },
  description:
    "Find the best Kota street food and Bunny Chow spots across South Africa. Community-rated, street-approved. Discover top-rated Kota in Soweto, Soshanguve, Johannesburg and Bunny Chow in Durban.",
  keywords: [
    "best kota in South Africa",
    "best kota near me",
    "kota street food",
    "kota recipe easy",
    "kota ingredients",
    "best kota in Soweto",
    "best kota in Soshanguve",
    "Bunny Chow Durban",
    "South African street food",
    "township food guide",
  ],
  openGraph: {
    siteName: "Kota & Bunny Explorer",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Kota & Bunny Explorer — South Africa's Street Food Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KotaBunnyZA",
  },
  alternates: {
    canonical: "https://www.kotabunny.co.za",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.kotabunny.co.za/#organization",
      name: "Kota & Bunny Explorer",
      url: "https://www.kotabunny.co.za",
      description:
        "South Africa's community-rated street food directory for Kota and Bunny Chow. Find the best kota street food and bunny chow spots across Mzansi.",
      areaServed: { "@type": "Country", name: "South Africa" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.kotabunny.co.za/#website",
      url: "https://www.kotabunny.co.za",
      name: "Kota & Bunny Explorer",
      publisher: { "@id": "https://www.kotabunny.co.za/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.kotabunny.co.za/kota?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AppwritePing />
        <div className="ndebele-border" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-mzansi-black text-white py-8">
          <div className="ndebele-border mb-6" />
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-sm font-sans text-gray-400">
              <div>
                <p className="heading-bold text-mzansi-yellow text-lg mb-2">Kota & Bunny Explorer</p>
                <p>South Africa&apos;s community-rated kota street food and bunny chow directory.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Explore</p>
                <ul className="space-y-1">
                  <li><Link href="/kota" className="hover:text-mzansi-yellow transition">Best Kota Spots</Link></li>
                  <li><Link href="/bunny-chow" className="hover:text-mzansi-yellow transition">Best Bunny Chow</Link></li>
                  <li><Link href="/recipes" className="hover:text-mzansi-yellow transition">Recipes</Link></li>
                  <li><Link href="/articles" className="hover:text-mzansi-yellow transition">Street Food Guides</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Top Cities</p>
                <ul className="space-y-1">
                  <li><Link href="/kota/soweto" className="hover:text-mzansi-yellow transition">Kota in Soweto</Link></li>
                  <li><Link href="/kota/soshanguve" className="hover:text-mzansi-yellow transition">Kota in Soshanguve</Link></li>
                  <li><Link href="/bunny-chow/durban" className="hover:text-mzansi-yellow transition">Bunny Chow in Durban</Link></li>
                  <li><Link href="/submit" className="hover:text-mzansi-yellow transition">Submit a Spot</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4 text-center text-gray-500 text-xs font-sans">
              Made with love for Mzansi street food culture
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
