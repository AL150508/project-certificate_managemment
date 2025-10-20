# Supabase Setup Guide

Panduan lengkap untuk setup dan troubleshooting koneksi Supabase dalam Certificate Management System.

## 🚀 Quick Setup

### 1. Environment Variables

Pastikan file `.env.local` berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Setup Categories Table

Jalankan script setup untuk membuat tabel categories:

```bash
npm run setup:categories
```

### 3. Test Connection

Test koneksi Supabase:

```bash
npm run test:supabase
```

## 🔍 Troubleshooting

### Error: "Categories table not found"

**Penyebab:** Tabel categories belum dibuat di database Supabase.

**Solusi:**
1. Jalankan `npm run setup:categories`
2. Atau buat manual di Supabase Dashboard:
   - Buka SQL Editor
   - Jalankan script dari `scripts/setup-categories.sql`

### Error: "Permission denied"

**Penyebab:** RLS (Row Level Security) policies tidak mengizinkan akses.

**Solusi:**
1. Buka Supabase Dashboard → Authentication → Policies
2. Pastikan ada policy untuk public read access:
   ```sql
   CREATE POLICY "Allow public read access to categories" ON categories
     FOR SELECT USING (true);
   ```

### Error: "Failed to load categories"

**Penyebab:** Berbagai kemungkinan masalah koneksi atau konfigurasi.

**Langkah Debugging:**
1. Buka Developer Console (F12)
2. Lihat error message detail
3. Jalankan diagnostik: `npm run test:supabase`
4. Periksa Network tab untuk request yang gagal

## 📊 Database Schema

### Categories Table

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Default Categories

Script akan menambahkan kategori default:
- Workshop: Workshop completion certificates
- Training: Training certificates  
- Seminar: Seminar attendance certificates
- Course: Course completion certificates
- Achievement: Achievement and award certificates
- Participation: Participation certificates

## 🔧 Manual Setup

Jika script otomatis gagal, setup manual:

### 1. Buat Tabel di Supabase Dashboard

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Buka **Table Editor**
4. Klik **New Table**
5. Nama: `categories`
6. Tambahkan kolom:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `name` (text, required)
   - `description` (text, optional)
   - `created_at` (timestamptz, default: now())
   - `updated_at` (timestamptz, default: now())

### 2. Setup RLS Policies

1. Buka **Authentication** → **Policies**
2. Pilih tabel `categories`
3. Klik **New Policy**
4. Template: **Enable read access for all users**
5. Policy name: `Allow public read access to categories`
6. **Save policy**

### 3. Insert Default Data

Buka **SQL Editor** dan jalankan:

```sql
INSERT INTO categories (name, description) VALUES
  ('Workshop', 'Workshop completion certificates'),
  ('Training', 'Training certificates'),
  ('Seminar', 'Seminar attendance certificates'),
  ('Course', 'Course completion certificates'),
  ('Achievement', 'Achievement and award certificates'),
  ('Participation', 'Participation certificates');
```

## 🧪 Testing

### Test Categories Access

```javascript
import { supabase } from '@/lib/supabase'

// Test basic access
const { data, error } = await supabase
  .from('categories')
  .select('*')

console.log('Categories:', data)
console.log('Error:', error)
```

### Test dengan Browser Console

Buka Developer Console dan jalankan:

```javascript
// Test connection
fetch('/api/test-supabase')
  .then(r => r.json())
  .then(console.log)

// Test categories directly
supabase.from('categories').select('*').then(console.log)
```

## 🚨 Common Issues

### 1. CORS Errors

**Gejala:** Request blocked by CORS policy

**Solusi:**
- Pastikan domain development (localhost:3000) terdaftar di Supabase
- Periksa **Settings** → **API** → **URL Configuration**

### 2. Invalid API Key

**Gejala:** 401 Unauthorized errors

**Solusi:**
- Periksa environment variables
- Pastikan menggunakan anon key yang benar
- Regenerate keys jika perlu

### 3. RLS Blocking Access

**Gejala:** Empty results atau permission denied

**Solusi:**
- Disable RLS sementara untuk testing
- Atau buat policy yang tepat
- Pastikan user authenticated jika diperlukan

### 4. Network Issues

**Gejala:** Connection timeout atau network errors

**Solusi:**
- Periksa internet connection
- Coba akses Supabase Dashboard
- Periksa firewall/proxy settings

## 📝 Logs dan Debugging

### Enable Debug Logging

Tambahkan di component:

```javascript
// Enable detailed logging
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Test connection
supabase.from('categories').select('count', { count: 'exact', head: true })
  .then(result => console.log('Connection test:', result))
```

### Check Network Tab

1. Buka Developer Tools (F12)
2. Tab **Network**
3. Filter: **Fetch/XHR**
4. Reload page
5. Lihat request ke Supabase
6. Check status codes dan response

### Supabase Dashboard Logs

1. Buka Supabase Dashboard
2. **Logs** → **API**
3. Filter by time range
4. Look for failed requests

## 🔄 Reset dan Clean Setup

Jika semua gagal, reset complete:

### 1. Reset Environment

```bash
# Backup current .env.local
cp .env.local .env.local.backup

# Clear cache
rm -rf .next
npm run build
```

### 2. Reset Database

```sql
-- Drop and recreate table
DROP TABLE IF EXISTS categories CASCADE;

-- Run setup script again
-- (paste content from scripts/setup-categories.sql)
```

### 3. Verify Setup

```bash
npm run test:supabase
npm run dev
```

## 📞 Support

Jika masih mengalami masalah:

1. **Check Supabase Status:** https://status.supabase.com/
2. **Supabase Docs:** https://supabase.com/docs
3. **Community:** https://github.com/supabase/supabase/discussions

## ✅ Success Checklist

- [ ] Environment variables configured
- [ ] Categories table created
- [ ] RLS policies setup
- [ ] Default data inserted
- [ ] Connection test passes
- [ ] Categories load in UI
- [ ] No console errors

---

**Happy coding! 🚀**
