import type { Metadata } from 'next';
import { ENDPOINT, PROJECT_ID, DATABASE_ID } from '../../../lib/appwrite';
import VendorClient from './VendorClient';

export const revalidate = 86400;

const API_KEY = process.env.APPWRITE_API_KEY ?? '';

const serverHeaders = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

interface VendorDoc {
  $id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  category: string;
  phone: string;
  photos: string;
  price_range: string;
  latitude?: number;
  longitude?: number;
}

async function fetchVendor(id: string): Promise<VendorDoc | null> {
  try {
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents/${id}`,
      { headers: serverHeaders, next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const queries = [
      `queries[]=${encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'is_vetted', values: [true] }))}`,
      `queries[]=${encodeURIComponent(JSON.stringify({ method: 'limit', values: [500] }))}`,
    ].join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents?${queries}`,
      { headers: serverHeaders }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.documents ?? []).map((d: { $id: string }) => ({ id: d.$id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vendor = await fetchVendor(id);

  if (!vendor) {
    return {
      title: 'Spot Not Found | Kota & Bunny Explorer',
      description: 'This street food spot could not be found.',
    };
  }

  const categoryLabel = vendor.category === 'kota' ? 'Kota' : 'Bunny Chow';
  const cityFromAddress = vendor.address.split(',').slice(-2, -1)[0]?.trim() ?? 'South Africa';
  const title = `${vendor.name} | ${categoryLabel} in ${cityFromAddress} | Kota & Bunny Explorer`;
  const description = `${vendor.name} is a ${categoryLabel} spot in ${cityFromAddress}. Rated ${vendor.rating.toFixed(1)}/5 from ${vendor.review_count} reviews. Find directions, hours, and community reviews on Kota & Bunny Explorer.`;

  let ogImage = 'https://www.kotabunny.co.za/og-default.jpg';
  if (vendor.photos) {
    try {
      const photos = JSON.parse(vendor.photos);
      if (photos.length > 0) ogImage = photos[0];
    } catch { /* use default */ }
  }

  return {
    title,
    description,
    keywords: [
      `${vendor.name} ${cityFromAddress}`,
      `best ${categoryLabel} in ${cityFromAddress}`,
      `${categoryLabel} ${cityFromAddress}`,
      `${vendor.name} reviews`,
      'South African street food',
      'kota street food',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${categoryLabel} at ${vendor.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://www.kotabunny.co.za/vendor/${id}`,
    },
  };
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await fetchVendor(id);

  const cityFromAddress = vendor?.address.split(',').slice(-2, -1)[0]?.trim() ?? 'South Africa';
  const categoryLabel = vendor?.category === 'kota' ? 'Kota' : 'Bunny Chow';

  const jsonLd = vendor
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: vendor.name,
        description: `${categoryLabel} spot in ${cityFromAddress}, South Africa`,
        servesCuisine: `South African ${categoryLabel}`,
        priceRange: vendor.price_range || 'R10–R100',
        telephone: vendor.phone || undefined,
        url: `https://www.kotabunny.co.za/vendor/${id}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: vendor.address,
          addressCountry: 'ZA',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: vendor.rating,
          reviewCount: vendor.review_count,
          bestRating: 5,
          worstRating: 1,
        },
        ...(vendor.latitude && vendor.longitude
          ? { geo: { '@type': 'GeoCoordinates', latitude: vendor.latitude, longitude: vendor.longitude } }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <VendorClient vendorId={id} />
    </>
  );
}
