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
import { useRole } from "@/context/RoleContext"
import { usePermissions } from "@/hooks/usePermissions"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { 
  DatabaseMember, 
  DatabaseCategory, 
  DatabaseTemplate
} from "@/types/database"

type Member = DatabaseMember
type Category = DatabaseCategory
type Template = DatabaseTemplate

export default function CertificatesClient() {
  const [loading, setLoading] = useState(false)
  const [certs, setCerts] = useState<Array<CertificateRow & { member_name: string | null; category_name: string | null }>>([])
  const [certificateDesigns, setCertificateDesigns] = useState<Array<{
    id: string
    template_id: string
    layout_data: unknown
    orientation: string
    member_id: string
    metadata: Record<string, unknown>
    created_at: string
    updated_at: string
  }>>([])
  const [members, setMembers] = useState<Member[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [templates, setTemplates] = useState<Template[]>([])

  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | "all">("all")
  const [filterStatus, setFilterStatus] = useState<string | "all">("all")
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<CertificateRow | null>(null)
  const [openPreview, setOpenPreview] = useState(false)
  const [previewCert, setPreviewCert] = useState< (CertificateRow & { member_name: string | null; category_name: string | null }) | null >(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const { role } = useRole()
  const { canDeleteCertificate } = usePermissions()
  const searchParams = useSearchParams()
  const defaultTemplateId = searchParams.get("templateId") ?? ""

  async function fetchCertificateDesigns() {
    try {
      console.log('🔍 Fetching certificate designs...')
      const { data, error } = await supabase
        .from('certificate_designs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        // Check if table doesn't exist
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('ℹ️ Certificate designs table not found - this is normal if not set up yet')
          return
        }
        
        console.error('❌ Error fetching certificate designs:', error)
        return
      }
      
      console.log('✅ Certificate designs loaded:', data?.length || 0)
      setCertificateDesigns(data || [])
      
    } catch (error) {
      console.log('ℹ️ Certificate designs feature not available yet - table may not be set up')
      console.log('To enable: Run scripts/setup-certificate-designs.sql in Supabase')
    }
  }

  async function fetchAll() {
    setLoading(true)
    
    // Also fetch certificate designs
    await fetchCertificateDesigns()
    try {
      const { data: certData, error: certErr } = await supabase
        .from("certificates")
        .select("id, certificate_number, verification_code, member_id, category_id, template_id, issue_date, status, pdf_url, png_url, recipient_name, created_by, created_at, certificate_data, metadata")
        .order("created_at", { ascending: false })

      if (certErr) throw certErr

      const [membersResp, categoriesResp, templatesResp] = await Promise.all([
        supabase.from("members").select("id, name, email").order("name"),
        // prefer certificate_categories, fallback to categories
        supabase.from("certificate_categories").select("id, name").order("name").then((r) => r.error ? supabase.from("categories").select("id, name").order("name") : r),
        supabase.from("certificate_templates").select("id, name, fields, preview_url, orientation, category_id").order("name"),
      ])

      type SimpleRow = { id: string; name: string }
      const membersMap = new Map<string, string>()
      for (const m of (membersResp.data ?? []) as SimpleRow[]) membersMap.set(m.id, m.name)
      const categoriesMap = new Map<string, string>()
      for (const c of (categoriesResp.data ?? []) as SimpleRow[]) categoriesMap.set(c.id, c.name)

      interface CertificateRowFromDB {
        id: string
        certificate_number: string
        verification_code: string | null
        issue_date: string | null
        status: string
        member_id: string | null
        category_id: string | null
        template_id: string | null
        pdf_url: string | null
        png_url: string | null
        recipient_name: string | null
        created_by: string | null
        created_at: string | null
        certificate_data: Record<string, unknown> | null
        metadata: Record<string, unknown> | null
      }

      const rows = (certData ?? []).map((r: CertificateRowFromDB) => ({
        id: r.id,
        certificate_number: r.certificate_number,
        verification_code: r.verification_code || '',
        issue_date: r.issue_date,
        status: r.status,
        member_id: r.member_id,
        category_id: r.category_id,
        template_id: r.template_id,
        fields_data: null,
        layout: null,
        pdf_url: r.pdf_url,
        png_url: r.png_url,
        created_by: r.created_by || null,
        created_at: r.created_at || "",
        updated_at: "",
        // Use recipient_name from editor, fallback to member_name from members table
        member_name: r.recipient_name || (r.member_id ? membersMap.get(r.member_id) ?? null : null),
        category_name: r.category_id ? categoriesMap.get(r.category_id) ?? null : null,
      })) as Array<CertificateRow & { member_name: string | null; category_name: string | null }>

      setCerts(rows)
      setMembers((membersResp.data ?? []).map((m: DatabaseMember) => ({ 
        id: m.id, 
        name: m.name, 
        email: m.email ?? null 
      })))
      setCategories((categoriesResp.data ?? []).map((c: DatabaseCategory) => ({ 
        id: c.id, 
        name: c.name 
      })))
      setTemplates((templatesResp.data ?? []).map((t: DatabaseTemplate) => ({ 
        id: t.id, 
        name: t.name, 
        fields: t.fields ?? [] 
      })))
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to fetch"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate(id: string) {
    try {
      const res = await fetch(`/api/certificates/${id}/generate`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Generate started/completed')
      fetchAll()
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to generate'
      toast.error(errorMessage)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // Refresh data when page becomes visible (e.g., after redirect from editor)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📥 Page visible, refreshing data...')
        fetchAll()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Auto-open create form when templateId is provided in query
  useEffect(() => {
    if (defaultTemplateId && !openForm && !editing) {
      setOpenForm(true)
    }
  }, [defaultTemplateId, openForm, editing])

  const filtered = useMemo(() => {
    return certs.filter((c) => {
      const s = search.toLowerCase()
      const matchesSearch = s
        ? (c.certificate_number?.toLowerCase().includes(s) || (c.member_name ?? "").toLowerCase().includes(s) || (c.category_name ?? "").toLowerCase().includes(s))
        : true
      const matchesCategory = filterCategory === "all" ? true : c.category_id === filterCategory
      const matchesStatus = filterStatus === "all" ? true : c.status === filterStatus
      const matchesDate = (() => {
        if (!fromDate && !toDate) return true
        const d = c.issue_date ? new Date(c.issue_date) : null
        if (!d) return false
        const fromOK = fromDate ? d >= new Date(fromDate) : true
        const toOK = toDate ? d <= new Date(toDate) : true
        return fromOK && toOK
      })()
      return matchesSearch && matchesCategory && matchesStatus && matchesDate
    })
  }, [certs, search, filterCategory, filterStatus, fromDate, toDate])

  async function handleCreate(form: { member_id: string; category_id: string; template_id: string; issued_at: string; status: string }) {
    console.log('➕ Creating certificate:', form)
    const baseDate = form.issued_at ? new Date(form.issued_at) : new Date()
    const y = baseDate.getFullYear()
    const m = baseDate.getMonth() + 1
    
    console.log('🔢 Generating certificate number...')
    const rpc = await supabase.rpc('next_certificate_identifiers', { y, m, code_len: 10 })
    if (rpc.error) {
      console.error('❌ RPC error:', rpc.error)
      throw rpc.error
    }
    
    const identifiers = rpc.data as { certificate_number: string; verification_code: string }
    console.log('✅ Certificate number generated:', identifiers.certificate_number)
    
    const fd = (typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>).__pendingFieldsData : null)
    console.log('📋 Fields data:', fd)
    
    const { error } = await supabase.from("certificates").insert({
      certificate_number: identifiers.certificate_number,
      verification_code: identifiers.verification_code,
      member_id: form.member_id,
      category_id: form.category_id,
      template_id: form.template_id,
      issue_date: form.issued_at || null,
      status: form.status || "draft",
      fields_data: fd,
    })
    
    if (error) {
      console.error('❌ Insert error:', error)
      throw error
    }
    
    console.log('✅ Certificate created successfully')
    
    // Try to log activity (non-blocking)
    try {
      await supabase.from("activity_logs").insert({ 
        action: "CREATE_CERTIFICATE", 
        related_table: "certificates", 
        description: `Create ${identifiers.certificate_number}` 
      })
    } catch (logError) {
      console.warn('⚠️ Activity log failed (non-critical):', logError)
    }
    
    toast.success("Certificate created successfully!")
    setOpenForm(false)
    fetchAll()
  }

  async function sendEmail(id: string) {
    try {
      const r = await fetch(`/api/certificates/${id}/email`, { method: 'POST' })
      if (!r.ok) throw new Error(await r.text())
      toast.success('Email dikirim')
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Gagal mengirim email'
      toast.error(errorMessage)
    }
  }

  async function bulkEmail() {
    try {
      const ids = Array.from(selectedIds)
      if (ids.length === 0) { toast.info('Pilih minimal 1 sertifikat'); return }
      const r = await fetch('/api/certificates/bulk-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) })
      if (!r.ok) throw new Error(await r.text())
      const j = await r.json()
      toast.success(`Bulk Email: sent=${j.sent}, failed=${j.failed}`)
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Bulk Email gagal'
      toast.error(errorMessage)
    }
  }

  async function handleUpdate(id: string, form: { member_id: string; category_id: string; template_id: string; issued_at: string; status: string }) {
    console.log('🔄 Updating certificate:', id, form)
    const fd = (typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>).__pendingFieldsData : null)
    console.log('📋 Fields data:', fd)
    
    const { error } = await supabase.from("certificates").update({
      member_id: form.member_id,
      category_id: form.category_id,
      template_id: form.template_id,
      issue_date: form.issued_at || null,
      status: form.status,
      fields_data: fd,
    }).eq("id", id)
    
    if (error) {
      console.error('❌ Update error:', error)
      throw error
    }
    
    console.log('✅ Certificate updated successfully')
    
    // Try to log activity (non-blocking)
    try {
      await supabase.from("activity_logs").insert({
        action: "UPDATE_CERTIFICATE",
        description: `Update ${id}`,
        related_table: "certificates",
        related_id: id,
      })
    } catch (logError) {
      console.warn('⚠️ Activity log failed (non-critical):', logError)
    }
    
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

  function getBaseUrl() {
    if (typeof window !== 'undefined') return window.location.origin
    return process.env.NEXT_PUBLIC_PUBLIC_BASE_URL || 'http://localhost:3000'
  }

  function copyLinks(c: { certificate_number: string; verification_code: string }) {
    const base = getBaseUrl()
    const linkByCode = `${base}/cek/${encodeURIComponent(c.verification_code)}`
    const linkByNumber = `${base}/cek/${encodeURIComponent(c.certificate_number)}`
    const text = `Verification (code): ${linkByCode}\nVerification (number): ${linkByNumber}`
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    toast.success('Verification links copied')
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-semibold">Certificates</h1>
          <p className="text-[#AAAAAA]">Daftar semua sertifikat yang telah dibuat.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">
            <Link href="/certificates/editor">+ New Certificate</Link>
          </Button>
          <Sheet open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null) }}>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#1a1a1a]">+ Quick Add</Button>
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
                defaultTemplateId={defaultTemplateId}
                onSubmit={async (vals) => {
                  try {
                    if (editing) await handleUpdate(editing.id, vals)
                    else await handleCreate(vals)
                  } catch (e: unknown) {
                    const errorMessage = e instanceof Error ? e.message : "Failed"
                    toast.error(errorMessage)
                  }
                }}
              />
            </SheetContent>
          </Sheet>
          <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => fetchAll()} disabled={loading}>Refresh 🔄</Button>
          {role !== 'public' && (
            <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={bulkEmail}>Bulk Email</Button>
          )}
        </div>
      </div>

      <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <Input placeholder="Search number / member / category" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-[#111] text-white border-[#333]" />
          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v)}>
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
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v)}>
            <SelectTrigger className="w-full md:w-40 bg-[#111] text-white border-[#333]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 w-full md:w-auto">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-[#111] text-white border-[#333]" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-[#111] text-white border-[#333]" />
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1f1f1f]">
              <TableHead className="text-white">
                <Input type="checkbox" className="h-4 w-4 bg-[#111] border-[#333]" onChange={(e) => {
                  if (e.target.checked) setSelectedIds(new Set(filtered.map(f => f.id)))
                  else setSelectedIds(new Set())
                }} />
              </TableHead>
              <TableHead className="text-white">Certificate Number</TableHead>
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
                <TableCell>
                  <Input type="checkbox" className="h-4 w-4 bg-[#111] border-[#333]" checked={selectedIds.has(c.id)} onChange={(e) => {
                    setSelectedIds((prev) => {
                      const n = new Set(prev)
                      if (e.target.checked) n.add(c.id); else n.delete(c.id)
                      return n
                    })
                  }} />
                </TableCell>
                <TableCell className="text-white font-medium">{c.certificate_number}</TableCell>
                <TableCell className="text-white">{c.member_name ?? '-'}</TableCell>
                <TableCell className="text-white">{c.category_name ?? '-'}</TableCell>
                <TableCell className="text-white">{c.issue_date ? new Date(c.issue_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <span className={
                    c.status === 'published' ? 'text-[#22c55e]' : c.status === 'draft' ? 'text-[#f97316]' : 'text-gray-400'
                  }>{c.status}</span>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => { setEditing(c); setOpenForm(true) }}>Edit</Button>
                  {canDeleteCertificate && (
                    <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => handleDelete(c.id)}>Delete</Button>
                  )}
                  <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white" onClick={() => { setPreviewCert(c); setOpenPreview(true) }}>Preview</Button>
                  <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => handleGenerate(c.id)}>Generate</Button>
                  <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => copyLinks(c)}>Copy Link</Button>
                  {c.pdf_url ? (
                    <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" asChild>
                      <a href={c.pdf_url} target="_blank" rel="noreferrer">Download PDF</a>
                    </Button>
                  ) : (
                    <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" disabled>Download PDF</Button>
                  )}
                  {(role === 'admin' || role === 'team') && (
                    <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => sendEmail(c.id)}>Send Email</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Certificate Designs Section */}
      {certificateDesigns.length > 0 && (
        <div className="mt-8">
          <h2 className="text-white text-2xl font-semibold mb-4">Certificate Designs</h2>
          <p className="text-[#AAAAAA] mb-4">Desain sertifikat yang telah dibuat dari Certificate Editor</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificateDesigns.map((design) => {
              const lastModified = design.metadata?.lastModified
              const createdBy = design.metadata?.createdBy
              const lastModifiedStr = typeof lastModified === 'string' ? lastModified : null
              const createdByStr = typeof createdBy === 'string' ? createdBy : null
              
              return (
              <Card key={design.id} className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 hover:border-[#333] transition-colors">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-white font-semibold">
                      {(design.metadata?.templateName as string) || 'Untitled Design'}
                    </h3>
                    <p className="text-[#AAAAAA] text-sm">
                      {design.orientation || 'portrait'} • {(design.metadata?.elementCount as number) || 0} elements
                    </p>
                  </div>
                  
                  <div className="text-xs text-[#666]">
                    <div>Created: {new Date(design.created_at).toLocaleDateString()}</div>
                    {lastModifiedStr && (
                      <div>Modified: {new Date(lastModifiedStr).toLocaleDateString()}</div>
                    )}
                    {createdByStr && (
                      <div>By: {createdByStr}</div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-[#333] bg-transparent text-white hover:bg-[#1a1a1a]"
                      onClick={() => {
                        // Navigate to editor with this design
                        window.location.href = `/certificates/editor?template=${design.template_id}`
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-[#333] bg-transparent text-white hover:bg-[#1a1a1a]"
                      onClick={() => {
                        // View design details
                        toast.info('Design details', {
                          description: `Template: ${design.metadata?.templateName}\nElements: ${design.metadata?.elementCount}\nOrientation: ${design.orientation}`
                        })
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Preview Sheet */}
      <Sheet open={openPreview} onOpenChange={setOpenPreview}>
        <SheetContent side="right" className="w-full sm:max-w-xl bg-[#0A0A0A] text-white border-[#1f1f1f]">
          <SheetHeader>
            <SheetTitle>Certificate Preview</SheetTitle>
          </SheetHeader>
          {previewCert ? (
            <div className="mt-4 space-y-4">
              <div className="text-sm text-white/70">
                <div><span className="text-white/60">Number:</span> {previewCert.certificate_number}</div>
                <div><span className="text-white/60">Verification:</span> {previewCert.verification_code}</div>
              </div>
              <div className="rounded-lg overflow-hidden border border-[#1f1f1f] bg-black/40">
                <Image src={previewCert.png_url ?? "/contoh%20sertifikat.png"} alt="Preview" width={920} height={600} className="w-full h-auto" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => copyLinks(previewCert)}>Copy Links</Button>
                {previewCert.pdf_url && (
                  <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" asChild>
                    <a href={previewCert.pdf_url} target="_blank" rel="noreferrer">Download PDF</a>
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function CertForm({
  members,
  categories,
  templates,
  defaultValues,
  defaultTemplateId,
  onSubmit,
}: {
  members: Member[]
  categories: Category[]
  templates: Template[]
  defaultValues?: CertificateRow | null
  defaultTemplateId?: string
  onSubmit: (vals: { member_id: string; category_id: string; template_id: string; issued_at: string; status: string }) => void | Promise<void>
}) {
  const [member_id, setMember] = useState<string>(defaultValues?.member_id ?? "")
  const [category_id, setCategory] = useState<string>(defaultValues?.category_id ?? "")
  const [template_id, setTemplate] = useState<string>(defaultValues?.template_id ?? defaultTemplateId ?? "")
  const [issued_at, setIssuedAt] = useState<string>(defaultValues?.issue_date ?? "")
  const [status, setStatus] = useState<string>(defaultValues?.status ?? "draft")
  const [fieldsData, setFieldsData] = useState<Record<string, string>>(() => (defaultValues?.fields_data as Record<string, string>) ?? {})
  const tpl = useMemo(() => templates.find(t => t.id === template_id) ?? null, [template_id, templates])

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault()
        ;(window as unknown as Record<string, unknown>).__pendingFieldsData = fieldsData
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
        <label className="text-xs text-white/60">Template</label>
        <Select value={template_id} onValueChange={setTemplate}>
          <SelectTrigger className="bg-[#111] text-white border-[#333] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-72">
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tpl && Array.isArray(tpl.fields) && tpl.fields.length > 0 && (
        <div className="mt-2 space-y-2">
          <div className="text-sm font-medium">Isi Data Sertifikat</div>
          {tpl.fields.map((f, index) => {
            const fieldKey = f.key || f.id || f.type || `field-${index}`
            return (
              <div key={fieldKey} className="grid grid-cols-1 gap-1">
                <label className="text-xs text-white/60">{f.label || f.placeholder || fieldKey}</label>
                <Input
                  value={fieldsData[fieldKey] ?? ""}
                  onChange={(e) => setFieldsData((p) => ({ ...p, [fieldKey]: e.target.value }))}
                  className="bg-[#111] text-white border-[#333] h-9"
                />
              </div>
            )
          })}
        </div>
      )}
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
            <SelectItem value="published">Published</SelectItem>
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


