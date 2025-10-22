# 🔍 ANALISIS MASALAH: Certificate Tidak Muncul Setelah Save Template

## 📋 RINGKASAN MASALAH

**Gejala:**
- User klik "Save Template" di Certificate Editor
- Template BERHASIL masuk ke database Supabase
- Certificate TIDAK muncul di halaman `/certificates`

---

## ✅ YANG SUDAH BENAR

### **1. Data BERHASIL Tersimpan ke Database**

Berdasarkan kode di `src/app/certificates/editor/page.tsx` (line 215-526), proses save sudah benar:

```typescript
// STEP 1: Save to certificate_templates ✅
const { data: templateResult } = await supabase
  .from('certificate_templates')
  .insert(templateData)

// STEP 2: Save to certificate_designs ✅
const { data: designResult } = await supabase
  .from('certificate_designs')
  .insert(designData)

// STEP 3: Save to certificates ✅
const { data: certResult } = await supabase
  .from('certificates')
  .insert(certificateData)
```

**Kesimpulan:** Data SUDAH masuk ke 3 tabel dengan benar!

---

## ❌ AKAR MASALAH

### **Masalah Utama: Certificate Status = 'draft'**

**Line 448 di `editor/page.tsx`:**
```typescript
const certificateData = {
  certificate_number: certificateNumber,
  template_id: templateResult.id,
  member_id: selectedMember || null,
  category_id: selectedCategory || null,
  recipient_name: templateName, // ← Menggunakan template name
  issue_date: now.toISOString().split('T')[0],
  status: 'draft', // ← MASALAH DI SINI!
  created_by: currentUser.id,
  // ...
}
```

**Kenapa ini masalah?**
- Certificate disimpan dengan `status: 'draft'`
- Halaman `/certificates` menampilkan SEMUA certificate (tidak filter by status)
- TAPI: Certificate dari editor menggunakan `recipient_name: templateName` bukan nama member sebenarnya

---

## 🔍 ANALISIS DETAIL

### **1. Data Yang Tersimpan:**

**Di tabel `certificates`:**
```json
{
  "certificate_number": "CERT-2025-10-1234",
  "template_id": "uuid-template",
  "member_id": null,  // ← Bisa null jika tidak pilih member
  "category_id": "uuid-category",
  "recipient_name": "Default Landscape", // ← Nama template, bukan nama orang!
  "issue_date": "2025-10-22",
  "status": "draft", // ← Status draft
  "certificate_data": {
    "elements": [...],
    "orientation": "landscape",
    "templateSource": {...}
  },
  "metadata": {
    "source": "editor",
    "templateName": "Default Landscape",
    "designId": "uuid-design"
  }
}
```

### **2. Halaman Certificates Menampilkan:**

**File:** `src/app/certificates/CertificatesClient.tsx`

**Line 95-98:**
```typescript
const { data: certData } = await supabase
  .from("certificates")
  .select("...")
  .order("created_at", { ascending: false })
```

**Tidak ada filter status!** Jadi seharusnya certificate muncul.

### **3. Display Name:**

**Line 150:**
```typescript
member_name: r.recipient_name || (r.member_id ? membersMap.get(r.member_id) ?? null : null)
```

Certificate akan tampil dengan nama:
- `recipient_name` = "Default Landscape" (nama template)
- Atau `member_name` dari tabel members (jika member_id ada)

---

## 🎯 KEMUNGKINAN PENYEBAB

### **Penyebab #1: User Tidak Scroll atau Refresh**
- Certificate tersimpan di database
- User tidak refresh halaman `/certificates`
- Certificate ada di list tapi tidak terlihat

### **Penyebab #2: Filter Status di Frontend**
- Mungkin ada filter di frontend yang hide certificate dengan status 'draft'
- Perlu check component `CertificatesClient.tsx` lebih lanjut

### **Penyebab #3: Redirect Terlalu Cepat**
**Line 490-496:**
```typescript
setTimeout(() => {
  router.push('/certificates?refresh=true')
  setTimeout(() => {
    window.location.href = '/certificates'
  }, 100)
}, 1000)
```

- Ada 2 redirect dalam 1.1 detik
- Database transaction mungkin belum selesai
- Data belum ter-commit sepenuhnya

### **Penyebab #4: Nama Certificate Membingungkan**
- Certificate tersimpan dengan nama template (e.g., "Default Landscape")
- User mencari dengan nama member
- Certificate tidak terlihat karena nama tidak sesuai ekspektasi

---

## ✅ SOLUSI YANG DIREKOMENDASIKAN

### **Solusi 1: Ubah Status dari 'draft' ke 'issued'**

