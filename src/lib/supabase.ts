import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase environment variables are missing. Using placeholder values for build.")
  console.warn("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Use placeholder values during build if env vars are missing
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-anon-key'

export const supabase = createClient(url, key)

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


