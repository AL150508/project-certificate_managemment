"use client"

import { useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"

export default function LogoutPage() {
  const hasLoggedOut = useRef(false)

  useEffect(() => {
    // Prevent multiple logout calls
    if (hasLoggedOut.current) {
      return
    }
    
    hasLoggedOut.current = true
    
    const handleLogout = async () => {
      try {
        console.log("🔐 Logging out...")
        
        // 1. Sign out from Supabase
        await supabase.auth.signOut()
        console.log("✅ Signed out from Supabase")
        
        // 2. Clear all localStorage
        localStorage.clear()
        console.log("✅ Cleared localStorage")
        
        // 3. Clear sessionStorage
        sessionStorage.clear()
        console.log("✅ Cleared sessionStorage")
        
        // 4. Redirect to login
        console.log("🔄 Redirecting to login...")
        
        // Use window.location for hard redirect (clears all state)
        window.location.href = "/login"
        
      } catch (error) {
        console.error("❌ Logout error:", error)
        // Still redirect even if error
        window.location.href = "/login"
      }
    }
    
    handleLogout()
  }, [])

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Logging out...</p>
      </div>
    </div>
  )
}


