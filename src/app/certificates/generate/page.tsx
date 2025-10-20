"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Download, Save } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface TemplateData {
  templateId: string
  templateName: string
  orientation: 'portrait' | 'landscape'
  layoutData: any[]
  fields: any[]
}

interface Member {
  id: string
  name: string
  email?: string
}

interface Category {
  id: string
  name: string
}

export default function GenerateCertificatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const [templateData, setTemplateData] = useState<TemplateData | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedMember, setSelectedMember] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadData()
  }, [templateId])

  const loadData = async () => {
    try {
      setLoading(true)

      // Try to get template data from sessionStorage first
      const storedTemplate = sessionStorage.getItem('selectedTemplate')
      if (storedTemplate) {
        const parsed = JSON.parse(storedTemplate)
        setTemplateData(parsed)
        console.log('Loaded template from session:', parsed)
      } else if (templateId) {
        // Fallback: load template data from database
        const [templateResp, designResp] = await Promise.all([
          supabase
            .from('certificate_templates')
            .select('id, name, orientation, fields')
            .eq('id', templateId)
            .single(),
          supabase
            .from('certificate_designs')
            .select('layout_data, orientation, metadata')
            .eq('template_id', templateId)
            .single()
        ])

        if (templateResp.error || designResp.error) {
          toast.error('Failed to load template')
          router.push('/certificates/new')
          return
        }

        const templateData: TemplateData = {
          templateId: templateResp.data.id,
          templateName: templateResp.data.name,
          orientation: designResp.data.orientation || templateResp.data.orientation,
          layoutData: designResp.data.layout_data,
          fields: templateResp.data.fields
        }

        setTemplateData(templateData)
        console.log('Loaded template from database:', templateData)
      }

      // Load members and categories
      const [membersResp, categoriesResp] = await Promise.all([
        supabase.from('members').select('id, name, email').order('name'),
        supabase.from('certificate_categories').select('id, name').order('name')
      ])

      if (membersResp.data) setMembers(membersResp.data)
      if (categoriesResp.data) setCategories(categoriesResp.data)

    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleGenerateCertificate = async () => {
    if (!templateData || !selectedMember || !selectedCategory) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setGenerating(true)

      // Get current date for certificate
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1

      // Generate certificate identifiers
      const { data: identifiers, error: rpcError } = await supabase
        .rpc('next_certificate_identifiers', { 
          y: year, 
          m: month, 
          code_len: 10 
        })

      if (rpcError) {
        console.error('RPC error:', rpcError)
        throw rpcError
      }

      // Create certificate record
      const certificateData = {
        certificate_number: identifiers.certificate_number,
        verification_code: identifiers.verification_code,
        template_id: templateData.templateId,
        member_id: selectedMember,
        category_id: selectedCategory,
        fields_data: fieldValues,
        data_json: {
          templateName: templateData.templateName,
          orientation: templateData.orientation,
          layoutData: templateData.layoutData,
          generatedAt: new Date().toISOString()
        },
        status: 'issued',
        issue_date: new Date().toISOString().split('T')[0]
      }

      const { data: certificate, error: certError } = await supabase
        .from('certificates')
        .insert(certificateData)
        .select()
        .single()

      if (certError) {
        console.error('Certificate creation error:', certError)
        throw certError
      }

      console.log('Certificate created successfully:', certificate)
      
      toast.success(`Certificate ${identifiers.certificate_number} created successfully!`)
      
      // Redirect to certificates list
      setTimeout(() => {
        router.push('/certificates')
      }, 1500)

    } catch (error) {
      console.error('Error generating certificate:', error)
      toast.error('Failed to generate certificate')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!templateData) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4">Template not found</div>
          <Link href="/certificates/new">
            <Button>Select Template</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/certificates/new">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Generate Certificate</h1>
              <p className="text-gray-400">Using template: {templateData.templateName}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-[#1f2937] border-[#374151] p-6">
            <h2 className="text-xl font-semibold mb-6">Certificate Details</h2>
            
            {/* Member Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Member *
              </label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#374151] text-white">
                  <SelectValue placeholder="Choose member" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f2937] border-[#374151]">
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} {member.email && `(${member.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-[#0A0A0A] border-[#374151] text-white">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f2937] border-[#374151]">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Fields */}
            {templateData.fields && templateData.fields.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Certificate Fields</h3>
                {templateData.fields.map((field: any) => (
                  <div key={field.id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {field.placeholder || field.type} {field.required && '*'}
                    </label>
                    <Input
                      value={fieldValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.type}`}
                      className="bg-[#0A0A0A] border-[#374151] text-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateCertificate}
              disabled={generating || !selectedMember || !selectedCategory}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Generate Certificate
                </>
              )}
            </Button>
          </Card>

          {/* Preview */}
          <Card className="bg-[#1f2937] border-[#374151] p-6">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            
            <div className="aspect-[3/4] bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="mb-2">Certificate Preview</div>
                <div className="text-sm">
                  Template: {templateData.templateName}<br/>
                  Orientation: {templateData.orientation}<br/>
                  Fields: {templateData.fields?.length || 0}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
