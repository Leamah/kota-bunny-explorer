'use client';

import { useEffect, useState } from 'react';
import { getDocument, DATABASE_ID } from '../../../lib/appwrite';
import MapEmbed from '../../components/MapEmbed';
import StreetTalk from '../../components/StreetTalk';
import UpvoteButton from '../../components/UpvoteButton';
import Link from 'next/link';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  category: string;
  source: 'google' | 'community';
  upvote_count: number;
  phone: string;
  hours: string;
  photos: string;
  price_range: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
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

export default function VendorClient({ vendorId }: { vendorId: string }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    getDocument(DATABASE_ID, 'vendors', vendorId)
      .then((data) => {
        if (data.code) throw new Error(data.message);
        setVendor(data as Vendor);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [vendorId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="heading-bold text-3xl text-gray-300 mb-2">Spot not found</h1>
        <p className="text-gray-400 font-sans">{error || "This vendor doesn't exist."}</p>
        <Link href="/kota" className="mt-6 inline-block text-mzansi-teal hover:underline font-sans">
          ← Browse all Kota spots
        </Link>
      </div>
    );
  }

  const photos: string[] = vendor.photos
    ? (() => { try { return JSON.parse(vendor.photos); } catch { return []; } })()
    : [];
  const hours: string[] = vendor.hours
    ? (() => { try { return JSON.parse(vendor.hours); } catch { return []; } })()
    : [];

  const cityFromAddress = vendor.address.split(',').slice(-2, -1)[0]?.trim() ?? 'South Africa';
  const categoryLabel = vendor.category === 'kota' ? 'Kota' : 'Bunny Chow';
  const categoryHref = vendor.category === 'kota' ? '/kota' : '/bunny-chow';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Photo Gallery */}
      {photos.length > 0 && (
        <section className="mb-8">
          <div className="rounded-2xl overflow-hidden shadow-lg mb-3">
            <img
              src={photos[activePhoto]}
              alt={`${categoryLabel} at ${vendor.name} in ${cityFromAddress}`}
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photos.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    i === activePhoto ? 'border-mzansi-red' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt={`${vendor.name} street food photo ${i + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="heading-bold text-3xl md:text-4xl text-mzansi-black">
              {vendor.name}
            </h1>
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
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-mzansi-cream text-mzansi-black">
              {categoryLabel}
            </span>
            {vendor.price_range && (
              <span className="text-sm font-bold text-mzansi-teal">{vendor.price_range}</span>
            )}
          </div>
        </div>
        <UpvoteButton vendorId={vendor.$id} initialUpvotes={vendor.upvote_count} />
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

      {/* Contact & Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {vendor.phone && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold font-sans text-mzansi-black mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-mzansi-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone
            </h3>
            <a href={`tel:${vendor.phone}`} className="text-mzansi-teal font-sans hover:underline">
              {vendor.phone}
            </a>
          </div>
        )}

        {hours.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold font-sans text-mzansi-black mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-mzansi-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hours
            </h3>
            <ul className="space-y-1">
              {hours.map((line, i) => (
                <li key={i} className="text-sm font-sans text-gray-600">{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Map */}
      <section className="mb-10">
        <h2 className="heading-bold text-xl text-mzansi-black mb-4">Location</h2>
        <MapEmbed address={vendor.address} />
      </section>

      {/* Internal links */}
      <section className="mb-10 p-5 bg-mzansi-cream rounded-2xl border border-gray-200">
        <h2 className="heading-bold text-lg text-mzansi-black mb-3">Explore More</h2>
        <div className="flex flex-wrap gap-3 font-sans text-sm">
          <Link href={categoryHref} className="text-mzansi-teal hover:underline">
            ← All {categoryLabel} Spots
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/recipes" className="text-mzansi-teal hover:underline">
            {categoryLabel} Recipes
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/submit" className="text-mzansi-teal hover:underline">
            Submit a Spot
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/articles" className="text-mzansi-teal hover:underline">
            Street Food Guides
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="text-mzansi-teal hover:underline">
            Home
          </Link>
        </div>
      </section>

      {/* Street Talk */}
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
