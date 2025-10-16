import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Globe } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-black/95 border-b border-[#1a1a1a] shadow-md">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1 lg:hidden" />
        <div className="flex items-center gap-2 select-none">
          <span className="text-white font-semibold text-base md:text-lg tracking-tight">Certificate <span className="text-[#E50914]">Manager</span></span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:text-white/90 hover:bg-[#111]">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#111] gap-1">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">EN/ID</span>
          </Button>
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6 bg-[#1f1f1f]" />
          <Avatar>
            <AvatarFallback className="bg-[#1A1A1A] text-white">CM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
