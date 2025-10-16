"use client"

import { Card } from "@/components/ui/card"
import { FileText, FolderKanban, Users, Award } from "lucide-react"

const items = [
  { title: "Template", value: "24", icon: FileText },
  { title: "Kategori", value: "12", icon: FolderKanban },
  { title: "Member", value: "1.248", icon: Users },
  { title: "Sertifikat", value: "5.432", icon: Award },
]

export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card
          key={item.title}
          className="bg-[#111] border border-[#E50914]/30 p-5 hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{item.title}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
            </div>
            <item.icon className="h-6 w-6 text-[#E50914]" />
          </div>
          <p className="mt-2 text-xs text-gray-500">Total {item.title.toLowerCase()} terdaftar</p>
        </Card>
      ))}
    </div>
  )
}

