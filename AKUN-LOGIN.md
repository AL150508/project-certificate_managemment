# 🔐 DAFTAR AKUN LOGIN

## ✅ 2 AKUN YANG TERSEDIA

### **AKUN 1: ADMIN** 👑

```
Email: admin@test.com
Password: Admin@123
Role: admin
```

**Akses:**
- ✅ Full dashboard access
- ✅ Manage templates
- ✅ Generate certificates
- ✅ Manage members
- ✅ Manage categories
- ✅ View all data
- ✅ Admin settings

**URL Login:**
```
http://localhost:3000/login
```

---

### **AKUN 2: TEAM** 👥

```
Email: team@test.com
Password: Team@123
Role: team
```

**Akses:**
- ✅ Generate certificates
- ✅ View certificates
- ✅ Limited dashboard access
- ❌ Cannot manage templates
- ❌ Cannot manage members
- ❌ Cannot access admin settings

**URL Login:**
```
http://localhost:3000/login
```

---

## 🚀 CARA MEMBUAT AKUN

### **Metode 1: Run SQL Script (RECOMMENDED)**

1. **Buka Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Pilih project Anda

2. **Buka SQL Editor**
   - Sidebar kiri → SQL Editor
   - Klik "New Query"

3. **Copy Paste Script**
   - Buka file: `create-2-accounts.sql`
   - Copy **SELURUH ISI** file
   - Paste ke SQL Editor

4. **Run Script**
   - Klik tombol "Run" atau tekan F5
   - Tunggu sampai selesai

5. **Lihat Output**
   - Harus ada NOTICE messages:
   ```
   ✅ ACCOUNT 1: ADMIN CREATED!
   Email: admin@test.com
   Password: Admin@123
   
   ✅ ACCOUNT 2: TEAM CREATED!
   Email: team@test.com
   Password: Team@123
   ```

6. **Verify**
   - Scroll ke bawah
   - Lihat hasil query verification
   - Harus ada 2 rows untuk setiap table

---

## 🎯 CARA LOGIN

### **Step 1: Logout dari akun lama (jika ada)**

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
1. Buka: `http://localhost:3000/login`
2. Email: `admin@test.com`
3. Password: `Admin@123`
4. Klik "Login"

**Login sebagai TEAM:**
1. Buka: `http://localhost:3000/login`
2. Email: `team@test.com`
3. Password: `Team@123`
4. Klik "Login"

### **Step 4: Expected Logs**

**Console browser harus menampilkan:**
```
🔐 Attempting login with: admin@test.com
📊 Login response: { authData: {...}, authError: null }
✅ User authenticated: admin@test.com
🍪 Syncing session to cookies...
✅ Session synced to cookies: admin@test.com
🔐 [AuthContext] Initializing...
📊 [AuthContext] Current session: admin@test.com
🔔 [AuthContext] Auth changed: SIGNED_IN admin@test.com
✅ [AuthProvider] User signed in, session active
```

### **Step 5: Verify Login**

**Check di console:**
```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
console.log('Email:', user.email)
console.log('ID:', user.id)
```

**Expected:**
```javascript
{
  email: "admin@test.com",
  id: "uuid-here",
  ...
}
```

---

## 🔍 TROUBLESHOOTING

### **Problem: "Invalid login credentials"**

**Cek:**
1. ✅ Email benar (case sensitive!)
2. ✅ Password benar (case sensitive!)
3. ✅ Account sudah dibuat (run verification query)

**Verification Query:**
```sql
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email IN ('admin@test.com', 'team@test.com');
```

**Jika email_confirmed_at NULL:**
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email IN ('admin@test.com', 'team@test.com');
```

---

### **Problem: "No user found in AuthContext"**

**Solution:**
1. Logout total
2. Clear all storage
3. Hard refresh (Ctrl+Shift+R)
4. Login lagi
5. Check console logs

---

### **Problem: Login berhasil tapi role salah**

**Check role:**
```sql
SELECT email, role FROM public.users 
WHERE email IN ('admin@test.com', 'team@test.com');
```

**Fix role:**
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@test.com';
UPDATE public.users SET role = 'team' WHERE email = 'team@test.com';
```

---

## 📊 VERIFICATION QUERIES

### **Check semua akun:**
```sql
-- Check auth.users
SELECT email, email_confirmed_at, created_at
FROM auth.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- Check public.users
SELECT email, role, created_at
FROM public.users
WHERE email IN ('admin@test.com', 'team@test.com')
ORDER BY email;

-- Check identities
SELECT au.email, i.provider, i.created_at
FROM auth.identities i
JOIN auth.users au ON i.user_id = au.id
WHERE au.email IN ('admin@test.com', 'team@test.com')
ORDER BY au.email;
```

**Expected:** Setiap query return 2 rows!

---

## 🎊 SUMMARY

**Total Akun:** 2

**Akun Admin:**
- ✅ Email: `admin@test.com`
- ✅ Password: `Admin@123`
- ✅ Role: `admin`
- ✅ Full access

**Akun Team:**
- ✅ Email: `team@test.com`
- ✅ Password: `Team@123`
- ✅ Role: `team`
- ✅ Limited access

**Status:** Ready to use!

---

## 🚀 NEXT STEPS

Setelah login berhasil:

**Sebagai ADMIN:**
1. ✅ Buka dashboard
2. ✅ Manage templates
3. ✅ Generate certificates
4. ✅ Manage members
5. ✅ Full control

**Sebagai TEAM:**
1. ✅ Buka dashboard
2. ✅ Generate certificates
3. ✅ View certificates
4. ✅ Limited features

---

## 📝 NOTES

- Password bisa diganti setelah login pertama
- Email tidak bisa diganti (unique constraint)
- Role bisa diubah via SQL query
- Akun bisa dihapus dan dibuat ulang kapan saja

**Good luck!** 🙏
