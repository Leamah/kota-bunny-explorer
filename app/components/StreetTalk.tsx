'use client';

import { useEffect, useState } from 'react';
import { listDocuments, createDocument, getAccount } from '../../lib/appwrite';

interface Review {
  $id: string;
  user_id: string;
  content: string;
  rating: number;
  $createdAt: string;
}

const DATABASE_ID = 'kota-bunny-db';
const REVIEWS_COLLECTION_ID = 'reviews';

export default function StreetTalk({ vendorId }: { vendorId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'auth-needed' | 'error'>('idle');

  useEffect(() => {
    listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [
      `equal("vendor_id", "${vendorId}")`,
    ])
      .then((res: { documents: Review[] }) => setReviews(res.documents))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [vendorId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    let user;
    try {
      user = await getAccount();
    } catch {
      setStatus('auth-needed');
      setSubmitting(false);
      return;
    }

    try {
      const newReview = await createDocument(DATABASE_ID, REVIEWS_COLLECTION_ID, {
        vendor_id: vendorId,
        user_id: user.email || user.$id,
        content,
        rating,
      });
      setReviews((prev) => [newReview as unknown as Review, ...prev]);
      setContent('');
      setRating(5);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={`w-8 h-8 ${i <= value ? 'star-filled' : 'text-gray-300'} hover:text-yellow-400 transition`}
          >
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Review submission form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="font-semibold font-sans text-mzansi-black mb-4">Drop your review</h3>

        {status === 'success' && (
          <p className="text-green-600 font-sans text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
            Review posted!
          </p>
        )}
        {status === 'auth-needed' && (
          <p className="text-yellow-700 font-sans text-sm bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mb-4">
            Please <a href="/auth" className="underline font-semibold">sign in</a> to leave a review.
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-600 font-sans text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            Something went wrong. Try again.
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-sans text-gray-600 mb-1">Your rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <textarea
          required
          rows={3}
          placeholder="What did you think? How was the food?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mzansi-yellow font-sans text-sm mb-4"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-mzansi-red text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition disabled:opacity-50"
        >
          {submitting ? 'Posting...' : 'Post Review'}
        </button>
      </form>

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-1" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-mzansi-cream rounded-xl p-8 text-center">
          <p className="text-gray-400 font-sans text-sm">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.$id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i <= review.rating ? 'star-filled' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-sans">
                  {new Date(review.$createdAt).toLocaleDateString('en-ZA')}
                </span>
              </div>
              <p className="text-gray-700 font-sans text-sm leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
