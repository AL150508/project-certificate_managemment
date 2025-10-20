# Template Configurations Guide

Sistem Template Configurations menyediakan cara yang konsisten dan mudah untuk mengatur posisi teks default pada berbagai template sertifikat berbasis gambar.

## 📁 Struktur File

```
src/
├── config/
│   └── template-configs.ts          # Konfigurasi template utama
├── lib/
│   └── template-renderer.ts         # Utilities untuk rendering
├── hooks/
│   └── use-template-config.ts       # React hooks
├── components/
│   └── template/
│       └── TemplatePreview.tsx      # Komponen preview
└── docs/
    └── template-configs-guide.md    # Dokumentasi ini
```

## 🎯 Fitur Utama

### 1. **Konfigurasi Template Terpusat**
- Semua konfigurasi template disimpan dalam satu file
- Mudah untuk menambah, mengubah, atau menghapus template
- Konsistensi di seluruh aplikasi

### 2. **Posisi Teks yang Presisi**
- Koordinat X, Y yang tepat untuk setiap elemen
- Dukungan untuk berbagai orientasi (portrait/landscape)
- Konfigurasi style yang lengkap (font, warna, alignment, dll)

### 3. **Validasi dan Error Handling**
- Validasi konfigurasi template
- Validasi data yang diperlukan
- Error handling yang komprehensif

### 4. **Rendering yang Fleksibel**
- Render untuk web (CSS)
- Render untuk Canvas/PDF
- Dukungan untuk custom elements

## 🚀 Cara Penggunaan

### 1. Menggunakan Template Config Dasar

```typescript
import { TemplateConfigManager } from '@/config/template-configs'

// Mendapatkan konfigurasi template
const config = TemplateConfigManager.getConfig('portrait-achievement')

// Mendapatkan template berdasarkan kategori
const trainingTemplates = TemplateConfigManager.getConfigsByCategory('training')

// Mendapatkan template berdasarkan orientasi
const landscapeTemplates = TemplateConfigManager.getConfigsByOrientation('landscape')
```

### 2. Menggunakan Template Renderer

```typescript
import { TemplateRenderer } from '@/lib/template-renderer'

// Data untuk dirender
const certificateData = {
  name: 'John Doe',
  description: 'Telah menyelesaikan pelatihan React Advanced',
  date: '20 Oktober 2025',
  number: 'CERT-001',
  expired: '20/10/2028'
}

// Render elemen
const renderedElements = TemplateRenderer.renderElements({
  templateId: 'landscape-training',
  data: certificateData
})

// Validasi data
const validation = TemplateRenderer.validateTemplateData(
  'landscape-training',
  certificateData
)

if (!validation.valid) {
  console.log('Missing fields:', validation.missingFields)
}
```

### 3. Menggunakan React Hook

```typescript
import { useTemplateConfig } from '@/hooks/use-template-config'

function CertificateEditor() {
  const {
    config,
    renderedElements,
    validation,
    actions
  } = useTemplateConfig({
    templateId: 'portrait-achievement',
    autoRender: true
  })

  const handleDataUpdate = (field: string, value: string) => {
    actions.updateData(field, value)
  }

  return (
    <div>
      {config && (
        <div>
          <h2>{config.name}</h2>
          <p>{config.description}</p>
          
          {/* Form inputs */}
          <input
            placeholder="Name"
            onChange={(e) => handleDataUpdate('name', e.target.value)}
          />
          
          {/* Rendered elements */}
          {renderedElements.map(element => (
            <div key={element.id} style={TemplateRenderer.toCSSStyle(element)}>
              {element.text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 4. Menggunakan Template Preview Component

```typescript
import { TemplatePreview } from '@/components/template/TemplatePreview'

function CertificatePreview() {
  const certificateData = {
    name: 'Jane Smith',
    description: 'Certificate of Completion',
    date: '20 Oktober 2025'
  }

  return (
    <TemplatePreview
      templateId="portrait-participation"
      data={certificateData}
      showControls={true}
      onEdit={() => console.log('Edit template')}
      onDownload={() => console.log('Download certificate')}
    />
  )
}
```

## 📝 Menambah Template Baru

### 1. Definisikan Konfigurasi Template

```typescript
// Tambahkan ke TEMPLATE_CONFIGS di template-configs.ts
'custom-template': {
  id: 'custom-template',
  name: 'Custom Certificate Template',
  description: 'Template kustom untuk sertifikat khusus',
  dimensions: { width: 1123, height: 794 },
  orientation: 'landscape',
  category: 'custom',
  elements: {
    name: {
      position: { x: 561, y: 300 },
      style: {
        fontFamily: 'Inter',
        fontSize: 28,
        color: '#1a1a1a',
        alignment: 'center',
        fontWeight: 'bold'
      },
      visible: true,
      placeholder: 'Nama Penerima'
    },
    // ... elemen lainnya
  },
  metadata: {
    createdAt: '2025-10-20T00:00:00Z',
    updatedAt: '2025-10-20T00:00:00Z',
    version: '1.0.0',
    author: 'Your Name',
    tags: ['custom', 'landscape']
  }
}
```

### 2. Test Konfigurasi

```typescript
// Validasi konfigurasi
const validation = TemplateConfigManager.validateConfig(customTemplate)
if (!validation.valid) {
  console.error('Template validation errors:', validation.errors)
}

