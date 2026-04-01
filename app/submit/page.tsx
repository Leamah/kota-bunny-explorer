'use client';

import { useState } from 'react';
import { createDocument, getAccount, DATABASE_ID } from '../../lib/appwrite';
import AuthModal from '../components/AuthModal';

export default function SubmitPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('kota');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      await getAccount();
    } catch {
      setShowAuth(true);
      setStatus('idle');
      return;
    }

    try {
      await createDocument(DATABASE_ID, 'vendors', {
        name,
        address,
        category,
        rating: 0,
        review_count: 0,
        source: 'community',
        is_vetted: false,
        upvotes: 0,
      });
      setStatus('success');
      setName('');
      setAddress('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setStatus('error');
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl text-mzansi-black mb-2">Submit a Spot</h1>
      <p className="text-gray-500 font-sans mb-8">
        Know a hidden gem? Share it with the community. All submissions are vetted before going live.
      </p>
      <div className="ndebele-border mb-8" />

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-700 font-sans font-semibold">Spot submitted! It will appear once vetted by our team.</p>
        </div>
      )}

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
        actionLabel="submit a spot"
      />

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 font-sans text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold font-sans text-gray-700 mb-1">Spot Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bra Mike's Kota Corner"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mzansi-yellow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold font-sans text-gray-700 mb-1">Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 123 Vilakazi St, Soweto"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mzansi-yellow"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold font-sans text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mzansi-yellow"
          >
            <option value="kota">Kota</option>
            <option value="bunny-chow">Bunny Chow</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-mzansi-red text-white py-3 rounded-lg heading-bold text-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Spot'}
        </button>
      </form>
    </div>
  );
}
