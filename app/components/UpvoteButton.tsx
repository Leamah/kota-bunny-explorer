'use client';

import { useState } from 'react';
import { createDocument, getAccount } from '../../lib/appwrite';

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '69cc168e00183ee74608';
const DATABASE_ID = 'kota-bunny-db';

interface UpvoteButtonProps {
  vendorId: string;
  initialUpvotes: number;
}

export default function UpvoteButton({ vendorId, initialUpvotes }: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [voted, setVoted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'auth-needed'>('idle');

  async function handleUpvote() {
    if (voted) return;

    let user;
    try {
      user = await getAccount();
    } catch {
      setStatus('auth-needed');
      return;
    }

    try {
      await createDocument(DATABASE_ID, 'upvotes', {
        vendor_id: vendorId,
        user_id: user.$id || user.email,
      });

      // Update vendor upvote count
      const newCount = upvotes + 1;
      await fetch(`${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents/${vendorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
        },
        credentials: 'include',
        body: JSON.stringify({ data: { upvotes: newCount } }),
      });

      setUpvotes(newCount);
      setVoted(true);
    } catch {
      // silently fail
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleUpvote}
        disabled={voted}
        className={`flex flex-col items-center gap-1 px-6 py-3 rounded-xl font-semibold transition ${
          voted
            ? 'bg-mzansi-teal text-white'
            : 'bg-mzansi-cream text-mzansi-teal hover:bg-teal-50 border-2 border-mzansi-teal'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        <span className="heading-bold text-2xl">{upvotes}</span>
        <span className="text-xs font-sans uppercase tracking-wider">
          {voted ? 'Upvoted' : 'Upvote'}
        </span>
      </button>
      {status === 'auth-needed' && (
        <p className="text-yellow-600 text-xs font-sans mt-2">
          <a href="/auth" className="underline">Sign in</a> to upvote
        </p>
      )}
    </div>
  );
}
