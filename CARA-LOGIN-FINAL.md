# 🔐 CARA LOGIN - FINAL SOLUTION

## ❌ PROBLEM: "Database error querying schema"

Error ini terjadi karena:
1. **RLS (Row Level Security)** memblokir query ke table `public.users`
2. Policy belum dikonfigurasi untuk authenticated users

---

## ✅ SOLUTION: Fix RLS Policies

### **Step 1: Run SQL Script**

1. **Buka Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Pilih project Anda

2. **Buka SQL Editor**
   - Sidebar kiri → SQL Editor
   - Klik "New Query"

3. **Copy Paste Script**
   - File: `fix-login-and-rls.sql`
   - Copy **SELURUH ISI**
   - Paste ke SQL Editor

4. **Run Script**
   - Klik **"Run"** atau F5
   - Tunggu sampai selesai

5. **Expected Output:**
```
NOTICE: ╔════════════════════════════════════════╗
NOTICE: ║   ✅ RLS POLICIES CONFIGURED!          ║
NOTICE: ╚════════════════════════════════════════╝
NOTICE: 
NOTICE: 📋 CONFIGURED POLICIES:
NOTICE: 1. Users can read own data (by ID)
NOTICE: 2. Authenticated users can read all users
NOTICE: 
NOTICE: 🔐 ACCOUNTS READY FOR LOGIN:
NOTICE: Account 1: Admin
NOTICE:   Email: admin@test.com
NOTICE:   Password: Admin@123
```

6. **Verify Results**
Scroll ke bawah, harus ada 3 hasil verification:
- ✅ auth.users: 2 rows (dengan has_password = true)
- ✅ public.users: 2 rows
- ✅ auth.identities: 2 rows

---

## 🚀 CARA LOGIN (SETELAH FIX RLS)

### **Step 1: Logout Total**

**Buka Console (F12) di browser:**
```javascript
await supabase.auth.signOut()
localStorage.clear()
sessionStorage.clear()
```

### **Step 2: Hard Refresh**
```
Ctrl + Shift + R
```

### **Step 3: Login**

**Login sebagai ADMIN:**
- Buka: `http://localhost:3000/login`
- Select Role: **Admin**
- Email: `admin@test.com`
- Password: `Admin@123`
- Klik "Login"

### **Step 4: Expected Console Logs:**
```
🔐 Attempting login with: admin@test.com
📊 Login response: { authData: {...}, authError: null }
✅ User authenticated: admin@test.com
🍪 Syncing session to cookies...
✅ Session synced to cookies: admin@test.com
📊 Session details: { user: "admin@test.com", ... }
💾 Saving backup to localStorage...
✅ Backup saved to localStorage
User data from DB: { role: "admin", email: "admin@test.com" } Error: null
User role from DB: admin Selected role: admin
Redirecting to: /admin/dashboard
```

**TIDAK ADA ERROR "Database error querying schema"!** ✅

### **Step 5: Verify Login Success**

**Check di console:**
```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log('✅ Current user:', user.email)

const { data: { session } } = await supabase.auth.getSession()
console.log('✅ Session:', session ? 'Active' : 'None')
```

**Expected:**
```
✅ Current user: admin@test.com
✅ Session: Active
```

---

## 🎯 TEST GENERATE CERTIFICATE

### **Step 1: Buka Editor**
- Navigate ke: `http://localhost:3000/certificates/editor`

### **Step 2: Check Console**
```
📊 [Editor] Auth state: {
  hasSession: true,
  hasUser: true,
  userEmail: "admin@test.com",
  loading: false
}
```

### **Step 3: Generate Certificate**
- Pilih template
- Isi recipient name
- Klik "Save"

### **Step 4: Expected Logs:**
```
=== GENERATE CERTIFICATE BUTTON CLICKED ===
🔍 Checking authentication from AuthContext...
📊 Auth state: { session: true, user: true, loading: false }
✅ User authenticated from AuthContext: admin@test.com
🔍 Testing database connection...
✅ Database connection successful
=== STEP 1: Generating Certificate ===
Certificate data: { certificate_number: "CERT-2025-10-XXXX", ... }
Certificate generated successfully: {...}
=== CERTIFICATE GENERATION COMPLETED ===
```

### **Step 5: Success!**
```
✅ Certificate CERT-2025-10-0001 generated successfully!
   Issued to Jane Smith
```

**Redirect ke `/certificates` dan certificate muncul di list!** ✅

---

## 🔍 TROUBLESHOOTING

### **Problem: "Invalid login credentials"**

**Check password:**
```sql
SELECT email, encrypted_password IS NOT NULL as has_password 
FROM auth.users 
WHERE email = 'admin@test.com';
```

**Expected:** `has_password = true`

**If false:** Password tidak ter-set. Run `create-2-accounts-FINAL.sql` lagi.

---

### **Problem: "Database error querying schema"**

**Check RLS policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'users';
```

**Expected:** Minimal 2 policies:
- "Users can read own data"
- "Allow authenticated users to read users"

**If not found:** Run `fix-login-and-rls.sql` lagi.

---

### **Problem: "User not found in database"**

**Check public.users:**
```sql
SELECT id, email, role 
FROM public.users 
WHERE email = 'admin@test.com';
```

**Expected:** 1 row dengan role = 'admin'

**If not found:** Run `create-2-accounts-FINAL.sql` lagi.

---

### **Problem: "No user found in AuthContext"**

**Solution:**
1. Logout total
2. Clear all storage
3. Hard refresh
4. Login lagi
5. Wait for all console logs
6. Check AuthContext state

---

## 📊 VERIFICATION CHECKLIST

Setelah login, check semua ini:

- [ ] ✅ Console log: "User authenticated: admin@test.com"
- [ ] ✅ Console log: "Session synced to cookies"
- [ ] ✅ Console log: "User data from DB: { role: 'admin', ... }"
- [ ] ✅ Console log: "Redirecting to: /admin/dashboard"
- [ ] ✅ No error "Database error querying schema"
- [ ] ✅ No error "User not found in database"
- [ ] ✅ Dashboard loads successfully
- [ ] ✅ Editor page detect user (hasUser: true)
- [ ] ✅ Generate certificate berhasil
- [ ] ✅ Certificate muncul di /certificates

**Jika semua ✅, berarti LOGIN BERHASIL!**

---

## 🎊 SUMMARY

**2 Akun yang tersedia:**

**Account 1: Admin**
- Email: `admin@test.com`
- Password: `Admin@123`
- Role: `admin`
- Access: Full dashboard

**Account 2: Team**
- Email: `team@test.com`
- Password: `Team@123`
- Role: `team`
- Access: Limited

**RLS Policies:**
- ✅ Users can read own data
- ✅ Authenticated users can read all users

**Status:** Ready to use!

---

## 🚀 QUICK START

**3 langkah cepat:**

1. **Run SQL:**
   ```
   File: fix-login-and-rls.sql
   Run di Supabase SQL Editor
   ```

2. **Logout & Clear:**
   ```javascript
   await supabase.auth.signOut()
   localStorage.clear()
   ```

3. **Login:**
   ```
   Email: admin@test.com
   Password: Admin@123
   Role: Admin
   ```

**Done!** ✅

---

## 📝 NOTES

- Password sudah ter-set di database (encrypted)
- Email sudah auto-confirmed
- RLS policies sudah dikonfigurasi
- Akun siap digunakan untuk login
- Tidak ada error "Database error querying schema"

**Good luck!** 🙏
