/**
 * Language Context Provider
 * Manages language state across the application
 * Persists language selection in localStorage
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LanguageCode } from '@/types/i18n'
import { translateText, translateBatch, t } from '@/lib/i18n/translate'
import { languageOptions } from '@/lib/i18n/translations'

interface LanguageContextType {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  translate: (text: string) => Promise<string>
  translateBatch: (texts: string[]) => Promise<string[]>
  t: (key: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = 'preferred_language'
const DEFAULT_LANGUAGE: LanguageCode = 'en'

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE)
  const [isLoading, setIsLoading] = useState(true)

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (stored && isValidLanguageCode(stored)) {
        setCurrentLanguage(stored as LanguageCode)
      }
    } catch (error) {
      console.error('Error loading language preference:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save language to localStorage when it changes
  const setLanguage = (lang: LanguageCode) => {
    try {
      setCurrentLanguage(lang)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
      
      // Emit custom event for other components to react
      window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }))
      
      console.log(`Language changed to: ${lang}`)
    } catch (error) {
      console.error('Error saving language preference:', error)
    }
  }

  // Translate function that uses current language
  const translate = async (text: string): Promise<string> => {
    if (currentLanguage === 'en') return text
    return translateText(text, currentLanguage, 'en')
  }

  // Batch translate function
  const translateBatchWrapper = async (texts: string[]): Promise<string[]> => {
    if (currentLanguage === 'en') return texts
    return translateBatch(texts, currentLanguage, 'en')
  }

  // Translation key function
  const tWrapper = (key: string): string => {
    return t(key, currentLanguage)
  }

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    translate,
    translateBatch: translateBatchWrapper,
    t: tWrapper,
    isLoading,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to use language context
 * Must be used within LanguageProvider
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  
  return context
}

/**
 * Validate language code
 */
function isValidLanguageCode(code: string): boolean {
  return languageOptions.some(option => option.code === code)
}

/**
 * Get current language from context (safe to use outside provider)
 */
export function getCurrentLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && isValidLanguageCode(stored)) {
      return stored as LanguageCode
    }
  } catch (error) {
    // Ignore error
  }
  return DEFAULT_LANGUAGE
}
