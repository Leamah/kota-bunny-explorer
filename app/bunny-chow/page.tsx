import type { Metadata } from 'next';
import VendorList from '../components/VendorList';

export const metadata: Metadata = {
  title: 'Best Bunny Chow in South Africa | Kota & Bunny Explorer',
  description:
    'Find the best Bunny Chow in Durban and across South Africa. Community-rated street food guide.',
  keywords: ['Bunny Chow Durban', 'Best Bunny Chow near me', 'South African curry bread bowl'],
};

export default function BunnyChowPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-2">
        Bunny Chow Spots
      </h1>
      <p className="text-gray-500 font-sans mb-8">
        Durban&apos;s pride, now found all over Mzansi.
      </p>
      <div className="ndebele-border mb-8" />
      <VendorList category="bunny-chow" />
    </div>
  );
}
