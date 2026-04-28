/**
 * Hugging Face Inference API for image generation.
 * Uses the model specified in HF_MODEL or defaults to stable-diffusion-xl-base-1.0.
 */
export async function generateImageWithHuggingFace(prompt: string): Promise<Buffer> {
  const model = process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell";
  const endpoint = `https://router.huggingface.co/hf-inference/models/${model}`;
  const token = process.env.HF_TOKEN;

  if (!token) {
    throw new Error("HF_TOKEN is not set in environment variables");
  }

  console.log(`[huggingface] Requesting: ${endpoint}`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        num_inference_steps: 4, // Fast for schnell
      }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[huggingface] Error Details:`, errText);
    throw new Error(`Hugging Face API failed (${response.status}): ${errText.slice(0, 200)}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
