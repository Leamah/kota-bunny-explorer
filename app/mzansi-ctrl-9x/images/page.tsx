'use client';

import { useEffect, useState } from 'react';
import { listDocuments, updateDocument, Query, DATABASE_ID } from '../../../lib/appwrite';

interface Vendor {
  $id: string;
  name: string;
  category: string;
  source: string;
  photos: string;
  images_locked: boolean;
  rating: number;
  review_count: number;
}

export default function ManageImagesPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'kota' | 'bunny-chow'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'google' | 'community'>('all');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [dragVendor, setDragVendor] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    setLoading(true);
    try {
      const queries = [
        Query.equal('is_vetted', true),
        Query.limit(200),
      ];
      const res = await listDocuments(DATABASE_ID, 'vendors', queries);
      setVendors(res.documents as Vendor[]);
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function removePhoto(vendorId: string, photoIndex: number) {
    const vendor = vendors.find((v) => v.$id === vendorId);
    if (!vendor) return;
    setSaving(vendorId);
    try {
      const photos: string[] = JSON.parse(vendor.photos || '[]');
      photos.splice(photoIndex, 1);
      await updateDocument(DATABASE_ID, 'vendors', vendorId, {
        photos: JSON.stringify(photos),
        images_locked: true,
      });
      setVendors((prev) =>
        prev.map((v) =>
          v.$id === vendorId ? { ...v, photos: JSON.stringify(photos), images_locked: true } : v
        )
      );
    } catch { /* ignore */ }
    setSaving(null);
  }

  async function movePhoto(vendorId: string, fromIndex: number, toIndex: number) {
    const vendor = vendors.find((v) => v.$id === vendorId);
    if (!vendor) return;
    setSaving(vendorId);
    try {
      const photos: string[] = JSON.parse(vendor.photos || '[]');
      const [moved] = photos.splice(fromIndex, 1);
      photos.splice(toIndex, 0, moved);
      await updateDocument(DATABASE_ID, 'vendors', vendorId, {
        photos: JSON.stringify(photos),
        images_locked: true,
      });
      setVendors((prev) =>
        prev.map((v) =>
          v.$id === vendorId ? { ...v, photos: JSON.stringify(photos), images_locked: true } : v
        )
      );
    } catch { /* ignore */ }
    setSaving(null);
  }

  async function toggleLock(vendorId: string, locked: boolean) {
    setSaving(vendorId);
    try {
      await updateDocument(DATABASE_ID, 'vendors', vendorId, { images_locked: locked });
      setVendors((prev) =>
        prev.map((v) => (v.$id === vendorId ? { ...v, images_locked: locked } : v))
      );
    } catch { /* ignore */ }
    setSaving(null);
  }

  async function removeAllPhotos(vendorId: string) {
    setSaving(vendorId);
    try {
      await updateDocument(DATABASE_ID, 'vendors', vendorId, {
        photos: '[]',
        images_locked: true,
      });
      setVendors((prev) =>
        prev.map((v) =>
          v.$id === vendorId ? { ...v, photos: '[]', images_locked: true } : v
        )
      );
    } catch { /* ignore */ }
    setSaving(null);
  }

  // Drag handlers
  function handleDragStart(vendorId: string, index: number) {
    setDragVendor(vendorId);
    setDragIndex(index);
  }

  function handleDrop(vendorId: string, dropIndex: number) {
    if (dragVendor === vendorId && dragIndex !== null && dragIndex !== dropIndex) {
      movePhoto(vendorId, dragIndex, dropIndex);
    }
    setDragVendor(null);
    setDragIndex(null);
  }

  // Filtered + searched list
  const displayed = vendors
    .filter((v) => filter === 'all' || v.category === filter)
    .filter((v) => sourceFilter === 'all' || v.source === sourceFilter)
    .filter((v) => {
      if (!search) return true;
      return v.name.toLowerCase().includes(search.toLowerCase());
    });

  // Analytics
  const totalVendors = vendors.length;
  const googleCount = vendors.filter((v) => v.source === 'google').length;
  const communityCount = vendors.filter((v) => v.source === 'community').length;
  const kotaCount = vendors.filter((v) => v.category === 'kota').length;
  const bunnyCount = vendors.filter((v) => v.category === 'bunny-chow').length;
  const withPhotos = vendors.filter((v) => {
    try { const p = JSON.parse(v.photos || '[]'); return p.length > 0; } catch { return false; }
  }).length;
  const lockedCount = vendors.filter((v) => v.images_locked).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-2">
        <a href="/mzansi-ctrl-9x" className="text-mzansi-teal hover:text-teal-700 font-sans text-sm">&larr; Admin</a>
      </div>
      <h1 className="heading-bold text-3xl text-mzansi-black mb-2">Manage Images</h1>
      <p className="text-gray-500 font-sans text-sm mb-6">
        Drag images to reorder. First image = thumbnail on listing. Removing or reordering auto-locks.
      </p>
      <div className="ndebele-border mb-6" />

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {[
          { label: 'Total', value: totalVendors, color: 'bg-mzansi-black text-white' },
          { label: 'Google', value: googleCount, color: 'bg-blue-100 text-blue-700' },
          { label: 'Community', value: communityCount, color: 'bg-mzansi-yellow text-mzansi-black' },
          { label: 'Kota', value: kotaCount, color: 'bg-orange-100 text-orange-700' },
          { label: 'Bunny', value: bunnyCount, color: 'bg-red-100 text-red-700' },
          { label: 'With Photos', value: withPhotos, color: 'bg-green-100 text-green-700' },
          { label: 'Locked', value: lockedCount, color: 'bg-teal-100 text-teal-700' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-3 text-center ${stat.color}`}>
            <p className="heading-bold text-2xl">{stat.value}</p>
            <p className="text-xs font-sans font-semibold uppercase tracking-wider opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-mzansi-yellow"
        />
        <div className="flex gap-2">
          {(['all', 'kota', 'bunny-chow'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg font-sans text-xs font-semibold transition ${
                filter === f ? 'bg-mzansi-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'kota' ? 'Kota' : 'Bunny'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['all', 'google', 'community'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSourceFilter(f)}
              className={`px-3 py-2 rounded-lg font-sans text-xs font-semibold transition ${
                sourceFilter === f ? 'bg-mzansi-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All Sources' : f === 'google' ? 'Google' : 'Community'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs font-sans text-gray-400 mb-4">{displayed.length} vendors shown</p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400 font-sans">Loading vendors...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayed.map((vendor) => {
            const photos: string[] = (() => {
              try { return JSON.parse(vendor.photos || '[]'); } catch { return []; }
            })();
            const isSaving = saving === vendor.$id;

            return (
              <div key={vendor.$id} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="heading-bold text-lg text-mzansi-black">{vendor.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                          vendor.category === 'kota' ? 'bg-mzansi-yellow text-mzansi-black' : 'bg-mzansi-red text-white'
                        }`}>
                          {vendor.category === 'kota' ? 'Kota' : 'Bunny'}
                        </span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                          vendor.source === 'google' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {vendor.source === 'google' ? 'Google' : 'Community'}
                        </span>
                        <span className="text-xs font-sans text-gray-400">
                          {vendor.rating.toFixed(1)} ({vendor.review_count})
                        </span>
                        <span className="text-xs font-sans text-gray-400">
                          {photos.length} photo{photos.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLock(vendor.$id, !vendor.images_locked)}
                      disabled={isSaving}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition ${
                        vendor.images_locked ? 'bg-mzansi-teal text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {vendor.images_locked ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        )}
                      </svg>
                      {vendor.images_locked ? 'Locked' : 'Unlocked'}
                    </button>
                    {photos.length > 0 && (
                      <button
                        onClick={() => removeAllPhotos(vendor.$id)}
                        disabled={isSaving}
                        className="px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {photos.length === 0 ? (
                  <p className="text-gray-300 font-sans text-sm py-4 text-center">No images</p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {photos.map((url, i) => (
                      <div
                        key={i}
                        className={`relative shrink-0 cursor-grab active:cursor-grabbing ${
                          dragVendor === vendor.$id && dragIndex === i ? 'opacity-40' : ''
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(vendor.$id, i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(vendor.$id, i)}
                      >
                        <img
                          src={url}
                          alt={`${vendor.name} ${i + 1}`}
                          className="w-28 h-28 object-cover rounded-lg"
                          loading="lazy"
                        />
                        {/* Position badge */}
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs font-bold rounded px-1.5 py-0.5">
                          {i + 1}
                        </span>
                        {/* Remove button */}
                        <button
                          onClick={() => removePhoto(vendor.$id, i)}
                          disabled={isSaving}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition disabled:opacity-50"
                        >
                          X
                        </button>
                        {/* Move arrows */}
                        <div className="absolute top-1 left-1 flex gap-0.5">
                          {i > 0 && (
                            <button
                              onClick={() => movePhoto(vendor.$id, i, i - 1)}
                              disabled={isSaving}
                              className="bg-black/70 text-white rounded w-5 h-5 flex items-center justify-center text-xs hover:bg-mzansi-teal transition"
                              title="Move left"
                            >
                              &larr;
                            </button>
                          )}
                          {i < photos.length - 1 && (
                            <button
                              onClick={() => movePhoto(vendor.$id, i, i + 1)}
                              disabled={isSaving}
                              className="bg-black/70 text-white rounded w-5 h-5 flex items-center justify-center text-xs hover:bg-mzansi-teal transition"
                              title="Move right"
                            >
                              &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
