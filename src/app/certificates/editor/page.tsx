"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CertificateElement, TemplateSource } from '@/types/certificate'
import { TemplateConfigManager } from '@/config/template-configs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Save, ArrowLeft, Smartphone, Monitor } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CertificatePreview from './components/CertificatePreview'
import EditorPanel from './components/EditorPanel'
import { generateAndUploadPreviews } from '@/lib/preview-generator'

export default function CertificateEditorPage() {
  const router = useRouter()
  const [templateSource, setTemplateSource] = useState<TemplateSource | null>(null)
  const [elements, setElements] = useState<CertificateElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])
  const [templateId, setTemplateId] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (!user) {
        console.warn('⚠️ No user found, but allowing access to editor')
        // Don't redirect immediately, let user try to save first
        // toast.error('Please login to access the editor')
        // router.push('/login')
      } else {
        console.log('✅ User authenticated:', user.email)
      }
    }
    
    checkUser()
  }, [router])

  // Load categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('certificate_categories')
          .select('id, name')
          .order('name')

        if (error) {
          console.error('Error loading categories:', error)
          // Fallback categories if table doesn't exist
          const fallbackCategories = [
            { id: 'achievement', name: 'Achievement' },
            { id: 'completion', name: 'Completion' },
            { id: 'participation', name: 'Participation' },
            { id: 'excellence', name: 'Excellence' },
            { id: 'training', name: 'Training' }
          ]
          console.log('Using fallback categories:', fallbackCategories)
          setCategories(fallbackCategories)
        } else {
          console.log('Loaded categories from database:', data)
          console.log('Categories count:', data?.length || 0)
          setCategories(data || [])
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback categories
        setCategories([
          { id: 'achievement', name: 'Achievement' },
          { id: 'completion', name: 'Completion' },
          { id: 'participation', name: 'Participation' },
          { id: 'excellence', name: 'Excellence' },
          { id: 'training', name: 'Training' }
        ])
      }
    }

    loadCategories()
  }, [])

  const generateElementId = () => {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleTemplateSelect = (template: TemplateSource) => {
    setTemplateSource(template)
    setSelectedElementId(null)
    
    // Generate template ID for database
    setTemplateId(template.configId || `uploaded_${Date.now()}`)
    
    // Load elements from template config if it's a config template
    if (template.type === 'config' && template.configId) {
      const templateConfig = TemplateConfigManager.getConfig(template.configId)
      if (templateConfig) {
        // Set orientation from template config
        setOrientation(templateConfig.orientation)
        
        const configElements: CertificateElement[] = Object.entries(templateConfig.elements).map(([type, elementConfig]) => ({
          id: generateElementId(),
          type: type as CertificateElement['type'],
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: elementConfig.placeholder || '',
          position: elementConfig.position,
          style: elementConfig.style,
          visible: elementConfig.visible,
          maxWidth: elementConfig.maxWidth,
          maxHeight: elementConfig.maxHeight
        }))
        
        setElements(configElements)
        toast.success(`Template "${templateConfig.name}" loaded with ${configElements.length} elements`)
      }
    } else {
      // Reset elements for other template types
      setElements([])
    }
    toast.success('Template selected successfully!')
  }

  const handleElementAdd = (type: CertificateElement['type']) => {
    const newElement: CertificateElement = {
      id: generateElementId(),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: `Sample ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position: {
        x: 100,
        y: 100
      },
      style: {
        fontFamily: 'Inter',
        fontSize: 16,
        color: '#000000',
        alignment: 'left'
      },
      visible: true
    }

    setElements(prev => [...prev, newElement])
    setSelectedElementId(newElement.id)
    toast.success(`${newElement.label} element added`)
    console.log('Element added:', newElement)
  }

  const handleElementUpdate = (elementId: string, updates: Partial<CertificateElement>) => {
    console.log('Updating element:', elementId, updates)
    setElements(prev => {
      const updated = prev.map(el => 
        el.id === elementId 
          ? { ...el, ...updates }
          : el
      )
      console.log('Updated elements:', updated)
      return updated
    })
  }

  const handleElementDelete = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId))
    if (selectedElementId === elementId) {
      setSelectedElementId(null)
    }
  }

  const handleElementDuplicate = (element: CertificateElement) => {
    const newElement: CertificateElement = {
      ...element,
      id: generateElementId(),
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    }
    setElements(prev => [...prev, newElement])
    setSelectedElementId(newElement.id)
  }

  async function handleSaveTemplate() {
    console.log('=== SAVE TEMPLATE BUTTON CLICKED ===')
    console.log('🔍 Current State:')
    console.log('  - Template Source:', templateSource)
    console.log('  - Elements Count:', elements.length)
    console.log('  - Elements:', elements)
    console.log('  - Selected Category:', selectedCategory)
    console.log('  - Orientation:', orientation)
    console.log('  - Saving State:', saving)

    if (!templateSource) {
      console.error('❌ No template source selected')
      toast.error('Please select a template background first')
      return
    }

    if (elements.length === 0) {
      console.error('❌ No elements added')
      toast.error('Please add at least one element to the template')
      return
    }

    console.log('✅ Validation passed, starting save process...')
    setSaving(true)
    console.log('📝 Saving state set to true')

    // Re-check user authentication
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    console.log('Current User:', currentUser)
    console.log('Template Source:', templateSource)
    console.log('Elements:', elements)
    console.log('Selected Category:', selectedCategory)

    if (!currentUser) {
      toast.error('Please login to save templates')
      router.push('/login')
      setSaving(false)
      return
    }

    try {
      // Test database connection first
      console.log('🔍 Testing database connection...')
      const { data: testData, error: testError } = await supabase
        .from('certificate_categories')
        .select('count')
        .limit(1)
      
      console.log('Database test result:', { testData, testError })
      
      if (testError) {
        console.error('❌ Database connection failed:', testError)
        toast.error('Database connection failed. Please check your setup.')
        setSaving(false)
        return
      }
      
      console.log('✅ Database connection successful')
      
      // STEP 1: Prepare template metadata for certificate_templates table
      const templateName = templateSource.configId ? 
        TemplateConfigManager.getConfig(templateSource.configId)?.name : 'Custom Template'
      
      const templateData = {
        name: templateName,
        orientation: orientation,
        width_px: orientation === 'portrait' ? 800 : 1200,
        height_px: orientation === 'portrait' ? 1200 : 800,
        background_url: templateSource.url,
        template_source: templateSource.type,
        template_url: templateSource.url,
        template_config_id: templateSource.configId || null,
        category_id: selectedCategory || null,
        created_by: currentUser.id,
        fields: elements.map(el => ({
          id: el.id,
          type: el.type,
          placeholder: (el as any).placeholder || '',
          required: true
        })),
        metadata: {
          templateId: templateId,
          orientation: orientation,
          category: selectedCategory || 'general',
          elementCount: elements.length,
          lastModified: new Date().toISOString(),
          version: '1.0.0'
        }
      }

      console.log('=== STEP 1: Saving to certificate_templates ===')
      console.log('Template data:', templateData)

      // Save to certificate_templates FIRST
      const { data: templateResult, error: templateError } = await supabase
        .from('certificate_templates')
        .insert(templateData)
        .select()
        .single()

      if (templateError) {
        console.error('❌ Template save error:', templateError)
        console.error('📋 Full error object:', JSON.stringify(templateError, null, 2))
        console.error('📋 Template error details:', {
          message: templateError.message,
          details: templateError.details,
          hint: templateError.hint,
          code: templateError.code,
          statusCode: (templateError as any).statusCode
        })
        console.error('📋 Template data that failed:', JSON.stringify(templateData, null, 2))
        
        // Provide specific error message
        if (templateError.message.includes('relation') && templateError.message.includes('does not exist')) {
          toast.error('Database table "certificate_templates" not found. Please run setup-all-tables.sql script.')
          setSaving(false)
          return
        } else if (templateError.message.includes('permission denied')) {
          toast.error('Permission denied. Please check your authentication.')
          setSaving(false)
          return
        } else {
          toast.error(`Template save failed: ${templateError.message}`)
          setSaving(false)
          return
        }
      }

      console.log('Template saved successfully:', templateResult)
      console.log('=== STEP 1 COMPLETED ===')

      // STEP 1.5: Generate and upload preview images (DISABLED - CSS compatibility issues)
      // Preview generation disabled due to html2canvas CSS parsing issues
      // Templates will save without preview images for now
      console.log('⚠️ Preview generation disabled (CSS compatibility issues)')
      
      // Set background_url as preview_url fallback
      try {
        const { error: updateError } = await supabase
          .from('certificate_templates')
          .update({
            preview_url: templateSource.url,
            thumbnail_url: templateSource.url
          })
          .eq('id', templateResult.id)

        if (updateError) {
          console.warn('⚠️ Failed to update preview URLs:', updateError)
        } else {
          console.log('✅ Using background as preview URL')
        }
      } catch (err) {
        console.warn('⚠️ Preview URL update failed (non-critical):', err)
      }

      // STEP 2: Prepare design data for certificate_designs table
      const designData = {
        template_id: templateResult.id, // Link to the template we just created
        layout_data: elements, // Store the actual layout elements
        orientation: orientation,
        metadata: {
          templateName: templateName,
          elementCount: elements.length,
          lastModified: new Date().toISOString()
        }
      }

      console.log('=== STEP 2: Saving to certificate_designs ===')
      console.log('Design data:', designData)

      // Save to certificate_designs with template_id reference
      const { data: designResult, error: designError } = await supabase
        .from('certificate_designs')
        .insert(designData)
        .select()
        .single()

      if (designError) {
        console.error('❌ Design save error:', designError)
        console.error('📋 Full design error object:', JSON.stringify(designError, null, 2))
        console.error('📋 Design error details:', {
          message: designError.message,
          details: designError.details,
          hint: designError.hint,
          code: designError.code,
          statusCode: (designError as any).statusCode
        })
        console.error('📋 Design data that failed:', JSON.stringify(designData, null, 2))
        
        // Provide specific error message
        if (designError.message.includes('relation') && designError.message.includes('does not exist')) {
          toast.error('Database table "certificate_designs" not found. Please run setup-all-tables.sql script.')
          setSaving(false)
          return
        } else if (designError.message.includes('permission denied')) {
          toast.error('Permission denied. Please check your authentication.')
          setSaving(false)
          return
        } else if (designError.message.includes('violates foreign key constraint')) {
          toast.error('Template reference error. Please try again.')
          setSaving(false)
          return
        } else {
          toast.error(`Design save failed: ${designError.message}`)
          setSaving(false)
          return
        }
      }

      console.log('Design saved successfully:', designResult)
      console.log('=== STEP 2 COMPLETED ===')

      console.log('=== SAVE COMPLETED SUCCESSFULLY ===')
      
      // Show success details  
      const categoryName = categories.find(c => c.id === selectedCategory)?.name || selectedCategory
      toast.success(`Template "${templateName}" saved successfully!`, {
        duration: 3000
      })
      
      console.log('🔄 Redirecting to /certificates...')
      
      // Redirect to certificates page with force refresh
      setTimeout(() => {
        router.push('/certificates?refresh=true')
        // Also trigger a hard refresh after navigation
        setTimeout(() => {
          window.location.href = '/certificates'
        }, 100)
      }, 1000)
      
    } catch (error) {
      console.error('Error saving certificate design:', error)
      
      // Provide specific error messages
      let errorMessage = 'Failed to save certificate design'
      if (error instanceof Error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          errorMessage = 'Database table "certificate_designs" not found. Please run the setup script: /scripts/ensure-certificate-designs-table.sql'
        } else if (error.message.includes('permission denied')) {
          errorMessage = 'Permission denied. Please check your authentication.'
        } else if (error.message.includes('violates foreign key constraint')) {
          errorMessage = 'Invalid user reference. Please log in again.'
        } else if (error.message.includes('violates not-null constraint')) {
          errorMessage = 'Missing required data. Please check template source and URL.'
        } else {
          errorMessage = `Save error: ${error.message}`
        }
      }
      
      toast.error(errorMessage, {
        duration: 5000,
        description: error instanceof Error && error.message.includes('relation') ? 
          'Run the SQL scripts in Supabase to create the required tables.' : undefined
      })
    } finally {
      setSaving(false)
      console.log('Setting saving to false...')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <div className="border-b border-[#334155] bg-[#1a1f2e] px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-[#9ca3af] hover:text-white hover:bg-[#2a3441]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Certificate Editor</h1>
              <p className="text-[#9ca3af]">Design and customize your certificate templates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Category Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#9ca3af]">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-[#1f2937] border-[#374151] text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f2937] border-[#374151] text-white">
                  {categories.length === 0 ? (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                        className="text-white hover:bg-[#374151] focus:bg-[#374151]"
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Orientation Toggle */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#9ca3af]">Orientation</label>
              <div className="flex bg-[#1f2937] rounded-md p-1">
                <Button
                  variant={orientation === 'portrait' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setOrientation('portrait')}
                  className={`px-3 py-1 text-xs ${
                    orientation === 'portrait' 
                      ? 'bg-[#3B82F6] text-white' 
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#374151]'
                  }`}
                >
                  <Smartphone className="w-3 h-3 mr-1" />
                  Portrait
                </Button>
                <Button
                  variant={orientation === 'landscape' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setOrientation('landscape')}
                  className={`px-3 py-1 text-xs ${
                    orientation === 'landscape' 
                      ? 'bg-[#3B82F6] text-white' 
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#374151]'
                  }`}
                >
                  <Monitor className="w-3 h-3 mr-1" />
                  Landscape
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveTemplate}
              disabled={saving || !templateSource || elements.length === 0}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-[1.7fr_1fr] gap-6 w-full h-full px-6 py-6 bg-[#0f172a] text-[#E2E8F0] rounded-xl">
          {/* Left Column - Certificate Preview */}
          <div id="certificate-preview-container">
            <CertificatePreview
            templateSource={templateSource}
            elements={elements}
            className={`w-full transition-all duration-300 ${
              orientation === 'portrait' 
                ? 'max-w-[600px] aspect-[3/4]' 
                : 'max-w-[800px] aspect-[4/3]'
            }`}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
            onElementSelect={setSelectedElementId}
            selectedElementId={selectedElementId}
            orientation={orientation}
            selectedCategory={selectedCategory}
            categories={categories}
          />
          </div>

          {/* Right Column - Editor Panel */}
          <EditorPanel
            elements={elements}
            onElementUpdate={handleElementUpdate}
            onElementAdd={handleElementAdd}
            onElementDelete={handleElementDelete}
            onElementDuplicate={handleElementDuplicate}
            selectedElementId={selectedElementId}
            onElementSelect={setSelectedElementId}
            templateSource={templateSource}
            onTemplateSelect={handleTemplateSelect}
            onSaveTemplate={handleSaveTemplate}
            saving={saving}
          />
        </div>
      </div>
    </div>
  )
}
