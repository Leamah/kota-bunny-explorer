'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-mzansi-black text-white">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="heading-bold text-mzansi-yellow text-xl tracking-wide">
          Kota &amp; Bunny
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase tracking-wider">
          <Link href="/kota" className="hover:text-mzansi-yellow transition">Kota</Link>
          <Link href="/bunny-chow" className="hover:text-mzansi-yellow transition">Bunny Chow</Link>
          <Link href="/recipes" className="hover:text-mzansi-yellow transition">Recipes</Link>
          <Link href="/auth" className="bg-mzansi-yellow text-mzansi-black px-4 py-1.5 rounded-full hover:bg-yellow-300 transition">
            Sign In
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-700 px-4 py-4 space-y-3 text-sm font-semibold uppercase">
          <Link href="/kota" onClick={() => setOpen(false)} className="block hover:text-mzansi-yellow">Kota</Link>
          <Link href="/bunny-chow" onClick={() => setOpen(false)} className="block hover:text-mzansi-yellow">Bunny Chow</Link>
          <Link href="/recipes" onClick={() => setOpen(false)} className="block hover:text-mzansi-yellow">Recipes</Link>
          <Link href="/auth" onClick={() => setOpen(false)} className="block text-mzansi-yellow">Sign In</Link>
        </div>
      )}
    </nav>
  );
}
