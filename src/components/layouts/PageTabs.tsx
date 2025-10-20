"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Template Sertifikat", href: "/templates" },
  { label: "Kategori", href: "/categories" },
  { label: "Member", href: "/members" },
  { label: "Sertifikat", href: "/certificates" },
  { label: "Pengaturan", href: "/settings" },
]

export function PageTabs() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="w-full bg-[#111] border-b border-[#1a1a1a]">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <nav className="flex gap-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const active = pathname?.startsWith(tab.href)
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className={`relative py-3 text-sm md:text-[15px] whitespace-nowrap transition-all ${active ? "text-white font-semibold" : "text-white/80 hover:text-white"}`}
              >
                <span className="px-1">
                  {tab.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#E50914]"
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}


