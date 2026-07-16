-- Migration: Add automated SEO and Google Discover optimization fields to blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS schema TEXT,
ADD COLUMN IF NOT EXISTS jsonld JSONB,
ADD COLUMN IF NOT EXISTS canonical TEXT,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS discover_ready BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS indexed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS twitter_image TEXT,
ADD COLUMN IF NOT EXISTS faq_json JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS toc JSONB DEFAULT '[]'::jsonb;

-- Sync function to keep thumbnail/featured_image and faqs/faq_json in sync
CREATE OR REPLACE FUNCTION sync_blog_legacy_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync featured_image and thumbnail
  IF NEW.featured_image IS NULL AND NEW.thumbnail IS NOT NULL THEN
    NEW.featured_image := NEW.thumbnail;
  ELSIF NEW.thumbnail IS NULL AND NEW.featured_image IS NOT NULL THEN
    NEW.thumbnail := NEW.featured_image;
  END IF;

  -- Sync faqs and faq_json
  IF NEW.faq_json IS NULL AND NEW.faqs IS NOT NULL THEN
    NEW.faq_json := NEW.faqs;
  ELSIF NEW.faqs IS NULL AND NEW.faq_json IS NOT NULL THEN
    NEW.faqs := NEW.faq_json;
  END IF;

  -- Set status based on published boolean
  IF NEW.published = TRUE THEN
    NEW.status := 'published';
  ELSE
    NEW.status := 'draft';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_blog_legacy_fields ON blogs;
CREATE TRIGGER trg_sync_blog_legacy_fields
  BEFORE INSERT OR UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION sync_blog_legacy_fields();

-- Populate existing rows if any
UPDATE blogs SET 
  featured_image = COALESCE(featured_image, thumbnail),
  faq_json = COALESCE(faq_json, faqs),
  status = CASE WHEN published = TRUE THEN 'published' ELSE 'draft' END
WHERE featured_image IS NULL OR faq_json IS NULL;
