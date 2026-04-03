import type { Metadata } from 'next';
import Link from 'next/link';
import VendorList from '../components/VendorList';
import SearchFilter from '../components/SearchFilter';

export const metadata: Metadata = {
  title: 'Best Kota Spots in South Africa | Kota & Bunny Explorer',
  description:
    'Find the best Kota spots in Johannesburg, Soweto, Soshanguve, Pretoria and across Mzansi. The Kota, a hollowed-out quarter loaf filled with chips, polony, atchar, Russian sausage and more, is the ultimate South African township street food. Community-rated, street-approved.',
  keywords: [
    'Best Kota in Soshanguve',
    'Best Kota in Soweto',
    'Best Kota in Johannesburg',
    'Best Kota in Pretoria',
    'Kota near me',
    'township kota spots',
    'South African street food',
    'kota sandwich',
    'skhambane',
    'kota fillings',
  ],
  openGraph: {
    title: 'Best Kota Spots in South Africa',
    description: 'Community-rated Kota spots across Mzansi. Find your next favourite.',
    type: 'website',
  },
};

export default function KotaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-2">
        Kota Spots
      </h1>
      <p className="text-gray-600 font-sans mb-4 max-w-2xl">
        The Kota is the heart of township street food, a hollowed-out quarter loaf of white bread,
        stuffed with chips, polony, atchar, Russian sausage, cheese, and whatever your heart desires.
        Born in the townships of Gauteng, the Kota has become a Mzansi icon.
      </p>
      <p className="text-gray-500 font-sans text-sm mb-8 max-w-2xl">
        All spots are community-rated. You get access to only the top rated places.
      </p>
      <div className="ndebele-border mb-8" />

      <SearchFilter category="kota" />

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        <Link
          href="/submit"
          className="flex items-center gap-3 bg-mzansi-yellow text-mzansi-black rounded-2xl p-5 shadow-md vendor-card"
        >
          <div className="w-12 h-12 bg-mzansi-black rounded-full flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-mzansi-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="heading-bold text-lg">Add Your Kota Spot</p>
            <p className="text-sm font-sans opacity-80">Know a spot we&apos;re missing? Submit it and put it on the map.</p>
          </div>
        </Link>
        <Link
          href="/recipes"
          className="flex items-center gap-3 bg-mzansi-red text-white rounded-2xl p-5 shadow-md vendor-card"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-mzansi-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <p className="heading-bold text-lg">Create Your Own Kota</p>
            <p className="text-sm font-sans opacity-80">Use our recipe builder to craft your dream Kota combo.</p>
          </div>
        </Link>
      </div>

      {/* SEO-rich content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="heading-bold text-2xl text-mzansi-black mb-4">What is a Kota?</h2>
        <div className="text-gray-600 font-sans space-y-4 max-w-3xl">
          <p>
            A <strong>Kota</strong> (also known as a <em>skhambane</em> or <em>sphatlo</em>) is a
            South African street food sandwich made from a quarter loaf of bread. The bread is
            hollowed out and filled with hot chips (French fries), then layered with a combination
            of proteins and condiments.
          </p>
          <p>
            Common fillings include <strong>polony</strong>, <strong>Russian sausage</strong>,{' '}
            <strong>vienna sausages</strong>, <strong>cheese</strong>, <strong>atchar</strong>{' '}
            (pickled mango relish), <strong>egg</strong>, and various sauces. Premium Kotas might
            include steak, burger patties, or even ribs.
          </p>
          <p>
            The Kota originated in the townships of <strong>Johannesburg</strong> and{' '}
            <strong>Pretoria</strong> and has since spread across South Africa. Every township has
            its own legendary Kota spot, and finding the best one is a matter of fierce local pride.
          </p>
          <h3 className="heading-bold text-xl text-mzansi-black mt-6">Popular Kota Varieties</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Number 1:</strong> Chips + Polony + Atchar</li>
            <li><strong>AK-47:</strong> Chips + Russian + Polony + Cheese + Atchar + Egg</li>
            <li><strong>Skomplaas / Full House:</strong> Everything in the shop, piled high</li>
            <li><strong>Cheese Kota:</strong> Extra cheese melted over the chips</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
