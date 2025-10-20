# Certificate Save with Supabase Storage Integration

## ✅ **SAVE BUTTON SUDAH TERINTEGRASI DENGAN SUPABASE STORAGE!**

Button "Save Template" di Certificate Editor sekarang sudah mengarahkan untuk menyimpan file preview ke Supabase Storage, selain menyimpan data ke database.

## 🔧 **FITUR YANG DITAMBAHKAN**

### **✅ 1. Preview Image Generation**
```typescript
// Generate canvas preview dari certificate design
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// Set canvas size berdasarkan orientation
const width = orientation === 'portrait' ? 800 : 1200
const height = orientation === 'portrait' ? 1200 : 800
canvas.width = width
canvas.height = height

// Draw background image
const img = new Image()
img.crossOrigin = 'anonymous'
await new Promise((resolve, reject) => {
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height)
    resolve(true)
  }
  img.src = templateSource.url
})

// Draw text elements
elements.forEach(element => {
  const el = element as any
  ctx.fillStyle = el.color || '#000000'
  ctx.font = `${el.fontSize || 16}px ${el.fontFamily || 'Arial'}`
  ctx.textAlign = (el.textAlign as CanvasTextAlign) || 'left'
  
  const x = (el.x / 100) * width
  const y = (el.y / 100) * height
  
  if (element.type === 'text') {
    ctx.fillText(el.content || el.placeholder || '', x, y)
  }
})
```

### **✅ 2. Supabase Storage Upload**
```typescript
// Convert canvas to blob
const blob = await new Promise<Blob>((resolve) => {
  canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.9)
})

// Upload to Supabase Storage
const fileName = `certificate-preview-${designResult.id}.png`
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('certificates')
  .upload(`previews/${fileName}`, blob, {
    contentType: 'image/png',
    upsert: true
  })

if (!uploadError) {
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('certificates')
    .getPublicUrl(`previews/${fileName}`)
  
  previewUrl = urlData.publicUrl
  
  // Update design record with preview URL
  await supabase
    .from('certificate_designs')
    .update({ preview_url: previewUrl })
    .eq('id', designResult.id)
}
```

## 🗄️ **STORAGE STRUCTURE**

### **✅ Supabase Storage Bucket: `certificates`**
```
certificates/
├── previews/
│   ├── certificate-preview-{design-id-1}.png
│   ├── certificate-preview-{design-id-2}.png
│   └── certificate-preview-{design-id-3}.png
├── generated/
│   ├── {certificate-id}/
│   │   ├── certificate.pdf
│   │   └── preview.png
│   └── ...
└── templates/
    ├── {template-id}/
    │   └── preview.png
    └── ...
```

### **✅ File Naming Convention**
- **Preview Images**: `certificate-preview-{design_id}.png`
- **Generated PDFs**: `{certificate_id}/certificate.pdf`
- **Generated PNGs**: `{certificate_id}/preview.png`
- **Template Previews**: `templates/{template_id}/preview.png`

## 🔄 **SAVE WORKFLOW LENGKAP**

### **✅ 1. Data Validation**
```typescript
if (!user) {
  toast.error('Please login to save templates')
  return
}

if (!templateSource) {
  toast.error('Please select a template first')
  return
}

if (elements.length === 0) {
  toast.error('Please add at least one element')
  return
}
```

### **✅ 2. Save to Database**
```typescript
// Save to certificate_designs table
const designData = {
  user_id: user.id,
  template_source: templateSource.type,
  template_url: templateSource.url,
  template_config_id: templateSource.configId || null,
  elements: elements,
  metadata: {
    templateId: templateId,
    templateName: templateSource.configId ? TemplateConfigManager.getConfig(templateSource.configId)?.name : 'Custom Template',
    orientation: orientation,
    category: selectedCategory || 'general',
    elementCount: elements.length,
    lastModified: new Date().toISOString(),
    version: '1.0.0'
  }
}

const { data: designResult, error: designError } = await supabase
  .from('certificate_designs')
  .insert(designData)
  .select()
  .single()
```

