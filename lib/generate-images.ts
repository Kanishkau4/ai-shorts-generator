import { createClient as createSupabase } from "@supabase/supabase-js";
import { generateImageWithHuggingFace } from "./huggingface";

/**
 * Generates an image for a single scene using the configured image generation provider,
 * then uploads the result to Supabase Storage.
 *
 * @param imagePrompt - The visual description for this scene
 * @param seriesId    - Used to build a unique storage path
 * @param sceneId     - Scene index to keep filenames unique
 * @param videoIndex  - Run timestamp to avoid collisions
 */
export async function generateSceneImage(
  imagePrompt: string,
  seriesId: string,
  sceneId: number,
  videoIndex: number = Date.now()
): Promise<string> {
  const provider = process.env.IMAGE_PROVIDER || "gemini";
  let imageBuffer: Buffer;
  let mimeType = "image/png";

  try {
    if (provider === "huggingface") {
      console.log(`[generate-images] Using Hugging Face for scene ${sceneId}`);
      imageBuffer = await generateImageWithHuggingFace(imagePrompt);
    } else {
      console.log(`[generate-images] Using Gemini for scene ${sceneId}`);
      const apiKey = process.env.GEMINI_API_KEY!;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a high-quality, cinematic image for a short video scene. Do not add any text, watermarks, or overlays. ${imagePrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE"],
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        const isRateLimit = response.status === 429 || errText.toLowerCase().includes("quota");
        
        if (isRateLimit && process.env.HF_TOKEN) {
          console.warn(`[generate-images] Gemini rate limited. Falling back to Hugging Face for scene ${sceneId}...`);
          imageBuffer = await generateImageWithHuggingFace(imagePrompt);
        } else {
          throw new Error(`Gemini image generation failed (${response.status}): ${errText}`);
        }
      } else {
        const json = await response.json();
        const inlineData = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData;

        if (!inlineData?.data) {
          throw new Error(`No image data returned for scene ${sceneId}`);
        }

        imageBuffer = Buffer.from(inlineData.data, "base64");
        mimeType = inlineData.mimeType || "image/png";
      }
    }
  } catch (error: any) {
    console.error(`[generate-images] Error in ${provider} for scene ${sceneId}:`, error.message);
    
    // Final fallback attempt if Gemini failed and we haven't tried HF yet
    if (provider === "gemini" && process.env.HF_TOKEN) {
      try {
        console.log(`[generate-images] Final fallback to Hugging Face for scene ${sceneId}`);
        imageBuffer = await generateImageWithHuggingFace(imagePrompt);
      } catch (fallbackError: any) {
        throw error;
      }
    } else {
      throw error;
    }
  }

  const ext = mimeType.split("/")[1] || "png";

  // Upload to Supabase Storage
  const supabase = createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const filePath = `images/${seriesId}/${videoIndex}/scene-${sceneId}.${ext}`;

  const { error } = await supabase.storage
    .from("generated-videos")
    .upload(filePath, imageBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) throw new Error(`Failed to upload image for scene ${sceneId}: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("generated-videos")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Generates images for all scenes in parallel (with concurrency limit).
 */
export async function generateAllSceneImages(
  scenes: { sceneId: number; imagePrompt: string }[],
  seriesId: string,
  videoIndex: number = Date.now()
): Promise<string[]> {
  // Run all image generations concurrently
  const imageUrls = await Promise.all(
    scenes.map((scene) =>
      generateSceneImage(scene.imagePrompt, seriesId, scene.sceneId, videoIndex)
    )
  );
  return imageUrls;
}
