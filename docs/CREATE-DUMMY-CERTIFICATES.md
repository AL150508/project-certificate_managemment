# Create Dummy Certificates

## 🎯 **MEMBUAT 2 DUMMY CERTIFICATES**

Script ini akan membuat 2 dummy certificates lengkap dengan templates, designs, dan data yang akan muncul di halaman `/certificates`.

### **📋 YANG AKAN DIBUAT**

#### **✅ Certificate 1: Professional Achievement**
```
Template: Professional Achievement Certificate
Orientation: Landscape (1200x800)
Recipient: John Doe
Achievement: Outstanding Performance in Web Development
Date: October 20, 2025
Certificate Number: CERT-2025-10-0001
Status: Issued
```

#### **✅ Certificate 2: Excellence Award**
```
Template: Excellence Award Certificate
Orientation: Portrait (800x1200)
Recipient: Jane Smith
Achievement: Excellence in Project Management
Date: October 20, 2025
Location: Jakarta, Indonesia
Certificate Number: CERT-2025-10-0002
Status: Issued
```

### **🚀 CARA MENJALANKAN**

#### **STEP 1: Run SQL Script**
```bash
1. Buka Supabase SQL Editor
2. Copy paste scripts/insert-dummy-certificates.sql
3. Klik RUN
4. Verify success messages
```

#### **STEP 2: Verify di Supabase**
```sql
-- Check certificates created:
SELECT certificate_number, status, issue_date
FROM certificates
ORDER BY created_at DESC
LIMIT 2;

-- Check templates created:
SELECT name, orientation, category_id
FROM certificate_templates
ORDER BY created_at DESC
LIMIT 2;

-- Check designs created:
SELECT template_id, orientation, metadata
FROM certificate_designs
ORDER BY created_at DESC
LIMIT 2;
```

#### **STEP 3: Check di Aplikasi**
```bash
1. Go to /certificates
2. Refresh page
3. Should see 2 certificates:
   - CERT-2025-10-0001 (John Doe)
   - CERT-2025-10-0002 (Jane Smith)
```

### **📊 DATA STRUCTURE**

#### **✅ Tables yang Diisi:**
```
1. certificate_templates (2 records)
   - Professional Achievement Certificate
   - Excellence Award Certificate

2. certificate_designs (2 records)
   - Layout data dengan elements (name, description, date, location)
   - Position dan styling untuk setiap element

3. certificates (2 records)
   - CERT-2025-10-0001
   - CERT-2025-10-0002

4. members (2 records - if not exist)
   - John Doe
   - Jane Smith

5. certificate_categories (1 record - if not exist)
   - Achievement
```

### **🎨 TEMPLATE DETAILS**

#### **Template 1: Professional Achievement**
```json
{
  "name": "Professional Achievement Certificate",
  "orientation": "landscape",
  "width": 1200,
  "height": 800,
  "background": "Gradient blue professional design",
  "elements": [
    {
      "type": "name",
      "text": "John Doe",
      "fontSize": 48,
      "fontFamily": "Poppins",
      "position": {"x": 400, "y": 250}
    },
    {
      "type": "description",
      "text": "For Outstanding Performance in Web Development",
      "fontSize": 24,
      "position": {"x": 400, "y": 350}
    },
    {
      "type": "date",
      "text": "October 20, 2025",
      "fontSize": 18,
      "position": {"x": 400, "y": 500}
    }
  ]
}
```

#### **Template 2: Excellence Award**
```json
{
  "name": "Excellence Award Certificate",
  "orientation": "portrait",
  "width": 800,
  "height": 1200,
  "background": "Elegant gradient design",
  "elements": [
    {
      "type": "name",
      "text": "Jane Smith",
      "fontSize": 42,
      "fontFamily": "Poppins",
      "position": {"x": 300, "y": 400}
    },
    {
      "type": "description",
      "text": "Excellence in Project Management",
      "fontSize": 22,
      "position": {"x": 300, "y": 500}
    },
    {
      "type": "date",
      "text": "October 20, 2025",
      "fontSize": 16,
      "position": {"x": 300, "y": 700}
    },
    {
      "type": "location",
      "text": "Jakarta, Indonesia",
      "fontSize": 14,
      "position": {"x": 300, "y": 750}
    }
  ]
}
```

