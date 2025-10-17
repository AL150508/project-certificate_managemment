"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type CategoryRow = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  template_name: string | null
  cert_count: number
}

type TemplateRow = { id: string; name: string }

export default function CategoriesClient() {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<CategoryRow[]>([])
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | "all">("all")

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  async function fetchAll() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, description, is_active, templates:template_id(name), certificates:certificates(id)")
        .order("created_at", { ascending: false })
      if (error) throw error
      const rows = (data ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        is_active: !!c.is_active,
        template_name: c.templates?.name ?? null,
        cert_count: (c.certificates ?? []).length,
      })) as CategoryRow[]
      setItems(rows)

      const { data: t } = await supabase.from("templates").select("id, name").order("name")
      setTemplates((t ?? []) as TemplateRow[])
    } catch (e: any) {
      toast.error(e.message ?? "Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const filtered = useMemo(() => {
    return items.filter((c) => {
      const s = search.toLowerCase()
      const matchesSearch = s ? (c.name.toLowerCase().includes(s) || (c.description ?? "").toLowerCase().includes(s)) : true
      const matchesStatus = filterStatus === "all" ? true : (filterStatus === 'active' ? c.is_active : !c.is_active)
      return matchesSearch && matchesStatus
    })
  }, [items, search, filterStatus])

  // pagination
  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  async function createOrUpdate(values: any) {
    if (editing) {
      const { error } = await supabase.from("categories").update(values).eq("id", editing.id)
      if (error) throw error
      await supabase.from("activity_logs").insert({ action: 'UPDATE_CATEGORY', related_table: 'categories', related_id: editing.id, description: `Updated category ${values.name}` })
      toast.success("Category updated")
    } else {
      const { data, error } = await supabase.from("categories").insert(values).select("id, name").single()
      if (error) throw error
      await supabase.from("activity_logs").insert({ action: 'CREATE_CATEGORY', related_table: 'categories', related_id: data?.id, description: `Created category ${data?.name}` })
      toast.success("Category created")
    }
    setOpenForm(false)
    setEditing(null)
    fetchAll()
  }

  async function handleDelete(cat: CategoryRow) {
    if (cat.cert_count > 0) {
      toast.error("Kategori ini masih memiliki sertifikat aktif dan tidak dapat dihapus.")
      return
    }
    const ok = typeof window !== 'undefined' ? window.confirm(`Hapus kategori ${cat.name}?`) : true
    if (!ok) return
    const { error } = await supabase.from("categories").delete().eq("id", cat.id)
    if (error) throw error
    await supabase.from("activity_logs").insert({ action: 'DELETE_CATEGORY', related_table: 'categories', related_id: cat.id, description: `Deleted category ${cat.name}` })
    toast.success("Category deleted")
    fetchAll()
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-semibold">Categories</h1>
          <p className="text-[#AAAAAA]">Daftar kategori sertifikat yang digunakan dalam sistem.</p>
        </div>
        <div className="flex gap-2">
          <Sheet open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null) }}>
            <SheetTrigger asChild>
              <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">+ New Category</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#0A0A0A] text-white border-[#1f1f1f]">
              <SheetHeader>
                <SheetTitle>{editing ? "Edit Category" : "New Category"}</SheetTitle>
              </SheetHeader>
              <CategoryForm
                defaultValues={editing ?? undefined}
                templates={templates}
                onSubmit={async (vals) => { try { await createOrUpdate(vals) } catch (e: any) { toast.error(e.message ?? 'Failed') } }}
              />
            </SheetContent>
          </Sheet>
          <Button variant="outline" className="border-[#333] text-white" onClick={() => fetchAll()}>Refresh 🔄</Button>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v as any); setPage(1) }}>
            <SelectTrigger className="w-40 bg-[#111] text-white border-[#333]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 mb-4">
        <Input placeholder="Search name or description" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="bg-[#111] text-white border-[#333]" />
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1f1f1f]">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Template</TableHead>
              <TableHead className="text-white">Certificates</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((c) => (
              <TableRow key={c.id} className="border-[#1f1f1f]">
                <TableCell className="text-white font-medium">{c.name}</TableCell>
                <TableCell className="text-white">{c.description ?? '-'}</TableCell>
                <TableCell className="text-white">{c.template_name ?? '-'}</TableCell>
                <TableCell className="text-white">{c.cert_count}</TableCell>
                <TableCell>
                  <span className={c.is_active ? 'text-[#22c55e]' : 'text-gray-400'}>{c.is_active ? 'Active' : 'Inactive'}</span>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" className="border-[#333] text-white" onClick={() => { setEditing(c as any); setOpenForm(true) }}>Edit</Button>
                  <Button variant="outline" className="border-[#333] text-white" onClick={() => handleDelete(c)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4 text-white">
        <span className="text-sm text-white/70">Page {page} of {totalPages}</span>
        <div className="space-x-2">
          <Button variant="outline" className="border-[#333] text-white" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p-1))}>Prev</Button>
          <Button variant="outline" className="border-[#333] text-white" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p+1))}>Next</Button>
        </div>
      </div>

      <RecentCategoryActivity />
    </div>
  )
}

function CategoryForm({ defaultValues, templates, onSubmit }: { defaultValues?: any; templates: TemplateRow[]; onSubmit: (vals: any) => void | Promise<void> }) {
  const [name, setName] = useState<string>(defaultValues?.name ?? "")
  const [description, setDescription] = useState<string>(defaultValues?.description ?? "")
  const [template_id, setTemplate] = useState<string>(defaultValues?.template_id ?? "")
  const [is_active, setActive] = useState<boolean>(defaultValues?.is_active ?? true)

  return (
    <form className="mt-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await onSubmit({ name, description, template_id: template_id || null, is_active }) }}>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-[#111] text-white border-[#333]" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#111] text-white border-[#333]" rows={3} />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Template</label>
        <Select value={template_id} onValueChange={setTemplate}>
          <SelectTrigger className="bg-[#111] text-white border-[#333]"><SelectValue placeholder="Pilih template" /></SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
            {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Status</label>
        <Select value={is_active ? 'active' : 'inactive'} onValueChange={(v) => setActive(v === 'active')}>
          <SelectTrigger className="bg-[#111] text-white border-[#333]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="pt-2 flex gap-2">
        <Button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">{defaultValues ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}

function RecentCategoryActivity() {
  const [items, setItems] = useState<Array<{ description: string; created_at: string }>>([])
  useEffect(() => {
    supabase
      .from("activity_logs")
      .select("description, created_at")
      .eq("related_table", "categories")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setItems((data ?? []) as any))
  }, [])
  return (
    <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 mt-8">
      <h3 className="text-white text-lg font-semibold mb-3">Recent Category Activities</h3>
      <ul className="space-y-2">
        {items.map((i, idx) => (
          <li key={idx} className="text-sm text-white flex justify-between">
            <span>{i.description}</span>
            <span className="text-white/60">{new Date(i.created_at).toLocaleString()}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-white/60">No recent activities.</li>}
      </ul>
    </Card>
  )
}


