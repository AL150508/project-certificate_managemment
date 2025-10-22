"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useLanguage } from "@/components/providers/LanguageProvider"

export function LandingNavbar() {
  const { t } = useLanguage()
  
  return (
    <header className="w-full fixed top-0 inset-x-0 z-30 bg-black/80 backdrop-blur border-b border-[#1a1a1a]">
      <div className="max-w-screen-xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="text-white font-semibold tracking-tight select-none">
          Certificate <span className="text-[#E50914]">Manager</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-white/80">
          <a href="/dashboard" className="hover:text-white">{t('dashboard.title')}</a>
          <a href="/faq" className="hover:text-white">{t('landing.faq')}</a>
        </nav>
        
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher variant="compact" />
          
          <Link href="/login">
            <Button className="bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white hover:opacity-90">
              {t('auth.loginRegister')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}


