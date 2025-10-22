# 🚀 Deployment Guide - Vercel + Supabase

**Date:** October 22, 2025  
**Status:** ✅ PRODUCTION READY

## Prerequisites

### 1. Accounts Required
- ✅ [Vercel Account](https://vercel.com) - For hosting
- ✅ [Supabase Account](https://supabase.com) - For database & auth
- ✅ [GitHub Account](https://github.com) - For repository

### 2. Project Requirements
- ✅ Next.js 15.5.5
- ✅ Node.js 18+ or 20+
- ✅ npm or yarn or pnpm

---

## Step 1: Prepare Supabase

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name:** `certificate-manager` (or your choice)
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to your users
4. Click "Create new project"
5. Wait for project to be ready (~2 minutes)

### 1.2 Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (optional)

### 1.3 Setup Database Tables

1. Go to **SQL Editor** in Supabase Dashboard
2. Run these scripts in order:

**Script 1: Create Tables**
```sql
-- Run scripts from /scripts/ folder in this order:
-- 1. create-categories-table.sql
-- 2. setup-all-tables.sql
-- 3. SETUP-RLS-POLICIES.sql
```

Or use the combined script:
```sql
-- Copy content from FINAL-SUPABASE-SETUP.sql
-- Run in SQL Editor
```

### 1.4 Setup Storage

1. Go to **Storage** in Supabase Dashboard
2. Create buckets:
   - `certificates` (public)
   - `templates` (public)
   - `previews` (public)
3. Set bucket policies to allow public read

Or run:
```sql
-- Copy content from supabase-storage-setup.sql
-- Run in SQL Editor
```

### 1.5 Setup Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Go to **Authentication** → **URL Configuration**
5. Add your site URL:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** `https://your-app.vercel.app/**`

---

## Step 2: Prepare GitHub Repository

### 2.1 Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Certificate Manager"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/certificate-manager.git

# Push
git push -u origin main
```

### 2.2 Verify Repository

- ✅ All files pushed
- ✅ `.env.local` is in `.gitignore` (DO NOT commit secrets!)
- ✅ `node_modules` is in `.gitignore`

---

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository: `certificate-manager`

### 3.2 Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as is)

**Build Command:** `npm run build` (default)

**Output Directory:** `.next` (default)

**Install Command:** `npm install` (default)

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role (OPTIONAL - for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration (OPTIONAL - for email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Public Base URL (OPTIONAL - for email links)
NEXT_PUBLIC_PUBLIC_BASE_URL=https://your-app.vercel.app
```

**Important:**
- ✅ Add to **Production**, **Preview**, and **Development**
- ✅ Double-check no typos in keys
- ✅ Make sure URLs don't have trailing slashes

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-5 minutes)
3. ✅ Deployment successful!

---

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Site URL

1. Go to Supabase Dashboard
2. Go to **Authentication** → **URL Configuration**
3. Update:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** Add `https://your-app.vercel.app/**`

### 4.2 Test Deployment

Visit your deployed site:
```
https://your-app.vercel.app
```

**Test Checklist:**
- [ ] Homepage loads
- [ ] Login page works
- [ ] Can create account
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can create certificate
- [ ] Certificate appears in list
- [ ] Verification page works (`/cek/[code]`)

---

## Common Deployment Issues & Solutions

### Issue 1: `MIDDLEWARE_INVOCATION_FAILED`

**Error:**
```
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
```

**Cause:** Middleware crashes due to missing environment variables

**Solution:** ✅ ALREADY FIXED
- Middleware now has error handling
- Continues without auth if env vars missing
- Logs helpful error messages

**File:** `src/middleware.ts` (lines 11-21)

---

### Issue 2: Missing Environment Variables

**Error:**
```
Error: Missing Supabase environment variables
```

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all required variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy:
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### Issue 3: Build Fails

**Error:**
```
Error: Failed to collect page data
```

**Solution:** ✅ ALREADY FIXED
- Lazy initialization for Supabase clients
- Runtime validation instead of build-time
- Proper error handling

**Files:**
- `src/lib/supabase-server.ts`
- `src/app/cek/[param]/page.tsx`

---

### Issue 4: Authentication Not Working

**Symptoms:**
- Can't login
- Session not persisting
- Redirects not working

**Solution:**
1. Check Supabase Site URL matches your Vercel URL
2. Check Redirect URLs include your Vercel URL
3. Clear browser cookies and try again
4. Check Vercel logs for errors:
   ```
   Vercel Dashboard → Your Project → Deployments → [Latest] → Function Logs
   ```

---

### Issue 5: Database Connection Errors

**Error:**
```
Error: relation "certificates" does not exist
```

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run setup scripts:
   - `FINAL-SUPABASE-SETUP.sql`
3. Verify tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

---

### Issue 6: Storage/Upload Errors

**Error:**
```
Error: new row violates row-level security policy
```

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Check bucket policies
3. Run storage setup script:
   - `supabase-storage-setup.sql`
4. Or manually set policies to allow public read

---

## Monitoring & Logs

### Vercel Logs

**Real-time Logs:**
1. Go to Vercel Dashboard
2. Your Project → Deployments
3. Click on latest deployment
4. Click "Function Logs" tab
5. See real-time logs

**Search Logs:**
- Filter by severity: Error, Warning, Info
- Search by keyword
- Download logs

### Supabase Logs

**Database Logs:**
1. Go to Supabase Dashboard
2. Logs → Database
3. See query logs, errors

**API Logs:**
1. Logs → API
2. See all API requests
3. Filter by status code

---

## Performance Optimization

### 1. Enable Caching

Vercel automatically caches:
- ✅ Static pages
- ✅ API routes (with proper headers)
- ✅ Images (via Next.js Image Optimization)

### 2. Enable Edge Functions (Optional)

For faster response times globally:

1. Update `next.config.ts`:
```typescript
export default {
  // ... other config
  experimental: {
    runtime: 'edge', // Use Edge Runtime
  },
}
```

2. Redeploy

### 3. Database Optimization

**Enable Connection Pooling:**
1. Go to Supabase Dashboard → Settings → Database
2. Enable "Connection Pooling"
3. Use pooled connection string in production

**Add Indexes:**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_certificates_member_id ON certificates(member_id);
CREATE INDEX idx_certificates_category_id ON certificates(category_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_created_at ON certificates(created_at DESC);
```

---

## Security Checklist

### Before Going Live:

- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ `.env.local` in `.gitignore`
- [ ] ✅ No secrets in code
- [ ] ✅ RLS policies enabled in Supabase
- [ ] ✅ Storage policies configured
- [ ] ✅ CORS configured (if using external APIs)
- [ ] ✅ Rate limiting enabled (Vercel Pro)
- [ ] ✅ HTTPS enforced (automatic on Vercel)
- [ ] ✅ CSP headers configured (optional)

### Supabase Security:

- [ ] ✅ Row Level Security (RLS) enabled on all tables
- [ ] ✅ Service role key kept secret (only in Vercel env vars)
- [ ] ✅ Anon key is public (safe to expose)
- [ ] ✅ Database password is strong
- [ ] ✅ 2FA enabled on Supabase account

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `example.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (~5-60 minutes)
5. Update Supabase Site URL to your custom domain

### SSL Certificate:

- ✅ Automatic (Vercel handles this)
- ✅ Free SSL from Let's Encrypt
- ✅ Auto-renewal

---

## Backup & Recovery

### Database Backup:

**Automatic Backups (Supabase Pro):**
- Daily backups
- Point-in-time recovery
- 7-day retention (Pro)

**Manual Backup:**
```sql
-- Export all data
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Code Backup:

- ✅ Git repository (GitHub)
- ✅ Vercel deployment history
- ✅ Rollback to previous deployment anytime

---

## Scaling

### Vercel Scaling:

- ✅ **Automatic:** Scales based on traffic
- ✅ **Serverless:** Pay per request
- ✅ **Global CDN:** Fast worldwide

### Supabase Scaling:

**Free Tier Limits:**
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- 2 GB bandwidth

**Upgrade to Pro:**
- 8 GB database
- 100 GB file storage
- 100,000 monthly active users
- 250 GB bandwidth

---

## Maintenance

### Regular Tasks:

**Weekly:**
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Review user feedback

**Monthly:**
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Optimize database queries
- [ ] Clean up old data

**Quarterly:**
- [ ] Full security audit
- [ ] Performance optimization
- [ ] Backup verification
- [ ] Disaster recovery test

---

## Support & Resources

### Documentation:
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Community:
- [Next.js Discord](https://discord.gg/nextjs)
- [Vercel Discord](https://discord.gg/vercel)
- [Supabase Discord](https://discord.supabase.com)

### Status Pages:
- [Vercel Status](https://www.vercel-status.com)
- [Supabase Status](https://status.supabase.com)

---

## Deployment Checklist

### Pre-Deployment:
- [x] ✅ All tests passing locally
- [x] ✅ Build succeeds locally (`npm run build`)
- [x] ✅ Lint passes (`npm run lint`)
- [x] ✅ Environment variables documented
- [x] ✅ Database tables created
- [x] ✅ Storage buckets configured
- [x] ✅ RLS policies enabled

### Deployment:
- [ ] ✅ Repository pushed to GitHub
- [ ] ✅ Vercel project created
- [ ] ✅ Environment variables set
- [ ] ✅ First deployment successful
- [ ] ✅ Site accessible

### Post-Deployment:
- [ ] ✅ Supabase Site URL updated
- [ ] ✅ All features tested
- [ ] ✅ Authentication working
- [ ] ✅ Database operations working
- [ ] ✅ File uploads working
- [ ] ✅ Email sending working (if configured)

---

## Troubleshooting Commands

### Check Deployment Logs:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs [deployment-url]
```

### Test Environment Variables:
```bash
# In Vercel CLI
vercel env ls

# Pull env vars locally
vercel env pull .env.local
```

### Redeploy:
```bash
# Trigger new deployment
vercel --prod

# Or via GitHub
git commit --allow-empty -m "Trigger deployment"
git push
```

---

**Last Updated:** October 22, 2025  
**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT

**Need Help?** Check the troubleshooting section or contact support.
