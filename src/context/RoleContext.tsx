"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Role = "admin" | "team" | "public"
type RoleContextValue = { role: Role; changeRole: (r: Role) => void }

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("activeRole") as Role | null
      if (saved) setRole(saved)
    } catch {}
  }, [])

  const changeRole = (newRole: Role) => {
    setRole(newRole)
    try { localStorage.setItem("activeRole", newRole) } catch {}
  }

  return (
    <RoleContext.Provider value={{ role, changeRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error("useRole must be used within RoleProvider")
  return ctx
}


