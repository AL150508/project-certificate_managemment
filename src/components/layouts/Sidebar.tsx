"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Template Sertifikat", href: "/templates" },
  { label: "Kategori", href: "/categories" },
  { label: "Member", href: "/members" },
  { label: "Sertifikat", href: "/certificates" },
  { label: "Impor Data", href: "/import" },
  { label: "Pengaturan", href: "/settings" },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-0 top-0 bottom-0 w-72 bg-[#0F0F0F] z-50 border-r border-[#1a1a1a]"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <div className="h-14 flex items-center justify-between px-4 border-b border-[#1a1a1a]">
              <span className="text-white font-semibold">Menu</span>
              <button onClick={onClose} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {links.map((l) => {
                const active = pathname?.startsWith(l.href)
                return (
                  <button
                    key={l.href}
                    onClick={() => { router.push(l.href); onClose() }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-all ${active ? "bg-[#1A1A1A] text-white" : "text-white/80 hover:text-white hover:bg-[#1A1A1A]"}`}
                  >
                    {l.label}
                  </button>
                )
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}


