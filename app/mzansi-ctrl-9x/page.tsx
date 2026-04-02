'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl text-mzansi-black mb-2">Admin Panel</h1>
      <p className="text-gray-500 font-sans mb-8">Manage vendors and community submissions.</p>
      <div className="ndebele-border mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/mzansi-ctrl-9x/pending" className="block bg-white rounded-2xl shadow-md p-8 vendor-card text-center">
          <div className="w-16 h-16 bg-mzansi-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-mzansi-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="heading-bold text-xl text-mzansi-black mb-1">Pending Submissions</h2>
          <p className="text-gray-400 font-sans text-sm">Review and approve community-submitted spots</p>
        </Link>

        <Link href="/mzansi-ctrl-9x/images" className="block bg-white rounded-2xl shadow-md p-8 vendor-card text-center">
          <div className="w-16 h-16 bg-mzansi-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="heading-bold text-xl text-mzansi-black mb-1">Manage Images</h2>
          <p className="text-gray-400 font-sans text-sm">Review, remove, and lock vendor photos</p>
        </Link>
      </div>
    </div>
  );
}
