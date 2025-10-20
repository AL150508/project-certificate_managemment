# Login Debug Guide

## 🔍 **DEBUGGING LOGIN YANG STUCK DI "MEMPROSES..."**

Jika login menampilkan "Memproses..." tapi tidak masuk ke halaman admin, ikuti langkah debugging ini:

### **🚀 LANGKAH 1: CEK BROWSER CONSOLE**

#### **✅ Buka Developer Tools:**
1. **Tekan F12** atau **Ctrl+Shift+I**
2. **Klik tab Console**
3. **Coba login dengan admin@gmail.com**
4. **Lihat pesan di console**

#### **✅ Expected Debug Messages:**
```
Starting login process...
Email: admin@gmail.com
Selected role: admin
Login successful: {user: {...}, session: {...}}
Redirecting to admin dashboard...
```

### **❌ KEMUNGKINAN ERROR & SOLUSI**

#### **1. "Invalid login credentials"**
```
❌ Problem: Email/password salah atau user belum terdaftar
✅ Solution: 
   - Pastikan email: admin@gmail.com
   - Pastikan password benar
   - Atau buat user baru di Supabase Auth
```

#### **2. "Supabase auth error: ..."**
```
❌ Problem: Masalah koneksi Supabase
✅ Solution: 
   - Check internet connection
   - Verify Supabase credentials di .env.local
   - Check Supabase project status
```

#### **3. Login berhasil tapi tidak redirect**
```
❌ Problem: Router navigation issue
✅ Solution: Sudah diperbaiki dengan window.location.href
```

#### **4. "Network error" atau timeout**
```
❌ Problem: Koneksi ke Supabase gagal
✅ Solution: 
   - Check .env.local file
   - Verify NEXT_PUBLIC_SUPABASE_URL
   - Verify NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### **🗄️ LANGKAH 2: CEK SUPABASE SETUP**

#### **✅ 1. Verify Environment Variables:**
```bash
# Check file: .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### **✅ 2. Check Supabase Auth:**
```sql
-- Di Supabase SQL Editor, check users:
SELECT * FROM auth.users;

-- Jika kosong, buat user baru di Supabase Dashboard:
-- Authentication → Users → Add User
-- Email: admin@gmail.com
-- Password: (set password)
```

#### **✅ 3. Test Supabase Connection:**
```javascript
// Test di browser console:
console.log(window.location.origin)
// Should show your app URL

// Test Supabase:
fetch('https://your-project.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'your-anon-key'
  }
}).then(r => console.log('Supabase OK:', r.status))
```

### **🔧 LANGKAH 3: MANUAL TESTING**

#### **✅ 1. Test Direct Navigation:**
```
1. Login berhasil (lihat console log)
2. Manually navigate ke: http://localhost:3000/admin/dashboard
3. Jika halaman muncul = login OK, redirect issue
4. Jika error = ada masalah auth/permission
```

#### **✅ 2. Test Different Browsers:**
```
1. Try Chrome (incognito mode)
2. Try Firefox
3. Clear browser cache/cookies
4. Disable browser extensions
```

#### **✅ 3. Check Network Tab:**
```
1. Open Developer Tools → Network
2. Try login
3. Look for failed requests (red status)
4. Check Supabase API calls
```

### **🚨 QUICK FIXES**

#### **✅ 1. Force Redirect Fix:**
```typescript
// Already implemented in login page:
// Uses window.location.href instead of router.replace
// Includes 500ms delay for auth state update
```

#### **✅ 2. Create Test User:**
```sql
-- If no users exist, create one in Supabase Dashboard:
-- Go to Authentication → Users → Add User
-- Email: admin@gmail.com  
-- Password: admin123
-- Confirm email: Yes
```

#### **✅ 3. Reset Auth State:**
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
// Then refresh page and try login again
```

### **📋 DEBUGGING CHECKLIST**

#### **✅ Environment:**
- [ ] .env.local file exists and has correct values
- [ ] Supabase project is active
- [ ] Internet connection working
- [ ] No firewall blocking Supabase

#### **✅ Authentication:**
- [ ] User exists in Supabase Auth
- [ ] Email is confirmed
- [ ] Password is correct
- [ ] No account lockouts

#### **✅ Application:**
- [ ] Console shows login debug messages
- [ ] No JavaScript errors in console
- [ ] Admin dashboard page exists
- [ ] No middleware blocking access

#### **✅ Browser:**
- [ ] Cookies enabled
- [ ] JavaScript enabled
- [ ] No ad blockers interfering
- [ ] Try incognito/private mode

### **🎯 EXPECTED BEHAVIOR**

#### **✅ Successful Login Flow:**
```
1. Enter email: admin@gmail.com
2. Enter password
3. Select role: Admin
4. Click "Login" button
5. Button shows "Memproses..." briefly
6. Console shows debug messages
7. Page redirects to /admin/dashboard
8. Admin dashboard loads successfully
```

#### **❌ Failed Login Indicators:**
```
1. Button stuck on "Memproses..."
2. Error alert appears
3. Console shows error messages
4. No redirect happens
5. Still on login page
```

### **🔧 ADVANCED DEBUGGING**

#### **✅ 1. Check Supabase Logs:**
```
1. Go to Supabase Dashboard
2. Logs → Auth Logs
3. Look for recent login attempts
4. Check for error messages
```

#### **✅ 2. Test API Directly:**
```bash
# Test auth endpoint:
curl -X POST 'https://your-project.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@gmail.com",
    "password": "your-password"
  }'
```

#### **✅ 3. Check RLS Policies:**
```sql
-- Check if RLS is blocking access:
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## 🎯 **MOST LIKELY SOLUTIONS**

### **✅ 1. Create Admin User (90% of cases):**
```
1. Go to Supabase Dashboard
2. Authentication → Users
3. Add User: admin@gmail.com
4. Set password
5. Confirm email
6. Try login again
```

### **✅ 2. Fix Environment Variables:**
```
1. Check .env.local exists
2. Verify Supabase URL and key
3. Restart development server
4. Try login again
```

### **✅ 3. Clear Browser Data:**
```
1. Clear cookies and localStorage
2. Try incognito mode
3. Disable extensions
4. Try login again
```

**Ikuti langkah debugging ini untuk mengidentifikasi dan memperbaiki masalah login!** 🔍✅
