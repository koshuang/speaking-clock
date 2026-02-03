-- Migration: 001_initial_auth_tables
-- Description: Create initial tables for user data sync
-- Date: 2025-01-30

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Todos Table
CREATE TABLE IF NOT EXISTS user_todos (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  todos JSONB NOT NULL DEFAULT '{"items": []}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Star Rewards Table
CREATE TABLE IF NOT EXISTS user_star_rewards (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  rewards JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_star_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can CRUD own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own todos" ON user_todos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own star rewards" ON user_star_rewards
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_settings_updated_at ON user_settings(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_todos_updated_at ON user_todos(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_star_rewards_updated_at ON user_star_rewards(updated_at);
