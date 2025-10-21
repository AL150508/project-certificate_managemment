"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Search } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"

interface Category {
  id: string
  name: string
  description: string | null
  slug: string | null
  is_active: boolean
  created_at: string
}

export default function CategoriesPage() {
  const { canDeleteCategory } = usePermissions()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  
  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("certificate_categories")
        .select("*")
        .order("name")
      
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    console.log("📝 Submitting category:", { name, description, slug, isActive })
    
    try {
      if (editing) {
        // Update
        console.log("🔄 Updating category:", editing.id)
        const { error } = await supabase
          .from("certificate_categories")
          .update({
            name,
            description,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            is_active: isActive
          })
          .eq("id", editing.id)
        
        if (error) {
          console.error("❌ Update error:", error)
          throw error
        }
        
        console.log("✅ Category updated successfully")
        toast.success("Category updated successfully")
      } else {
        // Create
        console.log("➕ Creating new category")
        const { error } = await supabase
          .from("certificate_categories")
          .insert({
            name,
            description,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            is_active: isActive
          })
        
        if (error) {
          console.error("❌ Insert error:", error)
          throw error
        }
        
        console.log("✅ Category created successfully")
        toast.success("Category created successfully")
      }
      
      // Reset form and close dialog
      resetForm()
      setOpenDialog(false)
      fetchCategories()
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save category")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return
    
    console.log("🗑️ Deleting category:", id)
    
    try {
      const { error } = await supabase
        .from("certificate_categories")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("❌ Delete error:", error)
        throw error
      }
      
      console.log("✅ Category deleted successfully")
      toast.success("Category deleted successfully")
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete category")
    }
  }

  function openEditDialog(category: Category) {
    setEditing(category)
    setName(category.name)
    setDescription(category.description || "")
    setSlug(category.slug || "")
    setIsActive(category.is_active)
    setOpenDialog(true)
  }

  function resetForm() {
    setEditing(null)
    setName("")
    setDescription("")
    setSlug("")
    setIsActive(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage certificate categories</p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={(open) => {
          setOpenDialog(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#dc2626] hover:bg-[#b91c1c]">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] text-white border-[#333]">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Achievement"
                  required
                  className="bg-[#111] border-[#333]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Category description"
                  className="bg-[#111] border-[#333]"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated if empty"
                  className="bg-[#111] border-[#333]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] flex-1">
                  {editing ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="border-[#333] bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#1a1a1a] border-[#333]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#333] hover:bg-[#222]">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Slug</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Created</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No categories found. Create your first category!
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="border-[#333] hover:bg-[#222]">
                  <TableCell className="font-medium text-white">{category.name}</TableCell>
                  <TableCell className="text-gray-400">{category.description || "-"}</TableCell>
                  <TableCell className="text-gray-400">{category.slug || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      category.is_active 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(category.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {canDeleteCategory && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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
    </div>
  )
}
