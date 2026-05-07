/**
 * Groq-powered script generation using llama-3.3-70b-versatile.
 * Produces the exact same output shape as the Gemini version so
 * the two are drop-in replacements for each other.
 */
export async function generateVideoScriptWithGroq(series: {
  series_name: string;
  niche: string;
  language: string;
  video_style: string;
  video_duration: string;
}) {
  const { series_name, niche, language, video_style, video_duration } = series;

  // Determine image prompt count from duration
  const durationRange = video_duration || "30-60";
  const is60to90 =
    durationRange.includes("60-90") || durationRange.startsWith("90");
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

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errorBody}`);
  }

  const json = await response.json();
  const rawText: string = json.choices?.[0]?.message?.content ?? "";

  // Strip <think>...</think> tags if they exist (common in "thinking" models)
  const contentWithoutThink = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  const cleaned = contentWithoutThink
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
