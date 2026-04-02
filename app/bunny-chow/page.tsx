import type { Metadata } from 'next';
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
      <div className="ndebele-border mb-8" />

      <SearchFilter category="bunny-chow" />

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
