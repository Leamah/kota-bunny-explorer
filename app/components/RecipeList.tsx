'use client';

import { useEffect, useState } from 'react';
import { listDocuments, DATABASE_ID } from '../../lib/appwrite';

interface Recipe {
  $id: string;
  title: string;
  content: string;
  image_url: string;
  generated_at: string;
}
const RECIPES_COLLECTION_ID = 'recipes';

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDocuments(DATABASE_ID, RECIPES_COLLECTION_ID)
      .then((res: { documents: Recipe[] }) => setRecipes(res.documents))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-4" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <p className="heading-bold text-2xl text-gray-300 mb-2">No recipes yet</p>
        <p className="text-gray-400 font-sans text-sm">
          First weekly recipe drop coming soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {recipes.map((recipe) => (
        <article
          key={recipe.$id}
          className="bg-white rounded-2xl shadow-md overflow-hidden vendor-card"
          itemScope
          itemType="https://schema.org/Recipe"
        >
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-64 object-cover"
              itemProp="image"
            />
          )}
          <div className="p-6">
            <p className="text-xs text-gray-400 font-sans uppercase tracking-wider mb-2">
              {new Date(recipe.generated_at).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h2 className="heading-bold text-2xl text-mzansi-black mb-3" itemProp="name">
              {recipe.title}
            </h2>
            <div
              className="text-gray-600 font-sans leading-relaxed whitespace-pre-line"
              itemProp="recipeInstructions"
            >
              {recipe.content}
            </div>
            <meta itemProp="recipeYield" content="1-2 servings" />
            <meta itemProp="recipeCategory" content="South African Street Food" />
          </div>
        </article>
      ))}
    </div>
  );
}
