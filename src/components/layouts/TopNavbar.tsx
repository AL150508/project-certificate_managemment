"use client"

import { Bell, Globe, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopNavbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="w-full bg-black border-b border-[#1a1a1a] shadow-md">
      <div className="max-w-screen-xl mx-auto h-14 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 select-none">
          <button onClick={onToggleSidebar} className="text-white/90 hover:text-white lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-white font-semibold text-base md:text-lg tracking-tight">Certificate <span className="text-[#E50914]">Manager</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:text-white/90 hover:bg-[#111]">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#111] gap-1">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">EN/ID</span>
          </Button>
          <Avatar>
            <AvatarFallback className="bg-[#1A1A1A] text-white">CM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}


