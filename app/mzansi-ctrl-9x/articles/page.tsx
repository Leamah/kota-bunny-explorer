'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listDocuments, updateDocument, DATABASE_ID, Query } from '../../../lib/appwrite';

interface Article {
  $id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  published_at: string;
  excerpt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    listDocuments(DATABASE_ID, 'articles', [
      Query.orderDesc('published_at'),
      Query.limit(100),
    ])
      .then((data) => setArticles(data.documents ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function togglePublish(article: Article) {
    setSaving(article.$id);
    try {
      await updateDocument(DATABASE_ID, 'articles', article.$id, {
        is_published: !article.is_published,
      });
      setArticles((prev) =>
        prev.map((a) =>
          a.$id === article.$id ? { ...a, is_published: !a.is_published } : a
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm('Unpublish and hide this article?')) return;
    setSaving(id);
    try {
      await updateDocument(DATABASE_ID, 'articles', id, { is_published: false });
      setArticles((prev) => prev.map((a) => (a.$id === id ? { ...a, is_published: false } : a)));
    } finally {
      setSaving(null);
    }
  }

  const CATEGORY_LABELS: Record<string, string> = {
    kota: 'Kota', 'bunny-chow': 'Bunny Chow', culture: 'Culture', recipe: 'Recipe', guide: 'Guide',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="heading-bold text-3xl text-mzansi-black">Manage Articles</h1>
          <p className="text-gray-500 font-sans text-sm mt-1">
            {articles.length} article{articles.length !== 1 ? 's' : ''} total ·{' '}
            {articles.filter((a) => a.is_published).length} published
          </p>
        </div>
        <Link
          href="/mzansi-ctrl-9x/articles/new"
          className="bg-mzansi-black text-mzansi-yellow font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition"
        >
          + New Article
        </Link>
      </div>
      <div className="ndebele-border mb-8" />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 font-sans mb-4">No articles yet.</p>
          <Link href="/mzansi-ctrl-9x/articles/new" className="text-mzansi-teal hover:underline font-sans">
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.$id}
              className={`flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4 ${
                !article.is_published ? 'opacity-60' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="heading-bold text-base text-mzansi-black truncate">{article.title}</h2>
                  <span className="shrink-0 text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-mzansi-cream text-mzansi-black">
                    {CATEGORY_LABELS[article.category] ?? article.category}
                  </span>
                  <span
                    className={`shrink-0 text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                      article.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-400 font-sans text-xs truncate">
                  /articles/{article.slug} ·{' '}
                  {new Date(article.published_at).toLocaleDateString('en-ZA')}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/articles/${article.slug}`}
                  target="_blank"
                  className="text-xs text-gray-400 hover:text-mzansi-teal font-sans px-3 py-1.5 rounded-lg border border-gray-200"
                >
                  View
                </Link>
                <Link
                  href={`/mzansi-ctrl-9x/articles/${article.$id}/edit`}
                  className="text-xs text-gray-600 hover:text-mzansi-black font-sans px-3 py-1.5 rounded-lg border border-gray-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => togglePublish(article)}
                  disabled={saving === article.$id}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    article.is_published
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {saving === article.$id ? '...' : article.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => deleteArticle(article.$id)}
                  disabled={saving === article.$id}
                  className="text-xs text-red-400 hover:text-red-600 font-sans px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-300"
                >
                  Hide
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/mzansi-ctrl-9x" className="text-gray-400 font-sans text-sm hover:text-mzansi-black">
          ← Back to Admin
        </Link>
      </div>
    </div>
  );
}
