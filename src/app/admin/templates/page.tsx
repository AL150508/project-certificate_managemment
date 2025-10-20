"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Eye, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/hooks/usePermissions"

interface Template {
  id: string
  name: string
  orientation: string
  background_url: string | null
  preview_url: string | null
  thumbnail_url: string | null
  category_id: string | null
  template_source: string | null
  created_at: string
  fields: any[]
}

interface Category {
  id: string
  name: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const { canDeleteTemplate } = usePermissions()
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      console.log("📥 Fetching templates and categories...")
      console.log("🔍 Current user:", await supabase.auth.getUser())
      
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
      
      console.log("✅ Fetched", templatesResp.data?.length, "templates")
      console.log("📋 Templates data:", templatesResp.data)
      console.log("✅ Fetched", categoriesResp.data?.length, "categories")
      
      setTemplates(templatesResp.data || [])
      setCategories(categoriesResp.data || [])
      
      if (!templatesResp.data || templatesResp.data.length === 0) {
        console.warn("⚠️ No templates found in database")
        toast.info("No templates found. Create your first template!")
      }
    } catch (error: any) {
      console.error("❌ Error fetching data:", error)
      toast.error(error.message || "Failed to fetch templates")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return
    
    console.log("🗑️ Deleting template:", id)
    
    try {
      // Delete associated designs first (CASCADE should handle this, but being explicit)
      const { error: designError } = await supabase
        .from("certificate_designs")
        .delete()
        .eq("template_id", id)
      
      if (designError) {
        console.warn("⚠️ Design delete warning:", designError)
      }
      
      // Delete template
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
      fetchData()
    } catch (error: any) {
      console.error("Error deleting template:", error)
      toast.error(error.message || "Failed to delete template")
    }
  }

  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return "-"
    const category = categories.find(c => c.id === categoryId)
    return category?.name || "-"
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(search.toLowerCase()) ||
    getCategoryName(template.category_id).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage certificate templates</p>
        </div>
        
        <Link href="/certificates/editor">
          <Button className="bg-[#dc2626] hover:bg-[#b91c1c]">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#333]"
          />
        </div>
      </div>

      <Card className="bg-[#1a1a1a] border-[#333]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#333] hover:bg-[#222]">
              <TableHead className="text-white">Preview</TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Orientation</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Fields</TableHead>
              <TableHead className="text-white">Source</TableHead>
              <TableHead className="text-white">Created</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  {search ? (
                    "No templates found matching your search"
                  ) : (
                    <div className="space-y-2">
                      <p>No templates found. Create your first template!</p>
                      <Link href="/certificates/editor">
                        <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333]">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Template
                        </Button>
                      </Link>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((template) => (
                <TableRow key={template.id} className="border-[#333] hover:bg-[#222]">
                  <TableCell>
                    <div className="w-20 h-14 relative bg-gray-800 rounded overflow-hidden">
                      {template.preview_url || template.thumbnail_url || template.background_url ? (
                        <Image
                          src={template.preview_url || template.thumbnail_url || template.background_url || ""}
                          alt={template.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                          No preview
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {template.name}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    <span className={`px-2 py-1 rounded text-xs ${
                      template.orientation === 'landscape' 
                        ? "bg-blue-500/20 text-blue-400" 
                        : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {template.orientation || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {getCategoryName(template.category_id)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {template.fields?.length || 0} fields
                  </TableCell>
                  <TableCell className="text-gray-400">
                    <span className="text-xs">
                      {template.template_source || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(template.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Preview template (could open in modal or new page)
                        toast.info("Preview feature coming soon")
                      }}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        router.push(`/certificates/editor?template=${template.id}`)
                      }}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {canDeleteTemplate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(template.id, template.name)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>
    </div>
  )
}
