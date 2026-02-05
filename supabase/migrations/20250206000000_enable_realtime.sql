-- Migration: Enable Realtime for sync tables
-- Description: Enable Supabase Realtime replication for user data tables
-- Date: 2025-02-06

-- Enable Realtime for user_todos table
ALTER PUBLICATION supabase_realtime ADD TABLE user_todos;

-- Enable Realtime for user_star_rewards table
ALTER PUBLICATION supabase_realtime ADD TABLE user_star_rewards;

-- Enable Realtime for user_ultimate_goals table
ALTER PUBLICATION supabase_realtime ADD TABLE user_ultimate_goals;

-- Enable Realtime for user_settings table
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;
