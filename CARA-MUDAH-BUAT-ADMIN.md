# 🔐 CARA PALING MUDAH BUAT ADMIN ACCOUNT

## ✅ METODE TERMUDAH - VIA SUPABASE DASHBOARD

### **STEP 1: Buat User di Supabase Dashboard**

1. **Buka Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Login dengan akun Supabase Anda

2. **Pilih Project**
   - Klik project certificate management Anda

3. **Buka Authentication**
   - Sidebar kiri → **Authentication** → **Users**

4. **Add User**
   - Klik tombol **"Add User"** (hijau, pojok kanan atas)

5. **Isi Form:**
   ```
   Email: superadmin@test.com
   Password: Admin@123456
   Auto Confirm User: ✅ CENTANG INI! (PENTING!)
   ```

6. **Klik "Create User"**

7. **COPY USER ID**
   - Setelah user dibuat, akan muncul di list
   - Klik pada user tersebut atau lihat kolom "ID"
   - **COPY UUID** (contoh: a1b2c3d4-e5f6-7890-abcd-ef1234567890)

---

### **STEP 2: Set Role Admin**

1. **Buka SQL Editor**
   - Sidebar kiri → **SQL Editor**
   - Klik "New Query"

2. **Paste Query Ini:**
   ```sql
   -- Ganti USER_ID dengan UUID yang Anda copy di Step 1.7
   INSERT INTO public.users (id, email, role, created_at)
   VALUES (
     'PASTE-USER-ID-DISINI',
     'superadmin@test.com',
     'admin',
     NOW()
   );
   ```

3. **GANTI `PASTE-USER-ID-DISINI`**
   - Ganti dengan UUID yang Anda copy
   - Contoh: `'a1b2c3d4-e5f6-7890-abcd-ef1234567890'`

4. **Klik "Run" atau tekan F5**

5. **Lihat Result**
   - Harus ada: `Success. 1 rows affected.`

---

### **STEP 3: Verify**

**Run query ini:**
```sql
SELECT 
  u.id,
  u.email,
  u.role,
  au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'superadmin@test.com';
```

**Expected result:**
```
id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
email: superadmin@test.com
role: admin
email_confirmed_at: 2025-10-22 10:40:00
```

---

## 🎯 CARA LOGIN

### **1. Logout dari akun lama**

**Buka Console (F12) di browser:**
```javascript
await supabase.auth.signOut()
localStorage.clear()
sessionStorage.clear()
```

### **2. Hard Refresh**
```
Ctrl + Shift + R
```

### **3. Login dengan akun baru**
- Buka: `http://localhost:3000/login`
- Email: `superadmin@test.com`
- Password: `Admin@123456`
- Klik **Login**

### **4. Expected Logs:**
```
🔐 Attempting login with: superadmin@test.com
📊 Login response: { authData: {...}, authError: null }
✅ User authenticated: superadmin@test.com
🍪 Syncing session to cookies...
✅ Session synced to cookies: superadmin@test.com
🔐 [AuthContext] Initializing...
📊 [AuthContext] Current session: superadmin@test.com
🔔 [AuthContext] Auth changed: SIGNED_IN superadmin@test.com
```

### **5. Verify Auth State**
```javascript
// Di console
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
// Expected: { email: "superadmin@test.com", ... }
```

---

## 🔍 TROUBLESHOOTING

### **Problem: "Invalid login credentials"**

**Pastikan:**
1. ✅ Auto Confirm User di-centang saat buat user
2. ✅ Password benar: `Admin@123456` (case sensitive!)

**Atau run query ini:**
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'superadmin@test.com';
```

### **Problem: "No user found in AuthContext"**

**Solution:**
1. Logout total
2. Clear semua storage
3. Hard refresh
4. Login lagi

### **Problem: User ID salah**

**Cek User ID yang benar:**
```sql
SELECT id, email FROM auth.users WHERE email = 'superadmin@test.com';
```

**Lalu update public.users:**
```sql
UPDATE public.users
SET id = 'USER-ID-YANG-BENAR'
WHERE email = 'superadmin@test.com';
```

---

## 📊 VERIFY SEMUA DATA

**Run query lengkap:**
```sql
-- Check auth.users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'superadmin@test.com';

-- Check public.users
SELECT id, email, role, created_at
FROM public.users
WHERE email = 'superadmin@test.com';

-- Check identities
SELECT id, user_id, provider, created_at
FROM auth.identities
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'superadmin@test.com'
);
```

**Semua query harus return 1 row!**

---

## 🎊 SUMMARY

**Akun Admin Baru:**
- ✅ Email: `superadmin@test.com`
- ✅ Password: `Admin@123456`
- ✅ Role: `admin`
- ✅ Auto confirmed: YES
- ✅ Ready to use!

**Total waktu:** 3-5 menit

**Tingkat kesulitan:** ⭐ (Sangat mudah!)

---

## 🚀 NEXT STEPS

Setelah login berhasil:
1. ✅ Buka `/certificates/editor`
2. ✅ Pilih template
3. ✅ Isi recipient name
4. ✅ Klik "Save"
5. ✅ Certificate generated!
6. ✅ Redirect ke `/certificates`
7. ✅ Certificate muncul di list!

**Good luck!** 🙏
