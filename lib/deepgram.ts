import { createClient as createSupabase } from "@supabase/supabase-js";

/**
 * Generates speech from scene scripts using Deepgram TTS,
 * then uploads the audio file to Supabase Storage.
 *
 * @param scenes - Array of scenes with script text (from Step 2)
 * @param voice  - Deepgram Aura voice model name (e.g. "aura-2-odysseus-en")
 * @param seriesId - Used to build a unique storage path
 * @param videoIndex - Counter to keep filenames unique across runs
 */
export async function generateVoiceover(
  scenes: { sceneId: number; script: string }[],
  voice: string,
  seriesId: string,
  videoIndex: number = Date.now()
) {
  // Combine all scene scripts into a single narration text
  const fullScript = scenes.map((s) => s.script).join(" ");

  // Call Deepgram TTS via REST API
  const response = await fetch(
    `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(voice)}&encoding=mp3`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: fullScript }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Deepgram TTS failed (${response.status}): ${errText}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());

  // Upload to Supabase Storage
  const supabase = createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const filePath = `voiceovers/${seriesId}/${videoIndex}.mp3`;

  const { error } = await supabase.storage
    .from("generated-videos")
    .upload(filePath, audioBuffer, {
      contentType: "audio/mp3",
      upsert: true,
    });

  if (error) throw new Error(`Failed to upload voiceover: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("generated-videos")
    .getPublicUrl(filePath);

  return {
    audioUrl: urlData.publicUrl,
    filePath,
    durationEstimateSeconds: Math.ceil(fullScript.split(" ").length / 2.5),
  };
}

/**
 * Transcribes an audio file using Deepgram STT to generate captions with timestamps.
 *
 * @param audioUrl - Public URL of the audio file to transcribe
 * @param language - Language code for transcription (e.g. "en-US")
 */
export async function generateCaptions(audioUrl: string, language: string) {
  // Language code: Deepgram uses 'en', 'es', 'fr' etc. (strip region suffix)
  const lang = language.split("-")[0];

  // Call Deepgram STT (Pre-recorded) via REST API
  const response = await fetch(
    `https://api.deepgram.com/v1/listen?model=nova-2&language=${lang}&smart_format=true&utterances=true&punctuate=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: audioUrl }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Deepgram STT failed (${response.status}): ${errText}`);
  }

  const json = await response.json();
  const words: any[] = json?.results?.channels[0]?.alternatives[0]?.words || [];

  if (words.length === 0) {
    throw new Error("Deepgram returned no transcription words.");
  }

  // Convert seconds to SRT timestamp format: 00:00:01,000
  const toSRTTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const ms = Math.floor((seconds % 1) * 1000);
    const timePart = date.toISOString().substr(11, 8);
    return `${timePart},${ms.toString().padStart(3, "0")}`;
  };

  // Group words into segments of ~4 words for captions
  let srt = "";
  const wordsPerSegment = 4;
  for (let i = 0; i < words.length; i += wordsPerSegment) {
    const segment = words.slice(i, i + wordsPerSegment);
    const startTime = toSRTTime(segment[0].start);
    const endTime = toSRTTime(segment[segment.length - 1].end);
    const text = segment.map((w: any) => w.punctuated_word || w.word).join(" ");

    srt += `${Math.floor(i / wordsPerSegment) + 1}\n`;
    srt += `${startTime} --> ${endTime}\n`;
    srt += `${text}\n\n`;
  }

  return {
    words,
    srt,
    transcript: json?.results?.channels[0]?.alternatives[0]?.transcript,
  };
}
