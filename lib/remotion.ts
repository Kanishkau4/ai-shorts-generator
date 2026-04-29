import { renderMediaOnLambda, getRenderProgress } from "@remotion/lambda/client";

const REGION = (process.env.REMOTION_AWS_REGION as "us-east-1" | "eu-central-1") || "us-east-1";
const FUNCTION_NAME = process.env.REMOTION_FUNCTION_NAME || "remotion-render";
const SERVE_URL = process.env.REMOTION_SERVE_URL || "https://your-serve-url.s3.amazonaws.com";

export async function renderVideoOnLambda(inputProps: Record<string, unknown>) {
  // 1. Kick off the render
  const { renderId, bucketName } = await renderMediaOnLambda({
    region: REGION,
    functionName: FUNCTION_NAME,
    serveUrl: SERVE_URL,
    composition: "MainVideo",
    inputProps,
    codec: "h264",
    imageFormat: "jpeg",
    maxRetries: 1,
    privacy: "public",
  });

  return { renderId, bucketName };
}

export async function checkRenderProgress(renderId: string, bucketName: string) {
  const progress = await getRenderProgress({
    renderId,
    bucketName,
    functionName: FUNCTION_NAME,
    region: REGION,
  });

  return progress;
}
