-- Add token columns to user_settings for social media integrations
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS youtube_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS facebook_access_token TEXT,
ADD COLUMN IF NOT EXISTS tiktok_access_token TEXT;
