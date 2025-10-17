"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRole } from "@/context/RoleContext"

export function RoleSwitcher() {
  const { role, changeRole } = useRole()
  const label = role.charAt(0).toUpperCase() + role.slice(1)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-white border-[#1f1f1f] bg-[#111] hover:bg-[#1a1a1a]">
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#0A0A0A] text-white border-[#1f1f1f]">
        {(["admin","team","public"] as const).map((r) => (
          <DropdownMenuItem key={r} onClick={() => changeRole(r)} className="capitalize hover:bg-[#111]">
            {r}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


