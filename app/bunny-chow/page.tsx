import type { Metadata } from 'next';
import Link from 'next/link';
import VendorList from '../components/VendorList';
import SearchFilter from '../components/SearchFilter';

export const metadata: Metadata = {
  title: 'Best Bunny Chow in South Africa | Kota & Bunny Explorer',
  description:
    'Find the best Bunny Chow in Durban, Johannesburg and across South Africa. Bunny Chow, a hollowed-out half or quarter loaf filled with rich, spicy curry, is a Durban original that has become a national treasure. Community-rated street food guide.',
  keywords: [
    'Bunny Chow Durban',
    'Best Bunny Chow near me',
    'Best Bunny Chow in Johannesburg',
    'South African curry bread bowl',
    'Durban street food',
    'bunny chow recipe',
    'mutton bunny chow',
    'chicken bunny chow',
    'bean bunny chow',
  ],
  openGraph: {
    title: 'Best Bunny Chow in South Africa',
    description: 'Community-rated Bunny Chow spots from Durban to Joburg and beyond.',
    type: 'website',
  },
};

export default function BunnyChowPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-2">
        Bunny Chow Spots
      </h1>
      <p className="text-gray-600 font-sans mb-4 max-w-2xl">
        Bunny Chow is Durban&apos;s gift to South Africa, a hollowed-out loaf of bread filled with
        rich, spicy curry. Originally from the Indian community in KwaZulu-Natal, the Bunny has
        become a cross-cultural icon loved by everyone.
      </p>
      <p className="text-gray-500 font-sans text-sm mb-8 max-w-2xl">
        All spots are community-rated. You get access to only the top rated places.
      </p>
      {/* Top CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
            <p className="heading-bold text-lg">Add Your Bunny Chow Spot</p>
            <p className="text-sm font-sans opacity-80">Know a legendary spot? Put it on the map.</p>
          </div>
        </Link>
        <Link
          href="/recipes"
          className="relative bg-mzansi-black text-white rounded-2xl overflow-hidden shadow-md vendor-card group"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            poster="/recipe-preview-poster.jpg"
          >
            <source src="/recipe-preview.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 flex items-center gap-3 p-5">
            <div className="w-12 h-12 bg-mzansi-red rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <p className="heading-bold text-lg">Create Your Own Bunny Chow</p>
              <p className="text-sm font-sans opacity-80">Try our recipe builder for the perfect combo.</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="ndebele-border mb-8" />

      <SearchFilter category="bunny-chow" />

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
            <p className="heading-bold text-lg">Add Your Bunny Chow Spot</p>
            <p className="text-sm font-sans opacity-80">Know a legendary bunny spot? Submit it and share with the community.</p>
          </div>
        </Link>
        <Link
          href="/recipes"
          className="relative bg-mzansi-black text-white rounded-2xl overflow-hidden shadow-md vendor-card group"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            poster="/recipe-preview-poster.jpg"
          >
            <source src="/recipe-preview.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 flex items-center gap-3 p-5">
            <div className="w-12 h-12 bg-mzansi-red rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <p className="heading-bold text-lg">Create Your Own Bunny Chow</p>
              <p className="text-sm font-sans opacity-80">Try our recipe builder to mix up your perfect bunny combo.</p>
            </div>
          </div>
        </Link>
      </div>

      {/* SEO-rich content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="heading-bold text-2xl text-mzansi-black mb-4">What is Bunny Chow?</h2>
        <div className="text-gray-600 font-sans space-y-4 max-w-3xl">
          <p>
            <strong>Bunny Chow</strong> (or simply &quot;bunny&quot;) is a South African fast food
            dish consisting of a hollowed-out loaf of white bread filled with curry. It originated
            in the <strong>Indian community of Durban</strong>, KwaZulu-Natal, and has since become
            one of South Africa&apos;s most iconic street foods.
          </p>
          <p>
            The curry is typically made with <strong>mutton</strong>, <strong>chicken</strong>, or{' '}
            <strong>beans</strong> (for a vegetarian option), slow-cooked with a blend of spices
            including cumin, coriander, turmeric, and chilli. The bread soaks up the curry gravy,
            creating layers of flavour in every bite.
          </p>
          <p>
            While <strong>Durban</strong> is the undisputed home of Bunny Chow, you can now find
            excellent versions across <strong>Johannesburg</strong>, <strong>Cape Town</strong>,{' '}
            <strong>Pretoria</strong>, and everywhere in between.
          </p>
          <h3 className="heading-bold text-xl text-mzansi-black mt-6">Types of Bunny Chow</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Mutton Bunny:</strong> The classic, slow-cooked mutton curry, rich and spicy</li>
            <li><strong>Chicken Bunny:</strong> Tender chicken in a fragrant curry sauce</li>
            <li><strong>Bean Bunny:</strong> Sugar beans in a thick, spiced gravy, the vegetarian favourite</li>
            <li><strong>Chip Bunny:</strong> Filled with chips and curry sauce, a quick, budget-friendly option</li>
            <li><strong>Quarter / Half / Full:</strong> Sizes based on the portion of bread loaf used</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
