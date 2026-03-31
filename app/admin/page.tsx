'use client';

import { useEffect, useState } from 'react';
import { listDocuments, getAccount } from '../../lib/appwrite';

interface Vendor {
  $id: string;
  name: string;
  address: string;
  category: string;
  is_vetted: boolean;
}

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69cc168e00183ee74608';
const DATABASE_ID = 'kota-bunny-db';
const VENDORS_COLLECTION_ID = 'vendors';

export default function AdminPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    getAccount()
      .then(() => {
        setAuthed(true);
        return loadVendors();
      })
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);

  async function loadVendors() {
    const res = await listDocuments(DATABASE_ID, VENDORS_COLLECTION_ID);
    setVendors(res.documents as Vendor[]);
  }

  async function toggleVet(vendorId: string, currentStatus: boolean) {
    await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/${VENDORS_COLLECTION_ID}/documents/${vendorId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
      },
      credentials: 'include',
      body: JSON.stringify({ data: { is_vetted: !currentStatus } }),
    });
    setVendors((prev) =>
      prev.map((v) => (v.$id === vendorId ? { ...v, is_vetted: !currentStatus } : v))
    );
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
          Please <a href="/auth" className="text-mzansi-teal underline font-semibold">sign in</a> to access the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl text-mzansi-black mb-2">Admin Panel</h1>
      <p className="text-gray-500 font-sans mb-8">Vet community-submitted spots.</p>
      <div className="ndebele-border mb-8" />

      {vendors.length === 0 ? (
        <p className="text-gray-400 font-sans text-center py-8">No vendor submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {vendors.map((v) => (
            <div
              key={v.$id}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-mzansi-black">{v.name}</h3>
                <p className="text-sm text-gray-500 font-sans">{v.address}</p>
                <span
                  className={`inline-block mt-1 text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                    v.category === 'kota'
                      ? 'bg-mzansi-yellow text-mzansi-black'
                      : 'bg-mzansi-red text-white'
                  }`}
                >
                  {v.category}
                </span>
              </div>
              <button
                onClick={() => toggleVet(v.$id, v.is_vetted)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  v.is_vetted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {v.is_vetted ? 'Vetted' : 'Not Vetted'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
