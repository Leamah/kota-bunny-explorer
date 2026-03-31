'use client';

import { useState } from 'react';

interface MapEmbedProps {
  address: string;
}

export default function MapEmbed({ address }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="w-full h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-mzansi-teal hover:bg-gray-50 transition cursor-pointer"
      >
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-sans text-gray-500">Tap to load map (saves data)</span>
      </button>
    );
  }

  const query = encodeURIComponent(address);
  return (
    <iframe
      className="w-full h-48 rounded-xl border-0"
      src={`https://www.google.com/maps?q=${query}&output=embed`}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={`Map of ${address}`}
    />
  );
}
