import type { Metadata } from 'next';
import RecipeList from '../components/RecipeList';

export const metadata: Metadata = {
  title: 'Weekly Kota & Bunny Chow Recipes | Kota & Bunny Explorer',
  description:
    'Weekly AI-generated recipes for Kota and Bunny Chow. Easy ingredients, smart substitutions, street-style flavour.',
  keywords: ['Kota recipe', 'Bunny Chow recipe', 'South African street food recipe', 'how to make kota'],
};

export default function RecipesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="heading-bold text-4xl md:text-5xl text-mzansi-black mb-2">
        Weekly Recipes
      </h1>
      <p className="text-gray-500 font-sans mb-8">
        Fresh drops every week. Easy subs, no fancy stuff.
      </p>
      <div className="ndebele-border mb-8" />
      <RecipeList />
    </div>
  );
}
