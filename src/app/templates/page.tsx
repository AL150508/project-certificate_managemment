"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, FileImage } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Template {
  id: string
  name: string
  background_url: string | null
  thumbnail_url: string | null
  orientation: 'portrait' | 'landscape'
  category_id: string | null
  created_at: string
  created_by: string
  certificate_categories?: {
    name: string
  }
}

interface Category {
  id: string
  name: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Create Template Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [templateFile, setTemplateFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [creating, setCreating] = useState(false)

  // Load templates and categories
  useEffect(() => {
    loadData()
  }, [])

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery.trim() === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
      template.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load templates and categories
      const [templatesResp, categoriesResp] = await Promise.all([
        supabase
          .from('certificate_templates')
          .select('id, name, background_url, thumbnail_url, orientation, category_id, created_at, created_by')
          .order('created_at', { ascending: false }),
        supabase
          .from('certificate_categories')
          .select('id, name')
          .order('name')
      ])

      if (templatesResp.error) {
        console.error('Error loading templates:', templatesResp.error)
        toast.error('Failed to load templates')
      } else {
        setTemplates(templatesResp.data || [])
      }

      if (categoriesResp.error) {
        console.error('Error loading categories:', categoriesResp.error)
        // Use fallback categories
        setCategories([
          { id: 'achievement', name: 'Achievement' },
          { id: 'completion', name: 'Completion' },
          { id: 'participation', name: 'Participation' },
          { id: 'excellence', name: 'Excellence' },
          { id: 'training', name: 'Training' }
        ])
      } else {
        setCategories(categoriesResp.data || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('certificate-assets')
      .upload(`${folder}/${fileName}`, file)
    
    if (error) throw error
    
    const { data: urlData } = supabase.storage
      .from('certificate-assets')
      .getPublicUrl(`${folder}/${fileName}`)
    
    return urlData.publicUrl
  }

  // Handle create template form submission
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!templateName.trim() || !selectedCategoryId || !templateFile) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setCreating(true)
      
      // Upload template image
      const backgroundUrl = await uploadFile(templateFile, 'backgrounds')
      
      // Upload preview image if provided
      let thumbnailUrl = null
      if (previewFile) {
        thumbnailUrl = await uploadFile(previewFile, 'thumbnails')
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to create templates')
        return
      }

      // Create template record
      const { data, error } = await supabase
        .from('certificate_templates')
        .insert({
          name: templateName.trim(),
          category_id: selectedCategoryId,
          orientation: orientation,
          background_url: backgroundUrl,
          thumbnail_url: thumbnailUrl,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating template:', error)
        toast.error('Failed to create template')
        return
      }

      toast.success('Template created successfully!')
      
      // Reset form
      setTemplateName('')
      setSelectedCategoryId('')
      setOrientation('portrait')
      setTemplateFile(null)
      setPreviewFile(null)
      setIsCreateModalOpen(false)
      
      // Reload templates
      loadData()
      
      // Redirect to editor
      router.push(`/certificates/editor?templateId=${data.id}`)
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
    } finally {
      setCreating(false)
    }
  }

  const handleUseTemplate = (templateId: string) => {
    router.push(`/certificates/generate?templateId=${templateId}`)
  }

  const handleEdit = (templateId: string) => {
    router.push(`/certificates/editor?templateId=${templateId}`)
  }

  const handleDelete = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('certificate_templates')
        .delete()
        .eq('id', templateId)

      if (error) {
        console.error('Error deleting template:', error)
        toast.error('Failed to delete template')
        return
      }

      toast.success('Template deleted successfully')
      loadData() // Reload templates
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Templates</h1>
            <p className="text-gray-400">Manage and create certificate templates</p>
          </div>
          
          {/* Create Template Button */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1f2937] text-white border-[#374151] max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Template</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                {/* Template Name */}
                <div>
                  <Label htmlFor="templateName" className="text-gray-300">Template Name *</Label>
                  <Input
                    id="templateName"
                    placeholder="Enter template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="bg-[#0A0A0A] border-[#374151] text-white"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="text-gray-300">Category *</Label>
                  <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                    <SelectTrigger className="bg-[#0A0A0A] border-[#374151] text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1f2937] border-[#374151]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white hover:bg-[#374151]">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Orientation */}
                <div>
                  <Label className="text-gray-300">Orientation</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={orientation === 'landscape' ? 'default' : 'outline'}
                      onClick={() => setOrientation('landscape')}
                      className={orientation === 'landscape' ? 'bg-red-600 hover:bg-red-700' : 'border-[#374151] text-gray-300 hover:bg-[#374151]'}
                    >
                      Landscape
                    </Button>
                    <Button
                      type="button"
                      variant={orientation === 'portrait' ? 'default' : 'outline'}
                      onClick={() => setOrientation('portrait')}
                      className={orientation === 'portrait' ? 'bg-red-600 hover:bg-red-700' : 'border-[#374151] text-gray-300 hover:bg-[#374151]'}
                    >
                      Portrait
                    </Button>
                  </div>
                </div>

                {/* Template Image */}
                <div>
                  <Label htmlFor="templateImage" className="text-gray-300">Template Image (Required) *</Label>
                  <Input
                    id="templateImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
                    className="bg-[#0A0A0A] border-[#374151] text-white file:bg-red-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                    required
                  />
                </div>

                {/* Preview Image */}
                <div>
                  <Label htmlFor="previewImage" className="text-gray-300">Preview Image (Thumbnail)</Label>
                  <Input
                    id="previewImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                    className="bg-[#0A0A0A] border-[#374151] text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="border-[#374151] text-gray-300 hover:bg-[#374151]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={creating}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {creating ? 'Creating...' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1f2937] border-[#374151] text-white placeholder-gray-400 focus:border-red-600"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-[#1f2937] border-[#374151] text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[#1f2937] border-[#374151]">
              <SelectItem value="all" className="text-white hover:bg-[#374151]">
                All Categories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="text-white hover:bg-[#374151]"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No templates found matching your criteria' 
                : 'No templates available'
              }
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Template
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-[#1f2937] border-[#374151] hover:border-red-500 transition-colors">
                <div className="p-4">
                  {/* Template Preview */}
                  <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-4 overflow-hidden">
                    {template.thumbnail_url || template.background_url ? (
                      <Image
                        src={template.thumbnail_url || template.background_url || ''}
                        alt={template.name}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <FileImage className="w-12 h-12 mx-auto mb-2" />
                          <div>No Preview</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Template Info */}
                  <h3 className="font-semibold text-white mb-2 truncate">
                    {template.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span className="capitalize">{template.orientation}</span>
                    <span>{template.certificate_categories?.name || 'General'}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Use Template
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(template.id)}
                      className="border-[#374151] text-gray-300 hover:bg-[#374151]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(template.id, template.name)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredTemplates.length > 0 && (
          <div className="mt-8 text-center text-gray-400 text-sm">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
        )}
      </div>
    </div>
  )
}
