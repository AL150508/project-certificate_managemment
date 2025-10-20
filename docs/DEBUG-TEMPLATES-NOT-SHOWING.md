# Debug: Templates Not Showing

## 🔍 **TROUBLESHOOTING TEMPLATES PAGE**

Jika templates tidak muncul di `/admin/templates`, ikuti langkah debugging ini:

### **STEP 1: Check Browser Console**

#### **✅ Open Console:**
```
1. Go to /admin/templates
2. Press F12 → Console tab
3. Look for these messages:
```

#### **✅ Expected Output (Success):**
```
📥 Fetching templates and categories...
🔍 Current user: {user: {...}}
📊 Templates response: {data: [...], error: null}
📊 Categories response: {data: [...], error: null}
✅ Fetched 5 templates
📋 Templates data: [{id: "...", name: "...", ...}, ...]
✅ Fetched 3 categories
```

#### **❌ Error Scenarios:**

**1. No Data:**
```
✅ Fetched 0 templates
⚠️ No templates found in database
Toast: "No templates found. Create your first template!"

Solution: Create template di /certificates/editor
```

**2. Permission Error:**
```
❌ Templates fetch error: {message: "permission denied for table certificate_templates"}

Solution: Check RLS policies
```

**3. Table Not Found:**
```
❌ Templates fetch error: {message: "relation certificate_templates does not exist"}

Solution: Run scripts/setup-all-tables.sql
```

**4. Not Authenticated:**
```
🔍 Current user: {user: null}
❌ Templates fetch error: {message: "..."}

Solution: Login as admin first
```

### **STEP 2: Check Database**

#### **✅ Run SQL Query:**
```sql
-- Check if templates exist
SELECT id, name, created_at
FROM certificate_templates
ORDER BY created_at DESC;

-- Expected: Should return rows if templates exist
-- If empty: No templates created yet
```

#### **✅ Check Table Exists:**
```sql
-- Verify table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'certificate_templates';

-- Expected: Should return 1 row
-- If empty: Table doesn't exist, run setup script
```

#### **✅ Check RLS Policies:**
```sql
-- Check policies
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'certificate_templates';

-- Should have SELECT policy for authenticated users
```

### **STEP 3: Verify Authentication**

#### **✅ Check Login Status:**
```
1. Check if logged in as admin
2. Look for user avatar in top right
3. Check role indicator shows "admin"
```

#### **✅ If Not Logged In:**
```
1. Go to /login
2. Login with admin credentials
3. Return to /admin/templates
4. Should now show templates
```

### **STEP 4: Create Test Template**

#### **✅ If No Templates Exist:**
```
1. Click "Create Template" button
2. Or go to /certificates/editor
3. Select background
4. Add some elements
5. Select category
6. Click "Save Template"
7. Should redirect to /admin/templates
8. Template should appear in list
```

### **STEP 5: Check Network Tab**

#### **✅ Open Network Tab:**
```
1. F12 → Network tab
2. Refresh /admin/templates
3. Look for request to Supabase
4. Check response
```

#### **✅ Expected Request:**
```
Request URL: https://[project].supabase.co/rest/v1/certificate_templates
Method: GET
Status: 200 OK
Response: [{id: "...", name: "...", ...}, ...]
```

#### **❌ Error Responses:**

**401 Unauthorized:**
```
Status: 401
Response: {"message": "JWT expired"}

Solution: Re-login
```

**403 Forbidden:**
```
Status: 403
Response: {"message": "permission denied"}

Solution: Check RLS policies
```

**404 Not Found:**
```
Status: 404
Response: {"message": "relation does not exist"}

Solution: Run setup-all-tables.sql
```

### **COMMON ISSUES & SOLUTIONS**

#### **❌ 1. "No templates found"**
```
Problem: Database is empty
Solution:
  1. Create template in /certificates/editor
  2. Or run scripts/insert-dummy-certificates.sql
  3. Refresh /admin/templates
```

#### **❌ 2. "Permission denied"**
```
Problem: RLS policies blocking access
Solution:
  1. Check if logged in as admin
  2. Verify RLS policies allow SELECT
  3. Run: scripts/fix-rls-policies.sql (if exists)
```

#### **❌ 3. "Table does not exist"**
```
Problem: certificate_templates table not created
Solution:
  1. Run: scripts/setup-all-tables.sql
  2. Verify table created
  3. Refresh page
```

#### **❌ 4. "Loading forever"**
```
Problem: Request hanging or error not caught
Solution:
  1. Check browser console for errors
  2. Check network tab for failed requests
  3. Verify Supabase connection
  4. Check internet connection
```

#### **❌ 5. Templates exist but not showing**
```
Problem: Frontend filter or state issue
Solution:
  1. Clear search box (if any text)
  2. Hard refresh (Ctrl+Shift+R)
  3. Check console for state updates
  4. Verify templates state: console.log(templates)
```

### **QUICK FIX CHECKLIST**

#### **✅ Run These Steps:**
```
1. ✅ Login as admin (/login)
2. ✅ Check console for errors (F12)
3. ✅ Verify database has data (SQL query)
4. ✅ Check RLS policies (SQL query)
5. ✅ Create test template (/certificates/editor)
6. ✅ Refresh /admin/templates
7. ✅ Check network tab for API calls
```

### **SQL DIAGNOSTIC QUERIES**

#### **✅ Run in Supabase SQL Editor:**
```sql
-- 1. Count templates
SELECT COUNT(*) as total FROM certificate_templates;

-- 2. List recent templates
SELECT id, name, created_at 
FROM certificate_templates 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'certificate_templates';

-- 4. Test SELECT permission
SELECT * FROM certificate_templates LIMIT 1;
-- If this fails, RLS is blocking
```

### **EXPECTED BEHAVIOR**

#### **✅ When Working Correctly:**
```
1. Page loads
2. Console shows: "Fetching templates..."
3. Console shows: "Fetched X templates"
4. Table displays templates
5. Preview images show
6. All columns populated
7. Action buttons work
```

#### **✅ When No Data:**
```
1. Page loads
2. Console shows: "Fetched 0 templates"
3. Toast: "No templates found"
4. Table shows: "No templates found. Create your first template!"
5. "Create Template" button visible
```

## ✅ **DEBUG STEPS SUMMARY**

**Quick Checklist:**
1. ✅ **Check Console** - Look for errors or "0 templates"
2. ✅ **Check Database** - Run SQL to verify data exists
3. ✅ **Check Login** - Verify logged in as admin
4. ✅ **Check RLS** - Verify policies allow SELECT
5. ✅ **Create Template** - Test create flow
6. ✅ **Check Network** - Verify API calls succeed

**Most Common Issue:**
- ⚠️ **No templates in database** → Create template in editor
- ⚠️ **Not logged in** → Login as admin
- ⚠️ **RLS blocking** → Check policies

**Share console output untuk debug lebih lanjut!** 🔍
