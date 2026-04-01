'use client';

import { useState } from 'react';
import { createDocument, getAccount, updateDocument, DATABASE_ID } from '../../lib/appwrite';
import AuthModal from './AuthModal';

interface UpvoteButtonProps {
  vendorId: string;
  initialUpvotes: number;
}

export default function UpvoteButton({ vendorId, initialUpvotes }: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [voted, setVoted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  async function doUpvote() {
    if (voted) return;

    let user;
    try {
      user = await getAccount();
    } catch {
      setShowAuth(true);
      return;
    }

    try {
      await createDocument(DATABASE_ID, 'upvotes', {
        vendor_id: vendorId,
        user_id: user.$id || user.email,
      });

      const newCount = upvotes + 1;
      await updateDocument(DATABASE_ID, 'vendors', vendorId, { upvote_count: newCount });

      setUpvotes(newCount);
      setVoted(true);
    } catch {
      // silently fail
    }
  }

  return (
    <>
      <button
        onClick={doUpvote}
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

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={doUpvote}
        actionLabel="upvote"
      />
    </>
  );
}
