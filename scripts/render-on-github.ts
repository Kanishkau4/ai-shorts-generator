import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

async function start() {
  const inputProps = JSON.parse(process.env.INPUT_PROPS || "{}");
  const seriesId = process.env.SERIES_ID;
  const videoIndex = process.env.VIDEO_INDEX;
  const videoId = process.env.VIDEO_ID;

  console.log(`Starting GitHub Render for Video ID: ${videoId}...`);

  try {
    const entry = path.join(process.cwd(), "remotion/index.ts");
    
    // 1. Bundle
    console.log("Bundling Remotion project...");
    const bundleLocation = await bundle({
      entryPoint: entry,
    });

    // 2. Dynamic Duration
    const captions = (inputProps.captions as any[]) || [];
    const fps = 30;
    const lastCaptionEnd = captions.length > 0 ? captions[captions.length - 1].end : 10;
    const durationInFrames = Math.ceil((lastCaptionEnd + 0.5) * fps);

    // 3. Select Composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "MainVideo",
      inputProps,
    });
    composition.durationInFrames = durationInFrames;

    // 4. Render
    const outputLocation = path.join(process.cwd(), "output.mp4");
    console.log("Rendering media...");
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
      inputProps,
    });

    // 5. Upload to Supabase
    console.log("Uploading to Supabase...");
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

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("generated-videos")
      .getPublicUrl(fileName);

    // 6. Update Database Status
    console.log("Updating database status...");
    const { error: updateError } = await supabase
      .from("generated_videos")
      .update({
        video_url: urlData.publicUrl,
        status: "completed",
      })
      .eq("id", videoId);

    if (updateError) throw updateError;

    console.log("Success! Render completed and database updated.");
  } catch (error) {
    console.error("Render failed:", error);
    
    // Attempt to mark as failed in DB
    if (videoId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase
        .from("generated_videos")
        .update({ status: "failed" })
        .eq("id", videoId);
    }
    process.exit(1);
  }
}

start();
