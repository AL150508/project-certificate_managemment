// Certificate Types for Certificate Management System

export interface TextPosition {
  x: number
  y: number
}

export interface TextStyle {
  fontFamily: string
  fontSize: number
  color: string
  alignment: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  letterSpacing?: number
  lineHeight?: number
}

export interface CertificateElement {
  id: string
  type: 'name' | 'description' | 'date' | 'number' | 'tanggal' | 'location' | string
  label: string
  value: string
  position: TextPosition
  style: TextStyle
  visible?: boolean
  maxWidth?: number
  maxHeight?: number
  rotation?: number // Added for text rotation
  dateFormat?: string // For tanggal element format selection
}

export interface TemplateSource {
  type: 'upload' | 'admin' | 'config'
  url: string
  file?: File
  configId?: string
}

export interface CertificateTemplate {
  id: string
  title: string
  name: string
  description?: string
  preview_url?: string
  background_url?: string
  fields?: TemplateField[]
  layout?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface TemplateField {
  key: string
  label?: string
  x: number
  y: number
  fontSize?: number
  fontFamily?: string
  color?: string
  align?: string
}

export interface UserCertificateDesign {
  id: string
  user_id: string
  template_source: string
  template_url: string
  elements: CertificateElement[]
  created_at?: string
}

export interface CertificateData {
  name: string
  description: string
  date: string
  number: string
  expired?: string
  [key: string]: string | undefined
}

export interface CertificateConfig {
  templateId: string
  data: CertificateData
  elements?: CertificateElement[]
  customStyles?: Record<string, Partial<TextStyle>>
}

export interface CertificateRenderOptions {
  format: 'png' | 'pdf' | 'svg'
  quality?: number
  scale?: number
  background?: string
  watermark?: boolean
}

// Export types for backward compatibility
export type { TextPosition as Position }
export type { TextStyle as Style }
