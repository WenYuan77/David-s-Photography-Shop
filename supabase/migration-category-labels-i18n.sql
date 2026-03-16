-- Add per-locale label columns for categories. Run in Supabase SQL Editor.
-- After this, admin can edit all 4 languages in one form; changing any language
-- updates the DB and all site versions (en/zh/th/es) stay in sync.

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS label_en TEXT,
  ADD COLUMN IF NOT EXISTS label_zh TEXT,
  ADD COLUMN IF NOT EXISTS label_th TEXT,
  ADD COLUMN IF NOT EXISTS label_es TEXT;

-- Backfill: copy existing label into label_en (and optionally others) so existing rows work
UPDATE categories
SET
  label_en = COALESCE(label_en, label),
  label_zh = COALESCE(label_zh, label),
  label_th = COALESCE(label_th, label),
  label_es = COALESCE(label_es, label)
WHERE label_en IS NULL OR label_zh IS NULL OR label_th IS NULL OR label_es IS NULL;

-- Keep `label` as fallback; app will prefer label_<locale> then label_en then label
