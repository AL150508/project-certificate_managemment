# Navigate to Templates Page

## 🎯 **CARA AKSES TEMPLATES PAGE**

### **📍 CORRECT URL**

#### **✅ Templates Page:**
```
URL: http://localhost:3000/admin/templates
```

#### **❌ BUKAN:**
```
❌ /certificates (ini halaman certificates)
❌ /admin/certificates (ini juga certificates)
❌ /templates (tidak ada)
```

### **🚀 CARA NAVIGASI**

#### **Method 1: Via Navigation Menu**
```
1. Login sebagai admin
2. Lihat menu di top navigation bar:
   Dashboard | Certificates | Templates | Members | Categories | FAQ
                              ↑ Click ini
3. Akan redirect ke /admin/templates
```

#### **Method 2: Direct URL**
```
1. Ketik di browser address bar:
   http://localhost:3000/admin/templates
2. Press Enter
3. Page akan load
```

#### **Method 3: From Certificates Page**
```
1. Di /admin/certificates
2. Click "Templates" di navigation menu
3. Atau ketik URL langsung
```

### **📊 PERBEDAAN PAGES**

#### **✅ Certificates Page (`/admin/certificates`):**
```
Content:
- List of issued certificates
- Certificate Number, Member, Category
- Actions: Edit, Delete, Preview, Generate
- Create new certificate

What you see:
- CERT-2025-10-0001, Jane Smith, Achievement
- CERT-2025-10-0002, Jane Smith, Achievement
```

#### **✅ Templates Page (`/admin/templates`):**
```
Content:
- List of certificate templates
- Template Name, Orientation, Category
- Preview thumbnails
- Actions: Preview, Edit, Delete
- Create new template

What you see:
- Professional Achievement, landscape, Achievement
- Excellence Award, portrait, Achievement
```

### **🔍 VERIFY YOU'RE ON CORRECT PAGE**

#### **✅ Templates Page Indicators:**
```
1. URL shows: /admin/templates
2. Page title: "Templates"
3. Subtitle: "Manage certificate templates"
4. Button: "Create Template" (red button)
5. Table columns: Preview | Name | Orientation | Category | Fields | Source | Created | Actions
6. Preview thumbnails visible (if templates exist)
```

#### **✅ Certificates Page Indicators:**
```
1. URL shows: /admin/certificates or /certificates
2. Page title: "Certificates"
3. Subtitle: "Daftar semua sertifikat yang telah dibuat"
4. Button: "+ New Certificate" (red button)
5. Table columns: Certificate Number | Member | Category | Issue Date | Status | Actions
6. No preview thumbnails
```

### **🎨 VISUAL DIFFERENCES**

#### **Templates Page:**
```
┌─────────────────────────────────────┐
│ Templates                           │
│ Manage certificate templates        │
│                                     │
│ [Search...]        [Create Template]│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Preview | Name | Orientation ... ││
│ │ [img]   | Prof | landscape   ... ││
│ │ [img]   | Excl | portrait    ... ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

#### **Certificates Page:**
```
┌─────────────────────────────────────┐
│ Certificates                        │
│ Daftar semua sertifikat...          │
│                                     │
│ [Search...]    [+ New Certificate]  │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Cert Number | Member | Category  ││
│ │ CERT-2025.. | Jane   | Achieve   ││
│ │ CERT-2025.. | Jane   | Achieve   ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### **🚨 TROUBLESHOOTING**

#### **❌ 1. "Templates" menu tidak ada**
```
Problem: Menu item tidak terlihat
Solution:
  1. Verify logged in as admin (bukan team/public)
  2. Check role indicator di header
  3. Re-login jika perlu
```

#### **❌ 2. Click "Templates" tapi tidak redirect**
```
Problem: Navigation tidak berfungsi
Solution:
  1. Check browser console untuk errors
  2. Hard refresh (Ctrl+Shift+R)
  3. Ketik URL manual: /admin/templates
```

#### **❌ 3. Page 404 Not Found**
```
Problem: /admin/templates tidak ditemukan
Solution:
  1. Verify file exists: src/app/admin/templates/page.tsx
  2. Restart dev server
  3. Check for build errors
```

#### **❌ 4. Masih di Certificates page**
```
Problem: Tidak pindah ke Templates
Solution:
  1. Check URL bar - harus /admin/templates
  2. Jangan click "Certificates" menu
  3. Click "Templates" menu (sebelah kanan Certificates)
```

### **✅ STEP-BY-STEP NAVIGATION**

#### **From Certificates to Templates:**
```
1. Current page: /admin/certificates
   (You see: Certificate Number, Jane Smith, etc)

2. Look at top navigation menu:
   Dashboard | Certificates | Templates | Members | Categories
                              ↑ Click this one

3. Page changes to: /admin/templates
   (You see: Preview thumbnails, Template names, etc)

4. Verify URL bar shows: /admin/templates
```

### **📱 SCREENSHOTS REFERENCE**

#### **✅ Certificates Page (Current):**
```
- Title: "Certificates"
- Subtitle: "Daftar semua sertifikat yang telah dibuat"
- Button: "+ New Certificate"
- Data: CERT-2025-10-0001, Jane Smith
```

#### **✅ Templates Page (Target):**
```
- Title: "Templates"
- Subtitle: "Manage certificate templates"
- Button: "Create Template"
- Data: Template names with preview images
```

## ✅ **NAVIGATION GUIDE**

**Quick Steps:**
1. ✅ **Check current URL**: Should be /admin/templates (not /admin/certificates)
2. ✅ **Look at page title**: Should say "Templates" (not "Certificates")
3. ✅ **Check button**: Should say "Create Template" (not "+ New Certificate")
4. ✅ **Verify table**: Should show preview images and template names

**If still showing Certificates page:**
- ❌ You're on wrong page
- ✅ Click "Templates" in navigation menu
- ✅ Or type: http://localhost:3000/admin/templates

**Templates page akan menampilkan list templates dengan preview thumbnails!** 🎨✅
