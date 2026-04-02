'use client';

import { useState } from 'react';
import { createDocument, getAccount, DATABASE_ID } from '../../lib/appwrite';
import AuthModal from '../components/AuthModal';

export default function SubmitPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('kota');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

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
      // If image was uploaded, convert to base64 data URL for storage
      let imageData = '';
      if (imageFile) {
        imageData = imagePreview || '';
      }

      await createDocument(DATABASE_ID, 'vendors', {
        name,
        address,
        category,
        rating: 0,
        review_count: 0,
        source: 'community',
        is_vetted: false,
        upvote_count: 0,
        photos: imageData ? JSON.stringify([imageData]) : '',
      });
      setStatus('success');
      setName('');
      setAddress('');
      setImageFile(null);
      setImagePreview(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setStatus('error');
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl text-mzansi-black mb-2">Submit a Spot</h1>
      <p className="text-gray-500 font-sans mb-8">
        Know a hidden gem? Share it with the community.
      </p>
      <div className="ndebele-border mb-8" />

      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-700 font-sans font-semibold">Spot submitted! Thanks for sharing.</p>
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold font-sans text-gray-700 mb-1">Upload Image</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:border-mzansi-yellow hover:bg-yellow-50 transition"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-sans text-gray-500">
                {imageFile ? imageFile.name : 'Tap to upload a photo'}
              </span>
            </label>
          </div>
          {imagePreview && (
            <div className="mt-3 relative">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
              >
                X
              </button>
            </div>
          )}
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
