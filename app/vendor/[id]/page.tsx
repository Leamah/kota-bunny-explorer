'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MapEmbed from '../../components/MapEmbed';
import StreetTalk from '../../components/StreetTalk';
import UpvoteButton from '../../components/UpvoteButton';

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69cc168e00183ee74608';
const DATABASE_ID = 'kota-bunny-db';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  category: string;
  source: 'google' | 'community';
  upvotes: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-6 h-6 ${i <= Math.round(rating) ? 'star-filled' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function VendorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents/${id}`, {
      headers: { 'X-Appwrite-Project': PROJECT_ID },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code) throw new Error(data.message);
        setVendor(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="heading-bold text-3xl text-gray-300 mb-2">Spot not found</h1>
        <p className="text-gray-400 font-sans">{error || 'This vendor doesn\'t exist.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="heading-bold text-3xl md:text-4xl text-mzansi-black">{vendor.name}</h1>
            <span
              className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                vendor.source === 'google'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-mzansi-yellow text-mzansi-black'
              }`}
            >
              {vendor.source === 'google' ? 'Google' : 'Community'}
            </span>
          </div>
          <p className="text-gray-500 font-sans">{vendor.address}</p>
          <span className="inline-block mt-2 text-xs font-bold uppercase px-3 py-1 rounded-full bg-mzansi-cream text-mzansi-black">
            {vendor.category === 'kota' ? 'Kota' : 'Bunny Chow'}
          </span>
        </div>
        <UpvoteButton vendorId={vendor.$id} initialUpvotes={vendor.upvotes} />
      </div>

      <div className="ndebele-border mb-8" />

      {/* Rating */}
      <div className="flex items-center gap-3 mb-8">
        <Stars rating={vendor.rating} />
        <span className="text-lg font-sans text-gray-700 font-semibold">
          {vendor.rating.toFixed(1)}
        </span>
        <span className="text-gray-400 font-sans">
          ({vendor.review_count} reviews)
        </span>
      </div>

      {/* Map */}
      <section className="mb-10">
        <h2 className="heading-bold text-xl text-mzansi-black mb-4">Location</h2>
        <MapEmbed address={vendor.address} />
      </section>

      {/* Street Talk - Reviews */}
      <section>
        <h2 className="heading-bold text-2xl text-mzansi-red mb-2">Street Talk</h2>
        <p className="text-gray-500 font-sans text-sm mb-6">
          Real reviews from real people. Share your experience.
        </p>
        <div className="ndebele-border max-w-xs mb-6" />
        <StreetTalk vendorId={vendor.$id} />
      </section>
    </div>
  );
}
