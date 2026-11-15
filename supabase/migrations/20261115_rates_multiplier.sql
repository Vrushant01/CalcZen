-- CalcZen Migration: 20261115_rates_multiplier.sql
-- Table to persist daily India gold/silver multiplier and track monthly API call budget
-- DO NOT RUN AGAINST PRODUCTION AUTOMATICALLY

CREATE TABLE IF NOT EXISTS rates_multiplier (
  id TEXT PRIMARY KEY DEFAULT 'current',
  multiplier_gold DOUBLE PRECISION NOT NULL,
  multiplier_silver DOUBLE PRECISION NOT NULL,
  authority TEXT NOT NULL, -- 'ibja' | 'mcx'
  indian_gold_rate DOUBLE PRECISION NOT NULL,
  indian_silver_rate DOUBLE PRECISION NOT NULL,
  spot_gold_rate DOUBLE PRECISION NOT NULL,
  spot_silver_rate DOUBLE PRECISION NOT NULL,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metals_dev_timestamp TIMESTAMPTZ,
  calls_this_month INTEGER NOT NULL DEFAULT 0,
  calls_month TEXT NOT NULL DEFAULT to_char(NOW(), 'YYYY-MM')
);

CREATE INDEX IF NOT EXISTS idx_rates_multiplier_computed_at ON rates_multiplier (computed_at DESC);

-- Enable Row Level Security
ALTER TABLE rates_multiplier ENABLE ROW LEVEL SECURITY;
