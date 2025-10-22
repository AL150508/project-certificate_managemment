"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type Role = "admin" | "team" | "public"
type RoleContextValue = { 
  role: Role; 
  user: { id: string; email: string } | null;
  changeRole: (newRole: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("public")
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [originalRole, setOriginalRole] = useState<Role>("public") // Store original role

  async function resolveRoleByEmail(email: string | null | undefined) {
    if (!email) { 
      setRole("public")
      setOriginalRole("public")
      return 
    }
    const { data, error } = await supabase.from("users").select("role").eq("email", email).maybeSingle<{ role: Role }>()
    if (error || !data) { 
      setRole("public")
      setOriginalRole("public")
      return 
    }
    const r = data.role ?? "public"
    
    // Check if there's a stored role override (for admin switching)
    const storedRole = localStorage.getItem('admin_role_override')
    if (storedRole && r === "admin") {
      setRole(storedRole as Role)
    } else {
      setRole(r)
    }
    setOriginalRole(r)
  }

  useEffect(() => {
    // Check for fallback credentials first (from localStorage)
    const fallbackRole = localStorage.getItem('fallback_role')
    const fallbackUserStr = localStorage.getItem('fallback_user')
    
    if (fallbackRole && fallbackUserStr) {
      try {
        const fallbackUser = JSON.parse(fallbackUserStr)
        console.log('✅ Found fallback role in localStorage:', fallbackRole)
        setRole(fallbackRole as Role)
        setOriginalRole(fallbackRole as Role)
        setUser({ id: 'fallback', email: fallbackUser.email })
        return // Don't check Supabase if using fallback
      } catch (e) {
        console.error('Failed to parse fallback user:', e)
      }
    }
    
    // initial session fetch from Supabase
    supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session
      if (s?.user) {
        setUser({ id: s.user.id, email: s.user.email ?? "" })
        await resolveRoleByEmail(s.user.email)
      } else {
        setUser(null)
        setRole("public")
      }
    })
    // subscribe to auth state
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      // Check fallback first
      const fallbackRole = localStorage.getItem('fallback_role')
      const fallbackUserStr = localStorage.getItem('fallback_user')
      
      if (fallbackRole && fallbackUserStr) {
        // User is using fallback credentials, don't override with Supabase state
        try {
          const fallbackUser = JSON.parse(fallbackUserStr)
          setRole(fallbackRole as Role)
          setOriginalRole(fallbackRole as Role)
          setUser({ id: 'fallback', email: fallbackUser.email })
        } catch (e) {
          console.error('Failed to parse fallback user:', e)
        }
        return
      }
      
      // Normal Supabase auth flow
      if (sess?.user) {
        setUser({ id: sess.user.id, email: sess.user.email ?? "" })
        await resolveRoleByEmail(sess.user.email)
      } else {
        setUser(null)
        setRole("public")
        setOriginalRole("public")
        // Clear role override on logout
        localStorage.removeItem('admin_role_override')
        localStorage.removeItem('fallback_role')
        localStorage.removeItem('fallback_user')
      }
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  // Function to change role (for admin testing/switching)
  const changeRole = (newRole: Role) => {
    // Only allow role switching if original role is admin
    if (originalRole === "admin") {
      setRole(newRole)
      // Store the role override in localStorage
      if (newRole !== originalRole) {
        localStorage.setItem('admin_role_override', newRole)
      } else {
        localStorage.removeItem('admin_role_override')
      }
    }
  }

  return (
    <RoleContext.Provider value={{ role, user, changeRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error("useRole must be used within RoleProvider")
  return ctx
}


