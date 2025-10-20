"use client"

import { Card } from "@/components/ui/card"
import { FileText, UserPlus, Layers, Inbox, Mail } from "lucide-react"

const items = [
  { icon: FileText, date: "15 Okt 2025", text: "Sertifikat “Pelatihan ReactJS” diterbitkan untuk Budi Santoso" },
  { icon: UserPlus, date: "14 Okt 2025", text: "Member baru: Andi Wijaya (UBIG)" },
  { icon: Layers, date: "13 Okt 2025", text: "Template “Default Landscape” diperbarui oleh Admin" },
  { icon: Inbox, date: "12 Okt 2025", text: "Import 120 data member dari Excel berhasil" },
  { icon: Mail, date: "11 Okt 2025", text: "35 sertifikat dikirim via email" },
]

export function AdminRecentActivity() {
  return (
    <Card className="rounded-xl border border-zinc-800/80 bg-[rgba(16,16,22,0.8)] backdrop-blur-sm p-5">
      <h3 className="text-zinc-100 text-lg font-semibold mb-3">Aktivitas Terbaru</h3>
      <ul className="max-h-[260px] overflow-auto pr-2 space-y-3">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-zinc-900/70 ring-1 ring-zinc-800"><i.icon className="h-4 w-4 text-rose-400" /></div>
            <div>
              <p className="text-sm text-zinc-100">{i.text}</p>
              <p className="text-xs text-zinc-500 mt-1">{i.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}


