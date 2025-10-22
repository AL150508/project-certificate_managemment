import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid errors during build/import
let _supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (_supabaseInstance) {
    return _supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Missing Supabase environment variables')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'present' : 'missing')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'present' : 'missing')
    
    // Return a dummy client that will fail gracefully
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.\n' +
      'Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  // Create Supabase browser client with proper SSR support
  // This ensures session persistence works correctly in Next.js App Router
  // Using default cookie handling from @supabase/ssr
  _supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)

  // Setup auth state listener to sync session across tabs/pages
  if (typeof window !== 'undefined') {
    _supabaseInstance.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email)
      
      // Sync session to localStorage explicitly
      if (session) {
        console.log('✅ Session active, syncing to storage')
      } else {
        console.log('⚠️ No session, user logged out')
      }
    })
  }

  return _supabaseInstance
}

// Export as a Proxy to enable lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabaseClient()
    return instance[prop as keyof SupabaseClient]
  }
})

export type CertificateStatus = "draft" | "published" | "revoked"

export type CertificateRow = {
  id: string
  certificate_number: string
  verification_code: string
  template_id: string | null
  category_id: string | null
  member_id: string | null
  fields_data: Record<string, unknown> | null
  layout: Record<string, unknown> | null
  pdf_url: string | null
  png_url: string | null
  issue_date: string | null
  status: CertificateStatus
  created_by: string | null
  created_at: string
  updated_at: string
}


