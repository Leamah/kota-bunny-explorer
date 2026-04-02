'use client';

import { useEffect, useState } from 'react';
import VendorCard from './VendorCard';
import { listDocuments, Query, DATABASE_ID } from '../../lib/appwrite';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  category: string;
  source: 'google' | 'community';
  is_vetted: boolean;
  upvote_count: number;
  photos: string;
  price_range: string;
}

const VENDORS_COLLECTION_ID = 'vendors';

interface VendorListProps {
  category: string;
  search?: string;
  sortBy?: 'rating' | 'upvotes';
}

export default function VendorList({ category, search = '', sortBy = 'rating' }: VendorListProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listDocuments(DATABASE_ID, VENDORS_COLLECTION_ID, [
      Query.equal('category', category),
      Query.equal('is_vetted', true),
      Query.greaterThanEqual('rating', 4.0),
      Query.greaterThanEqual('review_count', 10),
    ])
      .then((res: { documents: Vendor[] }) => {
        setVendors(res.documents);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const hasPhotos = (v: Vendor) => {
    if (!v.photos) return false;
    try { const p = JSON.parse(v.photos); return Array.isArray(p) && p.length > 0; } catch { return false; }
  };

  const filtered = vendors
    .filter((v) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      // Places with photos first
      const aHas = hasPhotos(a) ? 1 : 0;
      const bHas = hasPhotos(b) ? 1 : 0;
      if (bHas !== aHas) return bHas - aHas;
      return sortBy === 'upvotes' ? b.upvote_count - a.upvote_count : b.rating - a.rating;
    });

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

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <p className="heading-bold text-2xl text-gray-300 mb-2">
          {search ? 'No matches found' : 'No spots yet'}
        </p>
        <p className="text-gray-400 font-sans text-sm">
          {search
            ? `Try a different search term.`
            : `Be the first to submit a ${category === 'kota' ? 'Kota' : 'Bunny Chow'} spot!`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((v) => (
        <VendorCard
          key={v.$id}
          id={v.$id}
          name={v.name}
          address={v.address}
          rating={v.rating}
          reviewCount={v.review_count}
          source={v.source}
          upvotes={v.upvote_count}
          photos={v.photos}
          category={v.category}
          priceRange={v.price_range}
        />
      ))}
    </div>
  );
}
