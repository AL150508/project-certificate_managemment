# Preview Image Generation Implementation

## ✅ **FITUR PREVIEW IMAGE SUDAH DIIMPLEMENTASIKAN!**

Sekarang saat save template, sistem akan otomatis:
1. **Capture** certificate preview sebagai image
2. **Generate** preview (full size) dan thumbnail (400x300)
3. **Upload** ke Supabase Storage
4. **Save** URLs ke database
5. **Display** di halaman Certificates

### **🎯 FITUR YANG DITAMBAHKAN**

#### **✅ 1. Preview Image Generator (`src/lib/preview-generator.ts`):**
```typescript
// Functions:
- generatePreviewImage() - Capture DOM element as image
- uploadPreviewToStorage() - Upload to Supabase Storage
- generateThumbnail() - Create smaller thumbnail version
- generateAndUploadPreviews() - Complete workflow
```

#### **✅ 2. Database Schema Update:**
```sql
-- File: scripts/add-preview-columns.sql
ALTER TABLE certificate_templates 
ADD COLUMN preview_url TEXT,
ADD COLUMN thumbnail_url TEXT;
```

#### **✅ 3. Certificate Editor Integration:**
```typescript
// Saat save template:
STEP 1: Save template metadata
STEP 1.5: Generate & upload preview images  ← NEW!
STEP 2: Save design layout
STEP 3: Success & redirect
```

### **🚀 SETUP INSTRUCTIONS**

#### **✅ STEP 1: Install Dependencies**
```bash
npm install html2canvas
```

#### **✅ STEP 2: Update Database**
```bash
# Run in Supabase SQL Editor:
# scripts/add-preview-columns.sql
```

#### **✅ STEP 3: Verify Supabase Storage**
```bash
# Make sure bucket 'certificate-assets' exists
# Check scripts/setup-supabase-storage.sql
```

### **📊 HOW IT WORKS**

#### **✅ Save Template Flow:**
```
1. User clicks "Save Template"
2. Template metadata saved to database
3. 📸 Capture certificate preview:
   - Uses html2canvas to capture DOM
   - Converts to PNG blob
   - Quality: 95%, Scale: 2x
4. 🖼️ Generate thumbnail:
   - Resize to max 400x300
   - Quality: 80%
5. 📤 Upload to Supabase Storage:
   - Preview: /previews/template-{id}-preview-{timestamp}.png
   - Thumbnail: /previews/template-{id}-thumbnail-{timestamp}.png
6. 💾 Update database:
   - Save preview_url
   - Save thumbnail_url
7. ✅ Complete save process
```

#### **✅ Data Stored:**
```sql
certificate_templates:
- id: UUID
- name: "Professional Certificate"
- background_url: "https://..."
- preview_url: "https://...certificate-assets/previews/..."  ← NEW!
- thumbnail_url: "https://...certificate-assets/previews/..." ← NEW!
- fields: JSONB
- metadata: JSONB
```

### **🎨 DISPLAY IN CERTIFICATES PAGE**

#### **✅ Certificates List akan menampilkan:**
```typescript
// CertificatesClient.tsx
<Image 
  src={template.thumbnail_url || template.preview_url || '/placeholder.png'} 
  alt={template.name}
  width={400}
  height={300}
/>
```

#### **✅ Preview Options:**
```
1. Thumbnail (400x300) - For list view
2. Preview (full size) - For detail view
3. Fallback to placeholder if generation fails
```

### **🔍 CONSOLE OUTPUT**

#### **✅ Successful Preview Generation:**
```
=== STEP 1.5: Generating preview images ===
📸 Generating preview image...
✅ Canvas generated: {width: 1600, height: 1200}
✅ Blob created: {size: 245678, type: "image/png"}
🖼️ Generating thumbnail...
✅ Thumbnail created: {width: 400, height: 300, size: 45678}
📤 Uploading preview to storage...
✅ Upload successful: previews/template-xxx-preview-1234567890.png
✅ Public URL: https://...
📤 Uploading thumbnail to storage...
✅ Upload successful: previews/template-xxx-thumbnail-1234567890.png
✅ Public URL: https://...
🎉 Preview generation complete
✅ Preview URLs saved to database
```

#### **⚠️ If Preview Generation Fails:**
```
⚠️ Preview generation failed, continuing without previews
// Template still saves successfully
// Just no preview images
```

### **📋 TESTING CHECKLIST**

#### **✅ Test Preview Generation:**
- [ ] Run `npm install html2canvas`
- [ ] Run `scripts/add-preview-columns.sql` in Supabase
- [ ] Verify Supabase Storage bucket exists
- [ ] Create new template in editor
- [ ] Add elements (Name, Description, etc)
- [ ] Click "Save Template"
- [ ] Check console for preview generation logs
- [ ] Verify toast: "Generating preview images..."
- [ ] Check Supabase Storage for uploaded images
- [ ] Check database for preview_url and thumbnail_url
- [ ] Go to /certificates page
- [ ] Verify template shows with preview image

### **🗄️ SUPABASE STORAGE STRUCTURE**

#### **✅ Bucket: certificate-assets**
```
certificate-assets/
├── previews/
│   ├── template-{id}-preview-{timestamp}.png   (Full size)
│   ├── template-{id}-thumbnail-{timestamp}.png (400x300)
│   └── ...
├── backgrounds/
│   └── ...
└── certificates/
    └── ...
```

### **⚙️ CONFIGURATION**

#### **✅ Preview Settings:**
```typescript
// In preview-generator.ts
const PREVIEW_QUALITY = 0.95  // 95% quality
const PREVIEW_SCALE = 2       // 2x resolution
const THUMBNAIL_MAX_WIDTH = 400
const THUMBNAIL_MAX_HEIGHT = 300
const THUMBNAIL_QUALITY = 0.8  // 80% quality
```

### **🚨 TROUBLESHOOTING**

#### **❌ 1. "Cannot find module 'html2canvas'"**
```bash
Solution: npm install html2canvas
```

#### **❌ 2. "Element not found"**
```
Problem: certificate-preview-container ID not found
Solution: Verify div wrapper exists in editor page
```

#### **❌ 3. "Upload failed"**
```
Problem: Supabase Storage bucket doesn't exist
Solution: Run scripts/setup-supabase-storage.sql
```

#### **❌ 4. "Permission denied"**
```
Problem: RLS policies blocking upload
Solution: Check storage policies allow authenticated uploads
```

### **🎯 BENEFITS**

#### **✅ User Experience:**
```
✅ Visual preview of templates in list
✅ Easier template selection
✅ Professional appearance
✅ Faster template browsing
```

#### **✅ Technical:**
```
✅ Automatic image generation
✅ Optimized thumbnails
✅ Cloud storage integration
✅ No manual screenshot needed
```

## ✅ **PREVIEW IMAGE GENERATION READY!**

**Fitur yang diimplementasikan:**

- ✅ **Auto-capture** certificate preview saat save
- ✅ **Generate** preview & thumbnail images
- ✅ **Upload** ke Supabase Storage
- ✅ **Save** URLs ke database
- ✅ **Display** di Certificates page

**Jalankan `npm install html2canvas` dan `scripts/add-preview-columns.sql`, lalu test save template!** 🎨✅
