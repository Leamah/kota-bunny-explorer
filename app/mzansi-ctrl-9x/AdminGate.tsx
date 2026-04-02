'use client';

import { useEffect, useState, ReactNode } from 'react';
import { getAccount } from '../../lib/appwrite';

const ADMIN_PASSPHRASE = 'kotabunny2024';

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const [phase, setPhase] = useState<'loading' | 'passphrase' | 'auth' | 'granted'>('loading');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already unlocked this session
    const unlocked = sessionStorage.getItem('admin_unlocked');
    if (unlocked === 'true') {
      checkAuth();
    } else {
      setPhase('passphrase');
    }
  }, []);

  async function checkAuth() {
    try {
      await getAccount();
      setPhase('granted');
    } catch {
      setPhase('auth');
    }
  }

  function handlePassphrase(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PASSPHRASE) {
      sessionStorage.setItem('admin_unlocked', 'true');
      setError('');
      checkAuth();
    } else {
      setError('Wrong passphrase');
      setInput('');
    }
  }

  if (phase === 'loading') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 font-sans">Loading...</p>
      </div>
    );
  }

  if (phase === 'passphrase') {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-mzansi-black rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-mzansi-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="heading-bold text-xl text-mzansi-black mb-6">Access Required</h1>
          <form onSubmit={handlePassphrase} className="space-y-4">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter passphrase"
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-mzansi-yellow font-sans"
            />
            {error && <p className="text-red-500 font-sans text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-mzansi-black text-white py-3 rounded-lg font-sans font-semibold hover:bg-gray-800 transition"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (phase === 'auth') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-mzansi-red rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="heading-bold text-xl text-mzansi-black mb-4">Sign In Required</h1>
          <p className="text-gray-500 font-sans text-sm mb-6">
            You need to be signed in to access this area.
          </p>
          <a
            href="/auth"
            className="inline-block bg-mzansi-teal text-white px-8 py-3 rounded-lg font-sans font-semibold hover:bg-teal-700 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
