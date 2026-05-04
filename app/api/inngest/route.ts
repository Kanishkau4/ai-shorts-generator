import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, generateVideo, scheduleDailyVideos, processScheduledVideo } from "@/inngest/functions";

// Create an API route that serves the Inngest client and functions
const handler = serve({
  client: inngest,
  functions: [
    helloWorld,
    generateVideo,
    scheduleDailyVideos,
    processScheduledVideo,
  ],
  // Explicitly set the signing key to avoid signing issues
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
