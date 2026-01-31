import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Auth features will be disabled.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Expose to window for debugging (development only)
if (import.meta.env.DEV && supabase) {
  (window as unknown as { supabase: typeof supabase }).supabase = supabase
}

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}
