/**
 * Template Renderer Utilities
 * Helper functions untuk merender teks di atas template menggunakan konfigurasi
 * dari template-configs.ts
 */

import { TemplateConfigManager, ElementConfig } from '@/config/template-configs'
import { CertificateElement } from '@/types/certificate'

export interface RenderOptions {
  templateId: string
  data: Record<string, string>
  customElements?: CertificateElement[]
  overrides?: {
    [elementType: string]: Partial<ElementConfig>
  }
}

export interface RenderedElement {
  id: string
  type: string
  text: string
  x: number
  y: number
  style: {
    fontFamily: string
    fontSize: number
    color: string
    alignment: 'left' | 'center' | 'right'
    fontWeight?: string
    textTransform?: string
    letterSpacing?: number
    lineHeight?: number
  }
  visible: boolean
  maxWidth?: number
  maxHeight?: number
}

export class TemplateRenderer {
  /**
   * Merender elemen-elemen teks berdasarkan konfigurasi template
   */
  static renderElements(options: RenderOptions): RenderedElement[] {
    const config = TemplateConfigManager.getConfig(options.templateId)
    if (!config) {
      throw new Error(`Template configuration not found: ${options.templateId}`)
    }

    const renderedElements: RenderedElement[] = []

    // Render elemen dari konfigurasi template
    Object.entries(config.elements).forEach(([elementType, elementConfig]) => {
      if (!elementConfig) return
      
      // Apply overrides jika ada
      const finalConfig = options.overrides?.[elementType] 
        ? { ...elementConfig, ...options.overrides[elementType] }
        : elementConfig

      if (!finalConfig?.visible) return
      if (!finalConfig.position || !finalConfig.style) return

      const text = options.data[elementType] || finalConfig.placeholder || ''
      
      renderedElements.push({
        id: `${options.templateId}_${elementType}`,
        type: elementType,
        text,
        x: finalConfig.position.x,
        y: finalConfig.position.y,
        style: finalConfig.style,
        visible: finalConfig.visible,
        maxWidth: finalConfig.maxWidth,
        maxHeight: finalConfig.maxHeight
      })
    })

    // Render custom elements jika ada
    if (options.customElements) {
      options.customElements.forEach(element => {
        renderedElements.push({
          id: element.id,
          type: element.type,
          text: element.value || element.label,
          x: element.position.x,
          y: element.position.y,
          style: element.style,
          visible: true
        })
      })
    }

    return renderedElements
  }

  /**
   * Mengkonversi RenderedElement ke format CSS untuk web rendering
   */
  static toCSSStyle(element: RenderedElement): React.CSSProperties {
    return {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      fontFamily: element.style.fontFamily,
      fontSize: `${element.style.fontSize}px`,
      color: element.style.color,
      textAlign: element.style.alignment,
      fontWeight: element.style.fontWeight || 'normal',
      textTransform: (element.style.textTransform as 'none' | 'capitalize' | 'uppercase' | 'lowercase') || 'none',
      letterSpacing: element.style.letterSpacing ? `${element.style.letterSpacing}px` : 'normal',
      lineHeight: element.style.lineHeight || 'normal',
      maxWidth: element.maxWidth ? `${element.maxWidth}px` : 'none',
      maxHeight: element.maxHeight ? `${element.maxHeight}px` : 'none',
      overflow: 'hidden',
      whiteSpace: element.maxWidth ? 'normal' : 'nowrap',
      display: element.visible ? 'block' : 'none',
      transform: element.style.alignment === 'center' ? 'translateX(-50%)' : 'none'
    }
  }

  /**
   * Mengkonversi RenderedElement ke format Canvas untuk PDF generation
   */
  static toCanvasDrawing(
    ctx: CanvasRenderingContext2D,
    element: RenderedElement,
    scaleFactor: number = 1
  ): void {
    if (!element.visible) return

    const x = element.x * scaleFactor
    const y = element.y * scaleFactor
    const fontSize = element.style.fontSize * scaleFactor

    // Set font properties
    const fontWeight = element.style.fontWeight || 'normal'
    const fontFamily = element.style.fontFamily
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.fillStyle = element.style.color
    ctx.textBaseline = 'top'

    // Handle text alignment
    let textAlign: CanvasTextAlign = 'left'
    let adjustedX = x

    switch (element.style.alignment) {
      case 'center':
        textAlign = 'center'
        adjustedX = x
        break
      case 'right':
        textAlign = 'right'
        adjustedX = x
        break
      default:
        textAlign = 'left'
        adjustedX = x
    }

    ctx.textAlign = textAlign

    // Handle text wrapping if maxWidth is specified
    if (element.maxWidth) {
      this.drawWrappedText(
        ctx,
        element.text,
        adjustedX,
        y,
        element.maxWidth * scaleFactor,
        fontSize * (element.style.lineHeight || 1.2)
      )
    } else {
      ctx.fillText(element.text, adjustedX, y)
    }
  }

  /**
   * Helper untuk menggambar teks dengan word wrapping
   */
  private static drawWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): void {
    const words = text.split(' ')
    let line = ''
    let currentY = y

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY)
        line = words[i] + ' '
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }

  /**
   * Memvalidasi data yang diperlukan untuk template
   */
  static validateTemplateData(templateId: string, data: Record<string, string>): {
    valid: boolean
    missingFields: string[]
    warnings: string[]
  } {
    const config = TemplateConfigManager.getConfig(templateId)
    if (!config) {
      return {
        valid: false,
        missingFields: [],
        warnings: [`Template configuration not found: ${templateId}`]
      }
    }

    const missingFields: string[] = []
    const warnings: string[] = []

    // Check required visible elements
    Object.entries(config.elements).forEach(([elementType, elementConfig]) => {
      if (elementConfig && elementConfig.visible && !data[elementType]) {
        missingFields.push(elementType)
      }
    })

    // Check for extra data that won't be used
    Object.keys(data).forEach(key => {
      if (!config.elements[key]) {
        warnings.push(`Data field '${key}' is not used in template '${templateId}'`)
      }
    })

    return {
      valid: missingFields.length === 0,
      missingFields,
      warnings
    }
  }

  /**
   * Mendapatkan preview data untuk template
   */
  static getPreviewData(templateId: string): Record<string, string> {
    const config = TemplateConfigManager.getConfig(templateId)
    if (!config) return {}

    const previewData: Record<string, string> = {}

    Object.entries(config.elements).forEach(([elementType, elementConfig]) => {
      if (elementConfig && elementConfig.visible) {
        previewData[elementType] = elementConfig.placeholder || `Sample ${elementType}`
      }
    })

    return previewData
  }

  /**
   * Mengkalkulasi bounding box untuk semua elemen
   */
  static calculateBoundingBox(elements: RenderedElement[]): {
    minX: number
    minY: number
    maxX: number
    maxY: number
    width: number
    height: number
  } {
    if (elements.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 }
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    elements.forEach(element => {
      if (!element.visible) return

      minX = Math.min(minX, element.x)
      minY = Math.min(minY, element.y)
      
      const elementMaxX = element.x + (element.maxWidth || 200)
      const elementMaxY = element.y + element.style.fontSize
      
      maxX = Math.max(maxX, elementMaxX)
      maxY = Math.max(maxY, elementMaxY)
    })

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    }
  }
}

export default TemplateRenderer
