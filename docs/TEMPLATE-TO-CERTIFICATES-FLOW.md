# Template to Certificates Flow

## ✅ **TEMPLATE SAVE & DISPLAY FLOW**

Dokumentasi lengkap bagaimana template yang disave di editor muncul di halaman certificates.

### **🔄 COMPLETE FLOW**

#### **STEP 1: Create Template di Editor**
```
1. User buka /certificates/editor
2. Pilih background template
3. Add elements (Name, Description, Date, etc)
4. Select category
5. Click "Save Template"
```

#### **STEP 2: Save to Database**
```typescript
// Data yang disimpan:

1. certificate_templates table:
   - id: UUID
   - name: "Custom Template"
   - orientation: "portrait" | "landscape"
   - background_url: "https://..."
   - preview_url: "https://..." (sama dengan background_url)
   - template_source: "upload"
   - template_url: "https://..."
   - category_id: UUID
   - fields: JSONB (array of field configs)
   - metadata: JSONB

2. certificate_designs table:
   - id: UUID
   - template_id: UUID (reference ke certificate_templates)
   - layout_data: JSONB (array of elements dengan position & style)
   - orientation: "portrait" | "landscape"
   - metadata: JSONB
```

#### **STEP 3: Display di Certificates Page**
```
1. User navigate ke /certificates
2. CertificatesClient fetches:
   - certificates (actual issued certificates)
   - members
   - categories
   - templates ← Templates yang baru disave ada di sini
3. Templates available di dropdown "Template" saat create certificate
```

### **📊 DATA STRUCTURE**

#### **✅ Template Data (certificate_templates):**
```json
{
  "id": "abc-123-def",
  "name": "Professional Achievement",
  "orientation": "landscape",
  "width_px": 1200,
  "height_px": 800,
  "background_url": "https://images.unsplash.com/...",
  "preview_url": "https://images.unsplash.com/...",
  "template_source": "upload",
  "template_url": "https://images.unsplash.com/...",
  "category_id": "cat-123",
  "fields": [
    {
      "id": "name-1",
      "type": "name",
      "placeholder": "Recipient Name",
      "required": true
    },
    {
      "id": "desc-1",
      "type": "description",
      "placeholder": "Achievement Description",
      "required": true
    }
  ],
  "metadata": {
    "templateId": "custom-template",
    "orientation": "landscape",
    "category": "achievement"
  }
}
```

#### **✅ Design Data (certificate_designs):**
```json
{
  "id": "design-123",
  "template_id": "abc-123-def",
  "layout_data": [
    {
      "id": "element-1",
      "type": "name",
      "text": "John Doe",
      "position": {"x": 400, "y": 250},
      "style": {
        "fontSize": 48,
        "fontFamily": "Poppins",
        "color": "#1a1a1a"
      }
    }
  ],
  "orientation": "landscape",
  "metadata": {
    "templateName": "Professional Achievement",
    "elementCount": 3
  }
}
```

### **🎯 HOW TEMPLATES APPEAR IN CERTIFICATES**

#### **✅ 1. Template Dropdown:**
```typescript
// Di CertificatesClient.tsx saat create certificate:
<Select value={template_id} onValueChange={setTemplate}>
  {templates.map((t) => (
    <SelectItem key={t.id} value={t.id}>
      {t.name}  ← Template yang baru disave muncul di sini
    </SelectItem>
  ))}
</Select>
```

#### **✅ 2. Fields Auto-Populate:**
```typescript
// Saat template dipilih, fields otomatis muncul:
const tpl = templates.find(t => t.id === template_id)

{tpl && tpl.fields.map((f, index) => {
  const fieldKey = f.key || f.id || f.type || `field-${index}`
  return (
    <div key={fieldKey}>
      <label>{f.label || f.placeholder || fieldKey}</label>
      <Input
        value={fieldsData[fieldKey] ?? ""}
        onChange={(e) => setFieldsData({...fieldsData, [fieldKey]: e.target.value})}
      />
    </div>
  )
})}
```

### **🚀 TESTING FLOW**

#### **✅ Complete Test:**
```
1. Create Template:
   - Go to /certificates/editor
   - Select background
   - Add "Name" element
   - Add "Description" element
   - Select category: "Achievement"
   - Click "Save Template"
   - Verify success toast
   - Verify redirect to /certificates

2. Verify Template Available:
   - Click "+ New Certificate"
   - Open "Template" dropdown
   - Verify new template appears in list
   - Select the new template

3. Verify Fields Appear:
   - After selecting template
   - Verify "Name" field appears
   - Verify "Description" field appears
   - Fields should match what was added in editor

4. Create Certificate:
   - Select member
   - Select category
   - Fill in template fields
   - Click "Create"
   - Verify certificate created with template
```

### **📋 EXPECTED BEHAVIOR**

#### **✅ After Save Template:**
```
1. Template saved to database ✅
2. Design saved to database ✅
3. Redirect to /certificates ✅
4. Template available in dropdown ✅
5. Fields auto-populate when selected ✅
```

#### **✅ Certificate Creation Flow:**
```
1. Select template from dropdown
2. Template fields appear automatically
3. Fill in fields (name, description, etc)
4. Select member & category
5. Click "Create"
6. Certificate created with:
   - Template reference
   - Field data
   - Member reference
   - Category reference
```

### **🔍 DEBUGGING**

#### **✅ Check Template Saved:**
```sql
-- Verify template exists:
SELECT id, name, fields, preview_url
FROM certificate_templates
ORDER BY created_at DESC
LIMIT 5;

-- Verify design exists:
SELECT id, template_id, layout_data
FROM certificate_designs
ORDER BY created_at DESC
LIMIT 5;
```

#### **✅ Check Template Fetched:**
```typescript
// Console output saat load /certificates:
📥 Fetching all data...
✅ Fetched certificates, members, categories, templates

// Check templates array:
console.log('Templates:', templates)
// Should include newly saved template
```

#### **✅ Check Template in Dropdown:**
```
1. Open /certificates
2. Click "+ New Certificate"
3. Open "Template" dropdown
4. Verify template name appears
5. Select template
6. Verify fields appear below
```

### **⚠️ PREVIEW GENERATION**

#### **Current Status:**
```
⚠️ Preview generation DISABLED
Reason: html2canvas CSS compatibility issues
Fallback: Using background_url as preview_url
Impact: Templates still work, just no custom preview image
```

#### **What This Means:**
```
✅ Templates save successfully
✅ Templates appear in dropdown
✅ Fields work correctly
✅ Certificates can be created
⚠️ Preview shows background image instead of rendered preview
```

### **🎨 FUTURE ENHANCEMENT**

#### **Preview Generation Fix:**
```
TODO: Fix html2canvas CSS parsing
- Handle lab() color function
- Add CSS compatibility layer
- Generate actual preview images
- Upload to Supabase Storage
```

## ✅ **TEMPLATE TO CERTIFICATES FLOW COMPLETE!**

**Summary:**

1. ✅ **Create Template**: Editor → Save → Database
2. ✅ **Template Available**: Fetch → Display in dropdown
3. ✅ **Fields Auto-Populate**: Select template → Fields appear
4. ✅ **Create Certificate**: Use template → Certificate created
5. ⚠️ **Preview**: Using background as fallback (preview gen disabled)

**Templates yang disave di editor akan otomatis muncul di halaman certificates dan siap digunakan untuk membuat certificate!** 🚀✅
