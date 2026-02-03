-- Migration: add_ultimate_goals
-- Description: Create table for user ultimate goals sync
-- Date: 2025-02-03

-- User Ultimate Goals Table
CREATE TABLE IF NOT EXISTS user_ultimate_goals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  goals JSONB NOT NULL DEFAULT '{"goals": []}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_ultimate_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Users can only access their own data
CREATE POLICY "Users can CRUD own ultimate goals" ON user_ultimate_goals
  FOR ALL USING (auth.uid() = user_id);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_ultimate_goals_updated_at ON user_ultimate_goals(updated_at);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger (skip if already exists from other tables)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_ultimate_goals_updated_at'
  ) THEN
    CREATE TRIGGER update_user_ultimate_goals_updated_at
      BEFORE UPDATE ON user_ultimate_goals
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
