"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
})

export function AuthContextProvider({ 
  children,
  initialSession 
}: { 
  children: React.ReactNode
  initialSession: Session | null
}) {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 [AuthContext] Initializing...')
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('📊 [AuthContext] Current session:', currentSession?.user?.email || 'none')
      setSession(currentSession)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('🔔 [AuthContext] Auth changed:', _event, newSession?.user?.email || 'none')
        setSession(newSession)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthContextProvider')
  }
  return context
}
