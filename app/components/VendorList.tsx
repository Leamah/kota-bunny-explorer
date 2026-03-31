'use client';

import { useEffect, useState } from 'react';
import VendorCard from './VendorCard';
import { listDocuments } from '../../lib/appwrite';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  category: string;
  source: 'google' | 'community';
  is_vetted: boolean;
  upvotes: number;
}

const DATABASE_ID = 'kota-bunny-db';
const VENDORS_COLLECTION_ID = 'vendors';

export default function VendorList({ category }: { category: string }) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listDocuments(DATABASE_ID, VENDORS_COLLECTION_ID, [
      `equal("category", "${category}")`,
      `equal("is_vetted", true)`,
      `greaterThanEqual("rating", 4.0)`,
      `greaterThanEqual("review_count", 10)`,
    ])
      .then((res: { documents: Vendor[] }) => {
        setVendors(res.documents);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-yellow-700 font-sans text-sm">
          Vendors loading soon. Check back shortly!
        </p>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <p className="heading-bold text-2xl text-gray-300 mb-2">No spots yet</p>
        <p className="text-gray-400 font-sans text-sm">
          Be the first to submit a {category === 'kota' ? 'Kota' : 'Bunny Chow'} spot!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((v) => (
        <VendorCard
          key={v.$id}
          name={v.name}
          address={v.address}
          rating={v.rating}
          reviewCount={v.review_count}
          source={v.source}
          upvotes={v.upvotes}
        />
      ))}
    </div>
  );
}
