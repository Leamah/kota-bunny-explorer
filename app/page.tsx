import Link from 'next/link';
import SpotOfTheMonth from './components/SpotOfTheMonth';

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
            Find the best street food spots across Southy that have{' '}
            <span className="heading-bold text-mzansi-yellow text-2xl md:text-3xl inline-block transform -rotate-2">
              Community Cred
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {/* Kota - image behind button */}
            <div className="relative w-72 h-56 rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src="/kota-hero.jpg"
                alt="Kota street food"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <Link
                href="/kota"
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
              >
                <span className="heading-bold text-4xl md:text-5xl text-mzansi-yellow drop-shadow-lg">Kota</span>
                <span className="text-sm font-sans font-medium text-white/80 mt-1">
                  Township&apos;s finest
                </span>
              </Link>
            </div>

            {/* Bunny Chow - image behind button */}
            <div className="relative w-72 h-56 rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src="/bunny-hero.jpg"
                alt="Bunny Chow"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <Link
                href="/bunny-chow"
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
              >
                <span className="heading-bold text-4xl md:text-5xl text-white drop-shadow-lg">Bunny Chow</span>
                <span className="text-sm font-sans font-medium text-white/80 mt-1">
                  Durban&apos;s pride
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Spot of the Month */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="heading-bold text-3xl md:text-4xl text-mzansi-red text-center mb-2">
          Spot of the Month
        </h2>
        <div className="ndebele-border max-w-xs mx-auto mb-8" />
        <SpotOfTheMonth />
      </section>

      {/* Weekly Recipe Teaser */}
      <section className="bg-mzansi-teal text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="heading-bold text-3xl md:text-4xl mb-2">
            Weekly Recipe Drop
          </h2>
          <p className="text-teal-100 font-sans mb-8 max-w-xl mx-auto">
            Every week we drop a new Kota or Bunny Chow recipe. Easy subs, easy vibes.
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
          Know a hidden gem? Share it with the community.
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
