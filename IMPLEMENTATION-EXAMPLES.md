# 🎯 Implementation Examples

## How to Update Existing Pages with Multi-Language

---

## Example 1: Login Page

### **Before (Hardcoded English):**

```typescript
// src/app/login/page.tsx
export default function LoginPage() {
  return (
    <div>
      <h1>Login to your account</h1>
      <p>Enter your credentials to manage certificates</p>
      
      <form>
        <label>Email</label>
        <input type="email" placeholder="Enter your email" />
        
        <label>Password</label>
        <input type="password" placeholder="Enter your password" />
        
        <button>Login</button>
        <button>Continue as Guest</button>
      </form>
    </div>
  )
}
```

### **After (Multi-Language):**

```typescript
// src/app/login/page.tsx
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function LoginPage() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('auth.loginTitle')}</h1>
      <p>{t('auth.loginSubtitle')}</p>
      
      <form>
        <label>{t('auth.email')}</label>
        <input type="email" placeholder={t('auth.email')} />
        
        <label>{t('auth.password')}</label>
        <input type="password" placeholder={t('auth.password')} />
        
        <button>{t('auth.login')}</button>
        <button>{t('auth.continueAsGuest')}</button>
      </form>
    </div>
  )
}
```

**Result:**
- English: "Login to your account"
- Indonesian: "Masuk ke akun Anda"
- French: "Connectez-vous à votre compte" (auto-translated)

---

## Example 2: Certificates Page

### **Before:**

```typescript
// src/app/certificates/page.tsx
export default function CertificatesPage() {
  return (
    <div>
      <h1>Certificates</h1>
      <p>List of all certificates that have been created</p>
      
      <button>+ New Certificate</button>
      <button>Refresh 🔄</button>
      
      <input placeholder="Search number / member / category" />
      
      <table>
        <thead>
          <tr>
            <th>Certificate Number</th>
            <th>Member</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
  )
}
```

### **After:**

```typescript
// src/app/certificates/page.tsx
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function CertificatesPage() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('certificates.title')}</h1>
      <p>{t('certificates.subtitle')}</p>
      
      <button>{t('certificates.newCertificate')}</button>
      <button>{t('certificates.refresh')}</button>
      
      <input placeholder={t('certificates.searchPlaceholder')} />
      
      <table>
        <thead>
          <tr>
            <th>{t('certificates.certificateNumber')}</th>
            <th>{t('certificates.member')}</th>
            <th>{t('certificates.category')}</th>
            <th>{t('certificates.status')}</th>
            <th>{t('certificates.actions')}</th>
          </tr>
        </thead>
      </table>
    </div>
  )
}
```

---

## Example 3: Certificate Editor

### **Before:**

```typescript
// src/app/certificates/editor/page.tsx
export default function EditorPage() {
  return (
    <div>
      <h1>Certificate Editor</h1>
      <p>Design and customize your certificate templates</p>
      
      <div>
        <label>Orientation</label>
        <button>Portrait</button>
        <button>Landscape</button>
      </div>
      
      <button>Save Template</button>
    </div>
  )
}
```

### **After:**

```typescript
// src/app/certificates/editor/page.tsx
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function EditorPage() {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('editor.title')}</h1>
      <p>{t('editor.subtitle')}</p>
      
      <div>
        <label>{t('editor.orientation')}</label>
        <button>{t('editor.portrait')}</button>
        <button>{t('editor.landscape')}</button>
      </div>
      
      <button>{t('editor.saveTemplate')}</button>
    </div>
  )
}
```

---

## Example 4: Translating Database Content

### **Scenario: Certificate names from database**

```typescript
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useEffect, useState } from 'react'

export default function CertificateList() {
  const { translate, currentLanguage } = useLanguage()
  const [certificates, setCertificates] = useState([])
  const [translatedData, setTranslatedData] = useState<Record<string, any>>({})
  
  // Fetch certificates from database
  useEffect(() => {
    async function fetchCerts() {
      const { data } = await supabase
        .from('certificates')
        .select('*')
      
      setCertificates(data || [])
    }
    
    fetchCerts()
  }, [])
  
  // Translate certificate data when language changes
  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedData({})
      return
    }
    
    async function translateCerts() {
      const translations: Record<string, any> = {}
      
      for (const cert of certificates) {
        translations[cert.id] = {
          recipient_name: await translate(cert.recipient_name),
          // Don't translate certificate_number (it's a code)
          // Don't translate dates
          // Only translate text fields
        }
      }
      
      setTranslatedData(translations)
    }
    
    translateCerts()
  }, [certificates, currentLanguage])
  
  return (
    <div>
      {certificates.map(cert => (
        <div key={cert.id}>
          <h3>
            {translatedData[cert.id]?.recipient_name || cert.recipient_name}
          </h3>
          <p>Certificate Number: {cert.certificate_number}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Example 5: Adding Language Switcher to Navbar

### **Update Navbar Component:**

```typescript
// src/components/Navbar.tsx
'use client'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function Navbar() {
  const { t } = useLanguage()
  
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Certificate Manager</h1>
        
        <a href="/dashboard">{t('dashboard.title')}</a>
        <a href="/certificates">{t('certificates.title')}</a>
        <a href="/templates">{t('templates.title')}</a>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <LanguageSwitcher variant="compact" />
        
        <button>{t('auth.logout')}</button>
      </div>
    </nav>
  )
}
```

---

## Example 6: Toast Messages with Translation

### **Before:**

```typescript
import { toast } from 'sonner'

function handleSave() {
  try {
    // Save logic
    toast.success('Saved successfully')
  } catch (error) {
    toast.error('Failed to save')
  }
}
```

### **After:**

```typescript
import { toast } from 'sonner'
import { useLanguage } from '@/components/providers/LanguageProvider'

