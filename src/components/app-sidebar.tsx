"use client"

import * as React from "react"
import { LayoutDashboard, FileText, FolderKanban, Users, Award, Settings } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard, isActive: true },
    { title: "Template Sertifikat", url: "/admin/templates", icon: FileText },
    { title: "Kategori", url: "/manage/categories", icon: FolderKanban },
    { title: "Member", url: "/manage/members", icon: Users },
    { title: "Sertifikat", url: "/admin/certificates", icon: Award },
  ],
  navSecondary: [
    { title: "Pengaturan", url: "/settings", icon: Settings },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-[#111] text-white">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#" className="flex items-center gap-2">
                <span className="text-base font-semibold">Certificate <span className="text-[#E50914]">Manager</span></span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="[--sidebar-background:#111] [--sidebar-foreground:#fff]">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
