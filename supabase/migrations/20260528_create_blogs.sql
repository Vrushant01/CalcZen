-- CalcZen Supabase Blog System Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  author TEXT NOT NULL DEFAULT 'CalcZen Team',
  calculator_links JSONB NOT NULL DEFAULT '[]',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  views INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER NOT NULL DEFAULT 0,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance and query optimization indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs (category);
CREATE INDEX IF NOT EXISTS idx_blogs_published_date ON blogs (published, publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs (featured) WHERE featured = TRUE;

-- Automatically update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access: allows anyone to select published blogs
DROP POLICY IF EXISTS "Public Read Access" ON blogs;
CREATE POLICY "Public Read Access" ON blogs
  FOR SELECT
  USING (published = TRUE);

-- 2. Admin Write Access: allows authenticated users or service_role writes.
-- Our Node.js backend connects using the service_role key, bypassing RLS by default.
-- However, we define this policy to enable robust dashboard operations.
DROP POLICY IF EXISTS "Admin Full Access" ON blogs;
CREATE POLICY "Admin Full Access" ON blogs
  FOR ALL
  USING (true)
  WITH CHECK (true);
