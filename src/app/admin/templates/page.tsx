"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Eye, Pencil, Trash2, Search, RectangleHorizontal, RectangleVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRole } from "@/context/RoleContext"
import { AppHeader } from "@/components/layouts/AppHeader"
import Image from "next/image"

interface Template {
  id: string
  name: string
  orientation: "landscape" | "portrait"
  background_url: string | null
  preview_url: string | null
  thumbnail_url: string | null
  category_id: string | null
  created_at: string
}

interface Category {
  id: string
  name: string
}

export default function TemplatesPageNew() {
  const router = useRouter()
  const { role } = useRole()
  const isAdmin = role === "admin"

  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Create Template Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    orientation: "landscape" as "landscape" | "portrait",
    template_image: null as File | null,
    preview_image: null as File | null
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      console.log("📥 Fetching templates and categories from database...")
      
      const [templatesResp, categoriesResp] = await Promise.all([
        supabase
          .from("certificate_templates")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("certificate_categories")
          .select("id, name")
          .order("name")
      ])
      
      console.log("📊 Templates response:", templatesResp)
      console.log("📊 Categories response:", categoriesResp)
      
      if (templatesResp.error) {
        console.error("❌ Templates fetch error:", templatesResp.error)
        throw templatesResp.error
      }
      if (categoriesResp.error) {
        console.error("❌ Categories fetch error:", categoriesResp.error)
        throw categoriesResp.error
      }
      
      console.log(`✅ Fetched ${templatesResp.data?.length || 0} templates`)
      console.log(`✅ Fetched ${categoriesResp.data?.length || 0} categories`)
      
      setTemplates(templatesResp.data || [])
      setCategories(categoriesResp.data || [])
    } catch (error) {
      console.error("❌ Error fetching data:", error)
      toast.error("Failed to fetch templates")
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTemplate() {
    if (!formData.name || !formData.category_id || !formData.template_image || !formData.preview_image) {
      toast.error("Please fill all required fields")
      return
    }

    setCreating(true)
    try {
      console.log("🚀 Starting template creation...")
      console.log("📝 Form data:", {
        name: formData.name,
        category_id: formData.category_id,
        orientation: formData.orientation
      })

      const bucketName = "certificates"
      console.log("📦 Using bucket:", bucketName)

      // Upload template image
      const templateImagePath = `templates/${Date.now()}_${formData.template_image.name}`
      console.log("📤 Uploading template image to:", bucketName, templateImagePath)
      
      const { error: uploadError1 } = await supabase.storage
        .from(bucketName)
        .upload(templateImagePath, formData.template_image)
      
      if (uploadError1) {
        console.error("❌ Template image upload error:", uploadError1)
        throw uploadError1
      }
      console.log("✅ Template image uploaded successfully")

      // Upload preview image
      const previewImagePath = `templates/previews/${Date.now()}_${formData.preview_image.name}`
      console.log("📤 Uploading preview image to:", bucketName, previewImagePath)
      
      const { error: uploadError2 } = await supabase.storage
        .from(bucketName)
        .upload(previewImagePath, formData.preview_image)
      
      if (uploadError2) {
        console.error("❌ Preview image upload error:", uploadError2)
        throw uploadError2
      }
      console.log("✅ Preview image uploaded successfully")

      // Get public URLs
      const { data: { publicUrl: templateUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(templateImagePath)
      
      const { data: { publicUrl: previewUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(previewImagePath)

      console.log("🔗 Template URL:", templateUrl)
      console.log("🔗 Preview URL:", previewUrl)

      // Insert template to database
      console.log("💾 Inserting template to database...")
      const { data: newTemplate, error: insertError } = await supabase
        .from("certificate_templates")
        .insert({
          name: formData.name,
          category_id: formData.category_id,
          orientation: formData.orientation,
          background_url: templateUrl,
          preview_url: previewUrl,
          thumbnail_url: previewUrl,
          template_source: "manual"
        })
        .select()
        .single()

      if (insertError) {
        console.error("❌ Database insert error:", insertError)
        throw insertError
      }

      console.log("✅ Template created successfully:", newTemplate)
      toast.success("Template created successfully!")
      setCreateDialogOpen(false)
      
      // Reset form
      setFormData({
        name: "",
        category_id: "",
        orientation: "landscape",
        template_image: null,
        preview_image: null
      })

      // Refresh data
      await fetchData()

      // Redirect to Certificate Editor
      console.log("🔄 Redirecting to editor with template ID:", newTemplate.id)
      router.push(`/certificates/editor?template=${newTemplate.id}`)
    } catch (error) {
      console.error("❌ Error creating template:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create template")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return
    
    try {
      console.log("🗑️ Deleting template:", { id, name })
      
      const { error } = await supabase
        .from("certificate_templates")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("❌ Delete error:", error)
        throw error
      }
      
      console.log("✅ Template deleted successfully")
      toast.success("Template deleted successfully")
      
      // Refresh data
      await fetchData()
    } catch (error) {
      console.error("❌ Error deleting template:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete template")
    }
  }

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return "Uncategorized"
    const category = categories.find(c => c.id === categoryId)
    return category?.name || "Uncategorized"
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryName(template.category_id).toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-6 mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Templates</h1>
            <p className="text-white/60">Manage certificate templates</p>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search template"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#1a1a1a] border-[#333] text-white"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px] bg-[#1a1a1a] border-[#333] text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center text-white/60 py-12">Loading templates...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <p className="mb-4">No templates found</p>
            {isAdmin && (
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                variant="outline"
                className="border-[#333] text-white hover:bg-[#333]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first template
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-[#111] border-[#262626] overflow-hidden hover:border-[#333] transition-colors">
                <CardContent className="p-0">
                  {/* Template Preview Image */}
                  <div className="relative w-full h-48 bg-[#1a1a1a]">
                    {template.preview_url || template.thumbnail_url || template.background_url ? (
                      <Image
                        src={template.preview_url || template.thumbnail_url || template.background_url || ""}
                        alt={template.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No preview
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                        {getCategoryName(template.category_id)}
                      </span>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                        {template.orientation === "landscape" ? (
                          <><RectangleHorizontal className="w-4 h-4" /> Landscape</>
                        ) : (
                          <><RectangleVertical className="w-4 h-4" /> Portrait</>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => toast.info("Preview feature coming soon")}
                        variant="outline"
                        className="w-full border-[#333] text-white hover:bg-[#333]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      
                      <Button
                        onClick={() => router.push(`/certificates/editor?template=${template.id}`)}
                        className="w-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 text-white"
                      >
                        Use This Template
                      </Button>

                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => router.push(`/admin/templates/${template.id}/editor`)}
                            variant="outline"
                            className="flex-1 border-[#333] text-white hover:bg-[#333]"
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(template.id, template.name)}
                            variant="outline"
                            className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Template Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="bg-[#111] border-[#262626] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create Template</DialogTitle>
              <DialogDescription className="text-white/60">
                Define the basic details of your template.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Template Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Template Name</Label>
                <Input
                  id="name"
                  placeholder="Enter template name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#1a1a1a] border-[#333] text-white focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Orientation */}
              <div className="space-y-2">
                <Label className="text-white">Orientation</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={formData.orientation === "landscape" ? "default" : "outline"}
                    className={formData.orientation === "landscape" 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "border-[#333] text-white hover:bg-[#333]"}
                    onClick={() => setFormData({ ...formData, orientation: "landscape" })}
                  >
                    <RectangleHorizontal className="w-4 h-4 mr-2" />
                    Landscape
                  </Button>
                  <Button
                    type="button"
                    variant={formData.orientation === "portrait" ? "default" : "outline"}
                    className={formData.orientation === "portrait" 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "border-[#333] text-white hover:bg-[#333]"}
                    onClick={() => setFormData({ ...formData, orientation: "portrait" })}
                  >
                    <RectangleVertical className="w-4 h-4 mr-2" />
                    Portrait
                  </Button>
                </div>
              </div>

              {/* Template Image */}
              <div className="space-y-2">
                <Label htmlFor="template-image" className="text-white">
                  Template Image (Required) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="template-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, template_image: e.target.files?.[0] || null })}
                  className="bg-[#1a1a1a] border-[#333] text-white file:text-white"
                />
                {formData.template_image && (
                  <p className="text-sm text-green-400">✓ {formData.template_image.name}</p>
                )}
              </div>

              {/* Preview Image */}
              <div className="space-y-2">
                <Label htmlFor="preview-image" className="text-white">
                  Preview Image (Thumbnail) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="preview-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, preview_image: e.target.files?.[0] || null })}
                  className="bg-[#1a1a1a] border-[#333] text-white file:text-white"
                />
                {formData.preview_image && (
                  <p className="text-sm text-green-400">✓ {formData.preview_image.name}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="border-[#333] text-white hover:bg-[#333]"
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 text-white"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
