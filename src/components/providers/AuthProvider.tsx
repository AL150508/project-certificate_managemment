"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

/**
 * AuthProvider - Maintains Supabase session across page navigations
 * This component listens to auth state changes and ensures session persistence
 * Uses @supabase/ssr for proper Next.js App Router support
 * Receives initialSession from server layout
 */
export function AuthProvider({ 
  children,
  initialSession 
}: { 
  children: React.ReactNode
  initialSession: Session | null
}) {
  const [session, setSession] = useState<Session | null>(initialSession)

  useEffect(() => {
    console.log('🚀 [AuthProvider] Mounted and initializing...')
    
    // Check session immediately on mount
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession) {
          console.log('✅ [AuthProvider] Found active session on mount:', currentSession.user.email)
          setSession(currentSession)
        } else if (initialSession) {
          console.log('✅ [AuthProvider] Using initial session from server:', initialSession.user.email)
          setSession(initialSession)
        } else {
          console.log('⚠️ [AuthProvider] No active session found')
        }
      } catch (error) {
        console.error('❌ [AuthProvider] Error checking session:', error)
        // Use initial session from server if available
        if (initialSession) {
          console.log('✅ [AuthProvider] Falling back to initial session from server')
          setSession(initialSession)
        }
      }
    }
    
    checkSession()
    
    // Listen to auth state changes with detailed logging
    let subscription: { unsubscribe: () => void } | null = null
    
    try {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
        console.log(`🔔 [AuthProvider] Auth state changed: ${event}`, newSession?.user?.email || 'no user')
        
        if (event === 'SIGNED_IN' && newSession) {
          console.log('✅ [AuthProvider] User signed in, session active:', newSession.user.email)
          console.log('📊 [AuthProvider] Session details:', {
            user: newSession.user.email,
            expiresAt: new Date(newSession.expires_at! * 1000).toLocaleString()
          })
          setSession(newSession)
        } else if (event === 'SIGNED_OUT') {
          console.log('🔒 [AuthProvider] User signed out')
          setSession(null)
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          console.log('🔄 [AuthProvider] Token refreshed:', newSession.user.email)
          setSession(newSession)
        } else if (event === 'INITIAL_SESSION') {
          if (newSession) {
            console.log('🎯 [AuthProvider] Initial session loaded from listener:', newSession.user.email)
            setSession(newSession)
          } else {
            console.log('⚠️ [AuthProvider] Initial session event but no session data')
          }
        } else if (event === 'USER_UPDATED' && newSession) {
          console.log('👤 [AuthProvider] User updated:', newSession.user.email)
          setSession(newSession)
        }
      })

      subscription = authListener.subscription
      console.log('✅ [AuthProvider] Auth listener registered')
    } catch (error) {
      console.error('❌ [AuthProvider] Error setting up auth listener:', error)
    }

    // Cleanup subscription on unmount
    return () => {
      console.log('🔴 [AuthProvider] Unmounting...')
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [initialSession])

  return <>{children}</>
}
