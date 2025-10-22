# 📋 CERTIFICATE EDITOR - COMPLETE GUIDE

## ✅ PERUBAHAN YANG SUDAH DIBUAT

### **1. Certificate Editor (`/certificates/editor`)**

**Added Member Selector:**
- ✅ Dropdown untuk select member dari database
- ✅ Fetch data dari table `members`
- ✅ Sorted alphabetically
- ✅ Scrollable list (max-height: 60)
- ✅ Style sama dengan Category selector

**Updated Save Function:**
- ✅ Include `member_id` saat save certificate
- ✅ Include `memberName` di metadata
- ✅ Save ke table `certificates`

**Location:** `src/app/certificates/editor/page.tsx`

---

### **2. Certificates Display Page (`/certificates`)**

**Updated Query:**
- ✅ Fetch kolom baru: `recipient_name`, `created_by`, `created_at`, `certificate_data`, `metadata`
- ✅ Order by `created_at` (newest first)

**Updated Display Logic:**
- ✅ Use `recipient_name` from editor
- ✅ Fallback to `member_name` from members table
- ✅ Support both old and new certificate format

**Location:** `src/app/certificates/CertificatesClient.tsx`

---

## 🎯 CARA PAKAI

### **STEP 1: Buka Certificate Editor**

```
http://localhost:3000/certificates/editor?template=TEMPLATE_ID
```

**Replace `TEMPLATE_ID` dengan ID template yang ada di database.**

---

### **STEP 2: Select Member (Optional)**

1. **Lihat dropdown "Member"** di header (sebelah kiri Category)
2. **Klik dropdown** untuk melihat list members
3. **Select member** yang akan menerima certificate
4. **Skip jika tidak ada member** (bisa input manual di recipient name)

**Screenshot:**
```
┌──────────────────────────────────────────────────────┐
│ Member              Category         Orientation     │
│ ┌────────────┐     ┌──────────┐     ┌──────────┐    │
│ │ John Doe ▼ │     │ Award ▼  │     │ Portrait │    │
│ └────────────┘     └──────────┘     └──────────┘    │
└──────────────────────────────────────────────────────┘
```

---

### **STEP 3: Fill Certificate Details**

1. **Add Elements:**
   - Click "Add Element" di right panel
   - Select type: Name, Date, Text, etc.
   - Fill in values

2. **Customize:**
   - Drag elements to position
   - Adjust font size, color, alignment
   - Preview in real-time

---

### **STEP 4: Save Certificate**

1. **Click "Save Template"** button (red button, top right)
2. **Wait for save** (button shows "Saving...")
3. **Success!** Toast notification muncul
4. **Auto redirect** ke `/certificates` page

**Expected Console Logs:**
```
✅ User authenticated: admin@test.com
=== STEP 1: Generating Certificate ===
Certificate data: { certificate_number: "CERT-2025-10-0001", ... }
Certificate generated successfully
=== CERTIFICATE GENERATION COMPLETED ===
🔄 Redirecting to /certificates...
```

---

### **STEP 5: View Certificate di List**

**Setelah redirect, certificate akan muncul di `/certificates` page:**

```
┌─────────────────────────────────────────────────────────────┐
│ Certificate Number  │ Recipient      │ Category  │ Status  │
├─────────────────────┼────────────────┼───────────┼─────────┤
│ CERT-2025-10-0001   │ John Doe       │ Award     │ issued  │
│ CERT-2025-10-0002   │ Jane Smith     │ Training  │ issued  │
└─────────────────────────────────────────────────────────────┘
```

**Recipient name akan diambil dari:**
1. ✅ `recipient_name` (dari editor) - Priority 1
2. ✅ `member_name` (dari members table) - Fallback

---

## 🔍 TROUBLESHOOTING

### **Problem: Member dropdown kosong**

**Check 1: Apakah ada data di table members?**
```sql
SELECT * FROM members ORDER BY name;
```

**If empty:**
```sql
-- Insert sample members
INSERT INTO members (name, email) VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Bob Wilson', 'bob@example.com');
```

**Check 2: Console logs**
```
Expected: "Loaded members from database: [...]"
If error: Check RLS policies on members table
```

---

### **Problem: Certificate tidak muncul di list**

