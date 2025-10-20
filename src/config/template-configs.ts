/**
 * Template Configurations
 * Menyediakan konfigurasi posisi teks default untuk berbagai template sertifikat
 * berbasis gambar sehingga proses render teks di atas template dapat konsisten
 * dan mudah disesuaikan.
 */

export interface TextPosition {
  x: number
  y: number
}

export interface TextStyle {
  fontFamily: string
  fontSize: number
  color: string
  alignment: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  letterSpacing?: number
  lineHeight?: number
}

export interface ElementConfig {
  position: TextPosition
  style: TextStyle
  maxWidth?: number
  maxHeight?: number
  visible: boolean
  placeholder?: string
}

export interface TemplateConfig {
  id: string
  name: string
  description: string
  dimensions: {
    width: number
    height: number
  }
  orientation: 'portrait' | 'landscape'
  category: string
  elements: {
    name?: ElementConfig
    description?: ElementConfig
    date?: ElementConfig
    number?: ElementConfig
    tanggal?: ElementConfig
    location?: ElementConfig
    expired?: ElementConfig // Keep for backward compatibility
    [key: string]: ElementConfig | undefined // Allow custom elements
  }
  metadata: {
    createdAt: string
    updatedAt: string
    version: string
    author?: string
    tags?: string[]
    backgroundImage?: string
  }
}

// Default text styles untuk berbagai jenis elemen
export const DEFAULT_TEXT_STYLES: Record<string, TextStyle> = {
  name: {
    fontFamily: 'Inter',
    fontSize: 32,
    color: '#1a1a1a',
    alignment: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#4a4a4a',
    alignment: 'center',
    fontWeight: 'normal',
    lineHeight: 1.5
  },
  date: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#666666',
    alignment: 'center',
    fontWeight: 'normal'
  },
  number: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#888888',
    alignment: 'left',
    fontWeight: 'normal'
  },
  expired: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#888888',
    alignment: 'right',
    fontWeight: 'normal'
  },
  tanggal: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#666666',
    alignment: 'center',
    fontWeight: 'normal'
  },
  location: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#666666',
    alignment: 'center',
    fontWeight: 'normal'
  }
}

