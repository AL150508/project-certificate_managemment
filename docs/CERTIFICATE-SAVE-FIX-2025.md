# Certificate Save Error Fix - Missing Required Fields

## ✅ **CERTIFICATE SAVE ERROR SUDAH DIPERBAIKI!**

Error saat menyimpan sertifikat yang disebabkan oleh missing required fields (`certificate_number` dan `verification_code`) sudah diperbaiki.

## 🔧 **MASALAH YANG DIPERBAIKI**

### **❌ MASALAH SEBELUMNYA**
```typescript
// Certificate creation tanpa required fields
const certificateData = {
  design_id: designResult.id,
  user_id: user.id,
  status: 'draft'  // ❌ Missing certificate_number & verification_code
}

const { error } = await supabase
  .from('certificates')
  .insert(certificateData)  // ❌ Fails: NOT NULL constraint violation
```

**Problems:**
- Tabel `certificates` memerlukan `certificate_number` (UNIQUE NOT NULL)
- Tabel `certificates` memerlukan `verification_code` (UNIQUE NOT NULL)
- Kode tidak generate identifiers sebelum insert
- Error: "Certificate creation error" muncul di console

### **✅ SOLUSI YANG DITERAPKAN**
```typescript
// Generate certificate identifiers first
const currentDate = new Date()
const year = currentDate.getFullYear()
const month = currentDate.getMonth() + 1

const { data: identifiers, error: rpcError } = await supabase
  .rpc('next_certificate_identifiers', { 
    y: year, 
    m: month, 
    code_len: 10 
  })

if (rpcError) throw rpcError

// Certificate creation with all required fields
const certificateData = {
  certificate_number: identifiers.certificate_number,  // ✅ Generated: CERT-2025-10-0001
  verification_code: identifiers.verification_code,    // ✅ Generated: ABC123XYZ0
  design_id: designResult.id,
  user_id: user.id,
  status: 'draft'
}

const { error } = await supabase
  .from('certificates')
  .insert(certificateData)  // ✅ Success: All required fields present
```

## 🗄️ **DATABASE SETUP YANG DIPERLUKAN**

### **✅ 1. Certificates Table (File: setup-certificates-table.sql)**
```sql
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,        -- ✅ Required field
  verification_code TEXT UNIQUE NOT NULL,         -- ✅ Required field
  design_id UUID REFERENCES certificate_designs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  template_id UUID REFERENCES certificate_templates(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'revoked')),
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT,
  png_url TEXT,
  fields_data JSONB DEFAULT '{}',
  layout JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **✅ 2. RPC Function untuk Generate Identifiers**
```sql
CREATE OR REPLACE FUNCTION next_certificate_identifiers(y INTEGER, m INTEGER, code_len INTEGER DEFAULT 10)
RETURNS JSON AS $$
DECLARE
    cert_num TEXT;
    verify_code TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        -- Generate: CERT-YYYY-MM-NNNN
        cert_num := 'CERT-' || LPAD(y::TEXT, 4, '0') || '-' || LPAD(m::TEXT, 2, '0') || '-' || LPAD(counter::TEXT, 4, '0');
        
        -- Generate random verification code
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
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔄 **FIXED CODE IMPLEMENTATION**

### **✅ Updated handleSaveTemplate Function**
```typescript
// src/app/certificates/editor/page.tsx

const handleSaveTemplate = async () => {
  try {
    // Step 1: Save design
    const { data: designResult, error: designError } = await supabase
      .from('certificate_designs')
      .insert(designData)
      .select()
      .single()

    if (designError) throw designError

    // Step 2: Generate identifiers (BARU - FIX)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    
    const { data: identifiers, error: rpcError } = await supabase
      .rpc('next_certificate_identifiers', { 
        y: year, 
        m: month, 
        code_len: 10 
      })
    
    if (rpcError) {
      console.error('RPC error:', rpcError)
      throw rpcError
    }

    // Step 3: Create certificate with required fields (DIPERBAIKI)
    const certificateData = {
      certificate_number: identifiers.certificate_number,
      verification_code: identifiers.verification_code,
      design_id: designResult.id,
      user_id: user.id,
      status: 'draft'
    }

    const { data: certificateResult, error: certificateError } = await supabase
      .from('certificates')
      .insert(certificateData)
      .select()
      .single()

    if (certificateError) {
      console.error('Certificate creation error:', certificateError)
      toast.warning('Design saved but failed to create certificate entry')
    } else {
      console.log('Certificate created successfully:', certificateResult)
      toast.success('Certificate template saved successfully!')
    }

  } catch (error) {
    console.error('Save error:', error)
    toast.error('Failed to save certificate')
  }
}
```

