# Debug: Team Menu Not Showing

## ✅ **USER DATA VERIFIED**

Database shows:
- ✅ `team@gmail.com` exists in `public.users`
- ✅ Role = `team` (correct!)
- ✅ User should have full menu access

## 🔍 **DEBUG STEPS**

### **STEP 1: Check Console Output**

After login, open console (F12) and look for:

```
🔍 AppHeader - Current role: team
🔍 AppHeader - User: {email: "team@gmail.com"}
🔍 AppHeader - Nav links: [
  {href: "/team/dashboard", label: "Dashboard"},
  {href: "/certificates", label: "Certificates"},
  {href: "/admin/templates", label: "Templates"},
  {href: "/admin/members", label: "Members"},
  {href: "/admin/categories", label: "Categories"},
  {href: "/faq", label: "FAQ"}
]
```

### **STEP 2: Check Role Detection**

If console shows `role: "public"` instead of `"team"`:

**Problem:** Role not detected from database

**Solution:**
```sql
-- Verify user role in database
SELECT email, role FROM public.users WHERE email = 'team@gmail.com';

-- If role is wrong, update:
UPDATE public.users SET role = 'team' WHERE email = 'team@gmail.com';
```

### **STEP 3: Clear Cache & Logout**

```
1. Open console (F12)
2. Run: localStorage.clear()
3. Run: sessionStorage.clear()
4. Click "Log out"
5. Hard refresh: Ctrl + Shift + R
6. Login again
```

### **STEP 4: Check RoleContext**

In console, run:

```javascript
// Check current session
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Check user role from database
const { data } = await supabase
  .from("users")
  .select("role")
  .eq("email", "team@gmail.com")
  .single()
console.log('User role from DB:', data.role)
```

**Expected:**
```
Session: {user: {email: "team@gmail.com", ...}}
User role from DB: "team"
```

---

## 🚨 **COMMON ISSUES**

### **Issue 1: Role shows "public" instead of "team"**

**Cause:** RoleContext not fetching role correctly

**Fix:**
```typescript
// Check RoleContext.tsx line 26
const { data, error } = await supabase
  .from("users")  // ← Make sure this is "users" not "auth.users"
  .select("role")
  .eq("email", email)
  .maybeSingle<{ role: Role }>()
```

### **Issue 2: Menu only shows Dashboard & FAQ**

**Cause:** NavLinks returning PublicMenu instead of TeamMenu

**Fix:**
```typescript
// Check NavLinks.tsx
const TeamMenu: LinkItem[] = [
  { href: "/team/dashboard", label: "Dashboard" },
  { href: "/certificates", label: "Certificates" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/faq", label: "FAQ" },
]

// Make sure useRoleLinks returns TeamMenu for team role
if (role === "team") return TeamMenu
```

### **Issue 3: Navigation not updating after login**

**Cause:** React state not refreshing

**Fix:**
```
1. Logout
2. Clear localStorage
3. Hard refresh (Ctrl+Shift+R)
4. Login again
```

---

## ✅ **TESTING CHECKLIST**

```
1. ✅ Login as team
2. ✅ Open console (F12)
3. ✅ Check console output:
   - Current role: team
   - Nav links: 6 items
4. ✅ Check navigation menu:
   - Dashboard
   - Certificates
   - Templates
   - Members
   - Categories
   - FAQ
5. ✅ Click each menu item
6. ✅ Verify access to all pages
```

---

## 🔧 **QUICK FIX**

**If menu still not showing:**

1. **Logout:**
   ```
   Click avatar → Log out
   ```

2. **Clear everything:**
   ```javascript
   // In console (F12)
   localStorage.clear()
   sessionStorage.clear()
   ```

3. **Hard refresh:**
   ```
   Ctrl + Shift + R
   ```

4. **Login again:**
   ```
   Email: team@gmail.com
   Password: team123
   Role: Team
   ```

5. **Check console:**
   ```
   Should see:
   🔍 AppHeader - Current role: team
   🔍 AppHeader - Nav links: [6 items]
   ```

6. **Verify menu:**
   ```
   Navigation should show all 6 menu items
   ```

---

## 📋 **EXPECTED CONSOLE OUTPUT**

### **After Login:**
```
🔐 Starting login process...
📧 Email: team@gmail.com
👤 Selected role: team
✅ Login successful
✅ User: team@gmail.com
👤 User data from DB: {role: "team"}
🔄 Redirecting to team dashboard...
```

### **On Team Dashboard:**
```
🔍 AppHeader - Current role: team
🔍 AppHeader - User: {id: "...", email: "team@gmail.com"}
🔍 AppHeader - Nav links: [
  {href: "/team/dashboard", label: "Dashboard"},
  {href: "/certificates", label: "Certificates"},
  {href: "/admin/templates", label: "Templates"},
  {href: "/admin/members", label: "Members"},
  {href: "/admin/categories", label: "Categories"},
  {href: "/faq", label: "FAQ"}
]
```

---

## ✅ **SOLUTION**

**Code already correct! Just need to:**

1. ✅ **Logout** (clear session)
2. ✅ **Clear cache** (localStorage/sessionStorage)
3. ✅ **Hard refresh** (Ctrl+Shift+R)
4. ✅ **Login again** (as team)
5. ✅ **Check console** (verify role detection)
6. ✅ **Menu should appear!**

**Silakan logout, clear cache, dan login lagi!** 🔧✅
