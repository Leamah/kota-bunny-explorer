'use client';

import { useEffect, useState } from 'react';
import { listDocuments, updateDocument, Query, DATABASE_ID } from '../../../lib/appwrite';

interface Vendor {
  $id: string;
  name: string;
  category: string;
  photos: string;
  images_locked: boolean;
}

export default function ManageImagesPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'kota' | 'bunny-chow'>('all');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    setLoading(true);
    try {
      const queries = [
        Query.equal('is_vetted', true),
        Query.equal('source', 'google'),
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
        images_locked: true, // Lock after manual edit
      });
      // Update local state
      setVendors((prev) =>
        prev.map((v) =>
          v.$id === vendorId ? { ...v, photos: JSON.stringify(photos), images_locked: true } : v
        )
      );
    } catch {
      // ignore
    }
    setSaving(null);
  }

  async function toggleLock(vendorId: string, locked: boolean) {
    setSaving(vendorId);
    try {
      await updateDocument(DATABASE_ID, 'vendors', vendorId, { images_locked: locked });
      setVendors((prev) =>
        prev.map((v) => (v.$id === vendorId ? { ...v, images_locked: locked } : v))
      );
    } catch {
      // ignore
    }
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
    } catch {
      // ignore
    }
    setSaving(null);
  }

  const displayed = filter === 'all' ? vendors : vendors.filter((v) => v.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="heading-bold text-3xl text-mzansi-black">Manage Images</h1>
        <span className="text-sm font-sans text-gray-400">{displayed.length} vendors</span>
      </div>
      <p className="text-gray-500 font-sans text-sm mb-6">
        Remove bad images and lock them so the weekly sync won&apos;t overwrite your edits.
      </p>
      <div className="ndebele-border mb-6" />

      {/* Filter */}
      <div className="flex gap-2 mb-8">
        {(['all', 'kota', 'bunny-chow'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-sans text-sm font-semibold transition ${
              filter === f
                ? 'bg-mzansi-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'kota' ? 'Kota' : 'Bunny Chow'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400 font-sans">Loading vendors...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayed.map((vendor) => {
            const photos: string[] = (() => {
              try { return JSON.parse(vendor.photos || '[]'); } catch { return []; }
            })();
            const isSaving = saving === vendor.$id;

            return (
              <div key={vendor.$id} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="heading-bold text-lg text-mzansi-black">{vendor.name}</h3>
                    <span className="text-xs font-sans text-gray-400 uppercase">
                      {vendor.category === 'kota' ? 'Kota' : 'Bunny Chow'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Lock toggle */}
                    <button
                      onClick={() => toggleLock(vendor.$id, !vendor.images_locked)}
                      disabled={isSaving}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition ${
                        vendor.images_locked
                          ? 'bg-mzansi-teal text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {vendor.images_locked ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        )}
                      </svg>
                      {vendor.images_locked ? 'Locked' : 'Unlocked'}
                    </button>
                    {/* Remove all */}
                    {photos.length > 0 && (
                      <button
                        onClick={() => removeAllPhotos(vendor.$id)}
                        disabled={isSaving}
                        className="px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        Remove All
                      </button>
                    )}
                  </div>
                </div>

                {photos.length === 0 ? (
                  <p className="text-gray-300 font-sans text-sm py-4 text-center">No images</p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {photos.map((url, i) => (
                      <div key={i} className="relative shrink-0">
                        <img
                          src={url}
                          alt={`${vendor.name} ${i + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                          loading="lazy"
                        />
                        <button
                          onClick={() => removePhoto(vendor.$id, i)}
                          disabled={isSaving}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition disabled:opacity-50"
                        >
                          X
                        </button>
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
