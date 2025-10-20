// Preview Image Generator for Certificate Templates
import html2canvas from 'html2canvas'
import { supabase } from './supabase'

export interface PreviewGeneratorOptions {
  elementId: string
  fileName: string
  quality?: number
  scale?: number
}

/**
 * Generate preview image from DOM element
 */
export async function generatePreviewImage(
  options: PreviewGeneratorOptions
): Promise<Blob | null> {
  const { elementId, quality = 0.9, scale = 2 } = options

  try {
    console.log('🔍 Looking for element:', elementId)
    const element = document.getElementById(elementId)
    
    if (!element) {
      console.error('❌ Element not found:', elementId)
      console.log('Available elements with IDs:', 
        Array.from(document.querySelectorAll('[id]')).map(el => el.id)
      )
      return null
    }

    console.log('✅ Element found:', element)
    console.log('📸 Generating preview image...')
    
    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight
    })

    console.log('✅ Canvas generated:', {
      width: canvas.width,
      height: canvas.height
    })

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('✅ Blob created:', {
              size: blob.size,
              type: blob.type
            })
          }
          resolve(blob)
        },
        'image/png',
        quality
      )
    })
  } catch (error) {
    console.error('❌ Error generating preview:', error)
    return null
  }
}

/**
 * Upload preview image to Supabase Storage
 */
export async function uploadPreviewToStorage(
  blob: Blob,
  fileName: string,
  bucket: string = 'certificate-assets'
): Promise<string | null> {
  try {
    console.log('📤 Uploading preview to storage...')
    
    const filePath = `previews/${fileName}-${Date.now()}.png`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: false
      })

    if (error) {
      console.error('❌ Upload error:', error)
      return null
    }

    console.log('✅ Upload successful:', data.path)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    console.log('✅ Public URL:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('❌ Error uploading preview:', error)
    return null
  }
}

/**
 * Generate thumbnail (smaller version)
 */
export async function generateThumbnail(
  blob: Blob,
  maxWidth: number = 400,
  maxHeight: number = 300
): Promise<Blob | null> {
  try {
    console.log('🖼️ Generating thumbnail...')
    
    // Create image from blob
    const img = new Image()
    const url = URL.createObjectURL(blob)
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Calculate thumbnail dimensions
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Create canvas for thumbnail
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (thumbnailBlob) => {
            URL.revokeObjectURL(url)
            if (thumbnailBlob) {
              console.log('✅ Thumbnail created:', {
                width,
                height,
                size: thumbnailBlob.size
              })
            }
            resolve(thumbnailBlob)
          },
          'image/png',
          0.8
        )
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      
      img.src = url
    })
  } catch (error) {
    console.error('❌ Error generating thumbnail:', error)
    return null
  }
}

/**
 * Complete preview generation workflow
 */
export async function generateAndUploadPreviews(
  elementId: string,
  fileName: string
): Promise<{
  previewUrl: string | null
  thumbnailUrl: string | null
}> {
  try {
    console.log('🎨 Starting preview generation workflow...')
    
    // Generate preview image
    const previewBlob = await generatePreviewImage({
      elementId,
      fileName,
      quality: 0.95,
      scale: 2
    })

    if (!previewBlob) {
      console.error('❌ Failed to generate preview blob')
      return { previewUrl: null, thumbnailUrl: null }
    }

    // Upload preview
    const previewUrl = await uploadPreviewToStorage(
      previewBlob,
      `${fileName}-preview`
    )

    // Generate and upload thumbnail
    const thumbnailBlob = await generateThumbnail(previewBlob, 400, 300)
    let thumbnailUrl: string | null = null
    
    if (thumbnailBlob) {
      thumbnailUrl = await uploadPreviewToStorage(
        thumbnailBlob,
        `${fileName}-thumbnail`
      )
    }

    console.log('🎉 Preview generation complete:', {
      previewUrl,
      thumbnailUrl
    })

    return { previewUrl, thumbnailUrl }
  } catch (error) {
    console.error('❌ Error in preview generation workflow:', error)
    return { previewUrl: null, thumbnailUrl: null }
  }
}
