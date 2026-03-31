'use client';

import { useEffect } from 'react';
import { ping } from '../../lib/appwrite';

export default function AppwritePing() {
  useEffect(() => {
    ping()
      .then(() => console.log('Appwrite connection verified'))
      .catch((err: unknown) => console.error('Appwrite ping failed:', err));
  }, []);

  return null;
}
