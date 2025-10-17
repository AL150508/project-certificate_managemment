import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import { AboutLanding } from "@/components/sections/AboutLanding"
import ClientHero from "./ClientHero"
import { AdminSummaryCards } from "@/components/dashboard/AdminSummaryCards"
import { AdminAnalytics } from "@/components/dashboard/AdminAnalytics"
import { AdminRecentActivity } from "@/components/dashboard/AdminRecentActivity"

export const metadata: Metadata = {
  title: "Dashboard - Certificate Manager",
}

export default function Page() {
  // choose hero based on role (public/admin/team)
  // we'll use client hook via wrapper to avoid making this a client component
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader 
        isLoggedIn={true}
        user={{
          name: "John Doe",
          email: "john.doe@example.com",
          avatar: "",
          role: "Administrator"
        }}
      />
      <ClientHero />
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-6">

        <section className="mb-8">
          <AdminSummaryCards />
        </section>

        <section className="mb-8">
          <AdminAnalytics />
        </section>

        <section className="mb-8">
          <AdminRecentActivity />
        </section>
      </main>
      <AboutLanding />
    </div>
  )
}


