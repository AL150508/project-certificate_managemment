# ✅ VERIFIKASI: Data Masuk ke 3 Tabel

## 📋 RINGKASAN

Saat klik "Save Template", data akan masuk ke **3 tabel**:
1. ✅ `certificate_templates` - Template info
2. ✅ `certificate_designs` - Design layout
3. ✅ `certificates` - Certificate record

---

## 🔍 KODE SUDAH BENAR

### **STEP 1: Save to certificate_templates**

**Line 331-335:**
```typescript
const { data: templateResult, error: templateError } = await supabase
  .from('certificate_templates')
  .insert(templateData)
  .select()
  .single()
```

**Data yang disimpan:**
```json
{
  "name": "Default Landscape",
  "orientation": "landscape",
  "width_px": 1200,
  "height_px": 800,
  "background_url": "https://...",
  "template_source": "config",
  "template_url": "https://...",
  "template_config_id": "default-landscape",
  "category_id": "uuid-category",
  "created_by": "uuid-user",
  "fields": [...],
  "metadata": {...}
}
```

---

### **STEP 2: Save to certificate_designs**

**Line 412-416:**
```typescript
const { data: designResult, error: designError } = await supabase
  .from('certificate_designs')
  .insert(designData)
  .select()
  .single()
```

**Data yang disimpan:**
```json
{
  "template_id": "uuid-from-step-1",
  "layout_data": [
    {
      "id": "element_123",
      "type": "text",
      "label": "Title",
      "value": "Sample Title",
      "position": { "x": 100, "y": 100 },
      "style": { "fontSize": 24, "color": "#000000" },
      "visible": true
    }
  ],
  "orientation": "landscape",
  "member_id": "uuid-user",
  "metadata": {
    "templateName": "Default Landscape",
    "elementCount": 5,
    "lastModified": "2025-10-22T10:00:00Z",
    "createdBy": "admin@test.com",
    "selectedMemberId": "uuid-member",
    "selectedMemberName": "John Doe"
  }
}
```

---

### **STEP 3: Save to certificates**

**Line 491-495:**
```typescript
const { data: certResult, error: certError } = await supabase
  .from('certificates')
  .insert(certificateData)
  .select()
  .single()
```

**Data yang disimpan:**
```json
{
  "certificate_number": "CERT-2025-10-1234",
  "template_id": "uuid-from-step-1",
  "member_id": "uuid-member",
  "category_id": "uuid-category",
  "recipient_name": "John Doe",
  "issue_date": "2025-10-22",
  "status": "issued",
  "created_by": "uuid-user",
  "certificate_data": {
    "elements": [...],
    "orientation": "landscape",
    "templateSource": {...}
  },
  "metadata": {
    "source": "editor",
    "templateName": "Default Landscape",
    "designId": "uuid-from-step-2",
    "memberName": "John Doe"
  }
}
```

---

## 🧪 CARA VERIFIKASI

### **Method 1: Check Console Logs**

**Saat klik "Save Template", console harus show:**

```
=== SAVE TEMPLATE BUTTON CLICKED ===
✅ Validation passed, starting save process...
🔐 Checking user authentication...
✅ User authenticated: admin@test.com

=== STEP 1: Saving to certificate_templates ===
Template data: { name: "...", orientation: "...", ... }
Template saved successfully: { id: "uuid-1", name: "..." }
=== STEP 1 COMPLETED ===

=== STEP 2: Saving to certificate_designs ===
Design data: { template_id: "uuid-1", layout_data: [...], ... }
Design saved successfully: { id: "uuid-2", template_id: "uuid-1" }
=== STEP 2 COMPLETED ===

=== STEP 3: Saving to certificates table ===
Certificate data: { certificate_number: "CERT-...", template_id: "uuid-1", ... }
✅ Certificate saved to main table: { id: "uuid-3", certificate_number: "CERT-..." }
=== STEP 3 COMPLETED ===

=== SAVE COMPLETED SUCCESSFULLY ===
✅ Certificate saved and ready to view in /certificates
```

**Jika ada 3 "COMPLETED" = DATA MASUK KE 3 TABEL! ✅**

---

### **Method 2: Check Database Directly**

**Buka Supabase Dashboard → SQL Editor:**

#### **Check certificate_templates:**
```sql
SELECT 
  id,
  name,
  orientation,
  category_id,
  created_by,
  created_at,
  metadata
FROM certificate_templates
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
id: uuid-1
name: Default Landscape
orientation: landscape
category_id: uuid-category
created_by: uuid-user
created_at: 2025-10-22 10:00:00
metadata: { templateId: "...", elementCount: 5, ... }
```