// Test rendering
const previewData = TemplateRenderer.getPreviewData('custom-template')
const elements = TemplateRenderer.renderElements({
  templateId: 'custom-template',
  data: previewData
})
```

## 🎨 Kustomisasi Style

### Font Families yang Didukung
- Inter (default)
- Poppins
- Roboto
- Arial
- Helvetica
- Times New Roman

### Text Alignment Options
- `left`: Rata kiri
- `center`: Rata tengah
- `right`: Rata kanan

### Font Weight Options
- `normal` atau `400`
- `bold` atau `700`
- `100` - `900` (numeric values)

### Text Transform Options
- `none`: Tidak ada transformasi
- `uppercase`: HURUF BESAR
- `lowercase`: huruf kecil
- `capitalize`: Huruf Pertama Besar

## 🔧 Advanced Usage

### Custom Element Overrides

```typescript
const customElements = [
  {
    id: 'custom-signature',
    type: 'signature',
    label: 'Signature',
    value: 'Digital Signature',
    position: { x: 800, y: 600 },
    style: {
      fontFamily: 'Times New Roman',
      fontSize: 14,
      color: '#333333',
      alignment: 'right'
    }
  }
]

const elements = TemplateRenderer.renderElements({
  templateId: 'landscape-training',
  data: certificateData,
  customElements
})
```

### Style Overrides

```typescript
const styleOverrides = {
  name: {
    style: {
      fontSize: 36,
      color: '#ff0000',
      fontWeight: 'bold'
    }
  }
}

const elements = TemplateRenderer.renderElements({
  templateId: 'portrait-achievement',
  data: certificateData,
  overrides: styleOverrides
})
```

### Canvas Rendering untuk PDF

```typescript
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// Set canvas size
canvas.width = config.dimensions.width
canvas.height = config.dimensions.height

// Render background image first
const img = new Image()
img.onload = () => {
  ctx.drawImage(img, 0, 0)
  
  // Render text elements
  renderedElements.forEach(element => {
    TemplateRenderer.toCanvasDrawing(ctx, element, 1)
  })
  
  // Convert to PDF or download
  const dataURL = canvas.toDataURL('image/png')
  // ... PDF generation logic
}
img.src = templateImageUrl
```

## 📊 Template Statistics

```typescript
const stats = TemplateConfigManager.getStats()
console.log('Total templates:', stats.total)
console.log('By orientation:', stats.byOrientation)
console.log('By category:', stats.byCategory)

const categories = TemplateConfigManager.getAvailableCategories()
console.log('Available categories:', categories)
```

## 🐛 Debugging dan Troubleshooting

### Common Issues

1. **Template not found**
   ```typescript
   const config = TemplateConfigManager.getConfig('invalid-id')
   // Returns null, check template ID
   ```

2. **Missing required fields**
   ```typescript
   const validation = TemplateRenderer.validateTemplateData(templateId, data)
   if (!validation.valid) {
     console.log('Missing:', validation.missingFields)
   }
   ```

3. **Rendering errors**
   ```typescript
   try {
     const elements = TemplateRenderer.renderElements(options)
   } catch (error) {
     console.error('Rendering failed:', error.message)
   }
   ```

### Debug Mode

```typescript
// Enable debug logging
const elements = TemplateRenderer.renderElements({
  templateId: 'portrait-achievement',
  data: certificateData
})

// Calculate bounding box for layout debugging
const boundingBox = TemplateRenderer.calculateBoundingBox(elements)
console.log('Content bounds:', boundingBox)
```

## 🔄 Migration dari Sistem Lama

Jika Anda memiliki sistem template yang sudah ada, berikut cara migrasi:

1. **Identifikasi template yang ada**
2. **Mapping posisi elemen**
3. **Konversi ke format baru**
4. **Testing dan validasi**
5. **Update komponen yang menggunakan template**

## 📚 Best Practices

1. **Konsistensi Naming**: Gunakan naming convention yang konsisten untuk template ID
2. **Dokumentasi**: Selalu tambahkan description dan metadata yang jelas
3. **Testing**: Test setiap template dengan berbagai data
4. **Version Control**: Gunakan versioning untuk tracking perubahan
5. **Performance**: Gunakan lazy loading untuk template yang besar
6. **Accessibility**: Pastikan kontras warna yang cukup untuk readability

## 🤝 Contributing

Untuk menambah template baru atau memperbaiki yang ada:

1. Fork repository
2. Buat branch baru untuk template
3. Tambahkan konfigurasi di `template-configs.ts`
4. Test dengan `TemplatePreview` component
5. Update dokumentasi jika perlu
6. Submit pull request

---

**Happy templating! 🎨**
