"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRole } from "@/context/RoleContext"

export function RoleSwitcher() {
  const { role, changeRole } = useRole()
  const label = role.charAt(0).toUpperCase() + role.slice(1)
  
  // Check if admin is in switched mode
  const isAdminSwitched = localStorage.getItem('admin_role_override') !== null
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`text-white border-[#333] bg-transparent hover:bg-[#333] hover:text-white ${
            isAdminSwitched ? 'border-orange-500 text-orange-300' : ''
          }`}
        >
          {isAdminSwitched ? `🔄 ${label}` : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#0A0A0A] text-white border-[#1f1f1f]">
        {(["admin","team","public"] as const).map((r) => (
          <DropdownMenuItem 
            key={r} 
            onClick={() => changeRole(r)} 
            className={`capitalize hover:bg-[#111] ${role === r ? 'bg-[#333] text-white' : ''}`}
          >
            {r === "admin" ? "👑 Admin" : r === "team" ? "👥 Team" : "👤 Public"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


