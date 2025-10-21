import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import QRCode from "qrcode"
import fs from "node:fs/promises"
import path from "node:path"

type TemplateField = {
  key: string
  label?: string
  x: number
  y: number
  fontSize?: number
  fontFamily?: string
  color?: string
  align?: "left" | "center" | "right"
}

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_PUBLIC_BASE_URL
  if (envUrl) return envUrl
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
}

async function renderPdfAndPng(html: string, width: number, height: number) {
  const { chromium } = await import("playwright")
  const browser = await chromium.launch({ args: ["--no-sandbox","--disable-setuid-sandbox"], headless: true })
  const page = await browser.newPage({ viewport: { width, height } })
  await page.setContent(html, { waitUntil: "networkidle" })
  const pdfBuffer = await page.pdf({ printBackground: true, width: `${width}px`, height: `${height}px` })
  const pngBuffer = await page.screenshot({ type: "png" })
  await browser.close()
  return { pdfBuffer, pngBuffer }
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    // Load certificate + template
    const { data: cert, error: certErr } = await supabase
      .from("certificates")
      .select("id, certificate_number, verification_code, member_id, category_id, template_id, fields_data, layout, issue_date, status")
      .eq("id", id)
      .maybeSingle()
    if (certErr) throw certErr
    if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { data: tpl, error: tplErr } = await supabase
      .from("certificate_templates")
      .select("id, name, fields, background_url, width_px, height_px")
      .eq("id", cert.template_id)
      .maybeSingle()
    if (tplErr) throw tplErr
    if (!tpl) return NextResponse.json({ error: "Template missing" }, { status: 400 })

    const width = tpl.width_px ?? 1200
    const height = tpl.height_px ?? 850

    // QR Code URL
    const base = getBaseUrl()
    const verifyUrl = `${base}/cek/${encodeURIComponent(cert.verification_code)}`
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 100 })

    // Build HTML (absolute layout)
    const fields: TemplateField[] = Array.isArray(tpl.fields) ? (tpl.fields as TemplateField[]) : []
    const data = (cert.fields_data ?? {}) as Record<string, unknown>

    const textNodes = fields.map((f) => {
      const content = (data[f.key] as string) ?? f.label ?? f.key
      const fs = f.fontSize ?? 24
      const ff = f.fontFamily ?? "Poppins, Arial, sans-serif"
      const color = f.color ?? "#111"
      const align = f.align ?? "center"
      const x = Math.round(f.x ?? 0)
      const y = Math.round(f.y ?? 0)
      return `<div style="position:absolute; left:${x}px; top:${y}px; font-size:${fs}px; font-family:${ff}; color:${color}; width:100%; text-align:${align}; white-space:pre-wrap;">${String(content)}</div>`
    }).join("")

    const footer = `
      <div style="position:absolute; left:24px; bottom:20px; font-size:12px; color:#333;">
        <div>Certificate Number : ${cert.certificate_number}</div>
        <div>Verification Link  : ${verifyUrl}</div>
      </div>`

    const qrBlock = `<img src="${qrDataUrl}" style="position:absolute; right:24px; bottom:20px; width:100px; height:100px;" />`

    const bg = tpl.background_url ? `background-image:url('${tpl.background_url}'); background-size:cover; background-position:center;` : ""

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Poppins:wght@400;600;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style>html,body{margin:0;padding:0}</style>
      </head>
      <body>
        <div style="position:relative; width:${width}px; height:${height}px; ${bg}">
          ${textNodes}
          ${footer}
          ${qrBlock}
        </div>
      </body>
    </html>`

    const { pdfBuffer, pngBuffer } = await renderPdfAndPng(html, width, height)

    const isProd = process.env.NODE_ENV === "production"
    let pdfUrl: string | null = null
    let pngUrl: string | null = null

    if (isProd) {
      // upload both to Storage
      const upPdf = await supabase.storage.from("certificates").upload(`${id}/certificate.pdf`, pdfBuffer, { contentType: "application/pdf", upsert: true })
      if (upPdf.error) throw upPdf.error
      const upPng = await supabase.storage.from("certificates").upload(`${id}/preview.png`, pngBuffer, { contentType: "image/png", upsert: true })
      if (upPng.error) throw upPng.error
      pdfUrl = supabase.storage.from("certificates").getPublicUrl(upPdf.data.path).data.publicUrl
      pngUrl = supabase.storage.from("certificates").getPublicUrl(upPng.data.path).data.publicUrl
    } else {
      const outDir = path.join(process.cwd(), "public", "generated", id)
      await fs.mkdir(outDir, { recursive: true })
      const pdfPath = path.join(outDir, `certificate.pdf`)
      const pngPath = path.join(outDir, `preview.png`)
      await fs.writeFile(pdfPath, pdfBuffer)
      await fs.writeFile(pngPath, pngBuffer)
      pdfUrl = `/generated/${id}/certificate.pdf`
      pngUrl = `/generated/${id}/preview.png`
    }

    const layoutSnapshot: { orientation: "landscape" | "portrait"; fields: TemplateField[] } = {
      orientation: "landscape",
      fields: fields,
    }

    const { error: updErr } = await supabase
      .from("certificates")
      .update({ pdf_url: pdfUrl, png_url: pngUrl, layout: layoutSnapshot, status: cert.status === "draft" ? "published" : cert.status })
      .eq("id", id)
    if (updErr) throw updErr

    return NextResponse.json({ ok: true, pdf_url: pdfUrl, png_url: pngUrl, verifyUrl })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed'
    return new NextResponse(msg, { status: 500 })
  }
}
