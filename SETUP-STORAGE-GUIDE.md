# 📦 Panduan Setup Supabase Storage untuk Templates

## ⚠️ Masalah yang Terjadi:
1. ❌ "Bucket not found" - Bucket `certificates` belum dibuat
2. ❌ "new row violates row-level security policy" - RLS policies belum di-setup

## ✅ Solusi: Jalankan SQL Setup

### Cara 1: Menggunakan SQL Editor (RECOMMENDED)

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project Anda

2. **Buka SQL Editor**
   - Klik menu "SQL Editor" di sidebar kiri
   - Klik "New Query"

3. **Copy & Paste SQL**
   - Buka file: `supabase-setup-simple.sql`
   - Copy SEMUA isi file
   - Paste ke SQL Editor

4. **Run SQL**
   - Klik tombol "RUN" atau tekan Ctrl+Enter
   - Tunggu sampai selesai (biasanya < 5 detik)

5. **Verifikasi**
   - Jika berhasil, Anda akan lihat message: "Bucket created: certificates"
   - Tidak ada error merah

### Cara 2: Menggunakan Storage UI (ALTERNATIF)

Jika SQL gagal, buat bucket manual:

1. **Buka Storage**
   - Klik menu "Storage" di sidebar kiri
   - Klik "Create a new bucket"

2. **Setup Bucket**
   - Name: `certificates`
   - Public bucket: ✅ YES (centang)
   - File size limit: 10 MB
   - Allowed MIME types: 
     - image/jpeg
     - image/png
     - image/jpg
     - image/webp
     - image/gif
     - application/pdf

3. **Create Policies**
   - Setelah bucket dibuat, klik bucket "certificates"
   - Klik tab "Policies"
   - Klik "New Policy"
   - Pilih template: "Allow public access"
   - Klik "Review" → "Save policy"

## 🧪 Testing

Setelah setup selesai:

1. **Refresh aplikasi** (Ctrl+R)
2. **Login sebagai Admin**
3. **Buka Templates page**
4. **Klik "+ Create Template"**
5. **Isi form & upload gambar**
6. **Klik "Create Template"**

Jika berhasil:
- ✅ Tidak ada error
- ✅ Template tersimpan
- ✅ Redirect ke Certificate Editor

## 🔍 Troubleshooting

### Error: "must be owner of table objects"
- ✅ SOLVED: Gunakan `supabase-setup-simple.sql` (tidak ada ALTER TABLE)

### Error: "Bucket not found"
- Pastikan SQL sudah dijalankan
- Cek di Storage → Buckets → harus ada "certificates"

### Error: "new row violates row-level security policy"
- Pastikan SQL policies sudah dijalankan
- Pastikan Anda login sebagai authenticated user

### Error: "Permission denied"
- Pastikan bucket "certificates" di-set sebagai PUBLIC
- Pastikan policies sudah dibuat

## 📝 File SQL yang Tersedia

1. **supabase-setup-simple.sql** ⭐ RECOMMENDED
   - Paling sederhana
   - Tidak ada error
   - Menggunakan `CREATE POLICY IF NOT EXISTS`

2. **supabase-storage-setup.sql**
   - Lebih lengkap dengan verification queries
   - Bisa digunakan jika simple.sql tidak cukup

## ✨ Setelah Setup Berhasil

Anda bisa:
- ✅ Create template baru
- ✅ Upload template image
- ✅ Upload preview image
- ✅ Edit template di Certificate Editor
- ✅ Delete template
- ✅ Use template untuk generate certificates

## 🆘 Butuh Bantuan?

Jika masih error setelah setup:
1. Screenshot error message
2. Cek browser console (F12)
3. Cek Supabase logs
4. Pastikan .env.local sudah benar:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
