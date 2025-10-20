# Role Testing Checklist

## 🎯 **3 ROLES:**
1. **Public** - Guest/tidak login
2. **Team** - Team member (can create, read, update - NO DELETE)
3. **Admin** - Full access (can create, read, update, delete)

---

## ✅ **PUBLIC ROLE**

### **Access:**
- ✅ `/` → Redirect to `/dashboard`
- ✅ `/dashboard` → Public dashboard
- ✅ `/cek/{param}` → Certificate verification
- ✅ `/faq` → FAQ page
- ❌ `/admin/*` → Should redirect to login
- ❌ `/team/*` → Should redirect to login

### **Features:**
- ✅ View public dashboard
- ✅ Check certificate by number/code
- ✅ View statistics (read-only)
- ✅ Click "Login / Daftar" to login

### **Navigation Menu:**
- Dashboard
- FAQ

---

## ✅ **TEAM ROLE**

### **Access:**
- ✅ `/team/dashboard` → Team dashboard
- ✅ `/admin/certificates` → Certificates management
- ✅ `/admin/templates` → Templates management
- ✅ `/admin/members` → Members management
- ✅ `/admin/categories` → Categories management
- ✅ `/faq` → FAQ page

### **Features:**

#### **Certificates:**
- ✅ View all certificates
- ✅ Create new certificate
- ✅ Edit certificate
- ❌ **DELETE certificate** (DISABLED)
- ✅ Preview certificate
- ✅ Generate PDF/PNG
- ✅ Send email

#### **Templates:**
- ✅ View all templates
- ✅ Create new template
- ✅ Edit template
- ❌ **DELETE template** (DISABLED)
- ✅ Duplicate template
- ✅ Preview template

#### **Members:**
- ✅ View all members
- ✅ Create new member
- ✅ Edit member
- ❌ **DELETE member** (DISABLED)
- ✅ Import from Excel/CSV
- ✅ Export to Excel

#### **Categories:**
- ✅ View all categories
- ✅ Create new category
- ✅ Edit category
- ❌ **DELETE category** (DISABLED)

### **Navigation Menu:**
- Dashboard
- Certificates
- Templates
- Members
- Categories
- FAQ

### **Dashboard Badge:**
- Should show: **"Team Dashboard"** (blue badge)

---

## ✅ **ADMIN ROLE**

### **Access:**
- ✅ `/admin/dashboard` → Admin dashboard
- ✅ `/admin/certificates` → Certificates management
- ✅ `/admin/templates` → Templates management
- ✅ `/admin/members` → Members management
- ✅ `/admin/categories` → Categories management
- ✅ `/faq` → FAQ page

### **Features:**

#### **Certificates:**
- ✅ View all certificates
- ✅ Create new certificate
- ✅ Edit certificate
- ✅ **DELETE certificate** ✅
- ✅ Preview certificate
- ✅ Generate PDF/PNG
- ✅ Send email
- ✅ Bulk operations

#### **Templates:**
- ✅ View all templates
- ✅ Create new template
- ✅ Edit template
- ✅ **DELETE template** ✅
- ✅ Duplicate template
- ✅ Preview template

#### **Members:**
- ✅ View all members
- ✅ Create new member
- ✅ Edit member
- ✅ **DELETE member** ✅
- ✅ Import from Excel/CSV
- ✅ Export to Excel

#### **Categories:**
- ✅ View all categories
- ✅ Create new category
- ✅ Edit category
- ✅ **DELETE category** ✅

### **Navigation Menu:**
- Dashboard
- Certificates
- Templates
- Members
- Categories
- FAQ

### **Dashboard Badge:**
- Should show: **"Admin Dashboard"** (red badge)

### **Special Features:**
- ✅ Role switching (Admin can test as Team/Public)
- ✅ View activity logs
- ✅ System settings

---

## 🔍 **TESTING STEPS:**

### **1. Test Public Role:**
```
1. Open incognito/private window
2. Go to http://localhost:3000
3. Should redirect to /dashboard
4. Check navigation menu (only Dashboard, FAQ)
5. Try to access /admin/dashboard → should redirect to login
6. Test certificate verification
7. Click "Login / Daftar" → should go to /login
```

### **2. Test Team Role:**
```
1. Login with team@gmail.com
2. Should redirect to /team/dashboard
3. Check badge shows "Team Dashboard" (blue)
4. Check navigation menu (6 items)
5. Test Certificates:
   - Create ✅
   - Edit ✅
   - Delete button should NOT appear ❌
6. Test Templates:
   - Create ✅
   - Edit ✅
   - Delete button should NOT appear ❌
7. Test Members:
   - Create ✅
   - Edit ✅
   - Delete button should NOT appear ❌
8. Test Categories:
   - Create ✅
   - Edit ✅
   - Delete button should NOT appear ❌
9. Logout works ✅
```

### **3. Test Admin Role:**
```
1. Login with admin@gmail.com
2. Should redirect to /admin/dashboard
3. Check badge shows "Admin Dashboard" (red)
4. Check navigation menu (6 items)
5. Test Certificates:
   - Create ✅
   - Edit ✅
   - Delete button SHOULD appear ✅
6. Test Templates:
   - Create ✅
   - Edit ✅
   - Delete button SHOULD appear ✅
7. Test Members:
   - Create ✅
   - Edit ✅
   - Delete button SHOULD appear ✅
8. Test Categories:
   - Create ✅
   - Edit ✅
   - Delete button SHOULD appear ✅
9. Logout works ✅
```

---

## 🐛 **KNOWN ISSUES TO FIX:**

### **1. Role Detection:**
- ✅ RLS policy sudah di-run
- ⚠️ Perlu logout & login lagi untuk role ter-detect

### **2. Console Warnings:**
```
🔍 useRoleLinks - Current role: public
⚠️ Returning PublicMenu (2 items)
```
- Ini normal jika belum login atau role = public

### **3. Missing Image:**
```
GET /certificate-preview.png 404
```
- Need to add placeholder image or remove from Hero components

---

## ✅ **EXPECTED BEHAVIOR:**

### **Delete Button Visibility:**

**Public:**
- No delete buttons anywhere (read-only)

**Team:**
- ❌ No delete button in Certificates
- ❌ No delete button in Templates
- ❌ No delete button in Members
- ❌ No delete button in Categories

**Admin:**
- ✅ Delete button in Certificates
- ✅ Delete button in Templates
- ✅ Delete button in Members
- ✅ Delete button in Categories

---

## 🚀 **QUICK TEST COMMANDS:**

```bash
# Start dev server
npm run dev

# Test as Public
# Open: http://localhost:3000

# Test as Team
# Login: team@gmail.com / team123

# Test as Admin
# Login: admin@gmail.com / admin123
```

---

## 📋 **CHECKLIST SUMMARY:**

- [ ] Public can access public dashboard
- [ ] Public cannot access admin/team pages
- [ ] Team can login and see full menu
- [ ] Team dashboard shows "Team Dashboard" badge
- [ ] Team CANNOT see delete buttons
- [ ] Admin can login and see full menu
- [ ] Admin dashboard shows "Admin Dashboard" badge
- [ ] Admin CAN see delete buttons
- [ ] Logout works for all roles
- [ ] Role detection works correctly
- [ ] No console errors
- [ ] All navigation links work

**Status: READY FOR TESTING** ✅
