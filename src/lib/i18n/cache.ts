/**
 * Translation Cache Utility
 * Stores translated strings in localStorage to avoid repeated API calls
 */

import { TranslationCache } from '@/types/i18n'

const CACHE_KEY = 'translation_cache'
const CACHE_VERSION = '1.0'
const CACHE_VERSION_KEY = 'translation_cache_version'

/**
 * Get translation cache from localStorage
 */
export function getTranslationCache(): TranslationCache {
  if (typeof window === 'undefined') return {}
  
  try {
    const version = localStorage.getItem(CACHE_VERSION_KEY)
    
    // Clear cache if version mismatch
    if (version !== CACHE_VERSION) {
      localStorage.removeItem(CACHE_KEY)
      localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION)
      return {}
    }
    
    const cached = localStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : {}
  } catch (error) {
    console.error('Error reading translation cache:', error)
    return {}
  }
}

/**
 * Save translation cache to localStorage
 */
export function saveTranslationCache(cache: TranslationCache): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION)
  } catch (error) {
    console.error('Error saving translation cache:', error)
  }
}

/**
 * Get cached translation for a specific text and language
 */
export function getCachedTranslation(text: string, targetLang: string): string | null {
  const cache = getTranslationCache()
  return cache[text]?.[targetLang] || null
}

/**
 * Cache a translation
 */
export function cacheTranslation(text: string, targetLang: string, translation: string): void {
  const cache = getTranslationCache()
  
  if (!cache[text]) {
    cache[text] = {}
  }
  
  cache[text][targetLang] = translation
  saveTranslationCache(cache)
}

/**
 * Clear translation cache
 */
export function clearTranslationCache(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_VERSION_KEY)
  } catch (error) {
    console.error('Error clearing translation cache:', error)
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { entries: number; size: string } {
  const cache = getTranslationCache()
  const entries = Object.keys(cache).length
  const size = new Blob([JSON.stringify(cache)]).size
  const sizeKB = (size / 1024).toFixed(2)
  
  return {
    entries,
    size: `${sizeKB} KB`
  }
}
