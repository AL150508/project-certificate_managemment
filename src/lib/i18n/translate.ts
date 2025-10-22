/**
 * Translation Helper Functions
 * Handles translation logic with caching and fallback
 */

import { LanguageCode } from '@/types/i18n'
import { translations } from './translations'
import { getCachedTranslation, cacheTranslation } from './cache'

/**
 * Get nested translation value from translations object
 * Example: getNestedValue(translations.en, 'auth.login') => 'Login'
 */
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.')
  let current: unknown = obj
  
  for (const key of keys) {
    if (current && typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  
  return typeof current === 'string' ? current : undefined
}

/**
 * Translate text using manual translations or Google Translate API
 * @param text - Text to translate or translation key (e.g., 'auth.login')
 * @param targetLang - Target language code
 * @param sourceLang - Source language code (default: 'en')
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'en'
): Promise<string> {
  // If target is same as source, return original
  if (targetLang === sourceLang) {
    return text
  }
  
  // If target is English, return original (assuming source is English)
  if (targetLang === 'en') {
    return text
  }
  
  try {
    // 1. Check if it's a translation key (e.g., 'auth.login')
    if (text.includes('.') && !text.includes(' ')) {
      const manualTranslation = getNestedValue(translations[targetLang], text)
      if (manualTranslation) {
        return manualTranslation
      }
      
      // If not found in target language, try English as fallback
      const englishFallback = getNestedValue(translations.en, text)
      if (englishFallback) {
        text = englishFallback // Use English text for translation
      }
    }
    
    // 2. Check manual translations for exact match
    const targetTranslations = translations[targetLang]
    if (targetTranslations) {
      // Search through all nested values
      const findTranslation = (obj: unknown, searchText: string): string | null => {
        if (!obj || typeof obj !== 'object') return null
        
        const objRecord = obj as Record<string, unknown>
        for (const key in objRecord) {
          const value = objRecord[key]
          if (typeof value === 'string' && value === searchText) {
            return getNestedValue(translations[targetLang], key) || null
          } else if (typeof value === 'object' && value !== null) {
            const found = findTranslation(value, searchText)
            if (found) return found
          }
        }
        return null
      }
      
      const manualMatch = findTranslation(translations.en, text)
      if (manualMatch) {
        return manualMatch
      }
    }
    
    // 3. Check cache
    const cached = getCachedTranslation(text, targetLang)
    if (cached) {
      return cached
    }
    
    // 4. Call Google Translate API via our API route
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang,
      }),
    })
    
    if (!response.ok) {
      console.error('Translation API error:', await response.text())
      return text // Return original text on error
    }
    
    const data = await response.json()
    const translatedText = data.translatedText
    
    // Cache the translation
    if (translatedText) {
      cacheTranslation(text, targetLang, translatedText)
      return translatedText
    }
    
    return text
    
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text on error
  }
}

/**
 * Translate multiple texts at once (batch translation)
 * More efficient than calling translateText multiple times
 */
export async function translateBatch(
  texts: string[],
  targetLang: LanguageCode,
  sourceLang: LanguageCode = 'en'
): Promise<string[]> {
  // If target is same as source, return originals
  if (targetLang === sourceLang || targetLang === 'en') {
    return texts
  }
  
  const results: string[] = []
  
  // Process in parallel with Promise.all
  const promises = texts.map(text => translateText(text, targetLang, sourceLang))
  
  try {
    const translations = await Promise.all(promises)
    return translations
  } catch (error) {
    console.error('Batch translation error:', error)
    return texts // Return original texts on error
  }
}

/**
 * Get translation key value
 * Example: t('auth.login', 'id') => 'Masuk'
 */
export function t(key: string, lang: LanguageCode = 'en'): string {
  const value = getNestedValue(translations[lang], key)
  if (value) return value
  
  // Fallback to English
  const englishValue = getNestedValue(translations.en, key)
  if (englishValue) return englishValue
  
  // Return key if not found
  return key
}

/**
 * Check if translation is available for a language
 */
export function isTranslationAvailable(lang: LanguageCode): boolean {
  return !!translations[lang] && Object.keys(translations[lang]).length > 0
}
