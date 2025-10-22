"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Languages } from "lucide-react"
import { useRoleLinks } from "@/components/layouts/NavLinks"
import { RoleIndicator } from "@/components/layouts/RoleIndicator"
import { useRole } from "@/context/RoleContext"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/components/providers/LanguageProvider"
import { languageOptions } from "@/lib/i18n/translations"

type LinkItem = { href: string; label: string }

export function AppHeader({
  links,
  loginText = "Login / Daftar"
}: {
  links?: LinkItem[]
  loginText?: string
}) {
  const { role, user } = useRole()
  const router = useRouter()
  const roleLinks = useRoleLinks()
  const navLinks = links ?? roleLinks
  const isLoggedIn = role !== "public"
  const { currentLanguage, setLanguage } = useLanguage()

  async function handleLogoutOrLogin() {
    if (isLoggedIn) {
      console.log('🚪 Logging out...')
      try {
        // Logout untuk admin/team
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('❌ Logout error:', error)
          throw error
        }
        console.log('✅ Logout successful')
        
        // Clear any local storage
        if (typeof window !== 'undefined') {
          localStorage.clear()
          sessionStorage.clear()
        }
        
        // Redirect to login with hard refresh
        window.location.href = '/login'
      } catch (error) {
        console.error('Logout failed:', error)
        // Force redirect anyway
        window.location.href = '/login'
      }
    } else {
      // Redirect ke login untuk guest
      router.push("/login")
    }
  }
  return (
    <header className="w-full fixed top-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-b border-[#1a1a1a]">
      <div className="max-w-screen-xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        <Link 
          href={role === "admin" ? "/admin/dashboard" : role === "team" ? "/dashboard" : "/"} 
          className="text-white font-semibold tracking-tight select-none hover:opacity-80 transition-opacity"
        >
          Certificate <span className="text-[#E50914]">Manager</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-white/80">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <RoleIndicator />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.email ?? "User"} />
                      <AvatarFallback className="bg-[#E50914] text-white">
                        {user?.email ? user.email.charAt(0).toUpperCase() : role.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-[#333] text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{!isLoggedIn ? "Guest" : user?.email ?? "User"}</p>
                      <p className="text-xs leading-none text-white/60">{user?.email ?? "guest@local"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#333]" />
                  <DropdownMenuItem className="text-white hover:bg-[#333] cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-white hover:bg-[#333]">
                      <Languages className="mr-2 h-4 w-4" />
                      <span>Language</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-[#1a1a1a] border-[#333]">
                      {languageOptions.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`text-white hover:bg-[#333] ${currentLanguage === lang.code ? 'bg-[#333]' : ''}`}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          {currentLanguage === lang.code && (
                            <span className="ml-auto">✓</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSeparator className="bg-[#333]" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault()
                      handleLogoutOrLogin()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggedIn ? "Log out" : "Login"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild className="bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white hover:opacity-90">
                <Link href="/login">{loginText}</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#333] text-white">
                <Link href="/">Continue as Guest</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}


