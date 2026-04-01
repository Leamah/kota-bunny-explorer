'use client';

import { useState } from 'react';
import VendorList from './VendorList';

export default function SearchFilter({ category }: { category: string }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'upvotes'>('rating');

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search spots by name or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mzansi-yellow font-sans"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'rating' | 'upvotes')}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mzansi-yellow font-sans"
        >
          <option value="rating">Sort by Rating</option>
          <option value="upvotes">Sort by Upvotes</option>
        </select>
      </div>
      <VendorList category={category} search={search} sortBy={sortBy} />
    </div>
  );
}
