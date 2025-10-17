"use client"

import { Card } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts"

const monthly = [
  { name: "Jan", total: 18 },
  { name: "Feb", total: 22 },
  { name: "Mar", total: 25 },
  { name: "Apr", total: 19 },
  { name: "Mei", total: 21 },
  { name: "Jun", total: 27 },
  { name: "Jul", total: 24 },
  { name: "Agu", total: 26 },
  { name: "Sep", total: 29 },
  { name: "Okt", total: 32 },
  { name: "Nov", total: 20 },
  { name: "Des", total: 23 },
]

const categories = [
  { name: "Pelatihan", value: 45 },
  { name: "Magang", value: 25 },
  { name: "MoU", value: 15 },
  { name: "Lainnya", value: 15 },
]

const PIE_COLORS = ["#E50914", "#b1000e", "#333", "#666"]

export function AdminAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="bg-[#0A0A0A] border border-[#1f1f1f] p-5">
        <h3 className="text-white text-lg font-semibold mb-3">Certificate Issued per Month</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#aaa" tickLine={false} axisLine={{ stroke: "#333" }} />
              <YAxis stroke="#aaa" tickLine={false} axisLine={{ stroke: "#333" }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #1f1f1f", color: "#fff" }} cursor={{ fill: "#111", opacity: 0.2 }} />
              <Bar dataKey="total" fill="#E50914" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="bg-[#0A0A0A] border border-[#1f1f1f] p-5">
        <h3 className="text-white text-lg font-semibold mb-3">Certificate by Category</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categories} dataKey="value" nameKey="name" outerRadius={100} label>
                {categories.map((entry, index) => (
                  <Cell key={`c-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #1f1f1f", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}


