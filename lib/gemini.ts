import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Generates a video script, title, and image prompts based on the series config.
 */
export async function generateVideoScript(series: {
  series_name: string;
  niche: string;
  language: string;
  video_style: string;
  video_duration: string; // e.g. "30-60" or "60-90"
}) {
  const { series_name, niche, language, video_style, video_duration } = series;

  // Determine image prompt count from duration
  const durationRange = video_duration || "30-60";
  const is60to90 = durationRange.includes("60-90") || durationRange.startsWith("90");
  const imageCount = is60to90 ? "6-8" : "5-6";
  const approxSeconds = is60to90 ? "60-90 seconds" : "30-60 seconds";

  const prompt = `
You are a professional short-form video scriptwriter specializing in creating viral social media content.

Create a complete video script for a short video with the following details:
- Series Name: ${series_name}
- Niche/Topic: ${niche}
- Language: ${language}
- Visual Style: ${video_style}
- Video Duration: ${approxSeconds}

Your task is to produce a JSON response with the following structure. Return ONLY valid JSON, no markdown, no code blocks, no extra text.

{
  "title": "Catchy and engaging video title (max 80 characters)",
  "description": "SEO-friendly video description (2-3 sentences)",
  "scenes": [
    {
      "sceneId": 1,
      "script": "The narration for this specific scene. Natural and conversational.",
      "imagePrompt": "Visual scene description for this specific part of the narration. Style: ${video_style}."
    }
  ],
  "hashtags": ["relevant", "hashtags"],
  "hook": "The very first line of the script (first 2-3 seconds)"
}

Rules:
- Break the script into ${imageCount} logical scenes.
- Total narration across all scenes must fit within ${approxSeconds}.
- Each scene must have exactly one narration segment and one matching image prompt.
- All content must be in ${language}.
- Return ONLY the raw JSON object. No markdown.
`;

  const response = await gemini.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  const rawText = response.text ?? "";

  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return parsed as {
    title: string;
    description: string;
    scenes: {
      sceneId: number;
      script: string;
      imagePrompt: string;
    }[];
    hashtags: string[];
    hook: string;
  };
}
