"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase, type CertificateRow } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"

type Member = { id: string; name: string; email: string | null }
type Category = { id: string; name: string }
type Template = { id: string; name: string }

export default function CertificatesClient() {
  const [loading, setLoading] = useState(false)
  const [certs, setCerts] = useState<Array<CertificateRow & { member_name: string | null; category_name: string | null }>>([])
  const [members, setMembers] = useState<Member[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [templates, setTemplates] = useState<Template[]>([])

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | "all">("all")
  const [filterStatus, setFilterStatus] = useState<string | "all">("all")

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<CertificateRow | null>(null)

  async function fetchAll() {
    setLoading(true)
    try {
      const { data: certData, error } = await supabase
        .from("certificates")
        .select(
          `id, certificate_no, issued_at, status, member_id, category_id,
           members:member_id ( name ),
           categories:category_id ( name )`
        )
        .order("issued_at", { ascending: false })

      if (error) throw error

      const rows = (certData as any[]).map((r) => ({
        id: r.id,
        certificate_no: r.certificate_no,
        issued_at: r.issued_at,
        status: r.status,
        member_id: r.member_id,
        category_id: r.category_id,
        template_id: null,
        data_json: null,
        pdf_url: null,
        valid_until: null,
        created_by: null,
        created_at: "",
        updated_at: "",
        member_name: r.members?.name ?? null,
        category_name: r.categories?.name ?? null,
      })) as Array<CertificateRow & { member_name: string | null; category_name: string | null }>

      setCerts(rows)

      const [{ data: m }, { data: c }, { data: t }] = await Promise.all([
        supabase.from("members").select("id, name, email").order("name"),
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("templates").select("id, name").order("name"),
      ])
      setMembers((m ?? []) as Member[])
      setCategories((c ?? []) as Category[])
      setTemplates((t ?? []) as Template[])
    } catch (e: any) {
      toast.error(e.message ?? "Failed to fetch")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const filtered = useMemo(() => {
    return certs.filter((c) => {
      const matchesSearch = search
        ? (c.certificate_no?.toLowerCase().includes(search.toLowerCase()) ||
           (c.member_name ?? "").toLowerCase().includes(search.toLowerCase()))
        : true
      const matchesCategory = filterCategory === "all" ? true : c.category_id === filterCategory
      const matchesStatus = filterStatus === "all" ? true : c.status === filterStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [certs, search, filterCategory, filterStatus])

  async function handleCreate(form: { member_id: string; category_id: string; template_id: string; issued_at: string; status: string }) {
    const seq = Math.floor(1000 + Math.random() * 9000)
    const certificate_no = `CERT-2025-${seq}`
    const { error } = await supabase.from("certificates").insert({
      certificate_no,
      member_id: form.member_id,
      category_id: form.category_id,
      template_id: form.template_id,
      issued_at: form.issued_at || null,
      status: form.status,
    })
    if (error) throw error
    await supabase.from("activity_logs").insert({
      action: "create_certificate",
      description: `Create ${certificate_no}`,
      related_table: "certificates",
    })
    toast.success("Certificate created successfully!")
    setOpenForm(false)
    fetchAll()
  }

  async function handleUpdate(id: string, form: { member_id: string; category_id: string; template_id: string; issued_at: string; status: string }) {
    const { error } = await supabase.from("certificates").update({
      member_id: form.member_id,
      category_id: form.category_id,
      template_id: form.template_id,
      issued_at: form.issued_at || null,
      status: form.status,
    }).eq("id", id)
    if (error) throw error
    await supabase.from("activity_logs").insert({
      action: "update_certificate",
      description: `Update ${id}`,
      related_table: "certificates",
      related_id: id,
    })
    toast.success("Certificate updated")
    setOpenForm(false)
    setEditing(null)
    fetchAll()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("certificates").delete().eq("id", id)
    if (error) throw error
    await supabase.from("activity_logs").insert({
      action: "delete_certificate",
      description: `Delete ${id}`,
      related_table: "certificates",
      related_id: id,
    })
    toast.success("Certificate deleted")
    fetchAll()
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-semibold">Certificates</h1>
          <p className="text-[#AAAAAA]">Daftar semua sertifikat yang telah dibuat.</p>
        </div>
        <div className="flex gap-2">
          <Sheet open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null) }}>
            <SheetTrigger asChild>
              <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">+ New Certificate</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#0A0A0A] text-white border-[#1f1f1f]">
              <SheetHeader>
                <SheetTitle>{editing ? "Edit Certificate" : "New Certificate"}</SheetTitle>
              </SheetHeader>
              <CertForm
                members={members}
                categories={categories}
                templates={templates}
                defaultValues={editing ?? undefined}
                onSubmit={async (vals) => {
                  try {
                    if (editing) await handleUpdate(editing.id, vals)
                    else await handleCreate(vals)
                  } catch (e: any) {
                    toast.error(e.message ?? "Failed")
                  }
                }}
              />
            </SheetContent>
          </Sheet>
          <Button variant="outline" className="border-[#333] text-white" onClick={() => fetchAll()}>Refresh 🔄</Button>
        </div>
      </div>

      <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <Input placeholder="Search certificate no / member" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#111] text-white border-[#333]" />
          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as any)}>
            <SelectTrigger className="w-full md:w-56 bg-[#111] text-white border-[#333]">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
            <SelectTrigger className="w-full md:w-40 bg-[#111] text-white border-[#333]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1f1f1f]">
              <TableHead className="text-white">Certificate No</TableHead>
              <TableHead className="text-white">Member</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Issue Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} className="border-[#1f1f1f]">
                <TableCell className="text-white font-medium">{c.certificate_no}</TableCell>
                <TableCell className="text-white">{c.member_name ?? '-'}</TableCell>
                <TableCell className="text-white">{c.category_name ?? '-'}</TableCell>
                <TableCell className="text-white">{c.issued_at ? new Date(c.issued_at).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <span className={
                    c.status === 'issued' ? 'text-[#22c55e]' : c.status === 'draft' ? 'text-[#f97316]' : 'text-gray-400'
                  }>{c.status}</span>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" className="border-[#333] text-white" onClick={() => { setEditing(c as any); setOpenForm(true) }}>Edit</Button>
                  <Button variant="outline" className="border-[#333] text-white" onClick={() => handleDelete(c.id)}>Delete</Button>
                  <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">Preview PDF</Button>
                  <Button variant="outline" className="border-[#333] text-white">Send Email</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function CertForm({
  members,
  categories,
  templates,
  defaultValues,
  onSubmit,
}: {
  members: Member[]
  categories: Category[]
  templates: Template[]
  defaultValues?: any
  onSubmit: (vals: { member_id: string; category_id: string; template_id: string; issued_at: string; status: string }) => void | Promise<void>
}) {
  const [member_id, setMember] = useState<string>(defaultValues?.member_id ?? "")
  const [category_id, setCategory] = useState<string>(defaultValues?.category_id ?? "")
  const [template_id, setTemplate] = useState<string>(defaultValues?.template_id ?? "")
  const [issued_at, setIssuedAt] = useState<string>(defaultValues?.issued_at ?? "")
  const [status, setStatus] = useState<string>(defaultValues?.status ?? "draft")

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault()
        await onSubmit({ member_id, category_id, template_id, issued_at, status })
      }}
    >
      <div className="space-y-2">
        <label className="text-sm text-white/80">Member</label>
        <Select value={member_id} onValueChange={setMember}>
          <SelectTrigger className="bg-[#111] text-white border-[#333]">
            <SelectValue placeholder="Pilih member" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-72 overflow-auto">
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Category</label>
        <Select value={category_id} onValueChange={setCategory}>
          <SelectTrigger className="bg-[#111] text-white border-[#333]">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Template</label>
        <Select value={template_id} onValueChange={setTemplate}>
          <SelectTrigger className="bg-[#111] text-white border-[#333]">
            <SelectValue placeholder="Pilih template" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Issue Date</label>
        <Input type="date" value={issued_at} onChange={(e) => setIssuedAt(e.target.value)} className="bg-[#111] text-white border-[#333]" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/80">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="bg-[#111] text-white border-[#333]">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="pt-2 flex gap-2">
        <Button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">{defaultValues ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}


