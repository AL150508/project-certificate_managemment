import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { supabaseServer as supabase, validateSupabaseServer } from "@/lib/supabase-server"

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    validateSupabaseServer()
    const { data: cert, error } = await supabase
      .from("certificates")
      .select("id, certificate_number, verification_code, pdf_url, member_id, category_id")
      .eq("id", id)
      .maybeSingle()
    if (error) throw error
    if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { data: member, error: mErr } = await supabase
      .from("members")
      .select("email, name")
      .eq("id", cert.member_id)
      .maybeSingle()
    if (mErr) throw mErr

    const { data: category } = await supabase
      .from("certificate_categories")
      .select("name")
      .eq("id", cert.category_id)
      .maybeSingle()

    const payload = await req.json().catch(() => ({})) as { recipient?: string; subject?: string; message?: string }
    const to = payload.recipient || member?.email
    if (!to) return NextResponse.json({ error: "Recipient email not found" }, { status: 400 })

    const base = getBaseUrl()
    const verifyLink = `${base}/cek/${encodeURIComponent(cert.verification_code)}`
    const subject = payload.subject || `[Certificate] Sertifikat ${category?.name ?? "Pelatihan"} - ${member?.name ?? "Peserta"}`
    const from = process.env.EMAIL_FROM || "Certificate Manager <no-reply@domain.com>"

    const html = `
      <p>Halo ${member?.name ?? ''},</p>
      <p>Selamat! Anda telah menerima sertifikat pelatihan ${category?.name ?? ''}.</p>
      <p>Klik tautan berikut untuk melihat sertifikat Anda:<br/>
      <a href="${verifyLink}">${verifyLink}</a></p>
      <p>Anda juga dapat mengunduh PDF sertifikat melalui tautan berikut:<br/>
      <a href="${cert.pdf_url ?? '#'}">${cert.pdf_url ?? ''}</a></p>
      <p>Salam hangat,<br/>Tim Certificate Manager</p>
    `

    // queue log: queued
    const { data: log } = await supabase.from("email_logs").insert({
      certificate_id: cert.id,
      recipient_email: to,
      subject,
      status: "queued",
    }).select("id").single()

    const transporter = await getTransporter()

    // Try signed URL if bucket private
    async function resolvePdfUrl(u?: string | null) {
      if (!u) return null
      try {
        // If looks like public URL and reachable directly, just return
        const isHttp = /^https?:\/\//i.test(u)
        if (!isHttp) {
          // assume it's a storage path
          const { data, error } = await supabase.storage.from("certificates").createSignedUrl(u, 60 * 60)
          if (error) return u
          return data.signedUrl
        }
        // try to detect storage public URL path component
        const m = u.match(/\/certificates\/(.*)$/)
        if (m && m[1]) {
          const { data, error } = await supabase.storage.from("certificates").createSignedUrl(m[1], 60 * 60)
          if (!error) return data.signedUrl
        }
        return u
      } catch {
        return u
      }
    }

    const resolvedPdfUrl = await resolvePdfUrl(cert.pdf_url)
    const attachments: Array<{ filename: string; path: string }> = []
    if (resolvedPdfUrl) attachments.push({ filename: `${cert.certificate_number}.pdf`, path: resolvedPdfUrl })

    await transporter.sendMail({ from, to, subject, html, attachments })

    await supabase.from("email_logs").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", log?.id)

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed"
    // try logging failure if cert known
    try {
      const { id: certId } = await params
      await supabase.from("email_logs").insert({ certificate_id: certId, recipient_email: null, subject: "(auto)", status: "failed", error_message: msg })
    } catch {}
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
