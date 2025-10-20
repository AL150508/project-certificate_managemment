# Debug Save Template Issue

## 🔍 **TROUBLESHOOTING SAVE TEMPLATE YANG TIDAK BERFUNGSI**

Jika button "Save Template" tidak berfungsi, ikuti langkah debugging ini:

## 🚀 **LANGKAH 1: CEK BROWSER CONSOLE**

### **✅ Buka Developer Tools:**
1. **Tekan F12** atau **Ctrl+Shift+I**
2. **Klik tab Console**
3. **Klik "Save Template"**
4. **Lihat pesan di console**

### **✅ Expected Debug Messages:**
```
=== SAVE TEMPLATE STARTED ===
User: {id: "...", ...}
Template Source: {type: "...", url: "...", ...}
Elements: [{id: "...", type: "text", ...}, ...]
Selected Category: "achievement"
Setting saving to true...
=== STEP 1: Saving to certificate_templates ===
Template data: {...}
Template saved successfully: {...}
=== STEP 1 COMPLETED ===
=== STEP 2: Saving to certificate_designs ===
Design data: {...}
Design saved successfully: {...}
=== STEP 2 COMPLETED ===
Template "Custom Template" saved successfully!
Setting saving to false...
```

## ❌ **COMMON ERRORS & SOLUTIONS**

### **1. "Please login to save templates"**
```
❌ Problem: User not authenticated
✅ Solution: Login ke aplikasi dulu
```

### **2. "Please select a template first"**
```
❌ Problem: Belum pilih template background
✅ Solution: Pilih template dari sidebar kiri
```

### **3. "Please add at least one element"**
```
❌ Problem: Belum ada text elements
✅ Solution: Klik tombol "Name", "Description", dll untuk add elements
```

### **4. "relation 'certificate_templates' does not exist"**
```
❌ Problem: Tabel database belum dibuat
✅ Solution: Jalankan script SQL di Supabase:
   - scripts/ensure-certificate-templates-table.sql
```

### **5. "relation 'certificate_designs' does not exist"**
```
❌ Problem: Tabel certificate_designs belum ada
✅ Solution: Jalankan script SQL di Supabase:
   - scripts/create-certificate-designs-table.sql
```

### **6. "permission denied for table certificate_templates"**
```
❌ Problem: RLS policies belum setup
✅ Solution: Check RLS policies di Supabase dashboard
```

## 🗄️ **LANGKAH 2: CEK DATABASE SETUP**

### **✅ Required Tables:**
1. **certificate_templates** - Metadata template
2. **certificate_designs** - Layout & elements  
3. **certificate_categories** - Categories
4. **members** - Recipients (optional for template save)

### **✅ Run Setup Scripts:**
```bash
# Jalankan di Supabase SQL Editor (berurutan):

1. scripts/ensure-certificate-templates-table.sql
   # Creates certificate_templates table + policies

2. scripts/create-certificate-designs-table.sql
   # Creates certificate_designs table + policies

3. scripts/insert-sample-categories.sql
   # Adds sample categories

4. scripts/add-certificate-rpc.sql
   # Creates RPC function (optional for template save)
```

### **✅ Verify Tables Exist:**
```sql
-- Check di Supabase SQL Editor:
SELECT * FROM certificate_templates LIMIT 1;
SELECT * FROM certificate_designs LIMIT 1;
SELECT * FROM certificate_categories LIMIT 1;
```

## 🔧 **LANGKAH 3: TEST STEP BY STEP**

### **✅ 1. Basic Requirements:**
```
✅ User logged in (check auth state)
✅ Template selected (check templateSource)
✅ At least 1 element added (check elements array)
✅ Category selected (optional but recommended)
```

### **✅ 2. Database Connection:**
```
✅ Supabase connection working
✅ Tables exist and accessible
✅ RLS policies allow INSERT
✅ User has proper permissions
```

### **✅ 3. Save Process:**
```
✅ Step 1: Save to certificate_templates
✅ Step 2: Save to certificate_designs  
✅ Success toast appears
✅ Redirect to /certificates
```

## 🚨 **QUICK FIXES**

### **✅ 1. Reset dan Coba Lagi:**
```
1. Refresh halaman
2. Login ulang jika perlu
3. Pilih template background
4. Add minimal 1 text element
5. Pilih category
6. Klik Save Template
```

### **✅ 2. Check Network Tab:**
```
1. Buka Developer Tools → Network tab
2. Klik Save Template
3. Lihat ada request ke Supabase atau tidak
4. Check response status (200 = success, 4xx/5xx = error)
```

### **✅ 3. Simplified Test:**
```
1. Buka /certificates/editor
2. Pilih template apa saja
3. Klik "Name" untuk add text element
4. Langsung klik "Save Template"
5. Lihat console untuk error messages
```

## 📋 **CHECKLIST DEBUGGING**

### **✅ Before Save:**
- [ ] User authenticated (check console log)
- [ ] Template source selected (check console log)  
- [ ] Elements array not empty (check console log)
- [ ] Category selected (optional)

### **✅ Database Setup:**
- [ ] certificate_templates table exists
- [ ] certificate_designs table exists
- [ ] RLS policies configured
- [ ] User has INSERT permissions

### **✅ During Save:**
- [ ] Console shows "SAVE TEMPLATE STARTED"
- [ ] Console shows "STEP 1: Saving to certificate_templates"
- [ ] Console shows "Template saved successfully"
- [ ] Console shows "STEP 2: Saving to certificate_designs"
- [ ] Console shows "Design saved successfully"

### **✅ After Save:**
- [ ] Success toast appears
- [ ] Button state returns to normal
- [ ] Redirect to /certificates happens
- [ ] New record in database tables

## 🎯 **EXPECTED BEHAVIOR**

### **✅ Successful Save:**
```
1. Click "Save Template"
2. Button shows "Saving..." briefly
3. Console shows debug messages
4. Success toast: "Template [name] saved successfully!"
5. Additional toast with details
6. Redirect to /certificates after 1.5 seconds
7. New records in certificate_templates & certificate_designs
```

### **❌ Failed Save:**
```
1. Click "Save Template"  
2. Button shows "Saving..." briefly
3. Console shows error messages
4. Error toast with specific message
5. Button returns to "Save Template"
6. No redirect happens
7. No new records in database
```

**Ikuti langkah debugging ini untuk mengidentifikasi masalah save template!** 🔍✅
