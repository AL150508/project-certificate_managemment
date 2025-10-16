"use client"

import { Card } from "@/components/ui/card"

const items = [
  { text: "Agus Santoso menerima sertifikat Pelatihan Web", time: "2 jam lalu" },
  { text: "Template 'Default Horizontal' diperbarui", time: "kemarin" },
]

export function RecentActivities() {
  return (
    <Card className="bg-[#111] border border-[#1f1f1f] p-5">
      <h3 className="text-white text-lg font-semibold mb-3">Aktivitas Terbaru</h3>
      <ul className="divide-y divide-[#1f1f1f]">
        {items.map((i) => (
          <li key={i.text} className="py-3 flex items-center justify-between">
            <span className="text-white">{i.text}</span>
            <span className="text-sm text-[#AAAAAA]">{i.time}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}