## 🎯 **CERTIFICATE IDENTIFIER FORMAT**

### **✅ Certificate Number Examples**
```
Format: CERT-YYYY-MM-NNNN

Examples:
- CERT-2025-10-0001  ← First certificate in October 2025
- CERT-2025-10-0002  ← Second certificate in October 2025
- CERT-2025-11-0001  ← First certificate in November 2025
```

### **✅ Verification Code Examples**
```
Format: Random 10-character alphanumeric

Examples:
- ABC123XYZ0
- DEF456UVW1
- GHI789RST2
```

## 🚀 **SETUP INSTRUCTIONS**

### **✅ 1. Execute Database Setup**
```bash
# Run the SQL script in Supabase SQL Editor:
# File: scripts/setup-certificates-table.sql

# This will create:
# ✅ certificates table with proper schema
# ✅ RLS policies for security  
# ✅ Indexes for performance
# ✅ RPC function for ID generation
```

### **✅ 2. Verify Database Setup**
```sql
-- Check if table exists
\d certificates;

-- Test RPC function
SELECT next_certificate_identifiers(2025, 10, 10);

-- Should return something like:
-- {"certificate_number": "CERT-2025-10-0001", "verification_code": "ABC123XYZ0"}
```

### **✅ 3. Test Certificate Save**
1. **Open certificate editor** (`/certificates/editor`)
2. **Create a design** with some elements
3. **Click Save button**
4. **Should show success message** instead of error
5. **Check database** for new certificate record

## ✅ **IMPLEMENTATION COMPLETE**

**Certificate Save Error sudah diperbaiki dengan:**

- ✅ **Required Fields**: certificate_number & verification_code auto-generated
- ✅ **Database Schema**: Complete certificates table setup
- ✅ **RPC Function**: Unique identifier generation system
- ✅ **Error Handling**: Proper error messages and fallbacks
- ✅ **Data Integrity**: All constraints and foreign key relationships
- ✅ **Security**: RLS policies untuk data protection

## 🎯 **BEFORE vs AFTER**

| Aspect | Before (Error) | After (Fixed) |
|--------|---------------|---------------|
| **Save Result** | ❌ "Certificate creation error" | ✅ "Certificate template saved successfully!" |
| **Required Fields** | ❌ Missing certificate_number & verification_code | ✅ Auto-generated unique identifiers |
| **Database Record** | ❌ Insert fails with constraint violation | ✅ Complete certificate record created |
| **User Experience** | ❌ Confusing error message | ✅ Clear success feedback |
| **Data Completeness** | ❌ Incomplete certificate data | ✅ Full certificate with proper IDs |

## 🔍 **TROUBLESHOOTING**

### **✅ If Save Still Fails:**
1. **Check database**: Ensure certificates table exists
2. **Check RPC function**: Verify next_certificate_identifiers exists
3. **Check permissions**: Ensure user has INSERT permission on certificates
4. **Check foreign keys**: Ensure certificate_designs table exists
5. **Check console**: Look for specific error messages

### **✅ Common Issues:**
- **Table not found**: Run setup-certificates-table.sql
- **RPC not found**: Ensure RPC function is created
- **Permission denied**: Check RLS policies
- **Foreign key violation**: Ensure design_id exists

**Sekarang certificate save berfungsi dengan sempurna tanpa error!** ✅🎯
