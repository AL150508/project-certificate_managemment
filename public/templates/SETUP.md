# Template Images Setup

## 📋 Instruksi Setup Template

Untuk menggunakan template baru yang telah dikonfigurasi, Anda perlu menyimpan gambar template di folder ini.

### 🖼️ Gambar yang Diperlukan:

1. **Certificate-Template-Word-4-1.jpg**
   - Template sertifikat award merah dan emas
   - Ukuran: 1024x768 (landscape)
   - Digunakan untuk: `template-red-award`

2. **Blank-Award-Certificate.jpg**
   - Template sertifikat award emas klasik
   - Ukuran: 1024x768 (landscape)
   - Digunakan untuk: `template-gold-award`

3. **OIP (1).webp**
   - Template sertifikat award hitam emas elegan
   - Ukuran: 794x1123 (portrait)
   - Digunakan untuk: `template-black-gold-award`

### 📁 Struktur Folder:

```
public/templates/
├── Certificate-Template-Word-4-1.jpg
├── Blank-Award-Certificate.jpg
├── OIP (1).webp
├── README.md
└── SETUP.md (file ini)
```

### 🚀 Cara Setup:

1. **Download/Simpan Gambar**
   - Simpan ketiga gambar template ke folder `public/templates/`
   - Pastikan nama file sesuai dengan yang dikonfigurasi

2. **Verifikasi Setup**
   - Buka aplikasi di browser
   - Navigate ke `/certificates/editor`
   - Template baru harus muncul di Template Selector

3. **Test Template**
   - Klik salah satu template baru
   - Pastikan gambar muncul di preview
   - Test positioning teks dengan mengisi form

### 🔧 Troubleshooting:

**Template tidak muncul:**
- Periksa nama file harus persis sama
- Pastikan file ada di folder `public/templates/`
- Refresh browser (Ctrl+F5)

**Gambar tidak load:**
- Periksa format file (JPG, PNG, WebP)
- Pastikan ukuran file tidak terlalu besar (< 5MB)
- Check console browser untuk error

**Posisi teks tidak tepat:**
- Edit konfigurasi di `src/config/template-configs.ts`
- Sesuaikan koordinat X, Y untuk setiap elemen
- Test dengan data preview

### 📊 Template Configuration:

Template sudah dikonfigurasi dengan posisi teks yang optimal:

- **Red Award**: Landscape dengan signature area di kiri-kanan
- **Gold Award**: Landscape dengan date/signature di bawah
- **Black Gold**: Portrait dengan signature area di bawah

### 🎨 Customization:

Untuk mengubah posisi teks, edit file:
`src/config/template-configs.ts`

Contoh:
```typescript
name: {
  position: { x: 512, y: 200 }, // Center X, Y position
  style: { 
    fontSize: 28, 
    color: '#1a1a1a',
    alignment: 'center'
  }
}
```

### ✅ Checklist Setup:

- [ ] Gambar Certificate-Template-Word-4-1.jpg tersimpan
- [ ] Gambar Blank-Award-Certificate.jpg tersimpan  
- [ ] Gambar OIP (1).webp tersimpan
- [ ] Template muncul di selector
- [ ] Preview gambar berfungsi
- [ ] Posisi teks sesuai layout
- [ ] Test dengan data lengkap

---

**Selamat! Template baru siap digunakan! 🎉**
