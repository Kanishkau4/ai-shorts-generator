/**
 * Cloudflare Workers AI Image Generation.
 * Stable and reliable alternative with a generous free tier.
 */
export async function generateImageWithCloudflare(prompt: string): Promise<Buffer> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare Account ID or API Token is not set");
  }

  console.log("[cloudflare-ai] Generating image...");

  // Using SDXL Lightning for speed and quality
  const model = "@cf/bytedance/stable-diffusion-xl-lightning";
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `${prompt}, high quality, cinematic, 4k, vertical video ratio`,
      num_steps: 8, // Lightning only needs a few steps
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudflare AI failed (${response.status}): ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
