import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"

export const metadata: Metadata = {
  title: "FAQ - Certificate Manager",
}

export default function FaqPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-white text-3xl font-semibold mb-2">FAQ</h1>
        <p className="text-[#AAAAAA]">Pertanyaan yang sering diajukan (placeholder). Konten akan ditambahkan kemudian.</p>
      </main>
    </div>
  )
}


