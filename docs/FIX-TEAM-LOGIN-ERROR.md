# Fix: Team Login Error - Invalid Credentials

## ❌ **ERROR: "Invalid login credentials"**

### **🔍 PROBLEM**

User `team@gmail.com` exists in `public.users` table but NOT in `auth.users` table.

Supabase authentication requires user to exist in **auth.users** table.

### **✅ SOLUTION**

Create user in Supabase Auth Dashboard.

---

## 🚀 **FIX STEPS**

### **STEP 1: Create User in Supabase Auth**

```
1. Go to Supabase Dashboard
   URL: https://supabase.com/dashboard

2. Select your project

3. Go to: Authentication → Users

4. Click "Add User" button

5. Fill in the form:
   ┌─────────────────────────────────────┐
   │ Email: team@gmail.com               │
   │ Password: team123                   │
   │ Auto Confirm User: ✅ (CHECKED)     │
   └─────────────────────────────────────┘

6. Click "Create User"

7. User will be created in auth.users table
```

### **STEP 2: Verify User Created**

```sql
-- Run in Supabase SQL Editor
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'team@gmail.com';

-- Should return 1 row with email: team@gmail.com
```

### **STEP 3: Verify Role in public.users**

```sql
-- Check role is set correctly
SELECT 
  email,
  role,
  created_at
FROM public.users
WHERE email = 'team@gmail.com';

-- Should return: team@gmail.com | team
```

### **STEP 4: Login Again**

```
1. Go to: http://localhost:3000/login
2. Email: team@gmail.com
3. Password: team123
4. Click "Login"
5. Should work now! ✅
```

---

## 📋 **WHY THIS HAPPENS**

### **Two Separate Tables:**

**1. auth.users (Supabase Auth)**
```
Purpose: Authentication (login/logout)
Managed by: Supabase Auth system
Used for: Verifying email/password
```

**2. public.users (Your App)**
```
Purpose: User data & roles
Managed by: Your application
Used for: Storing role (admin/team/public)
```

### **Login Flow:**

```
1. User enters email & password
2. Supabase checks auth.users table ← MUST EXIST HERE
3. If valid, get user email
4. App queries public.users by email ← Gets role from here
5. Set role in context
6. Redirect based on role
```

### **Current Situation:**

```
✅ User exists in public.users (role: team)
❌ User NOT in auth.users (can't login)
```

### **After Fix:**

```
✅ User exists in public.users (role: team)
✅ User exists in auth.users (can login)
→ Login works! ✅
```

---

## 🔧 **ALTERNATIVE: Auto-Sync with Trigger**

To prevent this issue in future, create a trigger to auto-sync:

```sql
-- Create function to sync new auth users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'public')
  ON CONFLICT (email) DO UPDATE
  SET id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Benefits:**
- Auto-creates user in public.users when created in auth.users
- Keeps tables in sync
- Default role: 'public' (can update to 'team' or 'admin' later)

---

## ✅ **COMPLETE SETUP CHECKLIST**

### **For Each User:**

```
1. ✅ Create in Supabase Auth Dashboard
   - Email
   - Password
   - Auto Confirm: ✅

2. ✅ Verify in auth.users table
   SELECT * FROM auth.users WHERE email = '...'

3. ✅ Insert/Update in public.users table
   INSERT INTO public.users (email, role, password)
   VALUES ('...', 'team', '...')
   ON CONFLICT (email) DO UPDATE SET role = 'team'

4. ✅ Verify in public.users table
   SELECT * FROM public.users WHERE email = '...'

5. ✅ Test login
   - Go to /login
   - Enter credentials
   - Should work!
```

---

## 🎯 **QUICK FIX FOR team@gmail.com**

### **Do This Now:**

```
1. Open Supabase Dashboard
2. Authentication → Users → Add User
3. Email: team@gmail.com
4. Password: team123
5. Auto Confirm: ✅
6. Create User
7. Try login again
8. Should work! ✅
```

---

## 📊 **VERIFY BOTH TABLES**

### **Check auth.users:**

```sql
SELECT email, email_confirmed_at
FROM auth.users
WHERE email = 'team@gmail.com';
```

**Expected:**
```
email: team@gmail.com
email_confirmed_at: 2025-10-21 ... (timestamp)
```

### **Check public.users:**

```sql
SELECT email, role
FROM public.users
WHERE email = 'team@gmail.com';
```

**Expected:**
```
email: team@gmail.com
role: team
```

---

## ✅ **AFTER FIX**

**Login Credentials:**
```
Email: team@gmail.com
Password: team123
Role: team
```

**Login URL:**
```
http://localhost:3000/login
```

**Expected Result:**
```
✅ Login successful
✅ Redirects to /dashboard
✅ Role indicator shows "Team"
✅ Team menu visible
```

---

## 🎉 **SUMMARY**

**Problem:**
- ❌ User only in public.users
- ❌ Not in auth.users
- ❌ Can't login

**Solution:**
- ✅ Create user in Supabase Auth Dashboard
- ✅ User now in both tables
- ✅ Login works!

**Create user di Supabase Auth Dashboard sekarang, lalu coba login lagi!** 🔑✅
