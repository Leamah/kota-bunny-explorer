import type { Metadata } from 'next';
import Link from 'next/link';
import { ENDPOINT, PROJECT_ID, DATABASE_ID } from '../../../lib/appwrite';
import CityVendorGrid from './CityVendorGrid';

export const revalidate = 86400;

const API_KEY = process.env.APPWRITE_API_KEY ?? '';
const serverHeaders = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

const KOTA_CITIES: Record<string, { display: string; description: string; bunnyCity?: string }> = {
  soweto: {
    display: 'Soweto',
    description: "Soweto is the birthplace of the Kota. From Orlando to Vilakazi Street, the townships of Soweto have been serving the ultimate quarter-loaf street food for decades. Find the most-loved, community-rated kota spots in the township that started it all.",
    bunnyCity: 'johannesburg',
  },
  johannesburg: {
    display: 'Johannesburg',
    description: "Johannesburg is a melting pot of Kota culture. From the CBD to the suburbs, Joburg's kota spots serve everything from the classic Number 1 to the fully loaded AK-47. Discover the best kota street food in the City of Gold.",
    bunnyCity: 'johannesburg',
  },
  pretoria: {
    display: 'Pretoria',
    description: "Pretoria's kota scene stretches from Mamelodi to Soshanguve and beyond. The Jacaranda City has some of the best-rated kota spots in Gauteng. Find your next favourite kota in Tshwane.",
    bunnyCity: 'pretoria',
  },
  soshanguve: {
    display: 'Soshanguve',
    description: "Soshanguve is legendary for its kota culture. The township north of Pretoria has produced some of Gauteng's most iconic kota spots. Find the best community-rated kota in Soshanguve.",
    bunnyCity: undefined,
  },
  tembisa: {
    display: 'Tembisa',
    description: "Tembisa, one of Ekurhuleni's largest townships, has a thriving kota street food scene. Discover top-rated kota spots serving the Midrand and East Rand communities.",
    bunnyCity: undefined,
  },
  alexandra: {
    display: 'Alexandra',
    description: "Alexandra (Alex) sits in the heart of Johannesburg and has deep kota street food roots. Find the best kota spots in one of Joburg's most vibrant communities.",
    bunnyCity: 'johannesburg',
  },
  vosloorus: {
    display: 'Vosloorus',
    description: "Vosloorus on the East Rand is home to some of Ekurhuleni's favourite kota spots. Discover top-rated community-approved kota street food near Boksburg.",
    bunnyCity: undefined,
  },
  katlehong: {
    display: 'Katlehong',
    description: "Katlehong on the East Rand has a proud kota street food tradition. Find the best kota spots in this East Rand township near Germiston.",
    bunnyCity: undefined,
  },
  mamelodi: {
    display: 'Mamelodi',
    description: "Mamelodi, Pretoria's largest township, is home to a vibrant kota culture. Discover the top-rated kota spots serving the Mamelodi community.",
    bunnyCity: 'pretoria',
  },
  ekurhuleni: {
    display: 'Ekurhuleni',
    description: "The Ekurhuleni Metro — spanning Germiston, Boksburg, Benoni and beyond — has a growing kota street food scene. Find the best community-rated kota spots on the East Rand.",
    bunnyCity: undefined,
  },
};

interface VendorDoc {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  price_range: string;
  photos: string;
}

async function getCityVendors(citySlug: string): Promise<VendorDoc[]> {
  try {
    const queries = [
      JSON.stringify({ method: 'equal', attribute: 'is_vetted', values: [true] }),
      JSON.stringify({ method: 'equal', attribute: 'category', values: ['kota'] }),
      JSON.stringify({ method: 'limit', values: [100] }),
    ];
    const params = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents?${params}`,
      { headers: serverHeaders, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const cityName = KOTA_CITIES[citySlug]?.display.toLowerCase() ?? citySlug;
    return (data.documents ?? []).filter((v: VendorDoc) =>
      v.address.toLowerCase().includes(citySlug.replace('-', ' ')) ||
      v.address.toLowerCase().includes(cityName)
    );
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return Object.keys(KOTA_CITIES).map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const info = KOTA_CITIES[city];
  if (!info) return { title: 'Kota Spots' };

  const title = `Best Kota in ${info.display} | Kota & Bunny Explorer`;
  const description = `Find the best kota in ${info.display}, South Africa. Community-rated kota street food spots in ${info.display}. ${info.description.slice(0, 100)}...`;

  return {
    title,
    description,
    keywords: [
      `best kota in ${info.display}`,
      `kota ${info.display}`,
      `kota street food ${info.display}`,
      'best kota in South Africa',
      'kota near me',
    ],
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://www.kotabunny.co.za/kota/${city}` },
  };
}

