# 🔐 CARA MEMBUAT ADMIN ACCOUNT BARU

## ✅ METODE 1: VIA SUPABASE DASHBOARD (PALING MUDAH)

### **Langkah 1: Buat User di Supabase Dashboard**

1. **Buka Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Login dengan akun Supabase Anda

2. **Pilih Project Anda**
   - Klik project certificate management

3. **Buka Authentication**
   - Sidebar kiri → **Authentication** → **Users**

4. **Add User**
   - Klik tombol **"Add User"** (hijau, pojok kanan atas)

5. **Isi Form:**
   ```
   Email: superadmin@test.com
   Password: Admin@123456
   Auto Confirm User: ✅ YES (PENTING!)
   ```

6. **Klik "Create User"**

7. **Copy User ID**
   - Setelah user dibuat, copy **User ID** (UUID)
   - Contoh: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

### **Langkah 2: Set Role di Database**

1. **Buka SQL Editor**
   - Sidebar kiri → **SQL Editor**

2. **Run Query:**
   ```sql
   -- Insert ke public.users dengan role admin
   INSERT INTO public.users (id, email, role, created_at, updated_at)
   VALUES (
     'PASTE-USER-ID-DISINI', -- Ganti dengan User ID dari langkah 1.7
     'superadmin@test.com',
     'admin',
     NOW(),
     NOW()
   )
   ON CONFLICT (email) DO UPDATE
   SET role = 'admin',
       updated_at = NOW();
   ```

3. **Ganti `PASTE-USER-ID-DISINI`** dengan User ID yang Anda copy

4. **Klik "Run"**

---

### **Langkah 3: Verify**

**Run query ini untuk verify:**
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
email_confirmed_at: 2025-10-22 10:35:00
```

---

## ✅ METODE 2: VIA SQL SCRIPT (OTOMATIS)

### **Langkah 1: Run SQL Script**

1. **Buka SQL Editor** di Supabase Dashboard

2. **Copy paste isi file `create-new-admin.sql`**

3. **Klik "Run"**

4. **Lihat output** - Harus ada:
   ```
   NOTICE: Admin account created successfully!
   NOTICE: Email: superadmin@test.com
   NOTICE: Password: Admin@123456
   NOTICE: User ID: xxx-xxx-xxx
   ```

---

## 🎯 CARA LOGIN

### **1. Logout dari akun lama**
```javascript
// Di browser console (F12)
await supabase.auth.signOut()
localStorage.clear()
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
✅ [AuthProvider] User signed in, session active
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

**Solution:**
1. Pastikan **Auto Confirm User** di-check saat buat user
2. Atau run query ini:
   ```sql
   UPDATE auth.users
   SET email_confirmed_at = NOW()
   WHERE email = 'superadmin@test.com';
   ```

### **Problem: "No user found in AuthContext"**

**Solution:**
1. Logout total:
   ```javascript
   await supabase.auth.signOut()
   localStorage.clear()
   sessionStorage.clear()
   ```
2. Hard refresh (Ctrl+Shift+R)
3. Login lagi

### **Problem: User bisa login tapi role bukan admin**

**Solution:**
```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'superadmin@test.com';
```

---

## 📊 VERIFY ACCOUNT

**Run query ini untuk check semua data:**
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

**Setelah login dengan akun ini:**
- ✅ AuthContext akan detect user
- ✅ Tidak ada error "No user found"
- ✅ Bisa generate certificate
- ✅ Bisa akses semua fitur admin

---

## 🚀 NEXT STEPS

1. ✅ Buat akun admin baru (pilih Metode 1 atau 2)
2. ✅ Logout dari akun lama
3. ✅ Login dengan akun baru
4. ✅ Test generate certificate
5. ✅ Verify certificate muncul di /certificates

**Good luck!** 🙏
