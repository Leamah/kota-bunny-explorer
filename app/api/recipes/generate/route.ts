import { NextResponse } from 'next/server';

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '69cc168e00183ee74608';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const DATABASE_ID = 'kota-bunny-db';
const RECIPES_COLLECTION_ID = 'recipes';
const CRON_SECRET = process.env.CRON_SECRET || '';

function isAuthorized(request: Request) {
  const authHeader = request.headers.get('authorization');
  return !CRON_SECRET || authHeader === `Bearer ${CRON_SECRET}`;
}

// Vercel Cron fires GET — this lets the weekly schedule work
export async function GET(request: Request) {
  return generateRecipe(request);
}

export async function POST(request: Request) {
  return generateRecipe(request);
}

async function generateRecipe(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not set' }, { status: 500 });
  }
  if (!APPWRITE_API_KEY) {
    return NextResponse.json({ error: 'APPWRITE_API_KEY not set' }, { status: 500 });
  }

  try {
    // Pick a random food type
    const foodType = Math.random() > 0.5 ? 'Kota' : 'Bunny Chow';

    // Generate recipe with OpenAI
    const recipeRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a South African street food recipe writer. Write casual, fun recipes for township street food. Use local slang where appropriate. Always include substitution tips like "No polony? Use ham." Format: Title on first line, then ingredients, then numbered steps. Keep it for 1-2 servings.',
          },
          {
            role: 'user',
            content: `Write a unique, creative ${foodType} recipe. Include a catchy title, ingredients list, step-by-step instructions, and at least 2 substitution tips. Make it SEO-friendly with descriptive language.`,
          },
        ],
        max_tokens: 1000,
      }),
    });

    const recipeData = await recipeRes.json();
    const recipeContent = recipeData.choices?.[0]?.message?.content || '';

    // Extract title (first line)
    const lines = recipeContent.split('\n').filter((l: string) => l.trim());
    const title = lines[0]?.replace(/^#+\s*/, '').replace(/\*+/g, '').trim() || `Weekly ${foodType} Special`;
    const content = lines.slice(1).join('\n').trim();

    // Generate image with DALL-E
    let imageUrl = '';
    try {
      const imageRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `A delicious South African ${foodType} street food, close-up food photography, vibrant colors, served on newspaper or a simple plate, township vibes, natural lighting`,
          n: 1,
          size: '1024x1024',
        }),
      });
      const imageData = await imageRes.json();
      imageUrl = imageData.data?.[0]?.url || '';
    } catch {
      // Image generation failed, continue without image
    }

    // Save to Appwrite
    const saveRes = await fetch(
      `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${RECIPES_COLLECTION_ID}/documents`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
          'X-Appwrite-Key': APPWRITE_API_KEY,
        },
        body: JSON.stringify({
          documentId: 'unique()',
          data: {
            title,
            content,
            image_url: imageUrl,
            generated_at: new Date().toISOString(),
          },
        }),
      }
    );

    const savedRecipe = await saveRes.json();

    return NextResponse.json({
      success: true,
      recipe: {
        id: savedRecipe.$id,
        title,
        image_url: imageUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Recipe generation failed' },
      { status: 500 }
    );
  }
}
