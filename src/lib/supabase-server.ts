import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get Supabase credentials
function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Lazy initialization - only create client when actually needed
let _supabaseServerInstance: SupabaseClient | null = null

function getSupabaseServerInstance(): SupabaseClient {
  if (_supabaseServerInstance) {
    return _supabaseServerInstance
  }

  const url = getSupabaseUrl()
  const key = getSupabaseKey()

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables for server-side client.\n' +
      'Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)'
    )
  }

  _supabaseServerInstance = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return _supabaseServerInstance
}

// Export a proxy that lazily initializes the client
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabaseServerInstance()
    return instance[prop as keyof SupabaseClient]
  }
})