export default async function KotaCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const info = KOTA_CITIES[city];

  if (!info) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="heading-bold text-3xl text-gray-300 mb-2">City not found</h1>
        <Link href="/kota" className="text-mzansi-teal hover:underline font-sans">← All Kota Spots</Link>
      </div>
    );
  }

  const vendors = await getCityVendors(city);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Kota in ${info.display}`,
    description: info.description,
    url: `https://www.kotabunny.co.za/kota/${city}`,
    numberOfItems: vendors.length,
    itemListElement: vendors.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.name,
      url: `https://www.kotabunny.co.za/vendor/${v.$id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm font-sans text-gray-500 mb-6 flex gap-2 items-center">
          <Link href="/" className="hover:text-mzansi-teal">Home</Link>
          <span>›</span>
          <Link href="/kota" className="hover:text-mzansi-teal">Kota Spots</Link>
          <span>›</span>
          <span className="text-mzansi-black">{info.display}</span>
        </nav>

        <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-3">
          Best Kota in {info.display}
        </h1>
        <p className="text-gray-600 font-sans mb-4 max-w-2xl">{info.description}</p>
        <p className="text-gray-500 font-sans text-sm mb-6">
          {vendors.length > 0
            ? `${vendors.length} community-rated kota spot${vendors.length !== 1 ? 's' : ''} found in ${info.display}`
            : `Be the first to add a kota spot in ${info.display}`}
        </p>
        <div className="ndebele-border mb-8" />

        <CityVendorGrid vendors={vendors} city={info.display} />

        {/* Internal links */}
        <section className="mt-16 p-6 bg-white rounded-2xl shadow-sm">
          <h2 className="heading-bold text-xl text-mzansi-black mb-4">Explore More Kota & Street Food</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-2">More Kota Cities</p>
              <ul className="space-y-1">
                {Object.entries(KOTA_CITIES)
                  .filter(([slug]) => slug !== city)
                  .slice(0, 4)
                  .map(([slug, c]) => (
                    <li key={slug}>
                      <Link href={`/kota/${slug}`} className="text-mzansi-teal hover:underline">
                        Best Kota in {c.display}
                      </Link>
                    </li>
                  ))}
                <li><Link href="/kota" className="text-mzansi-teal hover:underline">All Kota Spots in South Africa</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Kota Resources</p>
              <ul className="space-y-1">
                <li><Link href="/recipes" className="text-mzansi-teal hover:underline">Easy Kota Recipes</Link></li>
                <li><Link href="/articles/what-is-a-kota" className="text-mzansi-teal hover:underline">What is a Kota?</Link></li>
                <li><Link href="/articles/best-kota-fillings" className="text-mzansi-teal hover:underline">Best Kota Fillings & Ingredients</Link></li>
                <li><Link href="/submit" className="text-mzansi-teal hover:underline">Submit a Kota Spot</Link></li>
                {info.bunnyCity && (
                  <li>
                    <Link href={`/bunny-chow/${info.bunnyCity}`} className="text-mzansi-teal hover:underline">
                      Bunny Chow in {info.display}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* SEO content */}
        <section className="mt-12 border-t border-gray-200 pt-10">
          <h2 className="heading-bold text-2xl text-mzansi-black mb-4">Kota Street Food in {info.display}</h2>
          <div className="text-gray-600 font-sans space-y-4 max-w-3xl">
            <p>{info.description}</p>
            <p>
              A <strong>Kota</strong> is a quarter loaf of white bread hollowed out and filled with hot chips, polony,
              Russian sausage, atchar, cheese, and any combination of fillings your heart desires. Whether you want a
              simple <strong>Number 1</strong> or a fully-loaded <strong>AK-47</strong>, {info.display} has you covered.
            </p>
            <p>
              All spots on Kota & Bunny Explorer are community-rated with a minimum of 4.0 stars and 10+ reviews.
              Only the best <strong>kota street food in {info.display}</strong> makes the cut.
            </p>
            <h3 className="heading-bold text-xl text-mzansi-black mt-6">Common Kota Fillings</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Kota ingredients:</strong> chips, polony, Russian sausage, atchar, cheese, egg</li>
              <li><strong>Number 1:</strong> Chips + Polony + Atchar — the classic easy kota recipe</li>
              <li><strong>AK-47:</strong> Chips + Russian + Polony + Cheese + Atchar + Egg</li>
              <li><strong>Full House:</strong> Everything in the shop, piled high</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