// Template configurations untuk berbagai jenis sertifikat
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  // Template Portrait - Achievement Certificate
  'portrait-achievement': {
    id: 'portrait-achievement',
    name: 'Achievement Certificate (Portrait)',
    description: 'Template sertifikat pencapaian dalam orientasi portrait',
    dimensions: { width: 794, height: 1123 }, // A4 Portrait
    orientation: 'portrait',
    category: 'achievement',
    elements: {
      name: {
        position: { x: 397, y: 450 },
        style: { ...DEFAULT_TEXT_STYLES.name, fontSize: 36 },
        maxWidth: 600,
        visible: true,
        placeholder: 'Nama Penerima'
      },
      description: {
        position: { x: 397, y: 520 },
        style: { ...DEFAULT_TEXT_STYLES.description, fontSize: 18 },
        maxWidth: 650,
        maxHeight: 100,
        visible: true,
        placeholder: 'Deskripsi pencapaian atau prestasi'
      },
      date: {
        position: { x: 200, y: 950 },
        style: { ...DEFAULT_TEXT_STYLES.date },
        visible: true,
        placeholder: '19 Oktober 2025'
      },
      number: {
        position: { x: 50, y: 50 },
        style: { ...DEFAULT_TEXT_STYLES.number },
        visible: true,
        placeholder: 'SR-001'
      },
      tanggal: {
        position: { x: 600, y: 950 },
        style: { ...DEFAULT_TEXT_STYLES.tanggal },
        visible: true,
        placeholder: '20 October 2026'
      },
      location: {
        position: { x: 397, y: 1000 },
        style: { ...DEFAULT_TEXT_STYLES.location },
        visible: true,
        placeholder: 'Jakarta, Indonesia'
      }
    },
    metadata: {
      createdAt: '2025-10-20T00:00:00Z',
      updatedAt: '2025-10-20T00:00:00Z',
      version: '1.0.0',
      author: 'Certificate Manager',
      tags: ['achievement', 'portrait', 'formal']
    }
  },

  // Template Landscape - Training Certificate
  'landscape-training': {
    id: 'landscape-training',
    name: 'Training Certificate (Landscape)',
    description: 'Template sertifikat pelatihan dalam orientasi landscape',
    dimensions: { width: 1123, height: 794 }, // A4 Landscape
    orientation: 'landscape',
    category: 'training',
    elements: {
      name: {
        position: { x: 561, y: 300 },
        style: { ...DEFAULT_TEXT_STYLES.name, fontSize: 28 },
        maxWidth: 700,
        visible: true,
        placeholder: 'Nama Peserta'
      },
      description: {
        position: { x: 561, y: 360 },
        style: { ...DEFAULT_TEXT_STYLES.description, fontSize: 16 },
        maxWidth: 800,
        maxHeight: 80,
        visible: true,
        placeholder: 'Telah menyelesaikan pelatihan'
      },
      date: {
        position: { x: 200, y: 700 },
        style: { ...DEFAULT_TEXT_STYLES.date },
        visible: true,
        placeholder: '19 Oktober 2025'
      },
      number: {
        position: { x: 50, y: 50 },
        style: { ...DEFAULT_TEXT_STYLES.number },
        visible: true,
        placeholder: 'TR-001'
      },
      expired: {
        position: { x: 1073, y: 744 },
        style: { ...DEFAULT_TEXT_STYLES.expired },
        visible: true,
        placeholder: '19/10/2028'
      }
    },
    metadata: {
      createdAt: '2025-10-20T00:00:00Z',
      updatedAt: '2025-10-20T00:00:00Z',
      version: '1.0.0',
      author: 'Certificate Manager',
      tags: ['training', 'landscape', 'professional'],
      backgroundImage: 'sample-template.svg'
    }
  },

  // Template Portrait - Participation Certificate
  'portrait-participation': {
    id: 'portrait-participation',
    name: 'Participation Certificate (Portrait)',
    description: 'Template sertifikat partisipasi dalam orientasi portrait',
    dimensions: { width: 794, height: 1123 },
    orientation: 'portrait',
    category: 'participation',
    elements: {
      name: {
        position: { x: 397, y: 480 },
        style: { ...DEFAULT_TEXT_STYLES.name, fontSize: 32, fontWeight: '600' },
        maxWidth: 550,
        visible: true,
        placeholder: 'Nama Partisipan'
      },
      description: {
        position: { x: 397, y: 550 },
        style: { ...DEFAULT_TEXT_STYLES.description, fontSize: 16 },
        maxWidth: 600,
        maxHeight: 120,
        visible: true,
        placeholder: 'Telah berpartisipasi dalam kegiatan'
      },
      date: {
        position: { x: 397, y: 900 },
        style: { ...DEFAULT_TEXT_STYLES.date, alignment: 'center' },
        visible: true,
        placeholder: '19 Oktober 2025'
      },
      number: {
        position: { x: 50, y: 1073 },
        style: { ...DEFAULT_TEXT_STYLES.number },
        visible: true,
        placeholder: 'PT-001'
      },
      expired: {
        position: { x: 744, y: 50 },
        style: { ...DEFAULT_TEXT_STYLES.expired },
        visible: false,
        placeholder: '19/10/2028'
      }
    },
    metadata: {
      createdAt: '2025-10-20T00:00:00Z',
      updatedAt: '2025-10-20T00:00:00Z',
      version: '1.0.0',
      author: 'Certificate Manager',
      tags: ['participation', 'portrait', 'event']
    }
  },

  // Template Landscape - Completion Certificate
  'landscape-completion': {
    id: 'landscape-completion',
    name: 'Completion Certificate (Landscape)',
    description: 'Template sertifikat penyelesaian dalam orientasi landscape',
    dimensions: { width: 1123, height: 794 },
    orientation: 'landscape',
    category: 'completion',
    elements: {
      name: {
        position: { x: 561, y: 280 },
        style: { ...DEFAULT_TEXT_STYLES.name, fontSize: 30, color: '#2c3e50' },
        maxWidth: 650,
        visible: true,
        placeholder: 'Nama Peserta'
      },
      description: {
        position: { x: 561, y: 340 },
        style: { ...DEFAULT_TEXT_STYLES.description, fontSize: 17 },
        maxWidth: 750,
        maxHeight: 100,
        visible: true,
        placeholder: 'Telah berhasil menyelesaikan program'
      },
      date: {
        position: { x: 300, y: 650 },
        style: { ...DEFAULT_TEXT_STYLES.date, fontSize: 15 },
        visible: true,
        placeholder: '19 Oktober 2025'
      },
      number: {
        position: { x: 50, y: 744 },
        style: { ...DEFAULT_TEXT_STYLES.number, fontSize: 11 },
        visible: true,
        placeholder: 'CP-001'
      },
      expired: {
        position: { x: 900, y: 650 },
        style: { ...DEFAULT_TEXT_STYLES.expired, fontSize: 13 },
        visible: true,
        placeholder: 'Berlaku hingga: 19/10/2028'
      }
    },
    metadata: {
      createdAt: '2025-10-20T00:00:00Z',
      updatedAt: '2025-10-20T00:00:00Z',
      version: '1.0.0',
      author: 'Certificate Manager',
      tags: ['completion', 'landscape', 'course']
    }
  },

  // Template Red Award Certificate
  'template-red-award': {
    id: 'template-red-award',
    name: 'Red Award Certificate',
    description: 'Template sertifikat award dengan desain merah dan emas',
    dimensions: { width: 1024, height: 768 }, // Landscape
    orientation: 'landscape',
    category: 'award',
    elements: {
      name: {
        position: { x: 512, y: 200 }, // Center x, adjusted y for name line
        style: { 
          ...DEFAULT_TEXT_STYLES.name, 
          fontSize: 28, 
          color: '#1a1a1a',
          fontWeight: 'bold',
          alignment: 'center'
        },
        maxWidth: 600,
        visible: true,
        placeholder: 'Nama Penerima'
      },
      description: {
        position: { x: 512, y: 270 }, // Below name
        style: { 
          ...DEFAULT_TEXT_STYLES.description, 
          fontSize: 26, 
          color: '#1a1a1a',
          alignment: 'center',
          fontWeight: '500'
        },
        maxWidth: 700,
        maxHeight: 80,
        visible: true,
        placeholder: 'Pencapaian atau prestasi yang diraih'
      },
      date: {
        position: { x: 200, y: 360 }, // Left side for signature area
        style: { 
          ...DEFAULT_TEXT_STYLES.date, 
          fontSize: 18, 
          alignment: 'center',
          color: '#333333'
        },
        visible: true,
        placeholder: '19 Oktober 2025'
      },
      number: {
        position: { x: 824, y: 360 }, // Right side for signature area
        style: { 
          ...DEFAULT_TEXT_STYLES.number, 
          fontSize: 18, 
          alignment: 'center',
          color: '#333333'
        },
        visible: true,
        placeholder: 'AWD-001'
      },
      expired: {
        position: { x: 974, y: 50 },
        style: { ...DEFAULT_TEXT_STYLES.expired, fontSize: 12 },
        visible: false,
        placeholder: '19/10/2028'
      }
    },
    metadata: {
      createdAt: '2025-10-20T00:00:00Z',
      updatedAt: '2025-10-20T00:00:00Z',
      version: '1.0.0',
      author: 'Certificate Manager',
      tags: ['award', 'landscape', 'red', 'formal'],
      backgroundImage: 'Certificate-Template-Word-4-1.jpg'
    }
  },

  // Template Gold Award Certificate
  'template-gold-award': {
    id: 'template-gold-award',
    name: 'Gold Award Certificate',
    description: 'Template sertifikat award dengan desain emas klasik',
    dimensions: { width: 1024, height: 768 }, // Landscape
    orientation: 'landscape',
    category: 'award',
    elements: {
      name: {
        position: { x: 512, y: 170 }, // Center x, name position
        style: { 
          ...DEFAULT_TEXT_STYLES.name, 
          fontSize: 28, 
          color: '#1a1a1a',
          fontWeight: 'bold',
          alignment: 'center'
        },
        maxWidth: 600,
        visible: true,
        placeholder: 'Nama Penerima'
      },
      description: {
        position: { x: 512, y: 250 }, // Below name
        style: { 
          ...DEFAULT_TEXT_STYLES.description, 
          fontSize: 26, 
          color: '#1a1a1a',
          alignment: 'center',
          fontWeight: '500'
        },
        maxWidth: 700,
        maxHeight: 80,
        visible: true,
        placeholder: 'Pencapaian atau prestasi yang diraih'
      },
      date: {
        position: { x: 665, y: 330 }, // Right side for date
        style: { 
          ...DEFAULT_TEXT_STYLES.date, 
          fontSize: 18, 
          alignment: 'center',
          color: '#333333'
        },
        visible: true,
        placeholder: '19 Oktober 2025'
      },
      number: {
        position: { x: 358, y: 330 }, // Left side for signature
        style: { 
          ...DEFAULT_TEXT_STYLES.number, 
          fontSize: 18, 
          alignment: 'center',
          color: '#333333'
        },
        visible: true,
        placeholder: 'Signature'
      },
      expired: {
        position: { x: 974, y: 50 },
        style: { ...DEFAULT_TEXT_STYLES.expired, fontSize: 12 },
        visible: false,
        placeholder: '19/10/2028'
      }
    },
    metadata: {
      createdAt: '2025-10-20T00:00:00Z',
      updatedAt: '2025-10-20T00:00:00Z',
      version: '1.0.0',
      author: 'Certificate Manager',
      tags: ['award', 'landscape', 'gold', 'classic'],
      backgroundImage: 'Blank-Award-Certificate.jpg'
    }
  },

  // Template Black Gold Award Certificate
  'template-black-gold-award': {
    id: 'template-black-gold-award',
    name: 'Black Gold Award Certificate',
    description: 'Template sertifikat award dengan desain hitam emas elegan',
    dimensions: { width: 794, height: 1123 }, // Portrait
    orientation: 'portrait',
    category: 'award',
    elements: {
      name: {
        position: { x: 397, y: 260 }, // Center x, name position
        style: { 
          ...DEFAULT_TEXT_STYLES.name, 
          fontSize: 28, 
          color: '#1a1a1a',
          fontWeight: 'bold',
          alignment: 'center'
        },
        maxWidth: 600,
        visible: true,
        placeholder: 'Nama Penerima'
      },
      description: {
        position: { x: 397, y: 370 }, // Below name
        style: { 
          ...DEFAULT_TEXT_STYLES.description, 
          fontSize: 26, 
          color: '#1a1a1a',
          alignment: 'center',
          fontWeight: '500'
        },
        maxWidth: 650,
        maxHeight: 100,
        visible: true,
        placeholder: 'Pencapaian atau prestasi yang diraih'
      },
      date: {
        position: { x: 238, y: 505 }, // Left side for signature
        style: { 
          ...DEFAULT_TEXT_STYLES.date, 
          fontSize: 18, 
          alignment: 'center',
          color: '#333333'
        },
        visible: true,
        placeholder: 'Signature'
      },
      number: {
        position: { x: 556, y: 505 }, // Right side for date
        style: { 
          ...DEFAULT_TEXT_STYLES.number, 
          fontSize: 18, 
          alignment: 'center',
          color: '#333333'
        },
        visible: true,
        placeholder: 'Date'
      },
      expired: {
        position: { x: 744, y: 50 },
        style: { ...DEFAULT_TEXT_STYLES.expired, fontSize: 12 },
        visible: false,
        placeholder: '19/10/2028'
      }
    },
    metadata: {
      createdAt: '2025-10-20T00:00:00Z',
      updatedAt: '2025-10-20T00:00:00Z',
      version: '1.0.0',
      author: 'Certificate Manager',
      tags: ['award', 'portrait', 'black', 'gold', 'elegant'],
      backgroundImage: 'OIP (1).webp'
    }
  }
}

