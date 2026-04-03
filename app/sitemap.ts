import type { MetadataRoute } from 'next';
import { ENDPOINT, PROJECT_ID, DATABASE_ID } from '../lib/appwrite';

export const dynamic = 'force-dynamic';

const API_KEY = process.env.APPWRITE_API_KEY ?? '';

const serverHeaders = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

async function getVendorIds(): Promise<{ id: string; updatedAt: string }[]> {
  try {
    const queries = [
      JSON.stringify({ method: 'equal', attribute: 'is_vetted', values: [true] }),
      JSON.stringify({ method: 'limit', values: [500] }),
    ];
    const params = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents?${params}`,
      { headers: serverHeaders }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.documents ?? []).map((d: { $id: string; $updatedAt: string }) => ({
      id: d.$id,
      updatedAt: d.$updatedAt,
    }));
  } catch {
    return [];
  }
}

async function getArticleSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const queries = [
      JSON.stringify({ method: 'equal', attribute: 'is_published', values: [true] }),
      JSON.stringify({ method: 'limit', values: [200] }),
    ];
    const params = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/articles/documents?${params}`,
      { headers: serverHeaders }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.documents ?? []).map((d: { slug: string; $updatedAt: string }) => ({
      slug: d.slug,
      updatedAt: d.$updatedAt,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.kotabunny.co.za';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/kota`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${base}/bunny-chow`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${base}/recipes`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/articles`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
  ];

  const kotaCities = [
    'soweto', 'johannesburg', 'pretoria', 'soshanguve', 'tembisa',
    'alexandra', 'vosloorus', 'katlehong', 'mamelodi', 'ekurhuleni',
  ];
  const bunnyCities = [
    'durban', 'johannesburg', 'cape-town', 'pretoria',
    'pietermaritzburg', 'phoenix', 'chatsworth', 'bluff', 'tongaat',
  ];

  const cityPages: MetadataRoute.Sitemap = [
    ...kotaCities.map((city) => ({
      url: `${base}/kota/${city}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...bunnyCities.map((city) => ({
      url: `${base}/bunny-chow/${city}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const [vendors, articles] = await Promise.all([getVendorIds(), getArticleSlugs()]);

  const vendorPages: MetadataRoute.Sitemap = vendors.map(({ id, updatedAt }) => ({
    url: `${base}/vendor/${id}`,
    lastModified: new Date(updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map(({ slug, updatedAt }) => ({
    url: `${base}/articles/${slug}`,
    lastModified: new Date(updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...cityPages, ...vendorPages, ...articlePages];
}
