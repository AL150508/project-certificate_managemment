import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { supabase } from "@/lib/supabase"

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_PUBLIC_BASE_URL
  if (envUrl) return envUrl
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
}

async function getTransporter() {
  const host = process.env.EMAIL_HOST as string
  const port = Number(process.env.EMAIL_PORT || 587)
  const user = process.env.EMAIL_USER as string
  const pass = process.env.EMAIL_PASS as string
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { ids?: string[]; subject?: string }
    const ids = Array.isArray(body.ids) ? body.ids : []
    if (ids.length === 0) return NextResponse.json({ error: "ids required" }, { status: 400 })

    // fetch certificates with member emails
    const { data: rows, error } = await supabase
      .from("certificates")
      .select("id, certificate_number, verification_code, pdf_url, member_id, category_id, status")
      .in("id", ids)
    if (error) throw error

    // map member emails
    const memberIds = Array.from(new Set(rows.map(r => r.member_id).filter(Boolean))) as string[]
    const members: Record<string, { email: string | null; name: string | null }> = {}
    if (memberIds.length) {
      const { data: ms, error: mErr } = await supabase.from("members").select("id, email, name").in("id", memberIds)
      if (mErr) throw mErr
      for (const m of ms ?? []) {
        const member = m as { id: string; email?: string | null; name?: string | null }
        members[member.id] = { email: member.email ?? null, name: member.name ?? null }
      }
    }
    const categoryIds = Array.from(new Set(rows.map(r => r.category_id).filter(Boolean))) as string[]
    const categories: Record<string, { name: string | null }> = {}
    if (categoryIds.length) {
      const { data: cs, error: cErr } = await supabase.from("certificate_categories").select("id, name").in("id", categoryIds)
      if (cErr) throw cErr
      for (const c of cs ?? []) {
        const category = c as { id: string; name?: string | null }
        categories[category.id] = { name: category.name ?? null }
      }
    }

    const base = getBaseUrl()
    const transporter = await getTransporter()

    let sent = 0, failed = 0, queued = 0
    async function resolvePdfUrl(u?: string | null) {
      if (!u) return null
      try {
        const isHttp = /^https?:\/\//i.test(u)
        if (!isHttp) {
          const { data, error } = await supabase.storage.from("certificates").createSignedUrl(u, 60 * 60)
          if (error) return u
          return data.signedUrl
        }
        const m = u.match(/\/certificates\/(.*)$/)
        if (m && m[1]) {
          const { data, error } = await supabase.storage.from("certificates").createSignedUrl(m[1], 60 * 60)
          if (!error) return data.signedUrl
        }
        return u
      } catch { return u }
    }

    for (const c of rows) {
      const recipient = c.member_id ? members[c.member_id]?.email : null
      if (!recipient) { failed++; continue }
      const verifyLink = `${base}/cek/${encodeURIComponent(c.verification_code)}`
      const subject = body.subject || `[Certificate] Sertifikat ${categories[c.category_id as string]?.name ?? 'Pelatihan'} - ${members[c.member_id as string]?.name ?? 'Peserta'}`
      const from = process.env.EMAIL_FROM || "Certificate Manager <no-reply@domain.com>"
      const html = `
        <p>Halo ${members[c.member_id as string]?.name ?? ''},</p>
        <p>Selamat! Anda telah menerima sertifikat pelatihan ${categories[c.category_id as string]?.name ?? ''}.</p>
        <p>Klik tautan berikut untuk melihat sertifikat Anda:<br/>
        <a href="${verifyLink}">${verifyLink}</a></p>
        <p>Anda juga dapat mengunduh PDF sertifikat melalui tautan berikut:<br/>
        <a href="${c.pdf_url ?? '#'}">${c.pdf_url ?? ''}</a></p>
        <p>Salam hangat,<br/>Tim Certificate Manager</p>
      `
      const resolvedPdfUrl = await resolvePdfUrl(c.pdf_url)
      const attachments: Array<{ filename: string; path: string }> = []
      if (resolvedPdfUrl) attachments.push({ filename: `${c.certificate_number}.pdf`, path: resolvedPdfUrl })

      const { data: log } = await supabase.from("email_logs").insert({
        certificate_id: c.id,
        recipient_email: recipient,
        subject,
        status: "queued",
      }).select("id").single()
      queued++

      try {
        await transporter.sendMail({ from, to: recipient, subject, html, attachments })
        await supabase.from("email_logs").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", log?.id)
        sent++
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        await supabase.from("email_logs").update({ status: "failed", error_message: msg }).eq("id", log?.id)
        failed++
      }
    }

    return NextResponse.json({ ok: true, sent, failed, queued })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
