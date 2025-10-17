"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Shield } from "lucide-react"

type LinkItem = { href: string; label: string }

export function AppHeader({
  links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/certificates", label: "Certificates" },
    { href: "/members", label: "Members" },
    { href: "/categories", label: "Categories" },
    { href: "/import", label: "Import" },
    { href: "/faq", label: "FAQ" },
  ],
  loginText = "Login / Daftar",
  isLoggedIn = false,
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    role: "Administrator"
  }
}: {
  links?: LinkItem[]
  loginText?: string
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
}) {
  return (
    <header className="w-full fixed top-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-b border-[#1a1a1a]">
      <div className="max-w-screen-xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="text-white font-semibold tracking-tight select-none">
          Certificate <span className="text-[#E50914]">Manager</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-white/80">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs px-2 py-1 rounded-md bg-[#111] text-white/80 border border-[#1f1f1f]">
                <Shield className="inline w-3 h-3 mr-1" />
                <span className="text-white font-medium">{user.role}</span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-[#E50914] text-white">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-[#333] text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-white/60">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#333]" />
                  <DropdownMenuItem className="text-white hover:bg-[#333] cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-[#333] cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#333]" />
                  <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button className="bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white hover:opacity-90">
              {loginText}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


