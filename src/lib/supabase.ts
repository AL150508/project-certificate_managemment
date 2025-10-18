import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our certificate data
export interface Certificate {
  id: string
  name: string
  training_title: string
  date: string
  location: string | null
  signer_1_name: string | null
  signer_1_title: string | null
  signer_2_name: string | null
  signer_2_title: string | null
  qr_code_url: string | null
  certificate_number: string
  template_url: string | null
  orientation: 'landscape' | 'portrait'
  text_positions: {
    name?: { x: number; y: number; size: number }
    training_title?: { x: number; y: number; size: number }
    date?: { x: number; y: number; size: number }
    location?: { x: number; y: number; size: number }
    signer_1_name?: { x: number; y: number; size: number }
    signer_1_title?: { x: number; y: number; size: number }
    signer_2_name?: { x: number; y: number; size: number }
    signer_2_title?: { x: number; y: number; size: number }
  }
  created_at: string
  updated_at: string
  is_verified: boolean
  created_by: string | null
}

export interface CreateCertificateData {
  name: string
  training_title: string
  date: string
  location?: string
  signer_1_name?: string
  signer_1_title?: string
  signer_2_name?: string
  signer_2_title?: string
  template_url?: string
  orientation?: 'landscape' | 'portrait'
  text_positions?: any
}

// Certificate service functions
export const certificateService = {
  // Create a new certificate
  async create(data: CreateCertificateData) {
    const { data: certificate, error } = await supabase
      .from('certificates')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return certificate
  },

  // Get certificate by ID
  async getById(id: string) {
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return certificate
  },

  // Get certificate by certificate number
  async getByCertificateNumber(certificateNumber: string) {
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('certificate_number', certificateNumber)
      .single()

    if (error) throw error
    return certificate
  },

  // Get all certificates for the current user
  async getAll() {
    const { data: certificates, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return certificates
  },

  // Update certificate
  async update(id: string, data: Partial<Certificate>) {
    const { data: certificate, error } = await supabase
      .from('certificates')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return certificate
  },

  // Delete certificate
  async delete(id: string) {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Verify certificate
  async verify(id: string) {
    const { data: certificate, error } = await supabase
      .from('certificates')
      .update({ is_verified: true })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return certificate
  },

  // Get certificate statistics
  async getStats() {
    const { data: stats, error } = await supabase
      .from('certificate_stats')
      .select('*')
      .single()

    if (error) throw error
    return stats
  }
}

// Storage service for file uploads
export const storageService = {
  // Upload certificate template
  async uploadTemplate(file: File, fileName: string) {
    const { data, error } = await supabase.storage
      .from('certificate-templates')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error
    return data
  },

  // Get public URL for template
  getTemplateUrl(fileName: string) {
    const { data } = supabase.storage
      .from('certificate-templates')
      .getPublicUrl(fileName)

    return data.publicUrl
  },

  // Delete template
  async deleteTemplate(fileName: string) {
    const { error } = await supabase.storage
      .from('certificate-templates')
      .remove([fileName])

    if (error) throw error
  }
}
