import type { Metadata } from "next"
import { LandingNavbar } from "@/components/layouts/LandingNavbar"

export const metadata: Metadata = {
  title: "Categories - Certificate Manager",
}

export default function CategoriesPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <LandingNavbar />
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-white text-3xl font-semibold mb-2">Categories</h1>
        <p className="text-[#AAAAAA]">Halaman kategori sertifikat. Konten akan dihubungkan ke Supabase nanti.</p>
      </main>
    </div>
  )
}


