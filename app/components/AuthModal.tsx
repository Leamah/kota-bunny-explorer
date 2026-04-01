'use client';

import { useState } from 'react';
import { createOAuth2Session, createPhoneSession, updatePhoneSession } from '../../lib/appwrite';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionLabel?: string;
}

type Step = 'choose' | 'phone-input' | 'otp-input';

export default function AuthModal({ isOpen, onClose, onSuccess, actionLabel = 'continue' }: AuthModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [phone, setPhone] = useState('+27');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleGoogle() {
    const currentUrl = window.location.href;
    const url = await createOAuth2Session('google', currentUrl, currentUrl);
    window.location.href = url;
  }

  async function handleSendOtp() {
    setError('');
    setLoading(true);
    try {
      const session = await createPhoneSession(phone);
      setUserId(session.userId);
      setStep('otp-input');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError('');
    setLoading(true);
    try {
      await updatePhoneSession(userId, otp);
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setStep('choose');
    setPhone('+27');
    setOtp('');
    setError('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="heading-bold text-xl text-mzansi-black text-center mb-1">
          Sign in to {actionLabel}
        </h2>
        <p className="text-gray-400 font-sans text-sm text-center mb-6">
          Quick and easy, no password needed
        </p>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 font-sans">
            {error}
          </p>
        )}

        {step === 'choose' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 font-semibold font-sans hover:border-gray-400 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => setStep('phone-input')}
              className="w-full flex items-center justify-center gap-3 bg-green-600 text-white rounded-xl px-4 py-3.5 font-semibold font-sans hover:bg-green-700 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Continue with WhatsApp
            </button>
          </div>
        )}

        {step === 'phone-input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-semibold text-gray-700 mb-1">
                Phone number (SA format)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 81 234 5678"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 font-sans"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading || phone.length < 10}
              className="w-full bg-green-600 text-white rounded-xl px-4 py-3 font-semibold font-sans hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP via WhatsApp'}
            </button>
            <button
              onClick={() => setStep('choose')}
              className="w-full text-gray-500 font-sans text-sm hover:text-gray-700"
            >
              Back
            </button>
          </div>
        )}

        {step === 'otp-input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-semibold text-gray-700 mb-1">
                Enter the 6-digit code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 font-sans"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 text-white rounded-xl px-4 py-3 font-semibold font-sans hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              onClick={() => setStep('phone-input')}
              className="w-full text-gray-500 font-sans text-sm hover:text-gray-700"
            >
              Resend code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
