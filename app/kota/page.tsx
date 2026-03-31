import type { Metadata } from 'next';
import VendorList from '../components/VendorList';

export const metadata: Metadata = {
  title: 'Best Kota Spots in South Africa | Kota & Bunny Explorer',
  description:
    'Find the best Kota spots in Johannesburg, Soweto, Soshanguve and across Mzansi. Community-rated street food guide.',
  keywords: ['Best Kota in Soshanguve', 'Best Kota in Soweto', 'Kota near me', 'township kota spots'],
};

export default function KotaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-2">
        Kota Spots
      </h1>
      <p className="text-gray-500 font-sans mb-8">
        The best township sandwiches, rated by the people.
      </p>
      <div className="ndebele-border mb-8" />
      <VendorList category="kota" />
    </div>
  );
}
