'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createDocument, DATABASE_ID } from '../../../../lib/appwrite';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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

  function handleTitleChange(value: string) {
    setForm((f) => ({ ...f, title: value, slug: slugify(value) }));
  }

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.excerpt || !form.body) {
      setError('Title, slug, excerpt and body are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createDocument(DATABASE_ID, 'articles', {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        published_at: new Date(form.published_at).toISOString(),
      });
      router.push('/mzansi-ctrl-9x/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-bold text-3xl text-mzansi-black">New Article</h1>
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
            {saving ? 'Saving...' : 'Create Article'}
          </button>
          <Link href="/mzansi-ctrl-9x/articles" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-sans hover:border-gray-400">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export function ArticleFormFields({
  form,
  onTitleChange,
  onChange,
}: {
  form: Record<string, string | boolean>;
  onTitleChange: (v: string) => void;
  onChange: (field: string, value: string | boolean) => void;
}) {
  return (
    <>
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title as string}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal"
          placeholder="Easy Kota Recipe for 2"
          required
        />
        <p className="text-xs text-gray-400 mt-1 font-sans">URL: /articles/{form.slug as string || 'auto-generated'}</p>
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">Slug</label>
        <input
          type="text"
          value={form.slug as string}
          onChange={(e) => onChange('slug', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal font-mono"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">
          Excerpt <span className="text-red-500">*</span>{' '}
          <span className="text-gray-400 font-normal">({(form.excerpt as string).length}/500)</span>
        </label>
        <textarea
          value={form.excerpt as string}
          onChange={(e) => onChange('excerpt', e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal resize-none"
          placeholder="A short description shown in article cards and meta description..."
          required
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">
          Body <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-1 font-sans">Supports: ## H2, ### H3, - bullet lists, plain paragraphs</p>
        <textarea
          value={form.body as string}
          onChange={(e) => onChange('body', e.target.value)}
          rows={16}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal resize-y font-mono"
          placeholder="## What is a Kota?&#10;&#10;A kota is a quarter loaf of bread filled with chips..."
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">Category</label>
        <select
          value={form.category as string}
          onChange={(e) => onChange('category', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal"
        >
          <option value="kota">Kota</option>
          <option value="bunny-chow">Bunny Chow</option>
          <option value="recipe">Recipe</option>
          <option value="guide">Guide</option>
          <option value="culture">Culture</option>
        </select>
      </div>

      {/* Cover image */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">Cover Image URL</label>
        <input
          type="url"
          value={form.cover_image_url as string}
          onChange={(e) => onChange('cover_image_url', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal"
          placeholder="https://..."
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">Author Name</label>
        <input
          type="text"
          value={form.author_name as string}
          onChange={(e) => onChange('author_name', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal"
          placeholder="e.g. Leama"
        />
      </div>

      {/* SEO Title */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">
          SEO Title{' '}
          <span className="text-gray-400 font-normal">({(form.seo_title as string).length}/70 · leave blank to use title)</span>
        </label>
        <input
          type="text"
          value={form.seo_title as string}
          onChange={(e) => onChange('seo_title', e.target.value)}
          maxLength={70}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal"
        />
      </div>

      {/* SEO Description */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">
          SEO Description{' '}
          <span className="text-gray-400 font-normal">({(form.seo_description as string).length}/160 · leave blank to use excerpt)</span>
        </label>
        <textarea
          value={form.seo_description as string}
          onChange={(e) => onChange('seo_description', e.target.value)}
          rows={2}
          maxLength={160}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">
          Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={form.tags as string}
          onChange={(e) => onChange('tags', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal"
          placeholder="kota recipe, kota ingredients, easy kota"
        />
      </div>

      {/* Related vendor */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">
          Related Vendor ID <span className="text-gray-400 font-normal">(optional — shows a spot CTA)</span>
        </label>
        <input
          type="text"
          value={form.related_vendor_id as string}
          onChange={(e) => onChange('related_vendor_id', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm font-mono focus:outline-none focus:border-mzansi-teal"
          placeholder="Appwrite document ID"
        />
      </div>

      {/* Published at */}
      <div>
        <label className="block text-sm font-semibold text-mzansi-black mb-1 font-sans">Publish Date</label>
        <input
          type="datetime-local"
          value={form.published_at as string}
          onChange={(e) => onChange('published_at', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-mzansi-teal"
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_published"
          checked={form.is_published as boolean}
          onChange={(e) => onChange('is_published', e.target.checked)}
          className="w-4 h-4 accent-mzansi-teal"
        />
        <label htmlFor="is_published" className="text-sm font-semibold text-mzansi-black font-sans">
          Publish immediately
        </label>
      </div>
    </>
  );
}
