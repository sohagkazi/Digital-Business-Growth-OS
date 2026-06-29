import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeSubscriptionId: true, stripeCurrentPeriodEnd: true, generationsCount: true, lastGenerationReset: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    let isPro = false;
    if (user.stripeSubscriptionId && user.stripeCurrentPeriodEnd && new Date(user.stripeCurrentPeriodEnd) > new Date()) {
      isPro = true;
    }
    if (user.role === "ADMIN") {
      isPro = true;
    }
    let newGenerationsCount = user.generationsCount;
    let newResetDate = user.lastGenerationReset;

    if (!isPro) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - new Date(user.lastGenerationReset).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 30) {
        newGenerationsCount = 0;
        newResetDate = now;
      }

      if (newGenerationsCount >= 7) {
        return NextResponse.json({ limitReached: true }, { status: 403 });
      }
    }

    const data = await req.json();
    const { businessName, niche, budget, country, language, images } = data;

    // Use header key or fallback to env variable
    const apiKey = req.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key. Please add it in Settings or .env.local" }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey });

    let prompt = `
You are an expert Digital Marketer and Copywriter.
Create a highly compelling, 100% unique marketing plan for a business.
Business Name: ${businessName}
Niche/Industry: ${niche}
Target Country/Location: ${country}
Budget: ${budget}
Language: ${language === 'bn' ? 'Bengali (Bangla)' : 'English'}

Instructions:
1. Generate 3 unique Facebook Ad Copies. 
   - Ad 1: Emotion/Story based.
   - Ad 2: Offer/Urgency based.
   - Ad 3: Direct/Simple/Trust based.
   - Make the hooks catchy, the bodies highly persuasive, and include emojis.
2. Generate 2 unique Reel/TikTok Scripts (AI Video Prompts).
   - Provide a hook, a visual AI Video Generation Prompt (Sora/Runway style), and a voiceover/text dialogue.
   - IMPORTANT: The 'scene' (visual prompt) MUST ALWAYS BE IN ENGLISH for video generation tools.
   - The 'hook' and 'dialogue' MUST be in the requested Language (${language === 'bn' ? 'Bengali' : 'English'}).
3. Generate a 7-day marketing plan/planner.
4. Generate Facebook Ads Targeting details (Age, Demographics, Interests, Behaviors).
   - IMPORTANT: Facebook Ads Targeting keywords MUST ALWAYS BE IN ENGLISH.
5. Generate 2 Irresistible Offer Ideas based on the niche.
6. Generate 10 SEO friendly keywords (short-tail and long-tail) based on the niche.

Respond STRICTLY with the following JSON structure:
{
  "ads": [
    { "title": "string", "hook": "string", "body": "string", "cta": "string" },
    { "title": "string", "hook": "string", "body": "string", "cta": "string" },
    { "title": "string", "hook": "string", "body": "string", "cta": "string" }
  ],
  "reels": [
    { "title": "string", "hook": "string", "scene": "string", "dialogue": "string" },
    { "title": "string", "hook": "string", "scene": "string", "dialogue": "string" }
  ],
  "planner": {
    "budgetDesc": "string",
    "tasks": [
      { "day": "Day 1", "task": "string" },
      { "day": "Day 2", "task": "string" },
      { "day": "Day 3", "task": "string" },
      { "day": "Day 4", "task": "string" },
      { "day": "Day 5", "task": "string" },
      { "day": "Day 6", "task": "string" },
      { "day": "Day 7", "task": "string" }
    ]
  },
  "audience": {
    "targeting": {
      "age": "string",
      "location": "string",
      "demographics": ["string", "string"],
      "interests": ["string", "string"],
      "behaviors": ["string", "string"]
    },
    "offers": ["string", "string"]
  },
  "keywords": ["string", "string", "string"]
}
`;

    if (images && images.length > 0) {
      prompt += `\n\n${images.length} image(s) are attached. Please analyze them carefully and incorporate specific visual details, aesthetics, colors, or features into the Ads, Hooks, and Video Scenes.`;
    }

    const contents: any[] = [prompt];
    
    if (images && images.length > 0) {
      images.forEach((img: { base64: string, mimeType: string }) => {
        contents.push({
          inlineData: {
            data: img.base64,
            mimeType: img.mimeType || "image/jpeg"
          }
        });
      });
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          responseMimeType: "application/json"
        }
      });
    } catch (error) {
      console.warn("Gemini 2.5 Flash failed, falling back to Gemma 4 26B:", error);
      response = await ai.models.generateContent({
        model: 'gemma-4-26b-a4b-it',
        contents: contents,
        config: {
          responseMimeType: "application/json"
        }
      });
    }

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);

    // Add unique ID for client-side rendering key
    resultJson.id = Math.random().toString(36).substring(7);

    if (!isPro && session?.user?.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          generationsCount: newGenerationsCount + 1,
          lastGenerationReset: newResetDate,
        }
      });
    }

    return NextResponse.json(resultJson);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI content" }, { status: 500 });
  }
}
