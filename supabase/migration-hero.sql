-- Add hero_image_url column to site_settings
-- Run this in Supabase SQL Editor if you already have site_settings

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '';
