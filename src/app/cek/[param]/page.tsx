import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Verifikasi Sertifikat",
}

async function findCertificate(param: string) {
  // try by verification_code first
  let { data, error } = await supabase
    .from("certificates")
    .select("id, certificate_number, verification_code, member_id, category_id, issue_date, status, pdf_url, png_url")
    .eq("verification_code", param)
    .maybeSingle()
  if (error) throw error
  if (!data) {
    const byNumber = await supabase
      .from("certificates")
      .select("id, certificate_number, verification_code, member_id, category_id, issue_date, status, pdf_url, png_url")
      .eq("certificate_number", param)
      .maybeSingle()
    if (byNumber.error) throw byNumber.error
    data = byNumber.data
  }
  if (!data) return null

  // fetch member and category name (support legacy table names)
  const [m, c] = await Promise.all([
    supabase.from("members").select("id, name").eq("id", data.member_id).maybeSingle(),
    supabase
      .from("certificate_categories").select("id, name").eq("id", data.category_id).maybeSingle()
      .then((r) => {
        if (r.error) return supabase.from("categories").select("id, name").eq("id", data!.category_id).maybeSingle()
        return r
      }),
  ])

  return {
    ...data,
    member_name: m.data?.name ?? null,
    category_name: c.data?.name ?? null,
  }
}

export default async function VerifyPage({ params }: { params: { param: string } }) {
  const cert = await findCertificate(decodeURIComponent(params.param))

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <main className="max-w-screen-md mx-auto px-6 md:px-12 py-20">
        {!cert ? (
          <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-6 text-white">
            <h1 className="text-2xl font-semibold mb-2">Certificate Verification</h1>
            <p className="text-white/70">❌ Certificate not found. Please check your code or number.</p>
          </Card>
        ) : (
          <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-6 text-white space-y-4">
            <h1 className="text-2xl font-semibold">✅ Certificate verified</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/60">Certificate Number</div>
                <div className="font-medium">{cert.certificate_number}</div>
              </div>
              <div>
                <div className="text-white/60">Verification Code</div>
                <div className="font-medium">{cert.verification_code}</div>
              </div>
              <div>
                <div className="text-white/60">Member</div>
                <div className="font-medium">{cert.member_name ?? '-'}</div>
              </div>
              <div>
                <div className="text-white/60">Category</div>
                <div className="font-medium">{cert.category_name ?? '-'}</div>
              </div>
              <div>
                <div className="text-white/60">Issue Date</div>
                <div className="font-medium">{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '-'}</div>
              </div>
              <div>
                <div className="text-white/60">Status</div>
                <div className="font-medium">{cert.status}</div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              {cert.pdf_url && (
                <Button variant="outline" className="border-[#333] text-white" asChild>
                  <a href={cert.pdf_url} target="_blank" rel="noreferrer">Download PDF</a>
                </Button>
              )}
              {cert.png_url && (
                <Button variant="outline" className="border-[#333] text-white" asChild>
                  <a href={cert.png_url} target="_blank" rel="noreferrer">Open Preview</a>
                </Button>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
