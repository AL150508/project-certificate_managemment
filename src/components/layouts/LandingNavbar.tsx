"use client"

import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  return (
    <header className="w-full fixed top-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-b border-[#1a1a1a]">
      <div className="max-w-screen-xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="text-white font-semibold tracking-tight select-none">
          Certificate <span className="text-[#E50914]">Manager</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-white/80">
          <a href="/dashboard" className="hover:text-white">Dashboard</a>
          <a href="/certificates" className="hover:text-white">Certificates</a>
          <a href="/members" className="hover:text-white">Members</a>
          <a href="/categories" className="hover:text-white">Categories</a>
          <a href="/logout" className="hover:text-white">Logout</a>
        </nav>
        <Button className="bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white hover:opacity-90">Login / Daftar</Button>
      </div>
    </header>
  )
}


