"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import Image from 'next/image'

interface PreviewModalProps {
  isOpen: boolean
  imageUrl: string
  templateName: string
  onClose: () => void
}

export default function PreviewModal({
  isOpen,
  imageUrl,
  templateName,
  onClose
}: PreviewModalProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setImageError(false)
      setZoom(1)
      setRotation(0)
    }
  }, [isOpen])

  const handleImageLoad = () => {
    setIsLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${templateName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const resetView = () => {
    setZoom(1)
    setRotation(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] bg-neutral-900 border-neutral-800 text-gray-100 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-neutral-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-100">
              {templateName}
            </DialogTitle>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleZoomOut}
                variant="outline"
                size="sm"
                className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-gray-300"
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-400 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                onClick={handleZoomIn}
                variant="outline"
                size="sm"
                className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-gray-300"
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handleRotate}
                variant="outline"
                size="sm"
                className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-gray-300"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-gray-300"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-gray-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Image Container */}
        <div className="flex-1 overflow-auto bg-neutral-950 p-4 min-h-0">
          <div className="flex items-center justify-center h-full">
            {isLoading && !imageError && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            )}

            {imageError && !isLoading && (
              <div className="text-center text-gray-400">
                <div className="w-24 h-24 mx-auto mb-4 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <X className="w-12 h-12" />
                </div>
                <p className="text-lg mb-2">Failed to load image</p>
                <p className="text-sm">The template preview could not be displayed</p>
              </div>
            )}

            {!imageError && imageUrl && (
              <div 
                className="relative transition-transform duration-200 ease-in-out"
                style={{ 
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <Image
                  src={imageUrl}
                  alt={templateName}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              Template Preview • {templateName}
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={resetView}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-300"
              >
                Reset View
              </Button>
              <span className="hidden sm:inline">Use mouse wheel to zoom • Click and drag to pan</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
