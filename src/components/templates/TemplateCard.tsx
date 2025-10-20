"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye, Play } from 'lucide-react'
// import Image from 'next/image' // Using regular img for external URLs

interface Template {
  id: string
  name: string
  background_url: string
  thumbnail_url: string
  preview_url: string
  orientation: 'portrait' | 'landscape'
  category_id: string | null
  width_px: number
  height_px: number
  created_at: string
  certificate_categories?: {
    name: string
  }
}

interface TemplateCardProps {
  template: Template
  onUse: () => void
  onEdit: () => void
  onDelete: () => void
  onPreview: () => void
}

export default function TemplateCard({
  template,
  onUse,
  onEdit,
  onDelete,
  onPreview
}: TemplateCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  return (
    <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200 hover:shadow-xl hover:shadow-red-600/10 group">
      <CardHeader className="p-0 relative">
        {/* Template Preview Image */}
        <div className="relative w-full h-48 bg-neutral-800 overflow-hidden rounded-t-2xl">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
          
          {!imageError ? (
            <img
              src={template.thumbnail_url || template.background_url || template.preview_url}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-2 bg-neutral-700 rounded-lg flex items-center justify-center">
                  <Eye className="w-8 h-8" />
                </div>
                <p className="text-sm">Preview not available</p>
              </div>
            </div>
          )}

          {/* Overlay with quick actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              onClick={onPreview}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Orientation Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="secondary" 
            className={`text-xs font-medium ${
              template.orientation === 'portrait' 
                ? 'bg-blue-600/80 text-white' 
                : 'bg-green-600/80 text-white'
            }`}
          >
            {template.orientation === 'portrait' ? 'Portrait' : 'Landscape'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Template Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 leading-tight">
            {template.name}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="capitalize">
              {template.orientation}
            </span>
            <span className="text-right">
              {template.certificate_categories?.name || 'Uncategorized'}
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={onUse}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium mb-3 transition-colors duration-200"
        >
          <Play className="w-4 h-4 mr-2" />
          Use This Template
        </Button>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="flex-1 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          
          <Button
            onClick={onPreview}
            variant="outline"
            size="sm"
            className="flex-1 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
          
          <Button
            onClick={onDelete}
            variant="outline"
            size="sm"
            className="flex-1 border-red-800 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>

        {/* Template ID (for debugging) */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          ID: {template.id.slice(0, 8)}...
        </div>
      </CardContent>
    </Card>
  )
}
