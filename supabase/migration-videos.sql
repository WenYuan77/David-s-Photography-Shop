-- Add video URL columns to site_settings
-- Run this in Supabase SQL Editor if you already have site_settings

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS intro_video_url TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS proposal_video_url TEXT DEFAULT '';
