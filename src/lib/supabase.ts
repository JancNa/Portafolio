import { createClient } from '@supabase/supabase-js'

const env = (import.meta as any).env
const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required')
}

export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string)
