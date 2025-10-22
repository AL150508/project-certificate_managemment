# 🔧 FIX: Build Error - Environment Variables Missing

## ❌ ERROR YANG TERJADI

**Error Message:**
```
Error: @supabase/ssr: Your project's URL and API key are required
[Error: Failed to collect page data for /api/certificates]
Error: Command "npm run build" exited with 1
```

**Screenshot Error:**
- Line 1: `Error: @supabase/ssr: Your project's URL and API key are required`
- Line 2: `Build error occurred`
- Line 3: `Failed to collect page data for /api/certificates`

---

## 🎯 ROOT CAUSE

**Problem:** File `.env.local` tidak ada atau environment variables tidak terset!

**Why This Happens:**
1. `.env.local` di-gitignore (tidak di-commit ke git)
2. Saat clone/download project, file `.env.local` tidak ada
3. Next.js build membutuhkan Supabase URL dan API key
4. Tanpa environment variables, build gagal

---

## ✅ SOLUSI

### **STEP 1: Buat File `.env.local`**

**Di root project, buat file baru bernama `.env.local`:**

```bash
# Windows (PowerShell)
New-Item -Path ".env.local" -ItemType File

# Or copy from example
Copy-Item env.example.txt .env.local
```

---

### **STEP 2: Isi Environment Variables**

**Edit file `.env.local` dengan nilai yang benar:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Email Configuration (Optional - for email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=Certificate Manager <your-email@gmail.com>

# Base URL
NEXT_PUBLIC_PUBLIC_BASE_URL=http://localhost:3000
```

---

### **STEP 3: Dapatkan Supabase Credentials**

**Option A: Dari Supabase Dashboard**

1. Go to: https://supabase.com
2. Login ke project Anda
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjc1NjQwMCwiZXhwIjoxOTQ4MzMyNDAwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

---

**Option B: Buat Project Supabase Baru**

Jika belum punya project Supabase:

1. Go to: https://supabase.com
2. Click **"New Project"**
3. Isi:
   - **Name:** Certificate Management
   - **Database Password:** (buat password kuat)
   - **Region:** Southeast Asia (Singapore)
4. Wait 2-3 minutes untuk setup
5. Copy URL dan API key dari Settings → API

---

### **STEP 4: Restart Dev Server**

```bash
# Stop current server (Ctrl + C)

# Start again
npm run dev
```

---

### **STEP 5: Try Build Again**

```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
✓ Build completed successfully
```

---

## 🚀 FOR DEPLOYMENT

### **Vercel Deployment:**

**Set Environment Variables di Vercel Dashboard:**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your-supabase-url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your-anon-key
   - `NEXT_PUBLIC_PUBLIC_BASE_URL` = https://your-domain.vercel.app

5. Click **"Save"**
6. Redeploy project

---

### **Netlify Deployment:**

**Set Environment Variables di Netlify:**

1. Go to: https://app.netlify.com
2. Select your site
3. Go to: **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: your-supabase-url
6. Click **"Save"**
7. Trigger new deploy

---

## 📋 CHECKLIST

**Before Build:**
- ✅ File `.env.local` exists in root directory
- ✅ `NEXT_PUBLIC_SUPABASE_URL` is set
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- ✅ Values are correct (no placeholder text)
- ✅ No extra spaces in values
- ✅ File is saved

**Verify:**
```bash
# Check if file exists
ls .env.local

# Check if variables are loaded (in dev mode)
npm run dev
# Open browser console and check:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

---

## ⚠️ COMMON MISTAKES

### **1. File Name Wrong**
```
❌ .env
❌ env.local
❌ .env-local
✅ .env.local
```

### **2. Placeholder Values**
```
❌ NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
✅ NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
```

### **3. Extra Spaces**
```
❌ NEXT_PUBLIC_SUPABASE_URL = https://abc.supabase.co
✅ NEXT_PUBLIC_SUPABASE_URL=https://abc.supabase.co
```

### **4. Wrong Location**
```
❌ /src/.env.local
❌ /app/.env.local
✅ /.env.local (root directory)
```

---

## 🔍 TROUBLESHOOTING

### **Error: "Your project's URL and API key are required"**

**Check:**
```bash
# 1. File exists?
ls .env.local

# 2. Variables set?
cat .env.local

# 3. Restart dev server
npm run dev
```

---

### **Error: "Failed to collect page data"**

**Possible causes:**
1. Supabase URL wrong
2. API key wrong
3. Supabase project not accessible
4. Network issue

**Fix:**
1. Verify credentials in Supabase dashboard
2. Copy fresh values
3. Update `.env.local`
4. Restart server

---

### **Build works locally but fails on Vercel/Netlify**

**Fix:**
1. Check environment variables in deployment platform
2. Make sure all variables are set
3. Redeploy after setting variables
4. Check deployment logs for specific errors

---

## 📝 EXAMPLE .env.local FILE

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjc1NjQwMCwiZXhwIjoxOTQ4MzMyNDAwfQ.abcdefghijklmnopqrstuvwxyz1234567890

# Email Configuration (OPTIONAL - only if using email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Certificate Manager <your-email@gmail.com>

# Base URL (REQUIRED for production)
NEXT_PUBLIC_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🎉 SUMMARY

**Error:** Environment variables missing

**Root Cause:** `.env.local` file not created

**Solution:**
1. ✅ Create `.env.local` file in root directory
2. ✅ Copy from `env.example.txt`
3. ✅ Fill in Supabase URL and API key
4. ✅ Restart dev server
5. ✅ Run build again

**For Deployment:**
- ✅ Set environment variables in Vercel/Netlify dashboard
- ✅ Redeploy after setting variables

**BUKAN ERROR DI CODE - INI CONFIGURATION ISSUE!** 🔧✅
