import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url'

if (!isConfigured) {
    console.warn('Supabase URL or Anon Key is missing or using placeholders. Please check your .env file.')
}

// Create a dummy client if not configured to prevent crashes, 
// though actual auth calls will fail.
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : { auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }) } }

export { isConfigured }
