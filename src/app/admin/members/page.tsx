"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Search } from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"

interface Member {
  id: string
  name: string
  email: string | null
  phone: string | null
  created_at: string
}

export default function MembersPage() {
  const { canDeleteMember } = usePermissions()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [search, setSearch] = useState("")
  
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    setLoading(true)
    try {
      console.log("📥 Fetching members...")
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("name")
      
      if (error) {
        console.error("❌ Fetch error:", error)
        throw error
      }
      
      console.log("✅ Fetched", data?.length, "members")
      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
      toast.error("Failed to fetch members")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    console.log("📝 Submitting member:", { name, email, phone })
    
    try {
      if (editing) {
        // Update
        console.log("🔄 Updating member:", editing.id)
        const { error } = await supabase
          .from("members")
          .update({
            name,
            email: email || null,
            phone: phone || null
          })
          .eq("id", editing.id)
        
        if (error) {
          console.error("❌ Update error:", error)
          throw error
        }
        
        console.log("✅ Member updated successfully")
        toast.success("Member updated successfully")
      } else {
        // Create
        console.log("➕ Creating new member")
        const { error } = await supabase
          .from("members")
          .insert({
            name,
            email: email || null,
            phone: phone || null
          })
        
        if (error) {
          console.error("❌ Insert error:", error)
          throw error
        }
        
        console.log("✅ Member created successfully")
        toast.success("Member created successfully")
      }
      
      // Reset form and close dialog
      resetForm()
      setOpenDialog(false)
      fetchMembers()
    } catch (error: any) {
      console.error("Error saving member:", error)
      toast.error(error.message || "Failed to save member")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this member?")) return
    
    console.log("🗑️ Deleting member:", id)
    
    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", id)
      
      if (error) {
        console.error("❌ Delete error:", error)
        throw error
      }
      
      console.log("✅ Member deleted successfully")
      toast.success("Member deleted successfully")
      fetchMembers()
    } catch (error: any) {
      console.error("Error deleting member:", error)
      toast.error(error.message || "Failed to delete member")
    }
  }

  function openEditDialog(member: Member) {
    setEditing(member)
    setName(member.name)
    setEmail(member.email || "")
    setPhone(member.phone || "")
    setOpenDialog(true)
  }

  function resetForm() {
    setEditing(null)
    setName("")
    setEmail("")
    setPhone("")
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email?.toLowerCase().includes(search.toLowerCase()) ||
    member.phone?.includes(search)
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">Manage certificate recipients</p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={(open) => {
          setOpenDialog(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#dc2626] hover:bg-[#b91c1c]">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a1a] text-white border-[#333]">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Member" : "Add New Member"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                  className="bg-[#111] border-[#333]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="bg-[#111] border-[#333]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="bg-[#111] border-[#333]"
                />
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

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search members by name, email, or phone..."
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
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">Created</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {search ? "No members found matching your search" : "No members found. Create your first member!"}
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-[#333] hover:bg-[#222]">
                  <TableCell className="font-medium text-white">{member.name}</TableCell>
                  <TableCell className="text-gray-400">{member.email || "-"}</TableCell>
                  <TableCell className="text-gray-400">{member.phone || "-"}</TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(member)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {canDeleteMember && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
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
        Showing {filteredMembers.length} of {members.length} members
      </div>
    </div>
  )
}
