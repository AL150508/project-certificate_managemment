/**
 * Language Switcher Component
 * Dropdown to select language
 * Can be placed in navbar or anywhere in the app
 */

'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { languageOptions } from '@/lib/i18n/translations'
import { LanguageCode } from '@/types/i18n'

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact'
  showLabel?: boolean
  className?: string
}

export function LanguageSwitcher({ 
  variant = 'default', 
  showLabel = true,
  className = '' 
}: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage, t } = useLanguage()

  const handleLanguageChange = (value: string) => {
    setLanguage(value as LanguageCode)
  }

  const currentOption = languageOptions.find(opt => opt.code === currentLanguage)

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 text-gray-400" />
        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[100px] h-8 bg-transparent border-gray-700 text-white">
            <SelectValue>
              <span className="flex items-center gap-1">
                {currentOption?.flag} {currentOption?.code.toUpperCase()}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#1f2937] border-gray-700">
            {languageOptions.map((option) => (
              <SelectItem
                key={option.code}
                value={option.code}
                className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>{option.flag}</span>
                  <span>{option.code.toUpperCase()}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <label className="text-xs text-gray-400">
          <Globe className="w-3 h-3 inline mr-1" />
          {t('settings.language')}
        </label>
      )}
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full bg-[#1f2937] border-gray-700 text-white hover:bg-gray-800">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{currentOption?.flag}</span>
              <span>{currentOption?.nativeName}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#1f2937] border-gray-700">
          {languageOptions.map((option) => (
            <SelectItem
              key={option.code}
              value={option.code}
              className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{option.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{option.nativeName}</span>
                  <span className="text-xs text-gray-400">{option.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * Compact Language Indicator
 * Shows current language with flag and code
 */
export function LanguageIndicator({ className = '' }: { className?: string }) {
  const { currentLanguage } = useLanguage()
  const currentOption = languageOptions.find(opt => opt.code === currentLanguage)

  return (
    <div className={`flex items-center gap-1 text-sm text-gray-400 ${className}`}>
      <Globe className="w-4 h-4" />
      <span>{currentOption?.flag}</span>
      <span className="font-medium">{currentOption?.code.toUpperCase()}</span>
    </div>
  )
}
