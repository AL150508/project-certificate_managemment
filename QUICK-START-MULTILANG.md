# 🚀 Multi-Language Quick Start Guide

## ✅ Implementation Complete!

Fitur multi-bahasa sudah berhasil diimplementasikan! Ikuti langkah-langkah berikut untuk menggunakannya.

---

## 📋 What's Been Added

### **New Files Created:**

```
src/
├── types/
│   └── i18n.ts                          ✅ Types & interfaces
├── lib/
│   └── i18n/
│       ├── translations.ts              ✅ Manual translations (EN, ID)
│       ├── translate.ts                 ✅ Translation helpers
│       └── cache.ts                     ✅ Cache utility
├── app/
│   └── api/
│       └── translate/
│           └── route.ts                 ✅ Google Translate API
└── components/
    ├── LanguageSwitcher.tsx             ✅ Language switcher UI
    └── providers/
        ├── LanguageProvider.tsx         ✅ Language context
        └── ClientProviders.tsx          ✅ Updated with LanguageProvider

Documentation/
├── MULTI-LANGUAGE-GUIDE.md              ✅ Complete guide
├── IMPLEMENTATION-EXAMPLES.md           ✅ Code examples
├── ENV-TEMPLATE.md                      ✅ Environment setup
└── QUICK-START-MULTILANG.md             ✅ This file
```

---

## 🎯 Quick Start (3 Steps!)

### **STEP 1: Setup Google Translate API**

**1. Get API Key:**
- Go to: https://console.cloud.google.com/
- Create project → Enable "Cloud Translation API"
- Create API Key

**2. Add to Environment:**

Create `.env.local` in project root:

```env
GOOGLE_TRANSLATE_API_KEY=AIzaSy...your_key_here
```

**3. Restart Dev Server:**

```bash
npm run dev
```

---

### **STEP 2: Add Language Switcher to UI**

**Find your navbar component** (e.g., `src/components/Navbar.tsx` or similar):

```typescript
// Add this import
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// Add this to your navbar
<LanguageSwitcher variant="compact" />
```

**Example:**

```typescript
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div>Logo & Nav Links</div>
      
      <div className="flex items-center gap-4">
        {/* Add Language Switcher here */}
        <LanguageSwitcher variant="compact" />
        
        <button>Logout</button>
      </div>
    </nav>
  )
}
```

---

### **STEP 3: Update Components with Translations**

**Example: Update Login Page**

**Before:**
```typescript
<h1>Login to your account</h1>
<button>Login</button>
```

**After:**
```typescript
'use client'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function LoginPage() {
  const { t } = useLanguage()
  
  return (
    <>
      <h1>{t('auth.loginTitle')}</h1>
      <button>{t('auth.login')}</button>
    </>
  )
}
```

**That's it!** 🎉

---

## 🧪 Test It!

**1. Start dev server:**
```bash
npm run dev
```

**2. Open browser:**
```
http://localhost:3000
```

**3. Look for language switcher:**
```
🌐 🇺🇸 EN  ← Click this!
```

**4. Select language:**
```
🇺🇸 English
🇮🇩 Bahasa Indonesia  ← Try this!
🇫🇷 Français
🇪🇸 Español
```

**5. Watch UI change:**
```
"Login" → "Masuk"
"Dashboard" → "Dasbor"
"Certificates" → "Sertifikat"
```

---

## 📖 Available Translation Keys

### **Common:**
```typescript
t('common.save')        // Save / Simpan
t('common.cancel')      // Cancel / Batal
t('common.delete')      // Delete / Hapus
t('common.edit')        // Edit / Edit
t('common.create')      // Create / Buat
```

### **Auth:**
```typescript
t('auth.login')         // Login / Masuk
t('auth.logout')        // Logout / Keluar
t('auth.loginTitle')    // Login to your account / Masuk ke akun Anda
t('auth.email')         // Email / Email
t('auth.password')      // Password / Kata Sandi
```

### **Dashboard:**
```typescript
t('dashboard.title')    // Dashboard / Dasbor
t('dashboard.welcome')  // Welcome / Selamat Datang
```

### **Certificates:**
```typescript
t('certificates.title')           // Certificates / Sertifikat
t('certificates.newCertificate')  // New Certificate / Sertifikat Baru
t('certificates.certificateNumber') // Certificate Number / Nomor Sertifikat
```

### **Editor:**
```typescript
t('editor.title')          // Certificate Editor / Editor Sertifikat
t('editor.saveTemplate')   // Save Template / Simpan Template
t('editor.orientation')    // Orientation / Orientasi
```

**See full list in:** `src/lib/i18n/translations.ts`

---

## 🎨 Usage Patterns

### **Pattern 1: Static UI Text**

```typescript
const { t } = useLanguage()

<button>{t('common.save')}</button>
<h1>{t('dashboard.title')}</h1>
<label>{t('auth.email')}</label>
```

**Use for:** Buttons, labels, headings, static text

---

### **Pattern 2: Dynamic Database Content**

