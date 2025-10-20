# Certificate Editor Guide

Panduan lengkap penggunaan Certificate Editor dengan template baru yang telah diimplementasikan.

## 🎯 Fitur yang Telah Diimplementasikan

### ✅ **Preview Template + Elemen Teks Dinamis**
- Preview real-time dengan scaling otomatis
- Menampilkan template background dengan elemen teks overlay
- Support untuk template config dengan positioning yang akurat
- Template info overlay menampilkan nama dan dimensi

### ✅ **Edit Posisi, Font, Warna, Align Tiap Elemen**
- Form editor lengkap untuk setiap elemen
- Edit posisi X, Y dengan input number
- Pilihan font family (Inter, Poppins, Roboto, Arial, Helvetica, Times New Roman)
- Font size dengan slider/input
- Color picker untuk warna teks
- Text alignment (left, center, right)
- Font weight dan text transform options

### ✅ **Simpan Hasil Edit ke certificate_designs**
- Tabel database `certificate_designs` untuk menyimpan konfigurasi
- Metadata lengkap termasuk template info dan element count
- RLS policies untuk keamanan user-specific data
- Error handling dengan pesan yang informatif

### ✅ **Integrasi Tombol Save Template**
- Tombol Save Template dengan loading state
- Validasi sebelum save (login, template, elements)
- Toast notifications untuk feedback user
- Simpan ke database dengan struktur yang proper

### ✅ **Template Utamakan dari File Baru**
- Prioritas template award yang baru ditambahkan
- 3 template baru: Red Award, Gold Award, Black Gold Award
- Auto-load elemen dari template config saat dipilih
- Template selector menampilkan preview gambar

## 🚀 Cara Penggunaan

### 1. **Setup Database**

Jalankan script setup untuk tabel certificate_designs:

```bash
# Setup categories (jika belum)
npm run setup:categories

# Setup certificate designs table
# Buka Supabase SQL Editor dan jalankan scripts/setup-certificate-designs.sql
```

### 2. **Setup Template Images**

Simpan gambar template di folder `public/templates/`:

```
public/templates/
├── Certificate-Template-Word-4-1.jpg    (Red Award)
├── Blank-Award-Certificate.jpg          (Gold Award)
└── OIP (1).webp                         (Black Gold Award)
```

### 3. **Menggunakan Editor**

#### **Langkah 1: Pilih Template**
1. Buka `/certificates/editor`
2. Pilih salah satu dari 3 template award baru
3. Template akan auto-load dengan elemen default

#### **Langkah 2: Edit Elemen**
1. Klik tombol elemen (Name, Description, Date, Number, Expired)
2. Isi nilai di form "Element Properties"
3. Sesuaikan posisi X, Y
4. Ubah font, size, warna, alignment
5. Preview akan update real-time

#### **Langkah 3: Simpan Design**
1. Klik tombol "Save Template" (merah, bottom right)
2. Design akan tersimpan ke database
3. Toast notification akan konfirmasi berhasil

## 📋 Template yang Tersedia

### **1. Red Award Certificate**
- **ID**: `template-red-award`
- **File**: `Certificate-Template-Word-4-1.jpg`
- **Orientasi**: Landscape (1024×768)
- **Layout**: Signature area kiri-kanan

### **2. Gold Award Certificate**
- **ID**: `template-gold-award`
- **File**: `Blank-Award-Certificate.jpg`
- **Orientasi**: Landscape (1024×768)
- **Layout**: Date/signature di bawah

### **3. Black Gold Award Certificate**
- **ID**: `template-black-gold-award`
- **File**: `OIP (1).webp`
- **Orientasi**: Portrait (794×1123)
- **Layout**: Signature area di bawah

## 🎨 Elemen yang Dapat Diedit

### **Name**
- Nama penerima sertifikat
- Default: Center alignment, bold font
- Posisi: Sesuai layout template

### **Description**
- Deskripsi pencapaian/kegiatan
- Support multi-line text
- Word wrapping otomatis

### **Date**
- Tanggal penerbitan
- Format: "19 Oktober 2025"
- Posisi: Biasanya di area signature

### **Number**
- Nomor sertifikat
- Format: "AWD-001", "CERT-001"
- Posisi: Corner atau signature area

### **Expired**
- Tanggal kadaluwarsa (opsional)
- Format: "19/10/2028"
- Visibility dapat di-toggle

## 🔧 Konfigurasi Lanjutan

### **Template Config Structure**

```typescript
{
  id: 'template-red-award',
  name: 'Red Award Certificate',
  dimensions: { width: 1024, height: 768 },
  orientation: 'landscape',
  category: 'award',
  elements: {
    name: {
      position: { x: 512, y: 200 },
      style: { fontSize: 28, alignment: 'center' },
      visible: true
    }
  }
}
```

### **Database Schema**

```sql
certificate_designs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  template_source TEXT,
  template_url TEXT,
  template_config_id TEXT,
  elements JSONB,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🐛 Troubleshooting

### **Template tidak muncul**
- Pastikan gambar ada di `public/templates/`
- Check nama file sesuai config
- Refresh browser (Ctrl+F5)

### **Save gagal**
- Pastikan user sudah login
- Check tabel `certificate_designs` sudah dibuat
- Lihat console untuk error detail

### **Preview tidak akurat**
- Posisi teks disesuaikan dengan scale factor
- Koordinat dalam template config mungkin perlu adjustment
- Test dengan data lengkap

### **Elemen tidak muncul**
- Check `visible: true` di element config
- Pastikan posisi X, Y dalam bounds template
- Verify font family tersedia

## 📊 Performance Tips

### **Optimasi Loading**
- Template images di-cache browser
- Preview menggunakan scale factor untuk performa
- Lazy loading untuk template selector

### **Memory Management**
- Elements array di-manage dengan React state
- Auto-cleanup saat ganti template
- Efficient re-rendering dengan proper keys

## 🔒 Security

### **RLS Policies**
- User hanya bisa akses design sendiri
- Template config read-only
- Proper authentication checks

### **Data Validation**
- Input sanitization di form
- Template config validation
- Error boundaries untuk crash protection

## 🚀 Next Steps

### **Planned Features**
- Drag & drop positioning
- More template categories
- Export to PDF/PNG
- Template sharing
- Batch certificate generation

### **Customization**
- Add more font families
- Custom color palettes
- Template marketplace
- Advanced text effects

---

**Certificate Editor siap digunakan dengan semua fitur yang diminta! 🎉**
