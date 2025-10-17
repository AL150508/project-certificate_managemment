"use client"

import { Button } from "@/components/ui/button"

type LinkItem = { href: string; label: string }

export function AppHeader({
  links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/certificates", label: "Certificates" },
    { href: "/members", label: "Members" },
    { href: "/categories", label: "Categories" },
    { href: "/import", label: "Import" },
    { href: "/faq", label: "FAQ" },
    { href: "/logout", label: "Logout" },
  ],
  loginText = "Login / Daftar",
}: {
  links?: LinkItem[]
  loginText?: string
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
          <span className="hidden sm:inline text-xs px-2 py-1 rounded-md bg-[#111] text-white/80 border border-[#1f1f1f]">
            <span className="text-white font-medium">Administrator</span>
          </span>
          <Button className="bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white hover:opacity-90">{loginText}</Button>
        </div>
      </div>
    </header>
  )
}


