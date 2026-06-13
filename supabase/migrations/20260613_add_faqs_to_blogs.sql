-- Add FAQs JSONB column to the blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- Comment on column
COMMENT ON COLUMN blogs.faqs IS 'Array of FAQ objects {question, answer}';
