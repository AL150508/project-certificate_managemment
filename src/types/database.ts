// Database types for Certificate Management System

export interface DatabaseUser {
  id: string
  email: string
  role: 'admin' | 'team' | 'public'
  name?: string | null
  created_at?: string
  updated_at?: string
}

export interface DatabaseCertificate {
  id: string
  certificate_number: string
  verification_code: string
  member_id: string | null
  category_id: string | null
  template_id: string | null
  issue_date: string | null
  status: string
  pdf_url: string | null
  png_url: string | null
  fields_data?: Record<string, unknown> | null
  layout?: Record<string, unknown> | null
  created_by?: string | null
  created_at?: string
  updated_at?: string
}

export interface DatabaseMember {
  id: string
  name: string
  email: string | null
  organization?: string | null
  phone?: string | null
  city?: string | null
}

export interface DatabaseCategory {
  id: string
  name: string
  description?: string | null
}

export interface DatabaseTemplate {
  id: string
  name: string
  fields?: TemplateField[] | null
  layout?: Record<string, unknown> | null
  background_url?: string | null
  preview_url?: string | null
}

export interface TemplateField {
  key?: string
  id?: string
  type?: string
  label?: string
  placeholder?: string
  required?: boolean
  x?: number
  y?: number
  fontSize?: number
  fontFamily?: string
  color?: string
  align?: string
}

export interface CertificateWithRelations extends DatabaseCertificate {
  member_name: string | null
  category_name: string | null
}

export interface SupabaseResponse<T> {
  data: T[] | null
  error: Error | null
}

export interface FormSubmissionData {
  member_id: string
  category_id: string
  template_id: string
  issued_at: string
  status: string
}
