import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { productName, niche, tone, language, images } = data;

    const apiKey = req.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key. Please add it in Settings or .env.local" }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey });

    let prompt = `
You are an expert Digital Marketer and Copywriter.
Create 3 highly compelling, 100% unique Ad Copies for a product.
Product/Service Name: ${productName}
Niche/Industry: ${niche}
Tone of Voice: ${tone}
Language: ${language === 'bn' ? 'Bengali (Bangla)' : 'English'}

Instructions:
1. Generate 3 unique Facebook/Instagram Ad Copies.
   - Ad 1: Emotion & Storytelling based.
   - Ad 2: Offer & Urgency (FOMO) based.
   - Ad 3: Direct Response in a ${tone} tone.
2. Make the hooks catchy, the bodies highly persuasive, and include relevant emojis.
3. Provide a strong Call to Action (CTA) for each.

Respond STRICTLY with the following JSON structure:
{
  "ads": [
    { "title": "string", "hook": "string", "body": "string", "cta": "string" },
    { "title": "string", "hook": "string", "body": "string", "cta": "string" },
    { "title": "string", "hook": "string", "body": "string", "cta": "string" }
  ]
}
`;

    if (images && images.length > 0) {
      prompt += `\n\n${images.length} image(s) are attached. Please analyze them carefully and incorporate specific visual details, aesthetics, colors, or features into the Ad Copies to make them highly specific and persuasive.`;
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

    return NextResponse.json(resultJson);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate AI Ads" }, { status: 500 });
  }
}
