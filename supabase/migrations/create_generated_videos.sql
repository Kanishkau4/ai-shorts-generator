-- ============================================================
-- Table: generated_videos
-- Stores all AI-generated assets for each video run
-- ============================================================

CREATE TABLE IF NOT EXISTS generated_videos (
  id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Relationships
  series_id               UUID NOT NULL REFERENCES video_series(id) ON DELETE CASCADE,
  user_id                 TEXT NOT NULL,

  -- Script data (from Step 2)
  title                   TEXT,
  description             TEXT,
  hook                    TEXT,
  hashtags                TEXT[],
  -- scenes: [{sceneId, script, imagePrompt}]
  scenes                  JSONB,
  transcript              TEXT,

  -- Audio (from Step 3)
  audio_url               TEXT,
  audio_duration_seconds  INTEGER,

  -- Captions (from Step 4)
  -- captions: word-level [{word, start, end, punctuated_word, ...}]
  captions                JSONB,
  srt_content             TEXT,

  -- Images (from Step 5) — one URL per scene, ordered
  image_urls              TEXT[],

  -- Final video (from Step 6 — when video assembly is implemented)
  video_url               TEXT,

  -- Status tracking
  status                  TEXT NOT NULL DEFAULT 'completed'
                            CHECK (status IN ('processing', 'completed', 'failed')),

  -- Timestamps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS generated_videos_series_id_idx ON generated_videos(series_id);
CREATE INDEX IF NOT EXISTS generated_videos_user_id_idx   ON generated_videos(user_id);
CREATE INDEX IF NOT EXISTS generated_videos_status_idx    ON generated_videos(status);

-- ── Auto-update updated_at on row change ────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_generated_videos_updated_at
  BEFORE UPDATE ON generated_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE generated_videos ENABLE ROW LEVEL SECURITY;

-- Users can only see their own generated videos
CREATE POLICY "Users can view own generated videos"
  ON generated_videos FOR SELECT
  USING (user_id = auth.uid()::TEXT);

-- Allow server-side inserts (service role bypasses RLS)
-- No INSERT policy needed for client, inngest uses service role key

-- ── Storage bucket policy (run once in Supabase dashboard) ──
-- Bucket: generated-videos
-- Policy: Allow public read access on all objects
-- INSERT INTO storage.buckets (id, name, public) VALUES ('generated-videos', 'generated-videos', true);
