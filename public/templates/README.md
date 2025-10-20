# Template Images

Folder ini berisi gambar template sertifikat yang digunakan dalam aplikasi.

## Template yang Tersedia:

### 1. Certificate-Template-Word-4-1.jpg
- **Template ID**: `template-red-award`
- **Deskripsi**: Template sertifikat award dengan desain merah dan emas
- **Orientasi**: Landscape (1024x768)
- **Kategori**: Award

### 2. Blank-Award-Certificate.jpg
- **Template ID**: `template-gold-award`
- **Deskripsi**: Template sertifikat award dengan desain emas klasik
- **Orientasi**: Landscape (1024x768)
- **Kategori**: Award

### 3. OIP (1).webp
- **Template ID**: `template-black-gold-award`
- **Deskripsi**: Template sertifikat award dengan desain hitam emas elegan
- **Orientasi**: Portrait (794x1123)
- **Kategori**: Award

## Cara Menambah Template Baru:

1. Simpan gambar template di folder ini
2. Update konfigurasi di `src/config/template-configs.ts`
3. Tambahkan metadata `backgroundImage` dengan nama file
4. Sesuaikan posisi teks dengan layout gambar

## Format yang Didukung:

- JPG/JPEG
- PNG
- WebP
- SVG

## Rekomendasi Ukuran:

- **Portrait**: 794x1123 (A4)
- **Landscape**: 1123x794 (A4 Landscape) atau 1024x768
- **Resolution**: Minimal 300 DPI untuk kualitas print yang baik
