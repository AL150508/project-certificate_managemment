# Team User Credentials

## 🔑 **LOGIN CREDENTIALS**

### **✅ TEAM USER**

```
Email: team@example.com
Password: Team123!
Role: team
Access: Team dashboard & limited features
```

### **✅ ADMIN USER**

```
Email: admin@example.com
Password: Admin123!
Role: admin
Access: Full admin dashboard & all features
```

### **✅ PUBLIC/GUEST**

```
Email: (no login required)
Password: (no login required)
Role: public
Access: Public pages only
```

---

## 🚀 **SETUP TEAM USER**

### **STEP 1: Create User in Supabase**

```
1. Go to Supabase Dashboard
2. Select your project
3. Go to: Authentication → Users
4. Click "Add User"
5. Fill in:
   - Email: team@example.com
   - Password: Team123!
   - Auto Confirm User: ✅ (checked)
6. Click "Create User"
7. Note the user ID
```

### **STEP 2: Set Role to "team"**

```sql
-- Run in Supabase SQL Editor
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"team"'
)
WHERE email = 'team@example.com';
```

### **STEP 3: Verify**

```sql
-- Check role set correctly
SELECT 
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'team@example.com';

-- Should return: role = 'team'
```

---

## 🔐 **LOGIN AS TEAM**

### **Steps:**

```
1. Go to: http://localhost:3000/login
2. Enter:
   Email: team@example.com
   Password: Team123!
3. Click "Login"
4. Redirects to: /dashboard
5. Role indicator shows: "Team"
6. Navigation menu shows team options
```

---

## 📋 **TEAM ACCESS & PERMISSIONS**

### **✅ Team Can Access:**

```
✅ /dashboard - Team dashboard
✅ /certificates - View & create certificates
✅ /members - View members
✅ /categories - View categories
✅ /faq - FAQ page
```

### **✅ Team Can Do:**

```
✅ View all certificates
✅ Create new certificates
✅ Edit certificates
✅ Generate PDF
✅ Send email
✅ Preview certificates
✅ Download PDF
```

### **❌ Team Cannot Do:**

```
❌ Delete certificates (admin only)
❌ Manage templates (admin only)
❌ Create/edit/delete categories (admin only)
❌ Create/edit/delete members (admin only)
❌ Access /admin/* routes
```

---

## 🎯 **NAVIGATION MENU**

### **Team Menu:**

```
Dashboard    → /dashboard
Certificates → /certificates
Members      → /members
Categories   → /categories
FAQ          → /faq
```

### **Admin Menu (For Comparison):**

```
Dashboard    → /admin/dashboard
Certificates → /admin/certificates
Templates    → /admin/templates
Members      → /admin/members
Categories   → /admin/categories
FAQ          → /faq
```

---

## 🔍 **VERIFY TEAM LOGIN**

### **Check After Login:**

```
1. ✅ Role indicator shows "Team" (not "Admin")
2. ✅ Avatar shows first letter of email
3. ✅ Navigation menu shows team options
4. ✅ No access to /admin/* routes
5. ✅ Can view certificates
6. ✅ Can create certificates
7. ❌ Cannot delete certificates
8. ❌ Cannot access templates
```

---

## 📊 **ALL USER ROLES**

### **Summary:**

| Role   | Email              | Password  | Access Level |
|--------|-------------------|-----------|--------------|
| admin  | admin@example.com | Admin123! | Full access  |
| team   | team@example.com  | Team123!  | Limited      |
| public | (no login)        | (none)    | View only    |

---

## 🚨 **TROUBLESHOOTING**

### **❌ "Invalid credentials"**

```
Problem: Cannot login with team credentials
Solutions:
  1. Verify user created in Supabase Dashboard
  2. Check email confirmed (Auto Confirm checked)
  3. Verify password correct: Team123!
  4. Check user exists in auth.users table
```

### **❌ "Login successful but role is 'public'"**

```
Problem: Logged in but shows as public/guest
Solutions:
  1. Run SQL to set role to "team"
  2. Verify raw_user_meta_data has role field
  3. Logout and login again
  4. Hard refresh (Ctrl+Shift+R)
```

### **❌ "Access denied to admin pages"**

```
Problem: Team user trying to access /admin/*
Expected: This is correct behavior
Team users should NOT access admin routes
Use /dashboard, /certificates instead
```

---

## ✅ **QUICK REFERENCE**

### **Team Login:**
```
URL: http://localhost:3000/login
Email: team@example.com
Password: Team123!
```

### **After Login:**
```
Redirect: /dashboard
Role: Team
Menu: Dashboard, Certificates, Members, Categories, FAQ
```

### **Team Dashboard:**
```
URL: http://localhost:3000/dashboard
Features: View stats, recent activity
Permissions: View only, no admin features
```

---

## 🎉 **READY TO LOGIN AS TEAM!**

**Credentials:**
- ✅ Email: team@example.com
- ✅ Password: Team123!
- ✅ Role: team

**Login URL:**
- ✅ http://localhost:3000/login

**After login, you'll have team-level access!** 🔑✅
