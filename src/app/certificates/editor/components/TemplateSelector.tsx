"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CertificateTemplate, TemplateSource } from '@/types/certificate'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import { TEMPLATE_CONFIGS, TemplateConfigManager } from '@/config/template-configs'

interface TemplateSelectorProps {
  onTemplateSelect: (template: TemplateSource) => void
  selectedTemplate: TemplateSource | null
}

export default function TemplateSelector({ 
  onTemplateSelect, 
  selectedTemplate 
}: TemplateSelectorProps) {
  const [adminTemplates, setAdminTemplates] = useState<CertificateTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Get predefined templates from config
  const predefinedTemplates = Object.values(TEMPLATE_CONFIGS)

  useEffect(() => {
    fetchAdminTemplates()
  }, [])

  const fetchAdminTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificate_templates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setAdminTemplates(data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load admin templates')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name, file.type, file.size)

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PNG, JPG, or PDF files only')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setUploading(true)

    try {
      // Create object URL for immediate preview
      const objectUrl = URL.createObjectURL(file)
      
      console.log('Creating template source with object URL:', objectUrl)

      // Create template source
      const templateSource: TemplateSource = {
        type: 'upload',
        url: objectUrl,
        file
      }

      onTemplateSelect(templateSource)
      toast.success('Template uploaded successfully!')

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload template')
    } finally {
      setUploading(false)
      // Reset input
      event.target.value = ''
    }
  }

  const handleAdminTemplateSelect = (template: CertificateTemplate) => {
    if (!template.preview_url) {
      toast.error('Template preview not available')
      return
    }

    const templateSource: TemplateSource = {
      type: 'admin',
      url: template.preview_url
    }

    onTemplateSelect(templateSource)
  }

  const handleConfigTemplateSelect = (templateConfig: typeof predefinedTemplates[0]) => {
    const imageUrl = templateConfig.metadata.backgroundImage 
      ? `/templates/${templateConfig.metadata.backgroundImage}`
      : '/templates/default-template.jpg'

    const templateSource: TemplateSource = {
      type: 'config',
      url: imageUrl,
      configId: templateConfig.id
    }

    onTemplateSelect(templateSource)
    toast.success(`Template "${templateConfig.name}" selected!`)
  }

  return (
    <div>
      <Label className="text-[#E2E8F0] text-sm mb-3 block">Choose Template</Label>
      
      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[140px] bg-[#1E293B] border border-[#334155] rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Show All Available Templates */}
          {predefinedTemplates.slice(0, 4).map((templateConfig) => (
            <div
              key={templateConfig.id}
              className={`h-[140px] bg-[#1E293B] border border-[#334155] rounded-md flex items-center justify-center text-sm font-semibold text-[#E2E8F0] cursor-pointer hover:bg-[#273548] transition relative overflow-hidden ${
                selectedTemplate?.type === 'config' && selectedTemplate.configId === templateConfig.id
                  ? 'ring-2 ring-[#3B82F6]'
                  : ''
              }`}
              onClick={() => handleConfigTemplateSelect(templateConfig)}
            >
              <div className="text-center p-4">
                <div className="w-full h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded mb-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {templateConfig.category?.toUpperCase() || 'TEMPLATE'}
                  </span>
                </div>
                <span className="block text-xs">{templateConfig.name}</span>
                <span className="text-xs opacity-70">{templateConfig.orientation}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      
      <div className="mt-4 text-center">
        <span className="text-[#94A3B8] text-xs">or</span>
      </div>

      <div className="mt-4">
        <Label className="text-[#94A3B8] text-xs mb-2 block">Upload Certificate (PNG, JPG, PDF)</Label>
        <div className="relative">
          <input
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="template-upload"
            disabled={uploading}
          />
          <Label
            htmlFor="template-upload"
            className={`cursor-pointer flex items-center justify-center w-full h-10 bg-[#1E293B] border border-[#334155] rounded-md text-[#E2E8F0] hover:bg-[#334155] transition-colors text-sm ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#E2E8F0] border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                <span>Choose File</span>
              </>
            )}
          </Label>
        </div>
      </div>
    </div>
  )
}
