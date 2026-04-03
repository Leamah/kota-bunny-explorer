import type { Metadata } from 'next';
import Link from 'next/link';
import { ENDPOINT, PROJECT_ID, DATABASE_ID } from '../../../lib/appwrite';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, string> = {
  kota: 'Kota',
  'bunny-chow': 'Bunny Chow',
  culture: 'Culture',
  recipe: 'Recipe',
  guide: 'Guide',
};

interface Article {
  $id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image_url?: string;
  author_name?: string;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
  related_vendor_id?: string;
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': process.env.APPWRITE_API_KEY ?? '',
  };
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const queries = [
      JSON.stringify({ method: 'equal', attribute: 'slug', values: [slug] }),
      JSON.stringify({ method: 'equal', attribute: 'is_published', values: [true] }),
      JSON.stringify({ method: 'limit', values: [1] }),
    ];
    const params = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/articles/documents?${params}`,
      { headers: getHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.documents?.[0] ?? null;
  } catch {
    return null;
  }
}

async function getRelatedVendor(id: string) {
  try {
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/vendors/documents/${id}`,
      { headers: getHeaders(), next: { revalidate: 86400 } }
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
      JSON.stringify({ method: 'equal', attribute: 'is_published', values: [true] }),
      JSON.stringify({ method: 'limit', values: [200] }),
    ];
    const params = queries.map((q) => `queries[]=${encodeURIComponent(q)}`).join('&');
    const res = await fetch(
      `${ENDPOINT}/databases/${DATABASE_ID}/collections/articles/documents?${params}`,
      { headers: getHeaders() }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.documents ?? []).map((d: { slug: string }) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  const title = article.seo_title || article.title;
  const description = article.seo_description || article.excerpt;
  const image = article.cover_image_url || 'https://www.kotabunny.co.za/og-default.jpg';

  return {
    title,
    description,
    keywords: [
      ...(article.tags ?? []),
      'kota street food',
      'South African street food',
      CATEGORY_LABELS[article.category] ?? '',
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.published_at,
      authors: article.author_name ? [article.author_name] : undefined,
      tags: article.tags,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: { canonical: `https://www.kotabunny.co.za/articles/${slug}` },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const relatedVendor = article.related_vendor_id
    ? await getRelatedVendor(article.related_vendor_id)
    : null;

  const categoryHref = article.category === 'kota' ? '/kota' : article.category === 'bunny-chow' ? '/bunny-chow' : '/articles';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      '@type': 'Person',
      name: article.author_name || 'Kota & Bunny Explorer',
    },
    publisher: {
      '@id': 'https://www.kotabunny.co.za/#organization',
    },
    image: article.cover_image_url || 'https://www.kotabunny.co.za/og-default.jpg',
    mainEntityOfPage: `https://www.kotabunny.co.za/articles/${slug}`,
    keywords: (article.tags ?? []).join(', '),
  };

  // Render simple markdown (bold, italic, headings, bullets, line breaks)
  function renderBody(text: string) {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="heading-bold text-2xl text-mzansi-black mt-8 mb-3">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="heading-bold text-xl text-mzansi-black mt-6 mb-2">{line.slice(4)}</h3>;
        if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="mb-3">{line}</p>;
      });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm font-sans text-gray-500 mb-6 flex gap-2 items-center flex-wrap">
          <Link href="/" className="hover:text-mzansi-teal">Home</Link>
          <span>›</span>
          <Link href="/articles" className="hover:text-mzansi-teal">Guides</Link>
          <span>›</span>
          <Link href={categoryHref} className="hover:text-mzansi-teal capitalize">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </Link>
          <span>›</span>
          <span className="text-mzansi-black line-clamp-1">{article.title}</span>
        </nav>

        {/* Category + date */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-mzansi-yellow text-mzansi-black">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
          <span className="text-sm text-gray-400 font-sans">
            {new Date(article.published_at).toLocaleDateString('en-ZA', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
          {article.author_name && (
            <span className="text-sm text-gray-400 font-sans">by {article.author_name}</span>
          )}
        </div>

        <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-4">{article.title}</h1>
        <p className="text-xl text-gray-600 font-sans mb-6">{article.excerpt}</p>

        {article.cover_image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={article.cover_image_url}
              alt={`${article.title} — kota street food`}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        <div className="ndebele-border mb-8" />

        {/* Article body */}
        <div className="text-gray-700 font-sans leading-relaxed text-base">
          {renderBody(article.body)}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-sans">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related vendor CTA */}
        {relatedVendor && (
          <div className="mt-10 p-5 bg-mzansi-yellow rounded-2xl">
            <p className="heading-bold text-lg text-mzansi-black mb-1">Featured Spot</p>
            <p className="text-sm font-sans text-mzansi-black mb-3">{relatedVendor.name} — {relatedVendor.address}</p>
            <Link
              href={`/vendor/${relatedVendor.$id}`}
              className="inline-block bg-mzansi-black text-mzansi-yellow font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90"
            >
              View Spot →
            </Link>
          </div>
        )}

        {/* Internal links */}
        <section className="mt-12 p-5 bg-white rounded-2xl shadow-sm">
          <h2 className="heading-bold text-lg text-mzansi-black mb-3">Keep Exploring</h2>
          <ul className="space-y-2 font-sans text-sm">
            <li><Link href="/kota" className="text-mzansi-teal hover:underline">Best Kota in South Africa</Link></li>
            <li><Link href="/kota/soweto" className="text-mzansi-teal hover:underline">Best Kota in Soweto</Link></li>
            <li><Link href="/bunny-chow/durban" className="text-mzansi-teal hover:underline">Best Bunny Chow in Durban</Link></li>
            <li><Link href="/recipes" className="text-mzansi-teal hover:underline">Easy Kota Recipes</Link></li>
            <li><Link href="/articles" className="text-mzansi-teal hover:underline">More Street Food Guides</Link></li>
            <li><Link href="/submit" className="text-mzansi-teal hover:underline">Submit a Street Food Spot</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
