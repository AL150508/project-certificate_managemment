"use client"

import { AppHeader } from "@/components/layouts/AppHeader"
import { useUser } from "@/contexts/UserContext"

export default function FaqPage() {
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
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-white text-3xl font-semibold mb-2">FAQ</h1>
        <p className="text-[#AAAAAA]">Pertanyaan yang sering diajukan (placeholder). Konten akan ditambahkan kemudian.</p>
      </main>
    </div>
  )
}


