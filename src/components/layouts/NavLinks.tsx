"use client"

import { useMemo } from "react"
import { useRole } from "@/context/RoleContext"

type LinkItem = { href: string; label: string }

const AdminMenu: LinkItem[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/faq", label: "FAQ" },
]

const TeamMenu: LinkItem[] = [
  { href: "/team/dashboard", label: "Dashboard" },
  { href: "/certificates", label: "Certificates" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/faq", label: "FAQ" },
]

const PublicMenu: LinkItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/faq", label: "FAQ" },
]

export function useRoleLinks(): LinkItem[] {
  const { role } = useRole()
  return useMemo(() => {
    if (role === "admin") return AdminMenu
    if (role === "team") return TeamMenu
    return PublicMenu
  }, [role])
}


