-- Add proposal_video_autoplay column to site_settings
-- Run this in Supabase SQL Editor if you already have site_settings

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS proposal_video_autoplay BOOLEAN DEFAULT false;