---

#### **Check certificate_designs:**
```sql
SELECT 
  id,
  template_id,
  orientation,
  member_id,
  created_at,
  metadata
FROM certificate_designs
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
id: uuid-2
template_id: uuid-1  ← Link to certificate_templates
orientation: landscape
member_id: uuid-user
created_at: 2025-10-22 10:00:00
metadata: { templateName: "...", elementCount: 5, ... }
```

---

#### **Check certificates:**
```sql
SELECT 
  id,
  certificate_number,
  template_id,
  recipient_name,
  status,
  created_at,
  metadata
FROM certificates
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
id: uuid-3
certificate_number: CERT-2025-10-1234
template_id: uuid-1  ← Link to certificate_templates
recipient_name: John Doe
status: issued
created_at: 2025-10-22 10:00:00
metadata: { source: "editor", designId: "uuid-2", ... }
```

---

#### **Check Relationships:**
```sql
-- Verify all 3 records are linked
SELECT 
  c.certificate_number,
  c.recipient_name,
  c.status,
  t.name as template_name,
  d.id as design_id,
  c.metadata->>'designId' as metadata_design_id
FROM certificates c
LEFT JOIN certificate_templates t ON c.template_id = t.id
LEFT JOIN certificate_designs d ON d.id = (c.metadata->>'designId')::uuid
WHERE c.metadata->>'source' = 'editor'
ORDER BY c.created_at DESC
LIMIT 5;
```

**Expected Result:**
```
certificate_number: CERT-2025-10-1234
recipient_name: John Doe
status: issued
template_name: Default Landscape  ← From certificate_templates
design_id: uuid-2  ← From certificate_designs
metadata_design_id: uuid-2  ← Matches!
```

**Jika semua data muncul dan linked = SUKSES! ✅**

---

### **Method 3: Check via API**

**Open Browser Console (F12):**

```javascript
// Check certificate_templates
const { data: templates } = await supabase
  .from('certificate_templates')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(5)

console.log('Templates:', templates)

// Check certificate_designs
const { data: designs } = await supabase
  .from('certificate_designs')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(5)

console.log('Designs:', designs)

// Check certificates
const { data: certs } = await supabase
  .from('certificates')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(5)

console.log('Certificates:', certs)
```

---

## 🎯 ERROR HANDLING

### **Jika STEP 1 Gagal:**
```
❌ Template save error: ...
```

**Possible causes:**
- Table `certificate_templates` tidak ada
- Permission denied
- Invalid data

**Solution:**
- Run setup SQL script
- Check RLS policies
- Check data format

---

### **Jika STEP 2 Gagal:**
```
❌ Design save error: ...
```

**Possible causes:**
- Table `certificate_designs` tidak ada
- Foreign key constraint (template_id invalid)
- Permission denied

**Solution:**
- Run setup SQL script
- Verify STEP 1 succeeded
- Check RLS policies

---

### **Jika STEP 3 Gagal:**
```
⚠️ Certificate save to main table failed (non-critical)
```

**Note:** Ini non-critical, design sudah tersimpan di STEP 2

**Possible causes:**
- Table `certificates` tidak ada
- Foreign key constraint
- Permission denied

**Solution:**
- Run setup SQL script
- Check RLS policies

---

## ✅ SUCCESS INDICATORS

### **Console Logs:**
```
✅ All 3 steps show "COMPLETED"
✅ No error messages
✅ Shows "SAVE COMPLETED SUCCESSFULLY"
```

### **Database:**
```
✅ New row in certificate_templates
✅ New row in certificate_designs (with template_id link)
✅ New row in certificates (with template_id link)
```

### **Relationships:**
```
certificates.template_id = certificate_templates.id
certificates.metadata.designId = certificate_designs.id
certificate_designs.template_id = certificate_templates.id
```

---

## 🎉 SUMMARY

**Kode sudah benar!** Data akan masuk ke 3 tabel:

1. ✅ **certificate_templates** (Line 331-335)
   - Template info & configuration
   
2. ✅ **certificate_designs** (Line 412-416)
   - Layout data & elements
   - Linked via `template_id`
   
3. ✅ **certificates** (Line 491-495)
   - Certificate record
   - Linked via `template_id` dan `metadata.designId`

**Cara Verifikasi:**
1. Check console logs (look for 3x "COMPLETED")
2. Check database (run SQL queries)
3. Check /certificates page

**Jika ada error:**
- Check console untuk error message
- Check database tables exist
- Check RLS policies
- Check user authentication

**KODE SUDAH SIAP! TINGGAL TEST!** ✅🎉
