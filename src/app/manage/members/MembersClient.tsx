"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type MemberRow = {
  id: string
  name: string
  organization: string | null
  email: string | null
  phone: string | null
  city: string | null
}

export default function MembersClient() {
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<Array<MemberRow & { cert_count: number }>>([])
  const [search, setSearch] = useState("")
  const [filterOrg, setFilterOrg] = useState<string | "all">("all")
  const [filterCity, setFilterCity] = useState<string | "all">("all")

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  // no separate dialog; we will confirm via window.confirm to avoid missing component errors

  async function fetchMembers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("members")
        .select("id, name, organization, email, phone, city, certificates:certificates(id)")
        .order("created_at", { ascending: false })
      if (error) throw error
      const rows = (data ?? []).map((m: any) => ({
        id: m.id,
        name: m.name,
        organization: m.organization,
        email: m.email,
        phone: m.phone,
        city: m.city,
        cert_count: (m.certificates ?? []).length,
      }))
      setMembers(rows)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to fetch members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const orgOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.organization).filter(Boolean) as string[])
    return Array.from(set)
  }, [members])
  const cityOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.city).filter(Boolean) as string[])
    return Array.from(set)
  }, [members])

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const s = search.toLowerCase()
      const matchesSearch = s ? (m.name.toLowerCase().includes(s) || (m.email ?? "").toLowerCase().includes(s)) : true
      const matchesOrg = filterOrg === "all" ? true : (m.organization ?? "") === filterOrg
      const matchesCity = filterCity === "all" ? true : (m.city ?? "") === filterCity
      return matchesSearch && matchesOrg && matchesCity
    })
  }, [members, search, filterOrg, filterCity])

  // Pagination
  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  async function createOrUpdate(values: any) {
    if (editing) {
      const { error } = await supabase.from("members").update(values).eq("id", editing.id)
      if (error) throw error
      await supabase.from("activity_logs").insert({
        action: "UPDATE_MEMBER",
        related_table: "members",
        related_id: editing.id,
        description: `Updated member ${values.name}`,
      })
      toast.success("Member updated")
    } else {
      const { data, error } = await supabase.from("members").insert(values).select("id, name").single()
      if (error) throw error
      await supabase.from("activity_logs").insert({
        action: "CREATE_MEMBER",
        related_table: "members",
        related_id: data?.id,
        description: `Created member ${data?.name}`,
      })
      toast.success("Member created")
    }
    setOpenForm(false)
    setEditing(null)
    fetchMembers()
  }

  async function handleDelete(member: MemberRow & { cert_count: number }) {
    if (member.cert_count > 0) {
      toast.error("Member ini masih memiliki sertifikat aktif dan tidak dapat dihapus.")
      return
    }
    const ok = typeof window !== 'undefined' ? window.confirm(`Hapus member ${member.name}?`) : true
    if (!ok) return
    const { error } = await supabase.from("members").delete().eq("id", member.id)
    if (error) throw error
    await supabase.from("activity_logs").insert({
      action: "DELETE_MEMBER",
      related_table: "members",
      related_id: member.id,
      description: `Deleted member ${member.name}`,
    })
    toast.success("Member deleted")
    fetchMembers()
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-semibold">Members</h1>
          <p className="text-[#AAAAAA]">Daftar peserta pelatihan dan penerima sertifikat.</p>
        </div>
        <div className="flex gap-2">
          <Sheet open={openForm} onOpenChange={(o) => { setOpenForm(o); if (!o) setEditing(null) }}>
            <SheetTrigger asChild>
              <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">+ New Member</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[#0A0A0A] text-white border-[#1f1f1f]">
              <SheetHeader>
                <SheetTitle>{editing ? "Edit Member" : "New Member"}</SheetTitle>
              </SheetHeader>
              <MemberForm
                defaultValues={editing ?? undefined}
                onSubmit={async (vals) => {
                  try { await createOrUpdate(vals) } catch (e: any) { toast.error(e.message ?? "Failed") }
                }}
              />
            </SheetContent>
          </Sheet>
          <Button variant="outline" className="border-[#333] text-white" onClick={() => fetchMembers()}>Refresh 🔄</Button>
          <Select value={filterOrg} onValueChange={(v) => { setFilterOrg(v as any); setPage(1) }}>
            <SelectTrigger className="w-40 bg-[#111] text-white border-[#333]"><SelectValue placeholder="Organization" /></SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
              <SelectItem value="all">All Org</SelectItem>
              {orgOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCity} onValueChange={(v) => { setFilterCity(v as any); setPage(1) }}>
            <SelectTrigger className="w-40 bg-[#111] text-white border-[#333]"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
              <SelectItem value="all">All City</SelectItem>
              {cityOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 mb-4">
        <Input placeholder="Search name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="bg-[#111] text-white border-[#333]" />
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1f1f1f]">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Organization</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">City</TableHead>
              <TableHead className="text-white">Certificates</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((m) => (
              <TableRow key={m.id} className="border-[#1f1f1f]">
                <TableCell className="text-white font-medium">{m.name}</TableCell>
                <TableCell className="text-white">{m.organization ?? '-'}</TableCell>
                <TableCell className="text-white">{m.email ?? '-'}</TableCell>
                <TableCell className="text-white">{m.phone ?? '-'}</TableCell>
                <TableCell className="text-white">{m.city ?? '-'}</TableCell>
                <TableCell className="text-white">{m.cert_count}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" className="border-[#333] text-white" onClick={() => { setEditing(m); setOpenForm(true) }}>Edit</Button>
                  <Button variant="outline" className="border-[#333] text-white" onClick={() => handleDelete(m)}>Delete</Button>
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

      <RecentActivity />
    </div>
  )
}

function MemberForm({ defaultValues, onSubmit }: { defaultValues?: any; onSubmit: (vals: any) => void | Promise<void> }) {
  const [name, setName] = useState<string>(defaultValues?.name ?? "")
  const [organization, setOrganization] = useState<string>(defaultValues?.organization ?? "")
  const [phone, setPhone] = useState<string>(defaultValues?.phone ?? "")
  const [email, setEmail] = useState<string>(defaultValues?.email ?? "")
  const [job, setJob] = useState<string>(defaultValues?.job ?? "")
  const [date_of_birth, setDob] = useState<string>(defaultValues?.date_of_birth ?? "")
  const [address, setAddress] = useState<string>(defaultValues?.address ?? "")
  const [city, setCity] = useState<string>(defaultValues?.city ?? "")
  const [notes, setNotes] = useState<string>(defaultValues?.notes ?? "")

  return (
    <form className="mt-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await onSubmit({ name, organization, phone, email, job, date_of_birth, address, city, notes }) }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-white/80">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-[#111] text-white border-[#333]" required />
        </div>
        <div>
          <label className="text-sm text-white/80">Organization</label>
          <Input value={organization} onChange={(e) => setOrganization(e.target.value)} className="bg-[#111] text-white border-[#333]" />
        </div>
        <div>
          <label className="text-sm text-white/80">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#111] text-white border-[#333]" />
        </div>
        <div>
          <label className="text-sm text-white/80">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#111] text-white border-[#333]" />
        </div>
        <div>
          <label className="text-sm text-white/80">Job</label>
          <Input value={job} onChange={(e) => setJob(e.target.value)} className="bg-[#111] text-white border-[#333]" />
        </div>
        <div>
          <label className="text-sm text-white/80">Date of Birth</label>
          <Input type="date" value={date_of_birth} onChange={(e) => setDob(e.target.value)} className="bg-[#111] text-white border-[#333]" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Address</label>
          <Textarea value={address} onChange={(e) => setAddress(e.target.value)} className="bg-[#111] text-white border-[#333]" rows={3} />
        </div>
        <div>
          <label className="text-sm text-white/80">City</label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} className="bg-[#111] text-white border-[#333]" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-white/80">Notes</label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-[#111] text-white border-[#333]" rows={3} />
        </div>
      </div>
      <div className="pt-2 flex gap-2">
        <Button type="submit" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">{defaultValues ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  )
}

function RecentActivity() {
  const [items, setItems] = useState<Array<{ description: string; created_at: string }>>([])
  useEffect(() => {
    supabase
      .from("activity_logs")
      .select("description, created_at")
      .eq("related_table", "members")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setItems((data ?? []) as any))
  }, [])
  return (
    <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 mt-8">
      <h3 className="text-white text-lg font-semibold mb-3">Recent Member Activities</h3>
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


