"use client"

import { useRole } from "@/context/RoleContext"

export function RoleIndicator() {
  const { role } = useRole()
  const style = role === "admin"
    ? "bg-red-500/20 text-red-300 border-red-500/40"
    : role === "team"
      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
      : "bg-gray-500/20 text-gray-300 border-gray-500/40"
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${style}`}>{role === 'public' ? 'Guest' : role[0].toUpperCase() + role.slice(1)}</span>
  )
}
