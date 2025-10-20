# Insert Team User Guide

## ✅ **TABLE public.users SUDAH ADA**

Aplikasi menggunakan table `public.users` untuk menyimpan user dan role.

### **📋 TABLE STRUCTURE**

```sql
create table public.users (
  id uuid not null default gen_random_uuid(),
  email text not null,
  password text null,
  role text not null default 'public'::text,
  created_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_role_check check (
    role = any (array['admin'::text, 'team'::text, 'public'::text])
  )
);
```

---

## 🚀 **INSERT TEAM USER**

### **✅ OPTION 1: Insert Single Team User**

```sql
-- Run in Supabase SQL Editor
INSERT INTO public.users (email, role, password)
VALUES ('team@example.com', 'team', 'Team123!')
ON CONFLICT (email) DO UPDATE
SET role = 'team';
```

### **✅ OPTION 2: Insert Multiple Team Users**

```sql
INSERT INTO public.users (email, role, password)
VALUES 
  ('team1@example.com', 'team', 'Team123!'),
  ('team2@example.com', 'team', 'Team123!'),
  ('team@example.com', 'team', 'Team123!')
ON CONFLICT (email) DO UPDATE
SET role = EXCLUDED.role;
```

### **✅ OPTION 3: Update Existing User to Team**

```sql
UPDATE public.users
SET role = 'team'
WHERE email = 'your-existing-email@example.com';
```

---

## 🔍 **VERIFY USER CREATED**

### **✅ Check All Users:**

```sql
SELECT 
  id,
  email,
  role,
  created_at
FROM public.users
ORDER BY created_at DESC;
```

### **✅ Check Team Users Only:**

```sql
SELECT 
  id,
  email,
  role,
  created_at
FROM public.users
WHERE role = 'team'
ORDER BY created_at DESC;
```

### **✅ Check Role Distribution:**

```sql
SELECT 
  role,
  COUNT(*) as user_count
FROM public.users
GROUP BY role
ORDER BY role;
```

**Expected Result:**
```
role   | user_count
-------|------------
admin  | 1
team   | 1
public | 0
```

---

## 🔑 **TEAM USER CREDENTIALS**

### **After Insert:**

```
Email: team@example.com
Password: Team123!
Role: team
```

---

## 🚀 **LOGIN AS TEAM**

### **Steps:**

```
1. Go to: http://localhost:3000/login
2. Enter:
   Email: team@example.com
   Password: Team123!
3. Click "Login"
4. Should redirect to /dashboard
5. Role indicator shows "Team"
```

---

## 🔐 **HOW AUTHENTICATION WORKS**

### **✅ Login Flow:**

```
1. User enters email & password in login form
2. App calls Supabase Auth (auth.users table)
3. If auth successful, get user email
4. App queries public.users table by email
5. Get role from public.users.role
6. Set role in RoleContext
7. Redirect based on role:
   - admin → /admin/dashboard
   - team → /dashboard
   - public → /dashboard
```

### **✅ Code Reference:**

```typescript
// src/context/RoleContext.tsx (line 26)
const { data, error } = await supabase
  .from("users")  // ← queries public.users table
  .select("role")
  .eq("email", email)
  .maybeSingle<{ role: Role }>()

const r = data.role ?? "public"
setRole(r)
```

---

## ⚠️ **IMPORTANT NOTES**

### **✅ Two Tables for Users:**

**1. auth.users (Supabase Auth)**
```
Purpose: Authentication (login/logout)
Managed by: Supabase Auth
Contains: id, email, encrypted_password, etc.
```

**2. public.users (Your App)**
```
Purpose: User data & roles
Managed by: Your app
Contains: id, email, password, role, created_at
```

### **✅ Sync Between Tables:**

For proper authentication, you need BOTH:

**Option A: Create in both tables manually**
```
1. Create user in Supabase Auth Dashboard
2. Insert same user in public.users table
```

**Option B: Use trigger to auto-sync** (Recommended)
```sql
-- Create trigger to auto-insert into public.users
-- when user created in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'public')
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🚨 **TROUBLESHOOTING**

### **❌ Issue 1: "Invalid credentials" on login**

```
Problem: User exists in public.users but not in auth.users
Solution:
  1. Create user in Supabase Auth Dashboard first
  2. Then insert/update in public.users
  3. Email must match in both tables
```

### **❌ Issue 2: Login successful but role is "public"**

```
Problem: User exists in auth.users but not in public.users
Solution:
  1. Run INSERT query to add user to public.users
  2. Set correct role
  3. Logout and login again
```

### **❌ Issue 3: "User already exists"**

```
Problem: Email already in public.users table
Solution:
  1. Use UPDATE instead of INSERT
  2. Or use ON CONFLICT DO UPDATE
  3. Check existing user first
```

---

## ✅ **COMPLETE SETUP STEPS**

### **Step-by-Step:**

**1. Create User in Supabase Auth:**
```
Dashboard → Authentication → Users → Add User
Email: team@example.com
Password: Team123!
Auto Confirm: ✅
```

**2. Insert into public.users:**
```sql
INSERT INTO public.users (email, role, password)
VALUES ('team@example.com', 'team', 'Team123!')
ON CONFLICT (email) DO UPDATE
SET role = 'team';
```

**3. Verify:**
```sql
SELECT email, role FROM public.users WHERE email = 'team@example.com';
-- Should return: team@example.com | team
```

**4. Login:**
```
URL: http://localhost:3000/login
Email: team@example.com
Password: Team123!
```

**5. Verify Login:**
```
✅ Redirects to /dashboard
✅ Role indicator shows "Team"
✅ Navigation shows team menu
```

---

## 📊 **EXAMPLE DATA**

### **✅ Sample Users:**

```sql
-- Admin user
INSERT INTO public.users (email, role, password)
VALUES ('admin@example.com', 'admin', 'Admin123!')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Team users
INSERT INTO public.users (email, role, password)
VALUES 
  ('team@example.com', 'team', 'Team123!'),
  ('team1@example.com', 'team', 'Team123!'),
  ('team2@example.com', 'team', 'Team123!')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- Public users (optional)
INSERT INTO public.users (email, role, password)
VALUES ('user@example.com', 'public', 'User123!')
ON CONFLICT (email) DO UPDATE SET role = 'public';
```

---

## 🎉 **READY TO USE!**

**Quick Insert:**
```sql
-- Run this in Supabase SQL Editor
INSERT INTO public.users (email, role, password)
VALUES ('team@example.com', 'team', 'Team123!')
ON CONFLICT (email) DO UPDATE SET role = 'team';
```

**Then Login:**
```
URL: http://localhost:3000/login
Email: team@example.com
Password: Team123!
```

**Team user ready to use!** 🔑✅
