import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

export async function renderVideoLocally(inputProps: Record<string, unknown>, seriesId: string, videoIndex: number) {
  console.log("Starting local render...");
  
  const entry = path.join(process.cwd(), "remotion/index.ts");
  
  // 1. Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: entry,
    // If you have specific webpack overrides, add them here
  });
  
  // Calculate duration based on the last caption timestamp
  const captions = (inputProps.captions as any[]) || [];
  const fps = 30;
  const lastCaptionEnd = captions.length > 0 ? captions[captions.length - 1].end : 10;
  // Add 0.5s padding at the end
  const durationInFrames = Math.ceil((lastCaptionEnd + 0.5) * fps);

  // 2. Select the composition
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "MainVideo",
    inputProps,
  });

  // Override the default duration with our calculated dynamic duration
  composition.durationInFrames = durationInFrames;

  // 3. Define output path
  const outputDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const outputLocation = path.join(outputDir, `render-${seriesId}-${videoIndex}.mp4`);
  
  // 4. Render the media
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps,
  });

  console.log("Render finished:", outputLocation);

  // 5. Upload to Supabase Storage (so we have a public URL)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const fileBuffer = fs.readFileSync(outputLocation);
  const fileName = `renders/${seriesId}/${videoIndex}.mp4`;

  const { error: uploadError } = await supabase.storage
    .from("generated-videos")
    .upload(fileName, fileBuffer, {
      contentType: "video/mp4",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload rendered video: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("generated-videos")
    .getPublicUrl(fileName);

  // Clean up local file
  fs.unlinkSync(outputLocation);

  return urlData.publicUrl;
}
