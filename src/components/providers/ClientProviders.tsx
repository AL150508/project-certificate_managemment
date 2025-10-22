"use client"

import { AuthProvider } from './AuthProvider'
import { AuthContextProvider } from '@/context/AuthContext'
import { RoleProvider } from '@/context/RoleContext'
import { LanguageProvider } from './LanguageProvider'
import type { Session } from '@supabase/supabase-js'

/**
 * ClientProviders - Wraps all client-side providers
 * This ensures all providers run on client side
 * Receives initialSession from server layout
 */
export function ClientProviders({ 
  children,
  initialSession 
}: { 
  children: React.ReactNode
  initialSession: Session | null
}) {
  return (
    <LanguageProvider>
      <AuthProvider initialSession={initialSession}>
        <AuthContextProvider initialSession={initialSession}>
          <RoleProvider>{children}</RoleProvider>
        </AuthContextProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
