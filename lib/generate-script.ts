import { generateVideoScript as generateWithGemini } from "./gemini";
import { generateVideoScriptWithGroq } from "./groq";

export type ScriptProvider = "groq" | "gemini";

export type VideoScript = {
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

type SeriesInput = {
  series_name: string;
  niche: string;
  language: string;
  video_style: string;
  video_duration: string;
};

/**
 * Generates a video script using whichever provider is configured.
 *
 * Set SCRIPT_PROVIDER in your .env.local:
 *   SCRIPT_PROVIDER=groq    → uses Groq (llama-3.3-70b-versatile)  [default]
 *   SCRIPT_PROVIDER=gemini  → uses Google Gemini
 *
 * Groq is the default so Gemini quota is preserved for image generation.
 */
export async function generateVideoScript(series: SeriesInput): Promise<VideoScript> {
  const provider: ScriptProvider =
    (process.env.SCRIPT_PROVIDER as ScriptProvider) ?? "groq";

  console.log(`[generate-script] Using provider: ${provider}`);

  if (provider === "gemini") {
    return generateWithGemini(series);
  }

  // Default: Groq
  return generateVideoScriptWithGroq(series);
}
