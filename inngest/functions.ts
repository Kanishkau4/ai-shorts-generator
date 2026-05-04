import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";
import { generateVideoScript } from "@/lib/generate-script";
import { generateVoiceover, generateCaptions } from "@/lib/deepgram";
import { generateAllSceneImages } from "@/lib/generate-images";
import { renderVideoLocally } from "@/lib/remotion-local";

type RenderResult =
  | { mode: "github"; pending: true }
  | { mode: "local"; videoUrl: string; pending: false };

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
    const { seriesId, userId, skipEmail } = event.data as { seriesId: string; userId: string; skipEmail?: boolean };
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

    // ── Step 6: Render Video (Local for Dev, GitHub Actions for Prod) ────────
    const renderResult: RenderResult = await step.run("render-video", async () => {
      const inputProps = {
        images: imageData.imageUrls,
        audioUrl: audioData.audioUrl,
        captions: captionData.words,
      };

      // If we have GitHub credentials, we use the free GitHub Actions renderer
      if (process.env.GH_PAT && process.env.GITHUB_REPO) {
        console.log("[Renderer] Triggering GitHub Actions render...");
        const { triggerGithubRender } = await import("@/lib/github-renderer");
        await triggerGithubRender({
          seriesId,
          videoIndex,
          videoId: initialVideo.id,
          inputProps,
        });
        return { mode: "github", pending: true } as const;
      }

      // Fallback to local rendering (works only in local dev environment)
      console.log("[Renderer] Falling back to local rendering...");
      const videoUrl = await renderVideoLocally(inputProps, seriesId, videoIndex);
      return { mode: "local", videoUrl, pending: false } as const;
    });

    // ── Step 7: Update record with all generated assets ──────────────────
    const savedVideo = await step.run("update-database", async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const updateData: any = {
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
      };

      // Only mark as completed if we rendered locally
      if (!renderResult.pending) {
        updateData.video_url = renderResult.videoUrl;
        updateData.status = "completed";
      }

      const { data, error } = await supabase
        .from("generated_videos")
        .update(updateData)
        .eq("id", initialVideo.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update video record: ${error.message}`);
      return data;
    });

    // ── Step 8: Send Email Notification ──────────────────────────────────────
    if (!skipEmail) {
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
          console.error(`[Email Notification] User not found in database: ${userId}`, userError);
          return { error: "User not found", userId };
        }

        console.log(`[Email Notification] Sending email to ${user.email} using Plunk...`);

        if (process.env.PLUNK_API_KEY) {
          const { sendVideoNotificationEmail } = await import("@/lib/plunk");
          const result = await sendVideoNotificationEmail({
            to: user.email,
            name: user.name || "User",
            videoTitle: scriptData.title,
            videoUrl: savedVideo.video_url,
            thumbnailUrl: imageData.imageUrls[0],
          });
          return { success: true, result };
        }

        return { skipped: true, reason: "PLUNK_API_KEY missing" };
      });
    }

    return {
      success: true,
      videoId: savedVideo.id,
      seriesId,
    };
  }
);

export const scheduleDailyVideos = inngest.createFunction(
  {
    id: "schedule-daily-videos",
    triggers: [{ cron: "0 0 * * *" }]
  },
  async ({ step }) => {
    const activeSeries = await step.run("fetch-active-series", async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data, error } = await supabase
        .from("video_series")
        .select("id, user_id, publish_time, platforms")
        .eq("status", "active");

      if (error) throw new Error(`Failed to fetch active series: ${error.message}`);
      return data;
    });

    if (activeSeries && activeSeries.length > 0) {
      const events = activeSeries.map(series => ({
        name: "series/process.scheduled",
        data: {
          seriesId: series.id,
          userId: series.user_id,
          publishTime: series.publish_time,
          platforms: series.platforms,
        }
      }));
      // @ts-ignore
      await step.sendEvent("dispatch-scheduled-videos", events);
    }

    return { dispatched: activeSeries?.length || 0 };
  }
);

export const processScheduledVideo = inngest.createFunction(
  {
    id: "process-scheduled-video",
    triggers: [{ event: "series/process.scheduled" }]
  },
  async ({ event, step }) => {
    const { seriesId, userId, publishTime, platforms, isTest } = event.data as {
      seriesId: string;
      userId: string;
      publishTime: string;
      platforms: string[];
      isTest?: boolean;
    };

    if (!isTest && publishTime) {
      // Calculate today's publish time
      const [hours, minutes] = publishTime.split(':').map(Number);
      const now = new Date();
      const publishDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

      // Calculate generation time (2 hours before publish)
      const generationDate = new Date(publishDate.getTime() - 2 * 60 * 60 * 1000);

      // If generation time is in the future today, sleep until then
      if (generationDate.getTime() > now.getTime()) {
        await step.sleepUntil("wait-for-generation-time", generationDate);
      }
    }

    // Trigger video generation, skipping immediate email
    const generationResult = await step.invoke("generate-video", {
      function: generateVideo,
      data: { seriesId, userId, skipEmail: true }
    });

    if (!isTest && publishTime) {
      const [hours, minutes] = publishTime.split(':').map(Number);
      const now = new Date();
      const publishDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

      if (publishDate.getTime() > new Date().getTime()) {
        await step.sleepUntil("wait-for-publish-time", publishDate);
      }
    }

    // Publish to platforms
    await step.run("publish-to-platforms", async () => {
      // We need video details
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: video } = await supabase
        .from("generated_videos")
        .select("*")
        .eq("id", generationResult.videoId)
        .single();

      const { data: user } = await supabase
        .from("users")
        .select("email, name")
        .eq("id", userId)
        .single();

      if (!video || !user) {
        console.error(`[Publish] Video or User not found: video=${generationResult.videoId}, user=${userId}`);
        return { error: "Missing video or user" };
      }

      const publishResults: any = {};

      if (platforms?.includes("email") && process.env.PLUNK_API_KEY) {
        const { sendVideoNotificationEmail } = await import("@/lib/plunk");
        publishResults.email = await sendVideoNotificationEmail({
          to: user.email,
          name: user.name || "User",
          videoTitle: video.title || "Scheduled Video",
          videoUrl: video.video_url || "",
          thumbnailUrl: video.image_urls?.[0] || "",
        });
      }

      if (platforms?.includes("youtube")) {
        // Fetch refresh token from user_settings
        const { data: settings } = await supabase
          .from('user_settings')
          .select('youtube_refresh_token')
          .eq('user_id', userId)
          .single();

        if (settings?.youtube_refresh_token) {
          try {
            const { uploadToYoutube } = await import("@/lib/youtube");
            publishResults.youtube = await uploadToYoutube({
              videoUrl: video.video_url || "",
              title: video.title || "New AI Short",
              description: `Automated AI short generated by Vibio.\n\n#ai #shorts #vibio`,
              refreshToken: settings.youtube_refresh_token
            });
          } catch (err: any) {
            console.error(`[YouTube Publish Error] ${err.message}`);
            publishResults.youtube = { error: err.message };
          }
        } else {
          console.warn(`[YouTube Publish] No refresh token found for user ${userId}`);
          publishResults.youtube = { error: "YouTube not connected" };
        }
      }
      if (platforms?.includes("facebook")) {
        console.log(`[Placeholder] Publishing video ${video.id} to Facebook`);
        publishResults.facebook = { status: "placeholder" };
      }
      if (platforms?.includes("tiktok")) {
        console.log(`[Placeholder] Publishing video ${video.id} to TikTok`);
        publishResults.tiktok = { status: "placeholder" };
      }

      return publishResults;
    });

    return { success: true, publishedPlatforms: platforms };
  }
);
