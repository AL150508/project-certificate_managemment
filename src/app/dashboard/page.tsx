"use client"

import { AppHeader } from "@/components/layouts/AppHeader"
import { AboutLanding } from "@/components/sections/AboutLanding"
import { Hero } from "@/components/sections/Hero"
import { AdminSummaryCards } from "@/components/dashboard/AdminSummaryCards"
import { AdminAnalytics } from "@/components/dashboard/AdminAnalytics"
import { AdminRecentActivity } from "@/components/dashboard/AdminRecentActivity"
import { useUser } from "@/contexts/UserContext"

export default function Page() {
  const { user, isLoading } = useUser()
  
  if (isLoading) {
    return (
      <div className="min-h-dvh w-full bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="min-h-dvh w-full bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Please login first</div>
      </div>
    )
  }

  // Get role display name
  const roleDisplayNames = {
    'admin': 'Administrator',
    'team': 'Team',
    'public': 'Publik'
  }

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader 
        isLoggedIn={true}
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar || "",
          role: roleDisplayNames[user.role]
        }}
      />
      <Hero />
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
