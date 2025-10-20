import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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


