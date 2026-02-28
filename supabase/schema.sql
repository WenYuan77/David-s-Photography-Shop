-- Run this SQL in your Supabase SQL Editor to create the schema

-- Site settings (phone, email, SEO) - single row
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT DEFAULT '(206) 206-9868',
  email TEXT DEFAULT 'pictureyour2day@gmail.com',
  seo_title TEXT DEFAULT 'Final Stage | Professional Photography',
  seo_description TEXT DEFAULT 'Where moments become masterpieces. Professional photography studio specializing in weddings, portraits, and commercial work.',
  seo_keywords TEXT[] DEFAULT ARRAY['photography', 'Final Stage', 'wedding photography', 'portrait', 'Seattle'],
  intro_video_url TEXT DEFAULT '',
  proposal_video_url TEXT DEFAULT '',
  intro_video_autoplay BOOLEAN DEFAULT false,
  proposal_video_autoplay BOOLEAN DEFAULT false,
  autoplay_customized BOOLEAN DEFAULT false,
  hero_image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO site_settings (id, phone, email, seo_title, seo_description, seo_keywords)
SELECT gen_random_uuid(), '(206) 206-9868', 'pictureyour2day@gmail.com', 
  'Final Stage | Professional Photography', 
  'Where moments become masterpieces. Professional photography studio specializing in weddings, portraits, and commercial work.',
  ARRAY['photography', 'Final Stage', 'wedding photography', 'portrait', 'Seattle']
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (id, label, sort_order) VALUES
  ('Wedding', 'Wedding', 1),
  ('Engagement', 'Engagement', 2),
  ('Family-Children', 'Family & Children', 3),
  ('Portrait', 'Portrait', 4),
  ('Pets', 'Pets', 5),
  ('Automotive', 'Automotive', 6),
  ('Events', 'Events', 7)
ON CONFLICT (id) DO NOTHING;

-- Portfolio images
CREATE TABLE IF NOT EXISTS portfolio_images (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  src TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_images_category ON portfolio_images(category_id);

-- Enable RLS (Row Level Security) - we'll use service role for server-side, so this is optional
-- For public read access via anon key, you may want to add policies
