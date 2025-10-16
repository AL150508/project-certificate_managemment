import type { Metadata } from "next"
import { LandingNavbar } from "@/components/layouts/LandingNavbar"

export const metadata: Metadata = {
  title: "Logout - Certificate Manager",
}

export default function LogoutPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <LandingNavbar />
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-white text-3xl font-semibold mb-2">Logout</h1>
        <p className="text-[#AAAAAA]">Halaman ini akan menangani sesi pengguna nanti.</p>
      </main>
    </div>
  )
}