function MyComponent() {
  const { t } = useLanguage()
  
  function handleSave() {
    try {
      // Save logic
      toast.success(t('success.saved'))
    } catch (error) {
      toast.error(t('errors.generic'))
    }
  }
  
  return <button onClick={handleSave}>{t('common.save')}</button>
}
```

---

## Example 7: Form Validation Messages

### **Before:**

```typescript
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
```

### **After:**

```typescript
import { useLanguage } from '@/components/providers/LanguageProvider'

function MyForm() {
  const { t } = useLanguage()
  
  const schema = z.object({
    email: z.string().email(t('errors.invalidEmail')),
    password: z.string().min(8, t('errors.requiredField')),
  })
  
  // ... rest of form
}
```

---

## Example 8: Batch Translation (Efficient)

### **Scenario: Translate multiple items at once**

```typescript
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'
import { useEffect, useState } from 'react'

export default function TemplateList() {
  const { translateBatch, currentLanguage } = useLanguage()
  const [templates, setTemplates] = useState([])
  const [translatedNames, setTranslatedNames] = useState<string[]>([])
  
  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase
        .from('certificate_templates')
        .select('*')
      
      setTemplates(data || [])
    }
    
    fetchTemplates()
  }, [])
  
  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedNames([])
      return
    }
    
    async function translateNames() {
      const names = templates.map(t => t.name)
      const translated = await translateBatch(names)
      setTranslatedNames(translated)
    }
    
    translateNames()
  }, [templates, currentLanguage])
  
  return (
    <div>
      {templates.map((template, index) => (
        <div key={template.id}>
          <h3>{translatedNames[index] || template.name}</h3>
        </div>
      ))}
    </div>
  )
}
```

**Benefits of batch translation:**
- Single API call for multiple texts
- Faster than individual translations
- More efficient caching

---

## Example 9: Conditional Translation

### **Scenario: Only translate certain fields**

```typescript
'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

export default function CertificateCard({ certificate }: { certificate: any }) {
  const { translate, currentLanguage } = useLanguage()
  const [translatedName, setTranslatedName] = useState('')
  
  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedName('')
      return
    }
    
    // Only translate recipient_name, not certificate_number or dates
    translate(certificate.recipient_name).then(setTranslatedName)
  }, [certificate, currentLanguage])
  
  return (
    <div>
      <h3>{translatedName || certificate.recipient_name}</h3>
      <p>Certificate Number: {certificate.certificate_number}</p>
      <p>Issue Date: {certificate.issue_date}</p>
    </div>
  )
}
```

**What to translate:**
- ✅ Names, descriptions, labels
- ✅ UI text, buttons, headings
- ✅ Error messages, success messages

**What NOT to translate:**
- ❌ Certificate numbers (codes)
- ❌ Dates (format instead)
- ❌ Email addresses
- ❌ Phone numbers
- ❌ URLs

---

## Example 10: Language-Specific Formatting

### **Dates:**

```typescript
import { useLanguage } from '@/components/providers/LanguageProvider'

function DateDisplay({ date }: { date: string }) {
  const { currentLanguage } = useLanguage()
  
  const formatted = new Date(date).toLocaleDateString(
    currentLanguage === 'id' ? 'id-ID' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
  
  return <span>{formatted}</span>
}

// Output:
// EN: "October 22, 2025"
// ID: "22 Oktober 2025"
```

### **Numbers:**

```typescript
import { useLanguage } from '@/components/providers/LanguageProvider'

function NumberDisplay({ value }: { value: number }) {
  const { currentLanguage } = useLanguage()
  
  const formatted = value.toLocaleString(
    currentLanguage === 'id' ? 'id-ID' : 'en-US'
  )
  
  return <span>{formatted}</span>
}

// Output:
// EN: "1,234,567"
// ID: "1.234.567"
```

---

## 🎯 Best Practices

### **1. Use Translation Keys for UI:**

✅ **Good:**
```typescript
<button>{t('common.save')}</button>
```

❌ **Bad:**
```typescript
<button>{await translate('Save')}</button>
```

**Why:** Translation keys are faster (no API call) and more reliable.

---

### **2. Use translate() for Dynamic Content:**

✅ **Good:**
```typescript
const translatedName = await translate(certificate.recipient_name)
```

❌ **Bad:**
```typescript
const translatedName = t('certificate.name') // This won't work for dynamic data
```

**Why:** Dynamic content from database needs Google Translate.

---

### **3. Handle Loading States:**

✅ **Good:**
```typescript
const [translatedText, setTranslatedText] = useState('')
const [isTranslating, setIsTranslating] = useState(false)

useEffect(() => {
  setIsTranslating(true)
  translate(text).then(result => {
    setTranslatedText(result)
    setIsTranslating(false)
  })
}, [text, currentLanguage])

return isTranslating ? 'Loading...' : translatedText
```

❌ **Bad:**
```typescript
const translatedText = await translate(text) // This will block rendering
```

---

### **4. Avoid Over-Translation:**

✅ **Good:**
```typescript
// Only translate once when language changes
useEffect(() => {
  translateData()
}, [currentLanguage])
```

❌ **Bad:**
```typescript
// Translates on every render
const translatedText = await translate(text)
```

---

## 📝 Summary

**Key Points:**
1. ✅ Use `t()` for UI strings (fast, free)
2. ✅ Use `translate()` for database content (cached)
3. ✅ Use `translateBatch()` for multiple items (efficient)
4. ✅ Handle loading states properly
5. ✅ Don't translate codes, dates, emails
6. ✅ Add `<LanguageSwitcher />` to navbar
7. ✅ Test with different languages

**Ready to implement!** 🚀