### **🔍 VERIFICATION QUERIES**

#### **✅ Check All Data:**
```sql
-- Complete certificate info:
SELECT 
  c.certificate_number,
  c.status,
  c.issue_date,
  m.name as member_name,
  m.email as member_email,
  t.name as template_name,
  t.orientation,
  cat.name as category_name,
  c.fields_data
FROM certificates c
LEFT JOIN members m ON c.member_id = m.id
LEFT JOIN certificate_templates t ON c.template_id = t.id
LEFT JOIN certificate_categories cat ON c.category_id = cat.id
WHERE c.certificate_number IN ('CERT-2025-10-0001', 'CERT-2025-10-0002')
ORDER BY c.certificate_number;
```

#### **✅ Check Templates with Designs:**
```sql
SELECT 
  t.name as template_name,
  t.orientation,
  t.width_px,
  t.height_px,
  d.layout_data,
  d.metadata
FROM certificate_templates t
LEFT JOIN certificate_designs d ON t.id = d.template_id
WHERE t.name IN (
  'Professional Achievement Certificate',
  'Excellence Award Certificate'
)
ORDER BY t.created_at DESC;
```

### **🎯 EXPECTED RESULTS**

#### **✅ Di Halaman /certificates:**
```
Certificates List:
┌─────────────────────────────────────────────────┐
│ CERT-2025-10-0001                              │
│ John Doe                                        │
│ Professional Achievement Certificate            │
│ Status: Issued                                  │
│ Date: October 20, 2025                         │
│ Category: Achievement                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CERT-2025-10-0002                              │
│ Jane Smith                                      │
│ Excellence Award Certificate                    │
│ Status: Issued                                  │
│ Date: October 20, 2025                         │
│ Category: Achievement                           │
└─────────────────────────────────────────────────┘
```

#### **✅ Di Supabase Dashboard:**
```
certificate_templates: 2 new rows
certificate_designs: 2 new rows
certificates: 2 new rows
members: 2 rows (or existing)
certificate_categories: 1 row (or existing)
```

### **🚨 TROUBLESHOOTING**

#### **❌ 1. "Duplicate key value"**
```
Problem: Certificates already exist
Solution: Script uses unique certificate numbers
         Run script multiple times will create new certs
```

#### **❌ 2. "Foreign key violation"**
```
Problem: Required tables don't exist
Solution: Run scripts/fix-save-template-errors-v2.sql first
```

#### **❌ 3. "Certificates not showing in /certificates"**
```
Problem: CertificatesClient.tsx not fetching correctly
Solution: 
  - Check browser console for errors
  - Verify data exists in database
  - Refresh page
```

### **🔧 CLEANUP (Optional)**

#### **Delete Dummy Certificates:**
```sql
-- Delete dummy certificates
DELETE FROM certificates 
WHERE certificate_number IN ('CERT-2025-10-0001', 'CERT-2025-10-0002');

-- Delete dummy templates
DELETE FROM certificate_templates 
WHERE name IN (
  'Professional Achievement Certificate',
  'Excellence Award Certificate'
);

-- Note: Designs will be auto-deleted due to CASCADE
```

## ✅ **READY TO CREATE DUMMY CERTIFICATES!**

**Langkah-langkah:**

1. ✅ **Run SQL Script**: `scripts/insert-dummy-certificates.sql` di Supabase
2. ✅ **Verify Database**: Check tables untuk 2 new records
3. ✅ **Check Application**: Go to `/certificates` dan lihat 2 certificates
4. ✅ **Test Functionality**: Click, view, edit certificates

**Jalankan script untuk membuat 2 dummy certificates yang siap ditampilkan!** 🎯✅
