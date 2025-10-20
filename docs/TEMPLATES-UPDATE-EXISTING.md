# Templates Update - Existing Template Only

## ✅ **SQL SCRIPT UPDATED - HANYA UPDATE TEMPLATE YANG ADA**

Script telah dimodifikasi untuk hanya memperbaiki template yang sudah ada di database, tidak menambah template baru.

## 🛠️ **YANG AKAN DILAKUKAN SQL SCRIPT:**

### **✅ 1. Update Template Existing**
```sql
UPDATE certificate_templates 
SET 
  name = 'Professional Certificate Template',  -- Fix name
  background_url = 'https://via.placeholder.com/1200x850/...',  -- Add image
  thumbnail_url = 'https://via.placeholder.com/400x300/...',    -- Add thumbnail
  preview_url = 'https://via.placeholder.com/800x600/...',      -- Add preview
  orientation = 'landscape',                                    -- Set orientation
  width_px = 1200,                                             -- Set dimensions
  height_px = 850,
  fields = '[...]',                                            -- Add form fields
  layout = '{...}'                                             -- Add layout config
WHERE id = 'd9753f61-dbbb-40e4-8eb5-1109b51190fd';
```

### **✅ 2. Create Categories Table**
```sql
CREATE TABLE IF NOT EXISTS certificate_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert 5 default categories
INSERT INTO certificate_categories (id, name, description) VALUES
('achievement', 'Achievement', 'Certificates for achievements and awards'),
('completion', 'Completion', 'Course and training completion certificates'),
('participation', 'Participation', 'Event and workshop participation certificates'),
('training', 'Training', 'Professional training certificates'),
('general', 'General', 'General purpose certificates');
```

### **✅ 3. Add Category Relationship**
```sql
-- Add category_id column if not exists
ALTER TABLE certificate_templates 
ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES certificate_categories(id);

-- Set existing template to 'general' category
UPDATE certificate_templates 
SET category_id = 'general' 
WHERE category_id IS NULL;
```

### **✅ 4. Verify Results**
```sql
-- Show updated template data
SELECT 
  id,
  name,
  orientation,
  width_px,
  height_px,
  category_id,
  CASE 
    WHEN background_url IS NOT NULL THEN 'Present'
    ELSE 'Missing'
  END as background_url_status,
  created_at
FROM certificate_templates
ORDER BY created_at DESC;
```

## 🎯 **EXPECTED RESULTS:**

### **✅ After Running SQL Script:**
- **1 template** dengan data lengkap
- **Template card** akan muncul dengan image
- **Name**: "Professional Certificate Template" 
- **Orientation**: "landscape"
- **Category**: "General"
- **Images**: background_url, thumbnail_url, preview_url
- **Dimensions**: 1200x850

### **✅ Templates Page Will Show:**
```
┌─────────────────────────────────────┐
│ Professional Certificate Template    │
│ ┌─────────────────────────────────┐ │
│ │     [Certificate Image]         │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ Landscape              General      │
│ [Use This Template]                 │
│ [Edit] [Preview] [Delete]           │
└─────────────────────────────────────┘
```

## 🚀 **LANGKAH EKSEKUSI:**

### **Step 1: Copy SQL Script**
```
Copy semua isi file: /scripts/fix-templates-data.sql
```

### **Step 2: Run di Supabase**
```
1. Buka Supabase Dashboard
2. Go to SQL Editor
3. Paste script
4. Click "Run"
```

### **Step 3: Verify Results**
```
1. Check query results di SQL Editor
2. Refresh /templates page
3. Template card seharusnya muncul
```

## 📊 **SMART UPDATE LOGIC:**

Script menggunakan `COALESCE` dan `CASE` untuk update yang aman:

```sql
-- Hanya update name jika kosong atau timestamp
name = CASE 
  WHEN name IS NULL OR name = '' OR name LIKE '%Template %' 
  THEN 'Professional Certificate Template'
  ELSE name  -- Keep existing name if good
END,

-- Hanya set default jika NULL
orientation = COALESCE(orientation, 'landscape'),
width_px = COALESCE(width_px, 1200),
```

## ✅ **SUMMARY:**

**SQL script akan:**
- ✅ Update 1 template existing dengan data lengkap
- ✅ Create categories table dengan 5 categories
- ✅ Add category relationship
- ✅ Tidak menambah template baru
- ✅ Preserve existing data yang sudah baik

**Result: 1 template card yang proper di Templates page!** 🎯
