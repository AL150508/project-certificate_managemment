"use client"

import { useEffect, useRef, useState } from 'react'
import { CertificateElement, TemplateSource } from '@/types/certificate'
import { TemplateConfigManager } from '@/config/template-configs'
import Image from 'next/image'
import TextTransformBox from '@/components/certificates/TextTransformBox'

interface CertificatePreviewProps {
  templateSource: TemplateSource | null
  elements: CertificateElement[]
  className?: string
  onElementUpdate?: (elementId: string, updates: Partial<CertificateElement>) => void
  onElementDelete?: (elementId: string) => void
  onElementSelect?: (elementId: string | null) => void
  selectedElementId?: string | null
  orientation?: 'portrait' | 'landscape'
  selectedCategory?: string
  categories?: Array<{id: string, name: string}>
}

export default function CertificatePreview({ 
  templateSource, 
  elements, 
  className = "",
  onElementUpdate,
  onElementDelete,
  onElementSelect,
  selectedElementId,
  orientation = 'portrait',
  selectedCategory,
  categories = []
}: CertificatePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Get template config if using config template
  const templateConfig = templateSource?.type === 'config' && templateSource.configId 
    ? TemplateConfigManager.getConfig(templateSource.configId)
    : null

  // Calculate dimensions based on orientation
  const getDimensions = () => {
    if (templateConfig) {
      return templateConfig.dimensions
    }
    // Default dimensions based on orientation
    return orientation === 'portrait' 
      ? { width: 600, height: 800 }
      : { width: 800, height: 600 }
  }

  // Calculate scale factor for preview
  const getScaleFactor = () => {
    const dimensions = getDimensions()
    const containerWidth = orientation === 'portrait' ? 500 : 700 // Max preview width
    return Math.min(containerWidth / dimensions.width, 0.8)
  }

  const dimensions = getDimensions()
  const scaleFactor = getScaleFactor()

  // Get category name for display
  const categoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name || selectedCategory
    : null

  return (
    <div className={`flex flex-col bg-[#111827] rounded-xl p-5 h-[680px] shadow-inner border border-[#1f2937] ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-[#E2E8F0]">Certificate Preview</h2>

      {templateSource ? (
        <div className="flex justify-center items-center bg-[#0f172a] h-full rounded-lg overflow-hidden" ref={containerRef}>
          <div 
            className="relative bg-white rounded-md shadow-lg transition-all duration-300"
            style={{
              width: `${dimensions.width * scaleFactor}px`,
              height: `${dimensions.height * scaleFactor}px`,
            }}
          >
            {/* Template Background */}
            {templateSource.type === 'upload' ? (
              // For uploaded templates, show only a simple background
              <div className="w-full h-full bg-white rounded-md relative overflow-hidden">
                {/* Simple background for uploaded templates */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
                  Uploaded Template
                </div>
              </div>
            ) : (
              // For config templates, show realistic placeholder
              <div className="w-full h-full bg-white rounded-md border-4 border-yellow-400 relative overflow-hidden">
                {/* Decorative border */}
                <div className="absolute inset-2 border-2 border-yellow-300 rounded-sm">
                  <div className="absolute inset-2 border border-yellow-200 rounded-sm">
                    {/* Certificate content */}
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center relative">
                      <div className="text-2xl font-bold text-gray-800 mb-3" style={{ fontSize: `${24 * scaleFactor}px` }}>
                        Certificate of {templateConfig?.category ? templateConfig.category.charAt(0).toUpperCase() + templateConfig.category.slice(1) : 'Achievement'}
                      </div>
                      <div className="text-base text-gray-600 mb-2" style={{ fontSize: `${16 * scaleFactor}px` }}>This is to certify that</div>
                      <div className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-gray-300 pb-2 px-6" style={{ fontSize: `${20 * scaleFactor}px` }}>
                        [RECIPIENT NAME]
                      </div>
                      <div className="text-sm text-gray-600 mb-3" style={{ fontSize: `${14 * scaleFactor}px` }}>
                        has successfully completed the requirements for
                      </div>
                      <div className="text-lg font-semibold text-gray-800 mb-6" style={{ fontSize: `${18 * scaleFactor}px` }}>
                        [{templateConfig?.category?.toUpperCase() || 'PROGRAM'} PROGRAM]
                      </div>
                      <div className="flex justify-between w-full mt-auto">
                        <div className="text-xs text-gray-600" style={{ fontSize: `${12 * scaleFactor}px` }}>
                          <div className="border-t border-gray-400 pt-1">Date</div>
                        </div>
                        <div className="text-xs text-gray-600" style={{ fontSize: `${12 * scaleFactor}px` }}>
                          <div className="border-t border-gray-400 pt-1">Signature</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Template name overlay */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
                  {templateConfig?.name}
                </div>
              </div>
            )}
            
            {/* Uploaded template image */}
            {templateSource.type === 'upload' && (
              <Image
                src={templateSource.url}
                alt="Selected Template"
                fill
                className="rounded-md object-contain absolute inset-0"
                style={{ zIndex: 10 }}
                priority
                onError={() => {
                  console.error('Failed to load uploaded template image:', templateSource.url)
                }}
                onLoad={() => {
                  console.log('Uploaded template loaded successfully')
                }}
              />
            )}
            
            {templateSource.type === 'config' && templateConfig?.metadata.backgroundImage && (
              // For config templates with background image, overlay the actual image
              <Image
                src={`/templates/${templateConfig.metadata.backgroundImage}`}
                alt={templateConfig.name}
                fill
                className="rounded-md object-contain"
                priority
                onError={() => {
                  console.log('Config template image not found, using placeholder')
                }}
                onLoad={() => {
                  console.log('Config template image loaded successfully')
                }}
              />
            )}
            
            {/* Category Display - Center Top */}
            {categoryName && (
              <div 
                className="absolute top-6 left-1/2 transform -translate-x-1/2 text-blue-400 text-lg font-semibold z-30 bg-white/90 px-4 py-2 rounded-lg shadow-md"
                style={{ fontSize: `${18 * scaleFactor}px` }}
              >
                {categoryName} Certificate
              </div>
            )}

            {/* Interactive Text Elements with Konva - Higher z-index than images */}
            <div className="absolute inset-0" style={{ zIndex: 20 }}>
              {onElementUpdate && onElementDelete && onElementSelect && (
                <TextTransformBox
                  elements={elements}
                  onElementUpdate={onElementUpdate}
                  onElementDelete={onElementDelete}
                  onElementSelect={onElementSelect}
                  selectedElementId={selectedElementId || null}
                  templateDimensions={dimensions}
                  scaleFactor={scaleFactor}
                />
              )}
            </div>

            {/* Template Info Overlay */}
            {templateConfig && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded" style={{ zIndex: 30 }}>
                {templateConfig.name} • {templateConfig.dimensions.width}×{templateConfig.dimensions.height}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-[#94A3B8]">
          <p className="text-lg font-medium mb-2">No Template Selected</p>
          <p className="text-sm opacity-80">
            Choose a template from the new award templates to start editing
          </p>
        </div>
      )}
    </div>
  )
}
