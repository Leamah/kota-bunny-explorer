import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-mzansi-black text-white py-20 md:py-32">
        <div className="geo-pattern" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="heading-bold text-5xl md:text-7xl text-mzansi-yellow mb-4">
            What&apos;s Your Bite Today?
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-sans">
            Find the best street food spots across Mzansi. Community-rated, street-approved.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/kota"
              className="group relative bg-mzansi-yellow text-mzansi-black w-64 py-6 rounded-2xl hover:bg-yellow-300 transition-all hover:scale-105 text-center"
            >
              <span className="heading-bold text-3xl md:text-4xl block">Kota</span>
              <span className="text-sm font-sans font-medium opacity-70 mt-1 block">
                Township&apos;s finest
              </span>
            </Link>

            <Link
              href="/bunny-chow"
              className="group relative bg-mzansi-red text-white w-64 py-6 rounded-2xl hover:bg-red-700 transition-all hover:scale-105 text-center"
            >
              <span className="heading-bold text-3xl md:text-4xl block">Bunny Chow</span>
              <span className="text-sm font-sans font-medium opacity-70 mt-1 block">
                Durban&apos;s pride
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Spot of the Month */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="heading-bold text-3xl md:text-4xl text-mzansi-red text-center mb-2">
          Spot of the Month
        </h2>
        <div className="ndebele-border max-w-xs mx-auto mb-8" />
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto text-center vendor-card">
          <div className="w-20 h-20 bg-mzansi-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-mzansi-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-sans">
            Top-rated spots coming soon. Browse and upvote your favourites!
          </p>
        </div>
      </section>

      {/* Weekly Recipe Teaser */}
      <section className="bg-mzansi-teal text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="heading-bold text-3xl md:text-4xl mb-2">
            Weekly Recipe Drop
          </h2>
          <p className="text-teal-100 font-sans mb-8 max-w-xl mx-auto">
            Every week we drop a new Kota or Bunny Chow recipe. Easy subs, no fancy stuff.
            &quot;No polony? Use ham.&quot;
          </p>
          <Link
            href="/recipes"
            className="inline-block bg-mzansi-yellow text-mzansi-black px-8 py-3 rounded-full heading-bold text-lg hover:bg-yellow-300 transition"
          >
            Check Recipes
          </Link>
        </div>
      </section>

      {/* Submit a Spot CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="heading-bold text-3xl md:text-4xl text-mzansi-black mb-4">
          Know a Spot?
        </h2>
        <p className="text-gray-600 font-sans mb-8 max-w-lg mx-auto">
          Share your favourite hidden gem with the community. Help fellow South Africans find the best street food.
        </p>
        <Link
          href="/submit"
          className="inline-block bg-mzansi-red text-white px-8 py-3 rounded-full heading-bold text-lg hover:bg-red-700 transition"
        >
          Submit a Spot
        </Link>
      </section>
    </div>
  );
}
