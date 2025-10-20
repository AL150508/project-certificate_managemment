# Setup Certificates Table - Fix Certificate Save Error

## ✅ **SETUP UNTUK MEMPERBAIKI CERTIFICATE SAVE ERROR**

Karena tabel `certificate_templates` sudah ada di Supabase, sekarang tinggal setup tabel `certificates` untuk memperbaiki error saat save.

## 🗄️ **LANGKAH SETUP**

### **✅ 1. Execute SQL Script**
```sql
-- Copy dan paste script ini ke Supabase SQL Editor:
-- File: scripts/setup-certificates-table.sql

-- Script ini akan membuat:
-- ✅ certificates table dengan struktur yang benar
-- ✅ RLS policies untuk security
-- ✅ Indexes untuk performance  
-- ✅ Triggers untuk updated_at
-- ✅ RPC function untuk generate certificate identifiers
```

### **✅ 2. Verify Setup**
```sql
-- Check jika tabel sudah dibuat
SELECT * FROM certificates LIMIT 1;

-- Test RPC function
SELECT next_certificate_identifiers(2025, 10, 10);

-- Should return:
-- {"certificate_number": "CERT-2025-10-0001", "verification_code": "ABC123XYZ0"}
```

### **✅ 3. Test Certificate Save**
1. **Buka certificate editor**: `/certificates/editor`
2. **Buat design** dengan beberapa elements
3. **Klik Save button**
4. **Should show**: "Certificate template saved successfully!"
5. **Check database**: New record di tabel certificates

## 🎯 **STRUKTUR TABEL CERTIFICATES**

```sql
CREATE TABLE certificates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,        -- CERT-2025-10-0001
  verification_code TEXT UNIQUE NOT NULL,         -- ABC123XYZ0
  design_id UUID REFERENCES certificate_designs(id),
  user_id UUID REFERENCES auth.users(id),
  member_id UUID REFERENCES members(id),
  category_id UUID REFERENCES categories(id),
  template_id UUID REFERENCES certificate_templates(id),  -- ✅ Links to existing table
  status TEXT DEFAULT 'draft',
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT,
  png_url TEXT,
  fields_data JSONB DEFAULT '{}',
  layout JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

## 🔒 **SECURITY POLICIES**

```sql
-- Public dapat read published certificates
CREATE POLICY "Allow public read access to published certificates" ON certificates
  FOR SELECT USING (status = 'published');

-- Users dapat read certificates mereka sendiri
CREATE POLICY "Allow authenticated users to read their own certificates" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

-- Users dapat insert certificates
CREATE POLICY "Allow authenticated users to insert certificates" ON certificates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users dapat update certificates mereka sendiri
CREATE POLICY "Allow users to update their own certificates" ON certificates
  FOR UPDATE USING (auth.uid() = user_id);

-- Users dapat delete certificates mereka sendiri
CREATE POLICY "Allow users to delete their own certificates" ON certificates
  FOR DELETE USING (auth.uid() = user_id);
```

## 🚀 **CERTIFICATE IDENTIFIER GENERATOR**

```sql
-- Function untuk generate unique certificate identifiers
CREATE OR REPLACE FUNCTION next_certificate_identifiers(y INTEGER, m INTEGER, code_len INTEGER DEFAULT 10)
RETURNS JSON AS $$
DECLARE
    cert_num TEXT;
    verify_code TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        -- Generate certificate number: CERT-YYYY-MM-NNNN
        cert_num := 'CERT-' || LPAD(y::TEXT, 4, '0') || '-' || LPAD(m::TEXT, 2, '0') || '-' || LPAD(counter::TEXT, 4, '0');
        
        -- Generate random verification code (10 chars)
        verify_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR code_len));
        
        -- Check uniqueness
        IF NOT EXISTS (SELECT 1 FROM certificates WHERE certificate_number = cert_num) AND
           NOT EXISTS (SELECT 1 FROM certificates WHERE verification_code = verify_code) THEN
            RETURN JSON_BUILD_OBJECT(
                'certificate_number', cert_num,
                'verification_code', verify_code
            );
        END IF;
        
        counter := counter + 1;
        
        -- Prevent infinite loop
        IF counter > 100 THEN
            RAISE EXCEPTION 'Could not generate unique certificate identifiers after 100 attempts';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## ✅ **SETELAH SETUP SELESAI**

**Certificate save akan berfungsi dengan:**

- ✅ **Auto-generated identifiers**: certificate_number & verification_code
- ✅ **Proper foreign keys**: Links ke certificate_templates yang sudah ada
- ✅ **Security policies**: RLS untuk data protection
- ✅ **Performance indexes**: Fast queries
- ✅ **Error handling**: Clear success/error messages

## 🎯 **EXPECTED RESULTS**

### **✅ Before Setup (Error):**
```
❌ "Certificate creation error"
❌ Console error: NOT NULL constraint violation
❌ Save fails
```

### **✅ After Setup (Success):**
```
✅ "Certificate template saved successfully!"
✅ New certificate record in database
✅ Generated certificate number: CERT-2025-10-0001
✅ Generated verification code: ABC123XYZ0
```

**Jalankan script SQL ini di Supabase, lalu test certificate save lagi!** 🚀✅
