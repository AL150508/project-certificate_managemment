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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.title} className="bg-[#111] border border-[#E50914]/20 p-5 hover:scale-[1.02] transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#1a1a1a]">
              <item.icon className="h-5 w-5 text-[#E50914]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">{item.title}</p>
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}


