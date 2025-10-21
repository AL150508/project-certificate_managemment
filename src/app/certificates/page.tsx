import type { Metadata } from "next"
import { Suspense } from "react"
import { AppHeader } from "@/components/layouts/AppHeader"
import CertificatesClient from "./CertificatesClient"

export const metadata: Metadata = {
  title: "Certificates - Certificate Manager",
}

export default function CertificatesPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <Suspense fallback={<div className="p-6 text-white">Loading...</div>}>
        <CertificatesClient />
      </Suspense>
    </div>
  )
}



