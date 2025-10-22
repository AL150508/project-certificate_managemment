import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import { AboutLanding } from "@/components/sections/AboutLanding"
import ClientHero from "./ClientHero"

export const metadata: Metadata = {
  title: "Admin Dashboard - Certificate Manager",
}

export default function AdminDashboardPage() {
  // Admin dashboard with role-based access
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <ClientHero />
      <AboutLanding />
    </div>
  )
}
