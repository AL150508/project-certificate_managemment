"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface TemplateUploadProps {
  onTemplateUpload: (url: string) => void
  currentTemplate?: string
}

export default function TemplateUpload({ onTemplateUpload, currentTemplate }: TemplateUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentTemplate || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onTemplateUpload(result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveTemplate = () => {
    setPreview(null)
    onTemplateUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#333333]">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold">Template Sertifikat</h3>
          
          {preview ? (
            <div className="relative">
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Template preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveTemplate}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={handleUploadClick}
            >
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Upload Template Sertifikat</p>
              <p className="text-sm text-gray-500">PNG, JPG, atau SVG (max 10MB)</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : preview ? "Change Template" : "Select Template"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