**Check 1: Apakah save berhasil?**
```
Console should show: "Certificate generated successfully"
```

**Check 2: Apakah ada di database?**
```sql
SELECT 
  certificate_number,
  recipient_name,
  category_id,
  status,
  created_at
FROM certificates
ORDER BY created_at DESC
LIMIT 5;
```

**Check 3: RLS policies**
```sql
-- Check if authenticated users can read certificates
SELECT * FROM pg_policies WHERE tablename = 'certificates';
```

---

### **Problem: Error saat save**

**Error: "Database table not found"**
```
Solution: Run database setup script
File: setup-all-tables.sql
```

**Error: "Permission denied"**
```
Solution: Check RLS policies
File: SETUP-RLS-POLICIES.sql
```

**Error: "No user found in AuthContext"**
```
Solution: Login terlebih dahulu
1. Logout: await supabase.auth.signOut()
2. Clear: localStorage.clear()
3. Login: admin@test.com / Admin@123
```

---

## 📊 DATABASE SCHEMA

### **Table: certificates**

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT UNIQUE NOT NULL,
  template_id UUID REFERENCES certificate_templates(id),
  recipient_name TEXT,                    -- ← From editor
  member_id UUID REFERENCES members(id),  -- ← Optional, from dropdown
  category_id UUID REFERENCES certificate_categories(id),
  issue_date DATE,
  status TEXT DEFAULT 'issued',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  certificate_data JSONB,                 -- ← Elements, orientation, template
  metadata JSONB,                         -- ← Additional info
  pdf_url TEXT,
  png_url TEXT
);
```

**Key Fields:**
- `recipient_name` - Nama penerima (dari editor)
- `member_id` - Link ke members table (optional)
- `certificate_data` - Elements dan layout
- `metadata` - Info tambahan (memberName, templateName, etc.)

---

## 🚀 END-TO-END FLOW

### **Complete Flow:**

```
1. User login
   ↓
2. Buka /certificates/editor?template=xxx
   ↓
3. Select member (optional)
   ↓
4. Fill certificate details
   ↓
5. Click "Save Template"
   ↓
6. Save to database (certificates table)
   ↓
7. Redirect to /certificates
   ↓
8. Certificate muncul di list
   ↓
9. ✅ SUCCESS!
```

---

## 📝 TESTING CHECKLIST

**Before Testing:**
- [ ] ✅ Login dengan akun admin/team
- [ ] ✅ Ada data di table `members`
- [ ] ✅ Ada template di table `certificate_templates`
- [ ] ✅ RLS policies sudah setup

**During Testing:**
- [ ] ✅ Member dropdown load data
- [ ] ✅ Bisa select member
- [ ] ✅ Bisa add elements
- [ ] ✅ Preview update real-time
- [ ] ✅ Save button enabled
- [ ] ✅ Click save berhasil
- [ ] ✅ Toast notification muncul
- [ ] ✅ Redirect ke /certificates

**After Testing:**
- [ ] ✅ Certificate muncul di list
- [ ] ✅ Recipient name benar
- [ ] ✅ Category benar
- [ ] ✅ Status = "issued"
- [ ] ✅ Created date benar

**If all ✅, berarti BERHASIL!**

---

## 🎊 SUMMARY

**What's New:**
1. ✅ Member selector di certificate editor
2. ✅ Save member_id ke database
3. ✅ Display recipient_name di certificates list
4. ✅ Support both old and new certificate format

**Files Modified:**
- `src/app/certificates/editor/page.tsx` - Added member selector
- `src/app/certificates/CertificatesClient.tsx` - Updated query & display

**Database Changes:**
- Added columns: `recipient_name`, `created_by`, `certificate_data`, `metadata`
- Query order changed to `created_at DESC`

**Status:** ✅ **READY TO USE!**

---

## 📞 NEXT STEPS

**If you want to:**

**1. Add more fields to certificate:**
- Edit `src/app/certificates/editor/page.tsx`
- Add new element types
- Update save function

**2. Customize certificate display:**
- Edit `src/app/certificates/CertificatesClient.tsx`
- Update table columns
- Add filters

**3. Add PDF/PNG generation:**
- Implement PDF generation service
- Update save function to generate files
- Store URLs in `pdf_url` and `png_url`

**Good luck!** 🚀