// Utility functions untuk bekerja dengan template configs
export class TemplateConfigManager {
  /**
   * Mendapatkan konfigurasi template berdasarkan ID
   */
  static getConfig(templateId: string): TemplateConfig | null {
    return TEMPLATE_CONFIGS[templateId] || null
  }

  /**
   * Mendapatkan semua template berdasarkan kategori
   */
  static getConfigsByCategory(category: string): TemplateConfig[] {
    return Object.values(TEMPLATE_CONFIGS).filter(config => config.category === category)
  }

  /**
   * Mendapatkan semua template berdasarkan orientasi
   */
  static getConfigsByOrientation(orientation: 'portrait' | 'landscape'): TemplateConfig[] {
    return Object.values(TEMPLATE_CONFIGS).filter(config => config.orientation === orientation)
  }

  /**
   * Membuat konfigurasi elemen baru dengan posisi custom
   */
  static createElementConfig(
    elementType: string,
    position: TextPosition,
    styleOverrides?: Partial<TextStyle>
  ): ElementConfig {
    const defaultStyle = DEFAULT_TEXT_STYLES[elementType] || DEFAULT_TEXT_STYLES.description
    
    return {
      position,
      style: { ...defaultStyle, ...styleOverrides },
      visible: true,
      placeholder: `${elementType} placeholder`
    }
  }

