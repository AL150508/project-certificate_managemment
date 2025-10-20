/**
 * Template Preview Component
 * Komponen untuk menampilkan preview template dengan konfigurasi yang sudah ditentukan
 */

"use client"

import React from 'react'
import { useTemplateConfig } from '@/hooks/use-template-config'
import { TemplateRenderer } from '@/lib/template-renderer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Eye, Download, Edit } from 'lucide-react'

interface TemplatePreviewProps {
  templateId: string
  data?: Record<string, string>
  showControls?: boolean
  onEdit?: () => void
  onDownload?: () => void
  className?: string
}

export function TemplatePreview({
  templateId,
  data = {},
  showControls = true,
  onEdit,
  onDownload,
  className = ""
}: TemplatePreviewProps) {
  const {
    config,
    isLoading,
    error,
    renderedElements,
    previewData,
    validation
  } = useTemplateConfig({
    templateId,
    data,
    autoRender: true
  })

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Card>
    )
  }

  if (error || !config) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>{error || 'Template not found'}</span>
        </div>
      </Card>
    )
  }

  const displayData = Object.keys(data).length > 0 ? data : previewData

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{config.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {config.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {config.orientation}
            </Badge>
            <Badge variant="secondary">
              {config.category}
            </Badge>
          </div>
        </div>

        {/* Validation Status */}
        {!validation.valid && (
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Missing fields: {validation.missingFields.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Template Preview */}
      <div className="p-6">
        <div className="relative bg-white border rounded-lg overflow-hidden">
          {/* Template Canvas */}
          <div
            className="relative mx-auto"
            style={{
              width: `${Math.min(config.dimensions.width * 0.5, 400)}px`,
              height: `${Math.min(config.dimensions.height * 0.5, 300)}px`,
              backgroundColor: '#f8f9fa'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#000"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Rendered Elements */}
            {renderedElements.map((element) => (
              <div
                key={element.id}
                style={{
                  ...TemplateRenderer.toCSSStyle(element),
                  // Scale down for preview
                  left: `${element.x * 0.5}px`,
                  top: `${element.y * 0.5}px`,
                  fontSize: `${element.style.fontSize * 0.5}px`,
                  maxWidth: element.maxWidth ? `${element.maxWidth * 0.5}px` : undefined,
                  maxHeight: element.maxHeight ? `${element.maxHeight * 0.5}px` : undefined
                }}
                className="pointer-events-none select-none"
              >
                {element.text}
              </div>
            ))}

            {/* Template Info Overlay */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {config.dimensions.width} × {config.dimensions.height}
            </div>
          </div>
        </div>

        {/* Element List */}
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Elements:</h4>
          <div className="grid grid-cols-2 gap-2">
            {renderedElements.map((element) => (
              <div
                key={element.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
              >
                <span className="font-medium capitalize">{element.type}</span>
                <span className="text-gray-500 truncate ml-2">
                  {element.text || 'Empty'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {renderedElements.length} elements • {config.orientation} • {config.category}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/templates/${templateId}`, '_blank')}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onDownload}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default TemplatePreview