### **✅ 3. Generate & Upload Preview**
```typescript
// Generate canvas preview
// Upload to Supabase Storage
// Update design record with preview URL
```

### **✅ 4. Generate Certificate Identifiers**
```typescript
const { data: identifiers, error: rpcError } = await supabase
  .rpc('next_certificate_identifiers', { 
    y: year, 
    m: month, 
    code_len: 10 
  })
```

### **✅ 5. Create Certificate Entry**
```typescript
const certificateData = {
  certificate_number: identifiers.certificate_number,
  verification_code: identifiers.verification_code,
  template_id: null,
  category_id: selectedCategory || null,
  member_id: null,
  data_json: designData,
  fields_data: {},
  layout: {},
  status: 'draft',
  created_by: user.id,
  issue_date: new Date().toISOString().split('T')[0]
}

const { data: certificateResult, error: certificateError } = await supabase
  .from('certificates')
  .insert(certificateData)
  .select()
  .single()
```

## 🎯 **HASIL SAVE OPERATION**

### **✅ Database Records Created:**
1. **certificate_designs table**:
   - Design data dengan elements
   - Template source information
   - Metadata (orientation, category, etc.)
   - Preview URL (jika upload berhasil)

2. **certificates table**:
   - Certificate number & verification code
   - Category dan status
   - Design data dalam data_json
   - Created by user ID

### **✅ Files Uploaded to Storage:**
1. **Preview Image**: `certificates/previews/certificate-preview-{design_id}.png`
   - PNG format dengan quality 0.9
   - Canvas-generated preview
   - Public URL tersimpan di database

### **✅ Success Messages:**
```
✅ "Certificate template saved successfully!"
✅ Console: "Design saved successfully: {designResult}"
✅ Console: "Preview uploaded successfully: {previewUrl}"
✅ Console: "Certificate created successfully: {certificateResult}"
```

## 🔒 **STORAGE PERMISSIONS**

### **✅ Supabase Storage Bucket Setup:**
```sql
-- Ensure certificates bucket exists with proper permissions
-- Allow authenticated users to upload
-- Allow public read access for preview URLs
```

### **✅ RLS Policies:**
- **certificate_designs**: User dapat CRUD designs mereka sendiri
- **certificates**: User dapat CRUD certificates mereka sendiri
- **Storage**: Authenticated upload, public read untuk previews

## 🚀 **TESTING SAVE FUNCTIONALITY**

### **✅ 1. Test Save Process:**
1. **Open certificate editor**
2. **Select template** dan add elements
3. **Click "Save Template"**
4. **Check console** untuk success messages
5. **Verify database** records created
6. **Check Supabase Storage** untuk preview file

### **✅ 2. Expected Results:**
```
✅ Database: New records in certificate_designs & certificates
✅ Storage: Preview image uploaded to certificates/previews/
✅ UI: Success toast message
✅ Console: All success logs without errors
```

### **✅ 3. Error Handling:**
- **Preview generation fails**: Save continues, no preview URL
- **Storage upload fails**: Save continues, warning logged
- **Database save fails**: Operation stops, error shown
- **RPC function fails**: Operation stops, error shown

## ✅ **IMPLEMENTATION COMPLETE**

**Button "Save Template" sekarang sudah terintegrasi penuh dengan:**

- ✅ **Database Storage**: certificate_designs & certificates tables
- ✅ **File Storage**: Supabase Storage untuk preview images
- ✅ **Preview Generation**: Canvas-based image generation
- ✅ **Error Handling**: Graceful fallbacks untuk setiap step
- ✅ **Public URLs**: Preview images accessible via public URL
- ✅ **Unique Identifiers**: Auto-generated certificate numbers
- ✅ **User Feedback**: Clear success/error messages

**Save functionality sekarang lengkap dengan file storage integration!** 🚀✅
