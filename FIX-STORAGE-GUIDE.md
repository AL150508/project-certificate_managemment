# 🔧 Panduan Fix Storage RLS Policy Error

## ⚠️ Error yang Terjadi:
```
StorageApiError: new row violates row-level security policy
```

## 🎯 Penyebab:
- Bucket 'certificates' sudah ada ✅
- Tapi RLS policies belum benar ❌
- User tidak punya permission untuk upload ❌

---

## 📝 CARA PERBAIKAN (MUDAH):

### Step 1: Buka Supabase Dashboard
1. Login ke https://supabase.com
2. Pilih project Anda
3. Klik **"SQL Editor"** di sidebar kiri
4. Klik **"New Query"**

### Step 2: Copy & Paste SQL
1. Buka file: **`fix-storage-policies.sql`**
2. Copy **SEMUA** isi file (Ctrl+A, Ctrl+C)
3. Paste ke SQL Editor (Ctrl+V)

### Step 3: Run SQL
1. Klik tombol **"RUN"** atau tekan **Ctrl+Enter**
2. Tunggu 2-5 detik
3. Jika berhasil, akan muncul tabel dengan 4 policies

### Step 4: Verify
Anda akan melihat output seperti ini:
```
policyname: "Authenticated can delete certificates"
policyname: "Authenticated can update certificates"
policyname: "Authenticated can upload certificates"
policyname: "Public can view certificates"
```

---

## 🧪 TEST SETELAH FIX:

1. **Refresh browser** (F5)
2. **Login sebagai Admin** (`admin@gmail.com` / `admin123`)
3. **Buka Templates page**
4. **Klik "+ Create Template"**
5. **Isi form:**
   - Template Name: Test Template
   - Category: Pilih kategori
   - Orientation: Landscape
   - Upload Template Image (JPG/PNG)
   - Upload Preview Image (JPG/PNG)
6. **Klik "Create Template"**

### Expected Result:
- ✅ Console log: "📦 Using bucket: certificates"
- ✅ Console log: "📤 Uploading template image..."
- ✅ Console log: "✅ Template image uploaded successfully"
- ✅ Console log: "📤 Uploading preview image..."
- ✅ Console log: "✅ Preview image uploaded successfully"
- ✅ Console log: "💾 Inserting template to database..."
- ✅ Console log: "✅ Template created successfully"
- ✅ Toast: "Template created successfully!"
- ✅ Redirect ke Certificate Editor
- ✅ **TIDAK ADA ERROR!**

---

## 🔍 Troubleshooting:

### Error: "policy already exists"
- **Solusi:** SQL sudah drop policy dulu, jalankan lagi

### Error: "permission denied"
- **Solusi:** Pastikan Anda login sebagai owner/admin project

### Masih error "violates row-level security policy"
- **Cek:** Apakah Anda sudah login sebagai authenticated user?
- **Cek:** Apakah SQL policies sudah dijalankan?
- **Cek:** Refresh browser dan coba lagi

### Error: "bucket not found"
- **Solusi:** Bucket belum dibuat, jalankan `FINAL-SUPABASE-SETUP.sql` dulu

---

## 📊 Apa yang Dilakukan SQL Ini?

**STEP 1: Drop Old Policies**
- Hapus semua policy lama yang mungkin salah

**STEP 2: Create New Policies**
1. **Public can view** → Semua orang bisa download/view files
2. **Authenticated can upload** → User login bisa upload
3. **Authenticated can update** → User login bisa update
4. **Authenticated can delete** → User login bisa delete

**STEP 3: Verify**
- Cek apakah 4 policies berhasil dibuat

---

## ✅ Checklist Setelah Fix:

- [ ] SQL berhasil dijalankan tanpa error
- [ ] Muncul 4 policies di output
- [ ] Refresh browser
- [ ] Login sebagai Admin
- [ ] Test create template
- [ ] Upload berhasil tanpa error
- [ ] Template tersimpan di database
- [ ] Redirect ke editor berhasil

---

## 🎊 Jika Semua Berhasil:

**Template System Sudah Berfungsi Penuh:**
- ✅ Create template dengan upload images
- ✅ List templates (card view)
- ✅ Edit template (redirect ke editor)
- ✅ Delete template
- ✅ Use template untuk generate certificates
- ✅ Storage bucket & policies bekerja
- ✅ Database connection OK

**Selamat! Template Management sudah siap digunakan!** 🎉