```typescript
const { translate, currentLanguage } = useLanguage()
const [translatedName, setTranslatedName] = useState('')

useEffect(() => {
  if (currentLanguage === 'en') {
    setTranslatedName('')
    return
  }
  
  translate(certificate.recipient_name).then(setTranslatedName)
}, [certificate, currentLanguage])

<h3>{translatedName || certificate.recipient_name}</h3>
```

**Use for:** Certificate names, template names, descriptions from database

---

### **Pattern 3: Toast Messages**

```typescript
const { t } = useLanguage()

toast.success(t('success.saved'))
toast.error(t('errors.generic'))
```

**Use for:** Success/error messages

---

## 🔧 Common Tasks

### **Add New Translation Key:**

**1. Update `src/lib/i18n/translations.ts`:**

```typescript
export const translations = {
  en: {
    // ... existing
    mySection: {
      title: 'My Title',
      button: 'Click Me',
    }
  },
  id: {
    // ... existing
    mySection: {
      title: 'Judul Saya',
      button: 'Klik Saya',
    }
  }
}
```

**2. Use in component:**

```typescript
const { t } = useLanguage()

<h1>{t('mySection.title')}</h1>
<button>{t('mySection.button')}</button>
```

---

### **Add New Language:**

**1. Update `src/lib/i18n/translations.ts`:**

```typescript
export const languageOptions = [
  // ... existing
  { code: 'pt' as LanguageCode, name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
]
```

**2. (Optional) Add manual translations:**

```typescript
export const translations = {
  // ... existing
  pt: {
    common: {
      save: 'Salvar',
      cancel: 'Cancelar',
      // ...
    }
  }
}
```

If you skip step 2, Google Translate will handle it automatically!

---

## 🐛 Troubleshooting

### **Problem: Language switcher not showing**

**Check:**
1. Is `<LanguageSwitcher />` added to your component?
2. Is component using `'use client'` directive?

---

### **Problem: Translations not working**

**Check:**
1. Is `GOOGLE_TRANSLATE_API_KEY` set in `.env.local`?
2. Did you restart dev server after adding `.env.local`?
3. Check browser console for errors

---

### **Problem: "Translation service is not configured"**

**Solution:**
```bash
# 1. Check .env.local exists
ls .env.local

# 2. Check API key is set
cat .env.local | grep GOOGLE_TRANSLATE_API_KEY

# 3. Restart dev server
npm run dev
```

---

## 💡 Tips

### **Tip 1: Use Translation Keys for Speed**

✅ **Fast (no API call):**
```typescript
t('common.save')  // Instant!
```

❌ **Slow (API call):**
```typescript
await translate('Save')  // ~500ms
```

---

### **Tip 2: Cache is Your Friend**

First time:
```typescript
await translate('Hello')  // API call (~500ms)
```

Second time:
```typescript
await translate('Hello')  // From cache (~1ms)
```

**99% faster!**

---

### **Tip 3: Batch Translations**

❌ **Slow:**
```typescript
for (const item of items) {
  await translate(item.name)  // 10 API calls
}
```

✅ **Fast:**
```typescript
const names = items.map(i => i.name)
const translated = await translateBatch(names)  // 1 API call
```

---

## 📊 What's Supported

### **✅ Supported Languages:**

- 🇺🇸 English (default)
- 🇮🇩 Bahasa Indonesia (manual translations)
- 🇫🇷 Français (Google Translate)
- 🇪🇸 Español (Google Translate)
- 🇩🇪 Deutsch (Google Translate)
- 🇯🇵 日本語 (Google Translate)
- 🇨🇳 中文 (Google Translate)

### **✅ Features:**

- Manual translations (EN ↔ ID)
- Google Translate integration
- Smart caching (localStorage)
- Rate limiting (100 req/hour)
- SSR safe
- TypeScript support
- Batch translations

### **✅ Components:**

- Language switcher (compact & full)
- Language indicator
- Translation context
- Translation hooks

---

## 📚 Documentation

**Full guides:**
- `MULTI-LANGUAGE-GUIDE.md` - Complete documentation
- `IMPLEMENTATION-EXAMPLES.md` - Code examples
- `ENV-TEMPLATE.md` - Environment setup

**Quick reference:**
- This file - Quick start guide

---

## 🎉 Summary

**What you need to do:**

1. ✅ Set `GOOGLE_TRANSLATE_API_KEY` in `.env.local`
2. ✅ Add `<LanguageSwitcher />` to navbar
3. ✅ Replace hardcoded strings with `t()` calls
4. ✅ Test with different languages

**What's already done:**

- ✅ All core files created
- ✅ Context provider setup
- ✅ API route configured
- ✅ Caching implemented
- ✅ Rate limiting added
- ✅ Documentation complete

**Status:** ✅ **READY TO USE!**

---

## 🚀 Next Steps

**To fully implement:**

1. **Add language switcher to navbar**
2. **Update login page** (see `IMPLEMENTATION-EXAMPLES.md`)
3. **Update certificates page**
4. **Update editor page**
5. **Update dashboard page**
6. **Test all pages**

**Estimated time:** 2-4 hours

**Happy translating!** 🌐🎉
