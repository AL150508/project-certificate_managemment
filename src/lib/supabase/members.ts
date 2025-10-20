import { supabase } from '@/lib/supabase'

export interface MemberData {
  id?: string
  name: string
  organization: string
  email: string
  phone: string
  job: string
  date_of_birth: string
  address: string
  city: string
  notes?: string
}

export interface MemberWithCertCount extends MemberData {
  cert_count: number
}

/**
 * Fetch all members with certificate count
 */
export async function fetchMembers(): Promise<MemberWithCertCount[]> {
  const { data, error } = await supabase
    .from("members")
    .select("id, name, organization, email, phone, city, job, date_of_birth, address, notes, certificates:certificates(id)")
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data ?? []).map((m: any) => ({
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
}

/**
 * Create a new member
 */
export async function createMember(memberData: Omit<MemberData, 'id'>): Promise<MemberData> {
  const { data, error } = await supabase
    .from("members")
    .insert(memberData)
    .select("id, name, organization, email, phone, city, job, date_of_birth, address, notes")
    .single()

  if (error) throw error

  // Log activity
  await supabase.from("activity_logs").insert({
    action: "CREATE_MEMBER",
    related_table: "members",
    related_id: data.id,
    description: `Created member ${data.name}`,
  })

  return data
}

/**
 * Update an existing member
 */
export async function updateMember(id: string, memberData: Partial<Omit<MemberData, 'id'>>): Promise<MemberData> {
  const { data, error } = await supabase
    .from("members")
    .update(memberData)
    .eq("id", id)
    .select("id, name, organization, email, phone, city, job, date_of_birth, address, notes")
    .single()

  if (error) throw error

  // Log activity
  await supabase.from("activity_logs").insert({
    action: "UPDATE_MEMBER",
    related_table: "members",
    related_id: id,
    description: `Updated member ${data.name}`,
  })

  return data
}

/**
 * Delete a member
 */
export async function deleteMember(id: string, name: string): Promise<void> {
  // Check if member has certificates
  const { data: certificates, error: certError } = await supabase
    .from("certificates")
    .select("id")
    .eq("member_id", id)

  if (certError) throw certError

  if (certificates && certificates.length > 0) {
    throw new Error("Member ini masih memiliki sertifikat aktif dan tidak dapat dihapus.")
  }

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id)

  if (error) throw error

  // Log activity
  await supabase.from("activity_logs").insert({
    action: "DELETE_MEMBER",
    related_table: "members",
    related_id: id,
    description: `Deleted member ${name}`,
  })
}

/**
 * Get recent member activities
 */
export async function getRecentMemberActivities(limit: number = 5): Promise<Array<{ description: string; created_at: string }>> {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("description, created_at")
    .eq("related_table", "members")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error

  return data ?? []
}

/**
 * Validate member data
 */
export function validateMemberData(data: Partial<MemberData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push("Name is required")
  }

  if (!data.organization?.trim()) {
    errors.push("Organization is required")
  }

  if (!data.email?.trim()) {
    errors.push("Email is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (!data.phone?.trim()) {
    errors.push("Phone is required")
  } else if (!/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
    errors.push("Please enter a valid phone number")
  }

  if (!data.job?.trim()) {
    errors.push("Job is required")
  }

  if (!data.date_of_birth) {
    errors.push("Date of birth is required")
  }

  if (!data.address?.trim()) {
    errors.push("Address is required")
  }

  if (!data.city?.trim()) {
    errors.push("City is required")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Format date for display
 */
export function formatDateOfBirth(dateString: string | null): string {
  if (!dateString) return '-'
  
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}
