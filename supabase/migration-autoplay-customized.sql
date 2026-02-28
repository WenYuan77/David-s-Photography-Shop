-- Add autoplay_customized column to site_settings
-- When false: use default (Intro autoplay) for first visit before admin customizes
-- When true: use intro_video_autoplay and proposal_video_autoplay from DB
-- Run this in Supabase SQL Editor if you already have site_settings

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS autoplay_customized BOOLEAN DEFAULT false;
