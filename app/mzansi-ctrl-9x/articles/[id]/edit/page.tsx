'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDocument, updateDocument, DATABASE_ID } from '../../../../../lib/appwrite';
import { ArticleFormFields } from '../../new/page';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    category: 'kota',
    cover_image_url: '',
    author_name: '',
    seo_title: '',
    seo_description: '',
    tags: '',
    related_vendor_id: '',
    published_at: new Date().toISOString().slice(0, 16),
    is_published: false,
  });

  useEffect(() => {
    getDocument(DATABASE_ID, 'articles', id)
      .then((data) => {
        if (data.code) throw new Error(data.message);
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          excerpt: data.excerpt ?? '',
          body: data.body ?? '',
          category: data.category ?? 'kota',
          cover_image_url: data.cover_image_url ?? '',
          author_name: data.author_name ?? '',
          seo_title: data.seo_title ?? '',
          seo_description: data.seo_description ?? '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          related_vendor_id: data.related_vendor_id ?? '',
          published_at: data.published_at
            ? new Date(data.published_at).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          is_published: data.is_published ?? false,
        });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleTitleChange(value: string) {
    setForm((f) => ({ ...f, title: value, slug: slugify(value) }));
  }

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateDocument(DATABASE_ID, 'articles', id, {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        published_at: new Date(form.published_at).toISOString(),
      });
      router.push('/mzansi-ctrl-9x/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-bold text-3xl text-mzansi-black">Edit Article</h1>
        <Link href="/mzansi-ctrl-9x/articles" className="text-gray-400 font-sans text-sm hover:text-mzansi-black">
          ← Back
        </Link>
      </div>
      <div className="ndebele-border mb-8" />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-sans text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ArticleFormFields form={form} onTitleChange={handleTitleChange} onChange={update} />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-mzansi-black text-mzansi-yellow font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href={`/articles/${form.slug}`}
            target="_blank"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-sans hover:border-gray-400"
          >
            Preview
          </Link>
        </div>
      </form>
    </div>
  );
}
