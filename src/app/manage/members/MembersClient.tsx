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
import { CalendarIcon } from "lucide-react"

type MemberRow = {
  id: string
  name: string
  organization: string | null
  email: string | null
  phone: string | null
  city: string | null
  job: string | null
  date_of_birth: string | null
  address: string | null
  notes: string | null
}

export default function MembersClient() {
  const [, setLoading] = useState(false)
  const [members, setMembers] = useState<Array<MemberRow & { cert_count: number }>>([])
  const [search, setSearch] = useState("")
  const [filterOrg, setFilterOrg] = useState<string | "all">("all")
  const [filterCity, setFilterCity] = useState<string | "all">("all")

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [notesModal, setNotesModal] = useState<{ open: boolean; member: MemberRow | null }>({ open: false, member: null })
  // no separate dialog; we will confirm via window.confirm to avoid missing component errors

  async function fetchMembers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("members")
        .select("id, name, organization, email, phone, city, job, date_of_birth, address, notes, certificates:certificates(id)")
        .order("created_at", { ascending: false })
      if (error) throw error
      const rows = (data ?? []).map((m: any) => ({
        id: m.id,
        name: m.name,
        organization: m.organization,
        email: m.email,
        phone: m.phone,
        city: m.city,
        job: m.job,
        date_of_birth: m.date_of_birth,
        address: m.address,
        notes: m.notes,
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
            <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#0A0A0A] text-white border-[#1f1f1f] p-0 overflow-hidden flex flex-col">
              {/* Fixed Header */}
              <div className="flex-shrink-0 p-6 border-b border-[#1f1f1f]">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold">{editing ? "Edit Member" : "New Member"}</SheetTitle>
                  <p className="text-sm text-white/60">Fill in the member information below</p>
                </SheetHeader>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#333 #1f1f1f'
              }}>
                <div className="p-6">
                  <MemberForm
                    defaultValues={editing ?? undefined}
                    onSubmit={async (vals) => {
                      try { await createOrUpdate(vals) } catch (e: any) { toast.error(e.message ?? "Failed") }
                    }}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" onClick={() => fetchMembers()}>Refresh 🔄</Button>
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
              <TableHead className="text-white">Job</TableHead>
              <TableHead className="text-white">Date of Birth</TableHead>
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
                <TableCell className="text-white">{m.job ?? '-'}</TableCell>
                <TableCell className="text-white">
                  {m.date_of_birth ? new Date(m.date_of_birth).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  }) : '-'}
                </TableCell>
                <TableCell className="text-white">{m.city ?? '-'}</TableCell>
                <TableCell className="text-white">{m.cert_count}</TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" 
                    onClick={() => { setEditing(m); setOpenForm(true) }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white" 
                    onClick={() => handleDelete(m)}
                  >
                    Delete
                  </Button>
                  {m.notes && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white p-2" 
                      onClick={() => setNotesModal({ open: true, member: m })}
                      title="View Notes"
                    >
                      🗒️
                    </Button>
                  )}
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

      {/* Notes Modal */}
      <Sheet open={notesModal.open} onOpenChange={(open) => setNotesModal({ open, member: null })}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-[#0A0A0A] text-white border-[#1f1f1f]">
          <SheetHeader>
            <SheetTitle>Notes - {notesModal.member?.name}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <div className="bg-[#111] border border-[#333] rounded-lg p-4">
              <p className="text-white whitespace-pre-wrap">
                {notesModal.member?.notes || 'No notes available.'}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    defaultValues?.date_of_birth ? new Date(defaultValues.date_of_birth) : null
  )
  const [showCalendar, setShowCalendar] = useState(false)
  const [address, setAddress] = useState<string>(defaultValues?.address ?? "")
  const [city, setCity] = useState<string>(defaultValues?.city ?? "")
  const [notes, setNotes] = useState<string>(defaultValues?.notes ?? "")
  const [loading, setLoading] = useState(false)

  // Update date_of_birth when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear()
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
      const day = selectedDate.getDate().toString().padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      setDob(dateString)
    }
  }, [selectedDate])

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required")
      return false
    }
    if (!organization.trim()) {
      toast.error("Organization is required")
      return false
    }
    if (!email.trim()) {
      toast.error("Email is required")
      return false
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    if (!phone.trim()) {
      toast.error("Phone is required")
      return false
    }
    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      toast.error("Please enter a valid phone number")
      return false
    }
    if (!job.trim()) {
      toast.error("Job is required")
      return false
    }
    if (!selectedDate) {
      toast.error("Date of birth is required")
      return false
    }
    if (!address.trim()) {
      toast.error("Address is required")
      return false
    }
    if (!city.trim()) {
      toast.error("City is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    try {
      await onSubmit({ 
        name: name.trim(), 
        organization: organization.trim(), 
        phone: phone.trim(), 
        email: email.trim(), 
        job: job.trim(), 
        date_of_birth, 
        address: address.trim(), 
        city: city.trim(), 
        notes: notes.trim() 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/80 mb-2 block">Name *</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="bg-[#111] text-white border-[#333] h-11" 
            placeholder="Enter full name"
            required 
          />
        </div>
        <div>
          <label className="text-sm text-white/80 mb-2 block">Email *</label>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="bg-[#111] text-white border-[#333] h-11" 
            placeholder="Enter email address"
            required 
          />
        </div>
        <div>
          <label className="text-sm text-white/80 mb-2 block">Phone *</label>
          <Input 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="bg-[#111] text-white border-[#333] h-11" 
            placeholder="Enter phone number"
            required 
          />
        </div>
        <div>
          <label className="text-sm text-white/80 mb-2 block">Organization *</label>
          <Input 
            value={organization} 
            onChange={(e) => setOrganization(e.target.value)} 
            className="bg-[#111] text-white border-[#333] h-11" 
            placeholder="Enter organization"
            required 
          />
        </div>
        <div>
          <label className="text-sm text-white/80 mb-2 block">Job *</label>
          <Input 
            value={job} 
            onChange={(e) => setJob(e.target.value)} 
            className="bg-[#111] text-white border-[#333] h-11" 
            placeholder="Enter job title"
            required 
          />
        </div>
        <div>
          <label className="text-sm text-white/80 mb-2 block">Date of Birth *</label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal bg-[#111] text-white border-[#333] h-11 hover:bg-[#222] hover:text-white"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                selectedDate.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              ) : (
                <span className="text-white/60">Pick a date</span>
              )}
            </Button>
            
            {showCalendar && (
              <div className="absolute top-full left-0 mt-1 z-50">
                <MiniCalendar
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date)
                    setShowCalendar(false)
                  }}
                  onClose={() => setShowCalendar(false)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <label className="text-sm text-white/80 mb-2 block">Address *</label>
          <Textarea 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className="bg-[#111] text-white border-[#333] w-full" 
            placeholder="Enter full address"
            rows={3} 
            required 
          />
        </div>
        <div>
          <label className="text-sm text-white/80 mb-2 block">City *</label>
          <Input 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="bg-[#111] text-white border-[#333] h-11" 
            placeholder="Enter city"
            required 
          />
        </div>
        <div className="lg:col-span-2">
          <label className="text-sm text-white/80 mb-2 block">Notes</label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            className="bg-[#111] text-white border-[#333] w-full" 
            placeholder="Additional notes (optional)"
            rows={3} 
          />
        </div>
      </div>
      <div className="pt-6 border-t border-[#1f1f1f] mt-6">
        <div className="flex gap-3">
          <Button 
            type="submit" 
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2 h-11 font-medium" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {defaultValues ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              defaultValues ? 'Update Member' : 'Save Member'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white px-6 py-2 h-11"
            onClick={() => {
              // Reset form or close modal logic can be added here
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}

function MiniCalendar({ 
  selectedDate, 
  onDateSelect, 
  onClose 
}: { 
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onClose: () => void 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  // Sync currentMonth with selected values
  useEffect(() => {
    setCurrentMonth(new Date(selectedYear, selectedMonth, 1))
  }, [selectedMonth, selectedYear])
  
  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.calendar-container')) {
        onClose()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])
  
  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  // Generate calendar days
  const days = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }
  
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }
  
  return (
    <div className="calendar-container bg-[#0A0A0A] border border-[#333] rounded-lg p-4 shadow-lg w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          className="text-white hover:bg-[#333]"
        >
          ←
        </Button>
        
        <div className="flex gap-2">
          {/* Month Dropdown */}
          <Select 
            value={selectedMonth.toString()} 
            onValueChange={(value) => {
              console.log('Month changed to:', value, monthNames[parseInt(value)])
              setSelectedMonth(parseInt(value))
            }}
          >
            <SelectTrigger className="w-24 bg-[#111] text-white border-[#333] h-8 text-sm">
              <SelectValue>
                {monthNames[selectedMonth].slice(0, 3)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
              {monthNames.map((monthName, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {monthName.slice(0, 3)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Year Dropdown */}
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => {
              console.log('Year changed to:', value)
              setSelectedYear(parseInt(value))
            }}
          >
            <SelectTrigger className="w-20 bg-[#111] text-white border-[#333] h-8 text-sm">
              <SelectValue>
                {selectedYear}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-60">
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="text-white hover:bg-[#333]"
        >
          →
        </Button>
      </div>
      
      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs text-white/60 p-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`w-full h-full text-sm ${
                  selectedDate && date.toDateString() === selectedDate.toDateString()
                    ? 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
                    : date.toDateString() === today.toDateString()
                    ? 'bg-[#333] text-white hover:bg-[#444]'
                    : 'bg-transparent text-white hover:bg-[#222] hover:text-white'
                }`}
                onClick={() => onDateSelect(date)}
              >
                {date.getDate()}
              </Button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Close button */}
      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="border-[#333] text-white hover:bg-[#333]"
        >
          Close
        </Button>
      </div>
    </div>
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


