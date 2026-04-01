'use client';

import Link from 'next/link';

interface VendorCardProps {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  source: 'google' | 'community';
  upvotes?: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= Math.round(rating) ? 'star-filled' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function VendorCard({
  id,
  name,
  address,
  rating,
  reviewCount,
  source,
  upvotes = 0,
}: VendorCardProps) {
  return (
    <Link href={`/vendor/${id}`} className="block">
      <div className="bg-white rounded-2xl shadow-md p-6 vendor-card h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="heading-bold text-xl text-mzansi-black">{name}</h3>
          <span
            className={`text-xs font-bold uppercase px-2 py-1 rounded-full shrink-0 ml-2 ${
              source === 'google'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-mzansi-yellow text-mzansi-black'
            }`}
          >
            {source === 'google' ? 'Google' : 'Community'}
          </span>
        </div>

        <p className="text-gray-500 text-sm font-sans mb-3">{address}</p>

        <div className="flex items-center gap-2 mb-4">
          <Stars rating={rating} />
          <span className="text-sm font-sans text-gray-600">
            {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-mzansi-teal font-sans">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {upvotes}
          </div>
          <span className="text-xs text-mzansi-red font-sans font-semibold uppercase tracking-wider">
            View Street Talk &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
