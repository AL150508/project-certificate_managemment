import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials with fallback for build time
function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

// Create Supabase server client for API routes and server components
// This bypasses RLS and should be used carefully
export const supabaseServer = createClient(
  getSupabaseUrl(),
  getSupabaseKey(),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to validate credentials at runtime
export function validateSupabaseServer() {
  const url = getSupabaseUrl()
  const key = getSupabaseKey()
  
  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables for server-side client.\n' +
      'Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)'
    )
  }
}
