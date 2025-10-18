# Supabase Setup untuk Certificate Manager

## 📋 Langkah-langkah Setup

### 1. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Login atau daftar akun
3. Klik "New Project"
4. Pilih organization dan isi detail project:
   - **Name**: certificate-manager
   - **Database Password**: buat password yang kuat
   - **Region**: pilih region terdekat (Singapore untuk Indonesia)

### 2. Setup Database
1. Buka SQL Editor di dashboard Supabase
2. Copy dan paste seluruh isi file `supabase-certificates.sql`
3. Klik "Run" untuk menjalankan script

### 3. Setup Storage
1. Buka **Storage** di sidebar Supabase
2. Klik "Create a new bucket"
3. **Bucket name**: `certificate-templates`
4. **Public bucket**: ✅ (centang untuk akses public)
5. Klik "Create bucket"

### 4. Setup Authentication
1. Buka **Authentication** > **Settings**
2. **Site URL**: `http://localhost:3000` (untuk development)
3. **Redirect URLs**: tambahkan `http://localhost:3000/**`
4. **JWT expiry**: 3600 (1 jam)

### 5. Setup Row Level Security (RLS)
RLS sudah dikonfigurasi dalam SQL script, tapi pastikan:
1. Buka **Authentication** > **Policies**
2. Pastikan tabel `certificates` memiliki policies yang benar
3. Test policies dengan user roles yang berbeda

### 6. Konfigurasi Environment Variables
1. Copy file `env.example` menjadi `.env.local`
2. Buka **Settings** > **API** di Supabase
3. Copy **Project URL** dan **anon public** key
4. Paste ke file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗂️ Struktur Database

### Tabel `certificates`
```sql
- id (uuid, primary key)
- name (text) - Nama penerima sertifikat
- training_title (text) - Judul pelatihan
- date (date) - Tanggal sertifikat
- location (text) - Lokasi pelatihan
- signer_1_name (text) - Nama penandatangan 1
- signer_1_title (text) - Jabatan penandatangan 1
- signer_2_name (text) - Nama penandatangan 2
- signer_2_title (text) - Jabatan penandatangan 2
- qr_code_url (text) - URL QR code
- certificate_number (text, unique) - Nomor sertifikat
- template_url (text) - URL template gambar
- orientation (text) - 'landscape' atau 'portrait'
- text_positions (jsonb) - Posisi teks dinamis
- created_at (timestamp)
- updated_at (timestamp)
- is_verified (boolean) - Status verifikasi
- created_by (uuid) - ID user yang membuat
```

### View `certificate_stats`
Menyediakan statistik sertifikat:
- Total certificates
- Verified certificates
- Pending certificates
- Landscape vs Portrait
- Unique trainings
- Unique locations

## 🔐 Security & Permissions

### Row Level Security (RLS) Policies
1. **Admin**: Bisa CRUD semua sertifikat
2. **Team**: Bisa CRUD sertifikat tim
3. **Public**: Hanya bisa READ sertifikat yang verified
4. **User**: Bisa CRUD sertifikat sendiri

### User Roles
Role disimpan di `auth.users.raw_user_meta_data->>'role'`:
- `admin` - Full access
- `team` - Team access
- `public` - Limited access

## 📁 Storage Bucket

### `certificate-templates`
- **Purpose**: Menyimpan template gambar sertifikat
- **Public**: ✅ (untuk akses langsung dari frontend)
- **File types**: PNG, JPG, SVG
- **Max size**: 10MB per file

## 🚀 Testing

### Test Database Connection
```bash
npm run dev
```
Buka browser ke `http://localhost:3000` dan coba:
1. Login dengan role yang berbeda
2. Buat sertifikat baru
3. Upload template
4. Download PDF

### Test RLS Policies
1. Login sebagai admin - harus bisa lihat semua
2. Login sebagai team - harus bisa lihat team certificates
3. Login sebagai public - hanya lihat verified certificates

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid JWT" Error**
   - Check environment variables
   - Verify Supabase URL dan key

2. **"RLS Policy" Error**
   - Check user role di `auth.users.raw_user_meta_data`
   - Verify policies di SQL Editor

3. **"Storage Access Denied"**
   - Check bucket permissions
   - Verify bucket is public

4. **"Certificate Number Duplicate"**
   - Check trigger function `generate_certificate_number()`
   - Verify unique constraint

### Debug Commands
```sql
-- Check user roles
SELECT id, email, raw_user_meta_data->>'role' as role 
FROM auth.users;

-- Check certificates
SELECT * FROM certificates ORDER BY created_at DESC;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'certificates';
```

## 📞 Support

Jika ada masalah:
1. Check Supabase dashboard logs
2. Check browser console errors
3. Verify database schema
4. Test dengan SQL queries langsung
