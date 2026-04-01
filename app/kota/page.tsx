import type { Metadata } from 'next';
import VendorList from '../components/VendorList';
import SearchFilter from '../components/SearchFilter';

export const metadata: Metadata = {
  title: 'Best Kota Spots in South Africa | Kota & Bunny Explorer',
  description:
    'Find the best Kota spots in Johannesburg, Soweto, Soshanguve, Pretoria and across Mzansi. The Kota — a hollowed-out quarter loaf filled with chips, polony, atchar, Russian sausage and more — is the ultimate South African township street food. Community-rated, street-approved.',
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
        The Kota is the heart of township street food — a hollowed-out quarter loaf of white bread,
        stuffed with chips, polony, atchar, Russian sausage, cheese, and whatever your heart desires.
        Born in the townships of Gauteng, the Kota has become a Mzansi icon.
      </p>
      <p className="text-gray-500 font-sans text-sm mb-8 max-w-2xl">
        All spots are community-rated. We only show places with <strong>4+ stars</strong> and{' '}
        <strong>10+ reviews</strong> so you know it&apos;s legit.
      </p>
      <div className="ndebele-border mb-8" />

      <SearchFilter category="kota" />

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