**File:** `src/app/certificates/editor/page.tsx`

**Line 448, ubah:**
```typescript
status: 'draft', // ← UBAH INI
```

**Menjadi:**
```typescript
status: 'issued', // ← Certificate langsung aktif
```

**Atau tambahkan pilihan:**
```typescript
status: selectedMember ? 'issued' : 'draft', // Jika ada member = issued, jika tidak = draft
```

---

### **Solusi 2: Perbaiki Recipient Name**

**Line 446, ubah:**
```typescript
recipient_name: templateName, // ← Nama template
```

**Menjadi:**
```typescript
recipient_name: selectedMember 
  ? members.find(m => m.id === selectedMember)?.name 
  : `Template: ${templateName}`, // Lebih jelas ini template
```

---

### **Solusi 3: Tambah Delay Sebelum Redirect**

**Line 490, ubah:**
```typescript
setTimeout(() => {
  router.push('/certificates?refresh=true')
  setTimeout(() => {
    window.location.href = '/certificates'
  }, 100)
}, 1000) // ← 1 detik
```

**Menjadi:**
```typescript
setTimeout(() => {
  window.location.href = '/certificates'
}, 2000) // ← 2 detik, cukup untuk database commit
```

---

### **Solusi 4: Tambah Filter Status di UI**

**File:** `src/app/certificates/CertificatesClient.tsx`

Tambahkan filter untuk show/hide draft certificates:

```typescript
const [showDrafts, setShowDrafts] = useState(true)

// Di render:
<Select value={showDrafts ? 'all' : 'issued'} onValueChange={(v) => setShowDrafts(v === 'all')}>
  <SelectItem value="all">All Certificates</SelectItem>
  <SelectItem value="issued">Issued Only</SelectItem>
  <SelectItem value="draft">Drafts Only</SelectItem>
</Select>

// Di filter:
const filtered = certs.filter(cert => {
  if (!showDrafts && cert.status === 'draft') return false
  // ... other filters
  return true
})
```

---

## 🧪 CARA VERIFIKASI MASALAH

### **1. Check Database Langsung:**

**Buka Supabase Dashboard → SQL Editor:**

```sql
-- Check apakah certificate tersimpan
SELECT 
  certificate_number,
  recipient_name,
  status,
  member_id,
  category_id,
  created_at,
  metadata
FROM certificates
ORDER BY created_at DESC
LIMIT 10;
```

**Expected Result:**
- Ada certificate baru dengan status 'draft'
- `recipient_name` = nama template (e.g., "Default Landscape")
- `metadata.source` = 'editor'

### **2. Check di Browser Console:**

**Saat save template, console harus show:**
```
=== SAVE TEMPLATE BUTTON CLICKED ===
✅ Validation passed
✅ Database connection successful
=== STEP 1: Saving to certificate_templates ===
Template saved successfully: { id: "...", name: "..." }
=== STEP 2: Saving to certificate_designs ===
Design saved successfully: { id: "...", template_id: "..." }
=== STEP 3: Saving to certificates table ===
✅ Certificate saved to main table: { id: "...", certificate_number: "CERT-..." }
=== SAVE COMPLETED SUCCESSFULLY ===
🔄 Redirecting to /certificates...
```

**Jika tidak ada error di console = data SUDAH tersimpan!**

### **3. Check di Halaman /certificates:**

**Buka:** `http://localhost:3000/certificates`

**Cari certificate dengan:**
- Certificate Number: `CERT-2025-10-xxxx`
- Recipient Name: Nama template (e.g., "Default Landscape")
- Status: Draft

**Jika tidak muncul:**
- Refresh halaman (Ctrl + Shift + R)
- Check filter status
- Check search box (kosongkan)

---

## 📊 KESIMPULAN

### **Root Cause:**
Certificate SUDAH tersimpan ke database, tapi:
1. Status = 'draft' (mungkin di-filter di frontend)
2. Recipient name = nama template (bukan nama member)
3. Redirect terlalu cepat (data belum fully committed)
4. User tidak refresh halaman

### **Quick Fix:**
Ubah status dari 'draft' ke 'issued' dan tambah delay redirect.

### **Proper Fix:**
1. Ubah status logic
2. Perbaiki recipient name
3. Tambah delay redirect
4. Tambah filter status di UI
5. Tambah loading indicator

---

## 🛠️ IMPLEMENTASI FIX

Saya akan implementasi fix yang paling sederhana dulu:
1. Ubah status ke 'issued'
2. Perbaiki recipient name
3. Tambah delay redirect

Apakah Anda ingin saya implementasikan fix ini sekarang?
