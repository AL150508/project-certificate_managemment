"use client"

import { Card } from "@/components/ui/card"
import { FileText, Users, FolderKanban, Layers, CalendarDays, Mail } from "lucide-react"

const items = [
  { title: "Total Sertifikat", value: "256", desc: "Jumlah semua sertifikat diterbitkan", icon: FileText },
  { title: "Total Member", value: "122", desc: "Jumlah peserta terdaftar", icon: Users },
  { title: "Kategori Aktif", value: "6", desc: "Kategori pelatihan/MoU aktif", icon: FolderKanban },
  { title: "Template Sertifikat", value: "8", desc: "Template tersimpan", icon: Layers },
  { title: "Sertifikat Bulan Ini", value: "32", desc: "Diterbitkan bulan berjalan", icon: CalendarDays },
  { title: "Email Terkirim", value: "180", desc: "Total email sertifikat dikirim", icon: Mail },
]

export function AdminSummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.title} className="rounded-xl border border-zinc-800/80 bg-[rgba(16,16,22,0.8)] backdrop-blur-sm p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-md bg-zinc-900/70 ring-1 ring-zinc-800">
              <item.icon className="h-5 w-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-400">{item.title}</p>
              <p className="text-3xl font-semibold text-zinc-100 tracking-tight">{item.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}


