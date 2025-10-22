# 🔍 TROUBLESHOOTING: Redirect ke Login Saat Save

## ❌ MASALAH

**Gejala:**
- User klik "Save Template" di Certificate Editor
- Langsung redirect ke halaman login
- Tidak tahu apakah data tersimpan atau tidak

---

## 🎯 ROOT CAUSE

**User session tidak terdeteksi atau sudah expired!**

Ketika klik "Save Template", sistem check authentication:
```typescript
const { data: { user: currentUser } } = await supabase.auth.getUser()

if (!currentUser) {
  // No user = redirect to login
  router.push('/login')
}
```

**Jika tidak ada user session → langsung redirect ke login**

---

## ✅ SOLUSI YANG SUDAH DIIMPLEMENTASIKAN

### **1. Better Error Message**

**Before:**
```typescript
toast.error('Please login to save templates')
router.push('/login') // Langsung redirect
```

**After:**
```typescript
toast.error('Session expired. Please login again.', {
  duration: 5000,
  description: 'Your session has expired. You need to login to save certificates.'
})

// Wait 2 seconds before redirect (user bisa baca message)
setTimeout(() => {
  router.push('/login')
}, 2000)
```

### **2. Detailed Console Logging**

Sekarang console akan show:
```
🔐 Checking user authentication...
Authentication check result: {
  user: null,
  email: undefined,
  error: { ... }
}
❌ No user found - authentication required
```

---

## 🔧 CARA FIX SESSION ISSUE

### **Option 1: Login Ulang (Recommended)**

**STEP 1: Login dengan benar**
```
1. Go to: http://localhost:3000/login
2. Email: admin@test.com
3. Password: Admin@123
4. Click "Login"
```

**STEP 2: Verify Login Success**
```
Check console (F12):
✅ User authenticated: admin@test.com
✅ [AuthProvider] User signed in
```

**STEP 3: Go to Editor**
```
http://localhost:3000/certificates/editor
```

**STEP 4: Try Save Again**
```
1. Choose template
2. Click "Save Template"
3. Should work now!
```

---

### **Option 2: Check Session Storage**

**Open Browser Console (F12):**
```javascript
// Check if session exists
const session = localStorage.getItem('supabase.auth.token')
console.log('Session:', session)

// If null or undefined = no session
```

**If no session:**
```
1. Clear all storage
2. Login again
3. Try save
```

---

### **Option 3: Check Supabase Connection**

**Open Browser Console (F12) di Editor page:**
```javascript
// Check current user
const { data, error } = await supabase.auth.getUser()
console.log('Current user:', data.user)
console.log('Error:', error)
```

**Expected:**
```javascript
Current user: {
  id: "...",
  email: "admin@test.com",
  // ...
}
Error: null
```

**If user is null:**
- Session expired
- Need to login again

---

## 🔍 HOW TO CHECK IF DATA SAVED

### **Method 1: Check Console Logs**

**Saat klik "Save Template", check console (F12):**

**If authentication failed:**
```
🔐 Checking user authentication...
❌ No user found - authentication required
```

**If authentication success:**
```
✅ User authenticated: admin@test.com
🔍 Testing database connection...
✅ Database connection successful
=== STEP 1: Saving to certificate_templates ===
Template saved successfully: { id: "..." }
=== STEP 2: Saving to certificate_designs ===
Design saved successfully: { id: "..." }
=== STEP 3: Saving to certificates table ===
✅ Certificate saved to main table: { id: "..." }
=== SAVE COMPLETED SUCCESSFULLY ===
```

**If you see "SAVE COMPLETED SUCCESSFULLY" = DATA TERSIMPAN!**

---

### **Method 2: Check Database Directly**

**Open Supabase Dashboard:**
```
1. Go to: https://supabase.com
2. Login to your project
3. Go to: Table Editor
4. Select table: certificates
5. Check latest entries
```

**Or run SQL:**
```sql
SELECT 
  certificate_number,
  recipient_name,
  status,
  created_at,
  metadata
FROM certificates
ORDER BY created_at DESC
LIMIT 5;
```

**If you see new entry = DATA TERSIMPAN!**

---

### **Method 3: Check Certificates Page**

**After login, go to:**
```
http://localhost:3000/certificates
```

**Check if certificate appears in the list**

---

## 🎯 PREVENTION

### **To Avoid Session Expiry:**

**1. Don't Clear Browser Cache During Development**
```
Avoid: Ctrl + Shift + Delete
Use: Ctrl + Shift + R (refresh only)
```

**2. Keep Login Tab Open**
```
Don't close the browser tab after login
```

**3. Check Session Before Save**
```
Before clicking "Save Template":
1. Open console (F12)
2. Check for user authentication logs
3. If no user = login first
```

**4. Use Fallback Credentials**
```
Email: admin@test.com
Password: Admin@123

These are hardcoded fallback credentials
Should always work
```

---

## 📋 COMPLETE WORKFLOW

### **Correct Flow:**

```
1. ✅ Login
   http://localhost:3000/login
   admin@test.com / Admin@123

2. ✅ Verify Login
   Check console: "User authenticated"

3. ✅ Go to Editor
   http://localhost:3000/certificates/editor

4. ✅ Create Certificate
   - Choose template
   - Edit elements
   - Select member (optional)
   - Select category (optional)

5. ✅ Save
   Click "Save Template"

6. ✅ Check Console
   Should see: "SAVE COMPLETED SUCCESSFULLY"

7. ✅ Check Success Message
   Toast notification with certificate details

8. ✅ Verify in Database
   Go to /certificates or check Supabase
```

---

## 🚨 COMMON ERRORS

### **Error 1: "Session expired"**
```
Cause: User session tidak ada atau expired
Fix: Login ulang
```

### **Error 2: "Please login to save templates"**
```
Cause: Tidak ada user authentication
Fix: Login dengan admin@test.com
```

### **Error 3: Redirect ke login tanpa message**
```
Cause: Session check failed
Fix: 
1. Clear browser cache
2. Login ulang
3. Try save again
```

### **Error 4: "Database connection failed"**
```
Cause: Supabase connection issue
Fix:
1. Check internet connection
2. Check Supabase project status
3. Check .env.local file
```

---

## 🎉 SUMMARY

**Problem:** Redirect ke login saat save

**Root Cause:** User session tidak terdeteksi

**Solution:**
1. ✅ Better error message (2 second delay)
2. ✅ Detailed console logging
3. ✅ User must login first before save

**How to Fix:**
1. Login dengan admin@test.com / Admin@123
2. Verify login success in console
3. Go to editor
4. Try save again

**How to Check if Saved:**
1. Check console logs (look for "SAVE COMPLETED")
2. Check database directly (Supabase dashboard)
3. Check /certificates page

**ALWAYS LOGIN FIRST BEFORE USING EDITOR!** 🔐✅
