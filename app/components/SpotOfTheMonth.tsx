'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listDocuments, DATABASE_ID } from '../../lib/appwrite';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  category: string;
  upvote_count: number;
}

export default function SpotOfTheMonth() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query vetted vendors sorted by upvote_count, updated in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    listDocuments(DATABASE_ID, 'vendors', [
      `equal("is_vetted", true)`,
      `greaterThanEqual("$updatedAt", "${thirtyDaysAgo.toISOString()}")`,
      `orderDesc("upvote_count")`,
      `limit(1)`,
    ])
      .then((res: { documents: Vendor[] }) => {
        setVendor(res.documents[0] || null);
      })
      .catch(() => {
        // Fallback: just get the top upvoted vendor without date filter
        listDocuments(DATABASE_ID, 'vendors', [
          `equal("is_vetted", true)`,
          `orderDesc("upvote_count")`,
          `limit(1)`,
        ])
          .then((res: { documents: Vendor[] }) => setVendor(res.documents[0] || null))
          .catch(() => setVendor(null));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto text-center animate-pulse">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  if (!vendor) {
    return (
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
    );
  }

  return (
    <Link href={`/vendor/${vendor.$id}`} className="block">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto text-center vendor-card">
        <div className="w-20 h-20 bg-mzansi-yellow rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-mzansi-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h3 className="heading-bold text-2xl text-mzansi-black mb-1">{vendor.name}</h3>
        <p className="text-gray-500 font-sans text-sm mb-2">{vendor.address}</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-mzansi-yellow font-bold">{vendor.rating.toFixed(1)}</span>
          <span className="text-gray-400 font-sans text-sm">
            ({vendor.review_count} reviews)
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-mzansi-cream text-mzansi-teal px-4 py-1.5 rounded-full font-semibold text-sm font-sans">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {vendor.upvote_count} upvotes
        </div>
      </div>
    </Link>
  );
}
