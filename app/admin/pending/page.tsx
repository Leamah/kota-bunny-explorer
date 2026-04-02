'use client';

import { useEffect, useState } from 'react';
import { listDocuments, updateDocument, getAccount, Query, DATABASE_ID } from '../../../lib/appwrite';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  category: string;
  source: string;
  is_vetted: boolean;
  $createdAt: string;
}

export default function PendingPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    getAccount()
      .then(() => {
        setAuthed(true);
        return loadPending();
      })
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);

  async function loadPending() {
    const res = await listDocuments(DATABASE_ID, 'vendors', [
      Query.equal('is_vetted', false),
      Query.equal('source', 'community'),
    ]);
    setVendors(res.documents as Vendor[]);
  }

  async function approve(vendorId: string) {
    await updateDocument(DATABASE_ID, 'vendors', vendorId, { is_vetted: true });
    setVendors((prev) => prev.filter((v) => v.$id !== vendorId));
  }

  async function reject(vendorId: string) {
    // For now, just mark as vetted=false and remove from list
    // Could add a "rejected" status in future
    setVendors((prev) => prev.filter((v) => v.$id !== vendorId));
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-gray-500 font-sans">Loading...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="heading-bold text-3xl text-mzansi-black mb-4">Admin Panel</h1>
        <p className="text-gray-500 font-sans">
          Please <a href="/auth" className="text-mzansi-teal underline font-semibold">sign in</a> to access.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-2">
        <a href="/admin" className="text-mzansi-teal hover:text-teal-700 font-sans text-sm">&larr; Admin</a>
      </div>
      <h1 className="heading-bold text-4xl text-mzansi-black mb-2">Pending Submissions</h1>
      <p className="text-gray-500 font-sans mb-8">
        Community-submitted spots waiting for approval. Approve to make them visible on the site.
      </p>
      <div className="ndebele-border mb-8" />

      {vendors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="heading-bold text-2xl text-gray-300 mb-2">All clear</p>
          <p className="text-gray-400 font-sans text-sm">No pending submissions right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendors.map((v) => (
            <div
              key={v.$id}
              className="bg-white rounded-xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-mzansi-black">{v.name}</h3>
                <p className="text-sm text-gray-500 font-sans">{v.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                      v.category === 'kota'
                        ? 'bg-mzansi-yellow text-mzansi-black'
                        : 'bg-mzansi-red text-white'
                    }`}
                  >
                    {v.category}
                  </span>
                  <span className="text-xs text-gray-400 font-sans">
                    Submitted {new Date(v.$createdAt).toLocaleDateString('en-ZA')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => approve(v.$id)}
                  className="px-5 py-2 rounded-lg font-semibold text-sm bg-green-100 text-green-700 hover:bg-green-200 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(v.$id)}
                  className="px-5 py-2 rounded-lg font-semibold text-sm bg-red-100 text-red-700 hover:bg-red-200 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
