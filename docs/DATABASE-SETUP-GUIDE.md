# Database Setup Guide - Perbaiki Error Certificate Designs

## ✅ **CARA PERBAIKI ERROR "Error fetching certificate designs"**

### **🔧 Masalah:**
```
❌ Error fetching certificate designs: 0
Console Error: Error fetching certificate designs
```

### **💡 Penyebab:**
Table `certificate_designs` belum ada di database Supabase.

### **🚀 Solusi Mudah:**

#### **Step 1: Buka Supabase Dashboard**
1. Buka [supabase.com](https://supabase.com)
2. Login ke account Anda
3. Pilih project yang digunakan
4. Klik **"SQL Editor"** di sidebar kiri

#### **Step 2: Run Setup Script**
1. Di SQL Editor, klik **"New Query"**
2. Copy seluruh isi file: `scripts/setup-certificate-designs-simple.sql`
3. Paste ke SQL Editor
4. Klik **"Run"** (atau Ctrl+Enter)
5. Tunggu sampai muncul: `Certificate designs table setup completed successfully!`

#### **Step 3: Verify Setup**
1. Klik **"Table Editor"** di sidebar
2. Cari table `certificate_designs`
3. Pastikan table ada dengan columns:
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key)
   - `template_source` (TEXT)
   - `template_url` (TEXT)
   - `template_config_id` (TEXT)
   - `elements` (JSONB)
   - `metadata` (JSONB)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### **📋 Script yang Akan Dijalankan:**

```sql
-- Creates table with proper structure
CREATE TABLE certificate_designs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  template_source TEXT NOT NULL,
  template_url TEXT,
  template_config_id TEXT,
  elements JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enables Row Level Security
ALTER TABLE certificate_designs ENABLE ROW LEVEL SECURITY;

-- Creates policies for user access
CREATE POLICY "Users can view own designs" ON certificate_designs
  FOR SELECT USING (auth.uid() = user_id);

-- Creates indexes for performance
CREATE INDEX idx_certificate_designs_user_id ON certificate_designs(user_id);
```

### **🎯 Setelah Setup Berhasil:**

#### **Test di Certificate Editor:**
1. Buka `/certificates/editor`
2. Pilih template
3. Tambah elements (Name, Description, etc.)
4. Klik **"Save Template"**
5. Harus muncul: ✅ **"Certificate design saved successfully!"**

#### **Test di Certificates Page:**
1. Buka `/certificates`
2. Console log harus menunjukkan: ✅ **"Certificate designs loaded: [number]"**
3. Tidak ada error lagi

### **🔍 Troubleshooting:**

#### **Jika Masih Error Setelah Setup:**

1. **Check Authentication:**
   ```
   - Pastikan user sudah login
   - Check di browser: Application > Local Storage > supabase auth token
   ```

2. **Check RLS Policies:**
   ```sql
   -- Run di SQL Editor untuk check policies:
   SELECT * FROM pg_policies WHERE tablename = 'certificate_designs';
   ```

3. **Check Table Exists:**
   ```sql
   -- Run di SQL Editor untuk check table:
   SELECT * FROM information_schema.tables WHERE table_name = 'certificate_designs';
   ```

4. **Manual Test Insert:**
   ```sql
   -- Test insert manual (ganti USER_ID dengan actual user ID):
   INSERT INTO certificate_designs (user_id, template_source, elements) 
   VALUES ('YOUR_USER_ID', 'config', '[]'::jsonb);
   ```

### **📊 Expected Console Logs Setelah Fix:**

#### **Saat Buka /certificates:**
```
🔍 Fetching certificate designs...
✅ Certificate designs loaded: 0
```

#### **Saat Save Template:**
```
Saving certificate design: {user_id: "...", elements: [...]}
Design saved successfully: {id: "...", created_at: "..."}
Certificate design saved successfully!
```

### **🎉 Hasil Akhir:**

**Setelah setup database:**
1. ✅ Error "fetching certificate designs" hilang
2. ✅ Save Template berfungsi normal
3. ✅ Designs tersimpan ke database
4. ✅ Console logs menunjukkan success
5. ✅ Halaman certificates tidak error lagi

### **📝 Alternative Setup (Jika SQL Editor Tidak Tersedia):**

#### **Via Supabase CLI:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push
```

#### **Via API (Advanced):**
```javascript
// Run in browser console di Supabase dashboard
const { data, error } = await supabase.rpc('exec_sql', {
  sql: `CREATE TABLE certificate_designs (...)`
});
```

### **🚨 Important Notes:**

1. **Backup First**: Selalu backup database sebelum run script
2. **Test Environment**: Test di development environment dulu
3. **User Permissions**: Pastikan user punya permission untuk create table
4. **Project Limits**: Check Supabase project limits untuk table count

### **✅ Success Indicators:**

- ❌ **Before**: `Error fetching certificate designs: 0`
- ✅ **After**: `Certificate designs loaded: 0` (atau number lain)

- ❌ **Before**: Save Template gagal
- ✅ **After**: `Certificate design saved successfully!`

**Database setup selesai! Certificate Editor sekarang fully functional! 🚀**
