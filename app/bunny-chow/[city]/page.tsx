import type { Metadata } from 'next';
import Link from 'next/link';
import { ENDPOINT, PROJECT_ID, DATABASE_ID } from '../../../lib/appwrite';
import BunnyCityVendorGrid from './CityVendorGrid';

export const revalidate = 86400;

const API_KEY = process.env.APPWRITE_API_KEY ?? '';
const serverHeaders = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

const BUNNY_CITIES: Record<string, { display: string; description: string; kotaCity?: string }> = {
  durban: {
    display: 'Durban',
    description: "Durban is the undisputed home of Bunny Chow. Born in the Indian community of KwaZulu-Natal, the bunny has been a Durban institution since the 1940s. From Grey Street to the beachfront, find the most-loved, community-rated bunny chow spots in eThekwini.",
    kotaCity: undefined,
  },
  johannesburg: {
    display: 'Johannesburg',
    description: "Joburg's bunny chow scene has exploded in recent years. From authentic curry houses to street-food stalls, the City of Gold now rivals Durban for the best bunny chow outside KZN. Discover top-rated bunny chow spots in Johannesburg.",
    kotaCity: 'johannesburg',
  },
  'cape-town': {
    display: 'Cape Town',
    description: "Cape Town has embraced bunny chow as part of its diverse street food culture. From the Cape Malay Quarter to the CBD, find the best bunny chow in the Mother City.",
    kotaCity: undefined,
  },
  pretoria: {
    display: 'Pretoria',
    description: "Pretoria's bunny chow spots bring Durban flavour to the Jacaranda City. Find community-rated mutton, chicken and bean bunny chow spots in Tshwane.",
    kotaCity: 'pretoria',
  },
  pietermaritzburg: {
    display: 'Pietermaritzburg',
    description: "Pietermaritzburg, the capital of KwaZulu-Natal, has a rich bunny chow tradition deeply connected to its Indian heritage. Find the best bunny chow in Msunduzi.",
    kotaCity: undefined,
  },
  phoenix: {
    display: 'Phoenix',
    description: "Phoenix, north of Durban, is home to some of KwaZulu-Natal's most authentic bunny chow joints. Find the best community-rated bunny chow spots in Phoenix.",
    kotaCity: undefined,
  },
  chatsworth: {
    display: 'Chatsworth',
    description: "Chatsworth in Durban South is legendary for its bunny chow culture. The township's Indian community has perfected the art of the bunny over generations.",
    kotaCity: undefined,
  },
  bluff: {
    display: 'Bluff',
    description: "The Bluff in Durban South has some of the most beloved bunny chow spots in KwaZulu-Natal. Find top-rated mutton and chicken bunny chow in Bluff.",
    kotaCity: undefined,
  },
  tongaat: {
    display: 'Tongaat',
    description: "Tongaat on the KwaZulu-Natal North Coast has a proud bunny chow heritage. Discover the best bunny chow spots in this coastal town north of Durban.",
    kotaCity: undefined,
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
      JSON.stringify({ method: 'equal', attribute: 'category', values: ['bunny-chow'] }),
      JSON.stringify({ method: 'limit', values: [100] }),
    ];
    const params = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents?${params}`,
      { headers: serverHeaders, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const cityName = BUNNY_CITIES[citySlug]?.display.toLowerCase() ?? citySlug;
    return (data.documents ?? []).filter((v: VendorDoc) =>
      v.address.toLowerCase().includes(citySlug.replace('-', ' ')) ||
      v.address.toLowerCase().includes(cityName)
    );
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return Object.keys(BUNNY_CITIES).map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const info = BUNNY_CITIES[city];
  if (!info) return { title: 'Bunny Chow Spots' };

  const title = `Best Bunny Chow in ${info.display} | Kota & Bunny Explorer`;
  const description = `Find the best bunny chow in ${info.display}, South Africa. Community-rated bunny chow spots in ${info.display}. ${info.description.slice(0, 100)}...`;

  return {
    title,
    description,
    keywords: [
      `best bunny chow in ${info.display}`,
      `bunny chow ${info.display}`,
      `bunny chow near me`,
      'South African street food',
      'Durban bunny chow',
    ],
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://www.kotabunny.co.za/bunny-chow/${city}` },
  };
}

