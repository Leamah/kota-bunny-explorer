import type { Metadata } from 'next';
import Link from 'next/link';
import { ENDPOINT, PROJECT_ID, DATABASE_ID } from '../../lib/appwrite';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Street Food Stories & Guides',
  description:
    'Discover guides, recipes, and stories about South African kota street food and bunny chow. Easy kota recipes, kota ingredients, history of bunny chow, and more.',
  keywords: [
    'kota recipe easy',
    'kota ingredients',
    'kota street food guide',
    'bunny chow history',
    'South African street food guide',
    'easy kota recipe for 2',
    'healthy kota South Africa',
  ],
  openGraph: {
    title: 'Street Food Stories & Guides | Kota & Bunny Explorer',
    description: 'Guides, recipes, and stories about kota street food and bunny chow across South Africa.',
    type: 'website',
  },
  alternates: { canonical: 'https://www.kotabunny.co.za/articles' },
};

interface Article {
  $id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image_url?: string;
  author_name?: string;
  published_at: string;
  tags?: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  kota: 'Kota',
  'bunny-chow': 'Bunny Chow',
  culture: 'Culture',
  recipe: 'Recipe',
  guide: 'Guide',
};

async function getArticles(): Promise<Article[]> {
  try {
    const API_KEY = process.env.APPWRITE_API_KEY ?? '';
    const queries = [
      JSON.stringify({ method: 'equal', attribute: 'is_published', values: [true] }),
      JSON.stringify({ method: 'orderDesc', attribute: 'published_at' }),
      JSON.stringify({ method: 'limit', values: [50] }),
    ];
    const params = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/articles/documents?${params}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': PROJECT_ID,
          'X-Appwrite-Key': API_KEY,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.documents ?? [];
  } catch {
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kota & Bunny Chow Street Food Guides',
    url: 'https://www.kotabunny.co.za/articles',
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.title,
      url: `https://www.kotabunny.co.za/articles/${a.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <nav className="text-sm font-sans text-gray-500 mb-6 flex gap-2 items-center">
          <Link href="/" className="hover:text-mzansi-teal">Home</Link>
          <span>›</span>
          <span className="text-mzansi-black">Street Food Guides</span>
        </nav>

        <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-3">
          Street Food Stories & Guides
        </h1>
        <p className="text-gray-600 font-sans mb-8 max-w-2xl">
          Easy kota recipes, kota ingredients explained, the history of bunny chow, healthy kota options,
          and everything else about South African kota street food culture.
        </p>
        <div className="ndebele-border mb-10" />

        {articles.length === 0 ? (
          <p className="text-gray-500 font-sans text-center py-16">
            Articles coming soon. In the meantime,{' '}
            <Link href="/kota" className="text-mzansi-teal hover:underline">browse kota spots</Link>.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.$id}
                href={`/articles/${article.slug}`}
                className="block bg-white rounded-2xl shadow-md overflow-hidden vendor-card group"
              >
                {article.cover_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.cover_image_url}
                      alt={`${article.title} — kota street food guide`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-mzansi-yellow text-mzansi-black">
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </span>
                    <span className="text-xs text-gray-400 font-sans">
                      {new Date(article.published_at).toLocaleDateString('en-ZA', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="heading-bold text-lg text-mzansi-black mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 font-sans text-sm line-clamp-3">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Internal links */}
        <section className="mt-16 p-6 bg-white rounded-2xl shadow-sm">
          <h2 className="heading-bold text-xl text-mzansi-black mb-4">Explore South African Street Food</h2>
          <div className="flex flex-wrap gap-4 font-sans text-sm">
            <Link href="/kota" className="text-mzansi-teal hover:underline">Best Kota in South Africa</Link>
            <Link href="/kota/soweto" className="text-mzansi-teal hover:underline">Best Kota in Soweto</Link>
            <Link href="/kota/soshanguve" className="text-mzansi-teal hover:underline">Best Kota in Soshanguve</Link>
            <Link href="/bunny-chow" className="text-mzansi-teal hover:underline">Best Bunny Chow</Link>
            <Link href="/bunny-chow/durban" className="text-mzansi-teal hover:underline">Best Bunny Chow in Durban</Link>
            <Link href="/recipes" className="text-mzansi-teal hover:underline">Easy Kota Recipes</Link>
            <Link href="/submit" className="text-mzansi-teal hover:underline">Submit a Spot</Link>
          </div>
        </section>
      </div>
    </>
  );
}
