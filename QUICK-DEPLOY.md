# 🚀 Quick Deploy - Vercel

**5-Minute Deployment Guide**

---

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account
- ✅ Supabase project

---

## Step 1: Get Supabase Credentials (2 min)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 2: Push to GitHub (1 min)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 3: Deploy to Vercel (2 min)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Add Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Click "Deploy"

---

## Step 4: Update Supabase (1 min)

1. Go to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Set Site URL: `https://your-app.vercel.app`
4. Add Redirect URL: `https://your-app.vercel.app/**`

---

## ✅ Done!

Visit: `https://your-app.vercel.app`

---

## Troubleshooting

### 500 Error?
- ✅ Check environment variables in Vercel
- ✅ Redeploy after adding env vars

### Can't Login?
- ✅ Update Supabase Site URL
- ✅ Check Redirect URLs

### Database Errors?
- ✅ Run setup script in Supabase SQL Editor
- ✅ File: `FINAL-SUPABASE-SETUP.sql`

---

**Need detailed guide?** See `DEPLOYMENT-GUIDE.md`