export default async function BunnyCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const info = BUNNY_CITIES[city];

  if (!info) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="heading-bold text-3xl text-gray-300 mb-2">City not found</h1>
        <Link href="/bunny-chow" className="text-mzansi-teal hover:underline font-sans">← All Bunny Chow Spots</Link>
      </div>
    );
  }

  const vendors = await getCityVendors(city);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Bunny Chow in ${info.display}`,
    description: info.description,
    url: `https://www.kotabunny.co.za/bunny-chow/${city}`,
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
        <nav className="text-sm font-sans text-gray-500 mb-6 flex gap-2 items-center">
          <Link href="/" className="hover:text-mzansi-teal">Home</Link>
          <span>›</span>
          <Link href="/bunny-chow" className="hover:text-mzansi-teal">Bunny Chow Spots</Link>
          <span>›</span>
          <span className="text-mzansi-black">{info.display}</span>
        </nav>

        <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-3">
          Best Bunny Chow in {info.display}
        </h1>
        <p className="text-gray-600 font-sans mb-4 max-w-2xl">{info.description}</p>
        <p className="text-gray-500 font-sans text-sm mb-6">
          {vendors.length > 0
            ? `${vendors.length} community-rated bunny chow spot${vendors.length !== 1 ? 's' : ''} in ${info.display}`
            : `Be the first to add a bunny chow spot in ${info.display}`}
        </p>
        <div className="ndebele-border mb-8" />

        <BunnyCityVendorGrid vendors={vendors} city={info.display} />

        <section className="mt-16 p-6 bg-white rounded-2xl shadow-sm">
          <h2 className="heading-bold text-xl text-mzansi-black mb-4">Explore More Bunny Chow & Street Food</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-2">More Bunny Chow Cities</p>
              <ul className="space-y-1">
                {Object.entries(BUNNY_CITIES)
                  .filter(([slug]) => slug !== city)
                  .slice(0, 4)
                  .map(([slug, c]) => (
                    <li key={slug}>
                      <Link href={`/bunny-chow/${slug}`} className="text-mzansi-teal hover:underline">
                        Best Bunny Chow in {c.display}
                      </Link>
                    </li>
                  ))}
                <li><Link href="/bunny-chow" className="text-mzansi-teal hover:underline">All Bunny Chow in South Africa</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Bunny Chow Resources</p>
              <ul className="space-y-1">
                <li><Link href="/recipes" className="text-mzansi-teal hover:underline">Bunny Chow Recipes</Link></li>
                <li><Link href="/articles/bunny-chow-history" className="text-mzansi-teal hover:underline">History of Bunny Chow</Link></li>
                <li><Link href="/articles/kota-vs-bunny-chow" className="text-mzansi-teal hover:underline">Kota vs Bunny Chow</Link></li>
                <li><Link href="/submit" className="text-mzansi-teal hover:underline">Submit a Bunny Chow Spot</Link></li>
                {info.kotaCity && (
                  <li>
                    <Link href={`/kota/${info.kotaCity}`} className="text-mzansi-teal hover:underline">
                      Kota in {info.display}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 border-t border-gray-200 pt-10">
          <h2 className="heading-bold text-2xl text-mzansi-black mb-4">Bunny Chow in {info.display}</h2>
          <div className="text-gray-600 font-sans space-y-4 max-w-3xl">
            <p>{info.description}</p>
            <p>
              A <strong>Bunny Chow</strong> is a hollowed-out loaf of bread filled with rich, spicy curry — mutton,
              chicken, or bean. The bread soaks up the gravy, creating layers of flavour. Whether you want a
              classic <strong>mutton bunny</strong> or a vegetarian <strong>bean bunny</strong>, {info.display}&apos;s
              best spots have you covered.
            </p>
            <h3 className="heading-bold text-xl text-mzansi-black mt-6">Types of Bunny Chow</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Mutton Bunny:</strong> The Durban classic — slow-cooked mutton curry in a half-loaf</li>
              <li><strong>Chicken Bunny:</strong> Tender chicken in fragrant curry sauce</li>
              <li><strong>Bean Bunny:</strong> Sugar beans in spiced gravy — the vegetarian favourite</li>
              <li><strong>Quarter / Half / Full:</strong> Sizes based on the portion of bread used</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
