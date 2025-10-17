import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CertificateStatus = "draft" | "issued" | "revoked"

export type CertificateRow = {
  id: string
  certificate_no: string
  template_id: string | null
  category_id: string | null
  member_id: string | null
  data_json: any
  pdf_url: string | null
  issued_at: string | null
  valid_until: string | null
  status: CertificateStatus
  created_by: string | null
  created_at: string
  updated_at: string
}


