import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";
import { generateVideoScript } from "@/lib/generate-script";
import { generateVoiceover, generateCaptions } from "@/lib/deepgram";
import { generateAllSceneImages } from "@/lib/generate-images";
import { renderVideoLocally } from "@/lib/remotion-local";

export const helloWorld = inngest.createFunction(
  { 
    id: "hello-world",
    name: "Hello World",
    triggers: [{ event: "test/hello.world" }]
  },
  async ({ event, step }) => {
    const { name } = event.data as { name?: string };
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${name || "World"}!` };
  }
);

export const generateVideo = inngest.createFunction(
  { 
    id: "generate-video",
    name: "Generate Video Series",
    triggers: [{ event: "series/generate.video" }]
  },
  async ({ event, step }) => {
    const { seriesId, userId } = event.data as { seriesId: string; userId: string };
    const videoIndex = Date.now();

    // ── Step 0: Create initial record with 'processing' status ───────────
    const initialVideo = await step.run("create-initial-record", async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase
        .from("generated_videos")
        .insert({
          series_id: seriesId,
          user_id: userId,
          status: "processing",
          title: "Generating...",
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create initial record: ${error.message}`);
      return data;
    });

    // ── Step 1: Fetch series data from Supabase ───────────────────────────
    const series = await step.run("fetch-series", async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase
        .from("video_series")
        .select("*")
        .eq("id", seriesId)
        .eq("user_id", userId)
        .single();

      if (error) throw new Error(`Failed to fetch series: ${error.message}`);
      return data;
    });

    // ── Step 2: Generate video script using AI (Gemini) ─────────────────
    const scriptData = await step.run("generate-script", async () => {
      const result = await generateVideoScript({
        series_name: series.series_name,
        niche: series.niche,
        language: series.language,
        video_style: series.video_style,
        video_duration: series.video_duration,
      });
      return result;
    });

    // ── Step 3: Generate voiceover using Deepgram TTS ────────────────────
    const audioData = await step.run("generate-voice", async () => {
      const result = await generateVoiceover(
        scriptData.scenes,
        series.voice,
        seriesId,
        videoIndex
      );
      return result;
    });

    // ── Step 4: Generate captions using Deepgram STT ─────────────────────
    const captionData = await step.run("generate-captions", async () => {
      const result = await generateCaptions(
        audioData.audioUrl,
        series.language
      );
      return result;
    });

    // ── Step 5: Generate scene images using Gemini ───────────────────────
    const imageData = await step.run("generate-images", async () => {
      const imageUrls = await generateAllSceneImages(
        scriptData.scenes.map((s: { sceneId: number; script: string; imagePrompt: string }) => ({
          sceneId: s.sceneId,
          imagePrompt: s.imagePrompt,
        })),
        seriesId,
        videoIndex
      );
      return { imageUrls };
    });

    // ── Step 6: Render Video Locally (Free Alternative to AWS) ──────────────
    const videoUrl = await step.run("render-video-local", async () => {
      return await renderVideoLocally({
        images: imageData.imageUrls,
        audioUrl: audioData.audioUrl,
        captions: captionData.words,
      }, seriesId, videoIndex);
    });

    // ── Step 7: Update record with all generated assets ──────────────────
    const savedVideo = await step.run("update-database", async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data, error } = await supabase
        .from("generated_videos")
        .update({
          title: scriptData.title,
          description: scriptData.description,
          hook: scriptData.hook,
          hashtags: scriptData.hashtags,
          scenes: scriptData.scenes,
          audio_url: audioData.audioUrl,
          audio_duration_seconds: audioData.durationEstimateSeconds,
          captions: captionData.words,
          srt_content: captionData.srt,
          transcript: captionData.transcript,
          image_urls: imageData.imageUrls,
          video_url: videoUrl,
          status: "completed",
        })
        .eq("id", initialVideo.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update video record: ${error.message}`);
      return data;
    });

    // ── Step 8: Send Email Notification ──────────────────────────────────────
    await step.run("send-email-notification", async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Get user email and name
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("email, name")
        .eq("id", userId)
        .single();

      if (userError || !user) {
        console.error("Failed to fetch user for email notification", userError);
        return null;
      }

      if (process.env.PLUNK_API_KEY) {
        const { sendVideoNotificationEmail } = await import("@/lib/plunk");
        await sendVideoNotificationEmail({
          to: user.email,
          name: user.name || "User",
          videoTitle: scriptData.title,
          videoUrl: videoUrl,
          thumbnailUrl: imageData.imageUrls[0],
        });
      }
    });

    return {
      success: true,
      videoId: savedVideo.id,
      seriesId,
    };
  }
);
