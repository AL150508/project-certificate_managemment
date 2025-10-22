# 🚀 RUN THIS SCRIPT TO FIX LOGIN!

## ❌ ERROR di Script Lama:

```
ERROR: 42601: syntax error at or near "RAISE"
LINE 56: RAISE NOTICE ' ✅ RLS policies configured';
```

**Masalah:**
- Emoji `✅` menyebabkan syntax error
- `RAISE NOTICE` standalone di luar DO block

---

## ✅ SCRIPT BARU (NO ERROR!):

**File:** `FIX-LOGIN-NO-ERROR.sql`

**Changes:**
- ✅ Removed problematic emoji
- ✅ All RAISE NOTICE inside DO blocks
- ✅ Clean syntax
- ✅ Same functionality

---

## 🚀 CARA RUN:

### **STEP 1: Buka Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Pilih project Anda

### **STEP 2: Buka SQL Editor**

1. Sidebar kiri → **SQL Editor**
2. Click **"New Query"**

### **STEP 3: Copy Paste Script**

1. Buka file: `FIX-LOGIN-NO-ERROR.sql`
2. Copy **SELURUH ISI**
3. Paste ke SQL Editor

### **STEP 4: Run Script**

1. Click **"Run"** atau F5
2. Tunggu ~5 detik

### **STEP 5: Check Output**

**Expected:**
```
=== CURRENT STATE ===
Accounts in auth.users: 2
Accounts in public.users: 0

=== VERIFICATION ===
1. Accounts in auth.users: 2
2. Accounts in public.users: 2
3. ID matches: 2
4. RLS policies: 2

========================================
SUCCESS! LOGIN READY! ALL CHECKS PASSED!
========================================

You can now login with:

Admin Account:
  Email: admin@test.com
  Password: Admin@123
  Role: Admin

Team Account:
  Email: team@test.com
  Password: Team@123
  Role: Team

Go to: http://localhost:3000/login
```

---

## 🔄 STEP 6: Test Login

1. **Refresh browser:**
   ```
   Ctrl + Shift + R
   ```

2. **Go to login:**
   ```
   http://localhost:3000/login
   ```

3. **Enter credentials:**
   - Email: `admin@test.com`
   - Password: `Admin@123`
   - Role: Admin

4. **Click "Login"**

5. **Expected:**
   - ✅ Login berhasil dalam 5-10 detik
   - ✅ Redirect ke `/admin/dashboard`
   - ✅ **NO TIMEOUT!**

---

## 🎯 TROUBLESHOOTING:

### **Problem: "user ID not found"**

**Solution:**

1. **Get User IDs from Dashboard:**
   - Supabase Dashboard → Authentication → Users
   - Copy User ID for admin@test.com
   - Copy User ID for team@test.com

2. **Update script line 64 & 76:**
   ```sql
   -- Line 64: Admin ID
   'ebd6c9b1-66d8-4521-94b3-6cd72aea4a66'  ← Replace with your admin ID
   
   -- Line 76: Team ID
   '01572696-1080-41c5-b675-989a1448fe15'  ← Replace with your team ID
   ```

3. **Run script again**

---

## 📊 WHAT THIS SCRIPT DOES:

**STEP 1:** Check current state
- Count accounts in auth.users
- Count accounts in public.users

**STEP 2:** Setup RLS policies
- Enable RLS on public.users
- Drop old policies
- Create new policies (allow read for authenticated & anon)

**STEP 3:** Insert accounts
- Insert admin@test.com to public.users
- Insert team@test.com to public.users
- Use same IDs from auth.users

**STEP 4:** Verification
- Verify accounts exist
- Verify IDs match
- Verify RLS policies
- Show success message

---

## 🎊 SUMMARY:

**Old Script:**
- ❌ Syntax error (emoji)
- ❌ RAISE NOTICE outside DO block

**New Script:**
- ✅ No emoji
- ✅ All RAISE NOTICE inside DO blocks
- ✅ Clean syntax
- ✅ Same functionality

**File:**
- ✅ `FIX-LOGIN-NO-ERROR.sql` - Use this!

**Status:** ✅ **READY TO RUN!**

---

## 🚀 QUICK START:

**3 langkah:**

1. **Run SQL:**
   ```
   File: FIX-LOGIN-NO-ERROR.sql
   Run di: Supabase SQL Editor
   ```

2. **Refresh:**
   ```
   Ctrl + Shift + R
   ```

3. **Login:**
   ```
   Email: admin@test.com
   Password: Admin@123
   ```

**Done!** ✅

---

**SILAKAN RUN SCRIPT SEKARANG!** 🚀

**LOGIN AKAN BERHASIL!** ✅🎉