  /**
   * Memvalidasi konfigurasi template
   */
  static validateConfig(config: TemplateConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!config.id || config.id.trim() === '') {
      errors.push('Template ID is required')
    }

    if (!config.name || config.name.trim() === '') {
      errors.push('Template name is required')
    }

    if (!config.dimensions || config.dimensions.width <= 0 || config.dimensions.height <= 0) {
      errors.push('Valid dimensions are required')
    }

    if (!['portrait', 'landscape'].includes(config.orientation)) {
      errors.push('Orientation must be either portrait or landscape')
    }

    // Validate required elements
    const requiredElements = ['name', 'description', 'date', 'number']
    for (const element of requiredElements) {
      if (!config.elements[element]) {
        errors.push(`Required element '${element}' is missing`)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Mengkonversi konfigurasi template ke format yang kompatibel dengan editor
   */
  static toEditorFormat(config: TemplateConfig) {
    return {
      templateId: config.id,
      templateName: config.name,
      dimensions: config.dimensions,
      orientation: config.orientation,
      elements: Object.entries(config.elements).map(([type, elementConfig]) => ({
        id: `${config.id}_${type}`,
        type: type as any,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: elementConfig.placeholder || '',
        position: elementConfig.position,
        style: elementConfig.style,
        visible: elementConfig.visible
      }))
    }
  }

  /**
   * Mendapatkan daftar semua kategori yang tersedia
   */
  static getAvailableCategories(): string[] {
    const categories = new Set(Object.values(TEMPLATE_CONFIGS).map(config => config.category))
    return Array.from(categories).sort()
  }

  /**
   * Mendapatkan statistik template
   */
  static getStats() {
    const configs = Object.values(TEMPLATE_CONFIGS)
    return {
      total: configs.length,
      byOrientation: {
        portrait: configs.filter(c => c.orientation === 'portrait').length,
        landscape: configs.filter(c => c.orientation === 'landscape').length
      },
      byCategory: configs.reduce((acc, config) => {
        acc[config.category] = (acc[config.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }
}

// Export semua konfigurasi dan utilities
export default TEMPLATE_CONFIGS
