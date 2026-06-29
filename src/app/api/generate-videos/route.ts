import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { topic, platform, tone, language, images } = data;

    const apiKey = req.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key. Please add it in Settings or .env.local" }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey });

    let prompt = `
You are an expert Social Media Video Producer and Creative Director.
Create 2 highly engaging, 100% unique short-form video scripts (Reels/TikTok/Shorts) based on the following context.
Topic / Idea: ${topic}
Tone: ${tone}
Target Platform: ${platform}
Language: ${language === 'bn' ? 'Bengali (Bangla)' : 'English'}

Instructions:
1. Generate 2 unique Video Scripts optimized for ${platform}.
2. Provide a 1-3 second Scroll-Stopping Hook.
3. Provide a highly detailed AI Video Generation Prompt (Scene) for tools like Sora/Runway (describe lighting, camera movement, subject, aesthetic).
4. Provide the voiceover dialogue or text-on-screen overlay (Dialogue).
5. IMPORTANT: The 'scene' (visual prompt) MUST ALWAYS BE IN ENGLISH for video generation tools.
6. The 'hook' and 'dialogue' MUST be in the requested Language (${language === 'bn' ? 'Bengali' : 'English'}).

Respond STRICTLY with the following JSON structure:
{
  "reels": [
    { "title": "string", "hook": "string", "scene": "string", "dialogue": "string" },
    { "title": "string", "hook": "string", "scene": "string", "dialogue": "string" }
  ]
}
`;

    if (images && images.length > 0) {
      prompt += `\n\n${images.length} image(s) are attached. Please analyze them carefully and incorporate specific visual details, aesthetics, colors, or features into the Video Scenes and Dialogue.`;
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
    return NextResponse.json({ error: error.message || "Failed to generate AI Video Scripts" }, { status: 500 });
  }
}
