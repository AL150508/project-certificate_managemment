/**
 * React Hook untuk Template Configuration
 * Hook untuk memudahkan penggunaan template configs dalam komponen React
 */

import { useState, useEffect, useMemo } from 'react'
import { TemplateConfig, TemplateConfigManager } from '@/config/template-configs'
import { TemplateRenderer, RenderOptions, RenderedElement } from '@/lib/template-renderer'

export interface UseTemplateConfigOptions {
  templateId?: string
  data?: Record<string, string>
  autoRender?: boolean
}

export interface UseTemplateConfigReturn {
  config: TemplateConfig | null
  isLoading: boolean
  error: string | null
  renderedElements: RenderedElement[]
  previewData: Record<string, string>
  validation: {
    valid: boolean
    missingFields: string[]
    warnings: string[]
  }
  actions: {
    setTemplateId: (id: string) => void
    setData: (data: Record<string, string>) => void
    updateData: (key: string, value: string) => void
    render: (options?: Partial<RenderOptions>) => RenderedElement[]
    reset: () => void
  }
}

export function useTemplateConfig(options: UseTemplateConfigOptions = {}): UseTemplateConfigReturn {
  const [templateId, setTemplateId] = useState<string>(options.templateId || '')
  const [data, setData] = useState<Record<string, string>>(options.data || {})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [renderedElements, setRenderedElements] = useState<RenderedElement[]>([])

  // Get template configuration
  const config = useMemo(() => {
    if (!templateId) return null
    
    try {
      const templateConfig = TemplateConfigManager.getConfig(templateId)
      if (!templateConfig) {
        setError(`Template configuration not found: ${templateId}`)
        return null
      }
      setError(null)
      return templateConfig
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }, [templateId])

  // Get preview data
  const previewData = useMemo(() => {
    if (!templateId) return {}
    return TemplateRenderer.getPreviewData(templateId)
  }, [templateId])

  // Validate template data
  const validation = useMemo(() => {
    if (!templateId || !config) {
      return { valid: false, missingFields: [], warnings: [] }
    }
    return TemplateRenderer.validateTemplateData(templateId, data)
  }, [templateId, config, data])

  // Auto render when data or template changes
  useEffect(() => {
    if (options.autoRender && templateId && config) {
      try {
        setIsLoading(true)
        const elements = TemplateRenderer.renderElements({
          templateId,
          data: Object.keys(data).length > 0 ? data : previewData
        })
        setRenderedElements(elements)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Rendering error')
        setRenderedElements([])
      } finally {
        setIsLoading(false)
      }
    }
  }, [templateId, data, config, options.autoRender, previewData])

  // Actions
  const actions = useMemo(() => ({
    setTemplateId: (id: string) => {
      setTemplateId(id)
      setData({}) // Reset data when template changes
      setRenderedElements([])
      setError(null)
    },

    setData: (newData: Record<string, string>) => {
      setData(newData)
    },

    updateData: (key: string, value: string) => {
      setData(prev => ({ ...prev, [key]: value }))
    },

    render: (renderOptions: Partial<RenderOptions> = {}) => {
      if (!templateId) {
        throw new Error('Template ID is required for rendering')
      }

      try {
        setIsLoading(true)
        const elements = TemplateRenderer.renderElements({
          templateId,
          data: Object.keys(data).length > 0 ? data : previewData,
          ...renderOptions
        })
        setRenderedElements(elements)
        setError(null)
        return elements
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Rendering error'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },

    reset: () => {
      setTemplateId('')
      setData({})
      setRenderedElements([])
      setError(null)
    }
  }), [templateId, data, previewData])

  return {
    config,
    isLoading,
    error,
    renderedElements,
    previewData,
    validation,
    actions
  }
}

// Hook untuk mendapatkan daftar template berdasarkan filter
export interface UseTemplateListOptions {
  category?: string
  orientation?: 'portrait' | 'landscape'
  searchQuery?: string
}

export function useTemplateList(options: UseTemplateListOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const templates = useMemo(() => {
    setIsLoading(true)
    
    let configs = Object.values(TemplateConfigManager.getStats())
    
    // Filter by category
    if (options.category) {
      configs = TemplateConfigManager.getConfigsByCategory(options.category)
    }
    
    // Filter by orientation
    if (options.orientation) {
      const orientationConfigs = TemplateConfigManager.getConfigsByOrientation(options.orientation)
      configs = options.category 
        ? configs.filter(c => orientationConfigs.some(oc => oc.id === c.id))
        : orientationConfigs
    }
    
    // Filter by search query
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase()
      configs = configs.filter(config => 
        config.name.toLowerCase().includes(query) ||
        config.description.toLowerCase().includes(query) ||
        config.category.toLowerCase().includes(query) ||
        (config.metadata.tags && config.metadata.tags.some(tag => 
          tag.toLowerCase().includes(query)
        ))
      )
    }
    
    setIsLoading(false)
    return configs
  }, [options.category, options.orientation, options.searchQuery])

  const categories = useMemo(() => {
    return TemplateConfigManager.getAvailableCategories()
  }, [])

  const stats = useMemo(() => {
    return TemplateConfigManager.getStats()
  }, [])

  return {
    templates,
    categories,
    stats,
    isLoading
  }
}

// Hook untuk template editor
export function useTemplateEditor(initialTemplateId?: string) {
  const {
    config,
    isLoading,
    error,
    renderedElements,
    previewData,
    validation,
    actions
  } = useTemplateConfig({
    templateId: initialTemplateId,
    autoRender: true
  })

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // Track changes
  useEffect(() => {
    setIsDirty(true)
  }, [actions])

  const selectedElement = useMemo(() => {
    return renderedElements.find(el => el.id === selectedElementId) || null
  }, [renderedElements, selectedElementId])

  const editorActions = useMemo(() => ({
    ...actions,
    
    selectElement: (elementId: string | null) => {
      setSelectedElementId(elementId)
    },

    updateElementPosition: (elementId: string, x: number, y: number) => {
      // This would need to be implemented based on your element update logic
      console.log('Update element position:', elementId, x, y)
    },

    updateElementStyle: (elementId: string, styleUpdates: Record<string, unknown>) => {
      // This would need to be implemented based on your element update logic
      console.log('Update element style:', elementId, styleUpdates)
    },

    save: () => {
      // Implement save logic
      setIsDirty(false)
      console.log('Save template configuration')
    },

    export: () => {
      if (!config) return null
      
      return {
        config,
        data: actions.render(),
        timestamp: new Date().toISOString()
      }
    }
  }), [actions, config, selectedElementId])

  return {
    config,
    isLoading,
    error,
    renderedElements,
    previewData,
    validation,
    selectedElement,
    selectedElementId,
    isDirty,
    actions: editorActions
  }
}
