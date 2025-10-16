"use client"

import { Card } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Mei", total: 320 },
  { name: "Jun", total: 410 },
  { name: "Jul", total: 380 },
  { name: "Agu", total: 460 },
  { name: "Sep", total: 520 },
  { name: "Okt", total: 480 },
]

export function CertificateChart() {
  return (
    <Card className="bg-[#0A0A0A] border border-[#1f1f1f] p-5">
      <h3 className="text-white text-lg font-semibold mb-3">Statistik Sertifikat Bulanan</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#333" vertical={false} />
            <XAxis dataKey="name" stroke="#aaa" tickLine={false} axisLine={{ stroke: "#333" }} />
            <YAxis stroke="#aaa" tickLine={false} axisLine={{ stroke: "#333" }} />
            <Tooltip contentStyle={{ background: "#111", border: "1px solid #1f1f1f", color: "#fff" }} cursor={{ fill: "#111", opacity: 0.2 }} />
            <Bar dataKey="total" fill="#E50914" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}


