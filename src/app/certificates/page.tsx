import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import CertificatesClient from "./CertificatesClient"

export const metadata: Metadata = {
  title: "Certificates - Certificate Manager",
}

type Member = { id: string; name: string; email: string | null }
type Category = { id: string; name: string }
type Template = { id: string; name: string }

export default function CertificatesPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <CertificatesClient />
    </div>
  )
}



