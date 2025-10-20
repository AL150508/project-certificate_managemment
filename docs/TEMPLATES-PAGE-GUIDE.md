# Templates Page Guide

## ✅ **TEMPLATES PAGE SUDAH AKTIF!**

Halaman Templates (`/admin/templates`) sekarang menampilkan semua templates yang dibuat di editor.

### **🎯 FEATURES**

#### **✅ 1. View All Templates**
```
- Table view dengan preview images
- Template name, orientation, category
- Field count, source, created date
- Search functionality
- Responsive layout
```

#### **✅ 2. Template Actions**
```
✅ Preview - View template preview (coming soon)
✅ Edit - Edit template di editor
✅ Delete - Remove template dari database
✅ Create - Create new template via editor
```

#### **✅ 3. Template Information**
```
Display:
- Preview thumbnail (80x56px)
- Template name
- Orientation (landscape/portrait)
- Category name
- Number of fields
- Template source
- Created date
```

### **🚀 CARA MENGGUNAKAN**

#### **STEP 1: View Templates**
```
1. Go to /admin/templates
2. View all templates dalam table
3. See preview, name, orientation, category
4. Check field count dan created date
```

#### **STEP 2: Search Templates**
```
1. Use search bar
2. Search by template name or category
3. Results filter automatically
4. Clear search to see all
```

#### **STEP 3: Create New Template**
```
1. Click "Create Template" button
2. Redirects to /certificates/editor
3. Design template dengan drag-drop
4. Save template
5. Returns to /admin/templates
6. New template appears in list
```

#### **STEP 4: Edit Template**
```
1. Click pencil icon on template
2. Opens editor with template loaded
3. Modify elements, layout, etc
4. Save changes
5. Returns to templates list
6. Changes reflected
```

#### **STEP 5: Delete Template**
```
1. Click trash icon on template
2. Confirm deletion
3. Template removed from database
4. Associated designs also deleted
5. List refreshes automatically
```

### **📊 TEMPLATE DATA DISPLAYED**

#### **✅ Table Columns:**
```
1. Preview - Thumbnail image (80x56)
2. Name - Template name
3. Orientation - landscape/portrait badge
4. Category - Category name
5. Fields - Number of fields
6. Source - Template source (upload/config)
7. Created - Creation date
8. Actions - Preview/Edit/Delete buttons
```

#### **✅ Preview Priority:**
```
1. preview_url (if available)
2. thumbnail_url (if available)
3. background_url (fallback)
4. "No preview" placeholder
```

### **🎨 UI FEATURES**

#### **✅ Visual Elements:**
```
- Dark theme consistent dengan app
- Preview thumbnails untuk quick identification
- Color-coded orientation badges:
  - Landscape: Blue badge
  - Portrait: Purple badge
- Icon buttons untuk actions:
  - Eye (green) - Preview
  - Pencil (blue) - Edit
  - Trash (red) - Delete
- Search bar dengan icon
- Template count display
```

#### **✅ Interactive Elements:**
```
- Hover effects pada table rows
- Button hover states
- Search real-time filtering
- Confirmation dialogs
- Toast notifications
- Loading states
```

### **🔄 COMPLETE WORKFLOW**

#### **Create → View → Edit → Delete:**
```
1. CREATE:
   /admin/templates → Click "Create Template"
   → /certificates/editor → Design template
   → Save → Redirect to /admin/templates
   → New template appears in list

2. VIEW:
   /admin/templates → See all templates
   → Preview thumbnails, details
   → Search/filter templates

3. EDIT:
   /admin/templates → Click pencil icon
   → /certificates/editor?template={id}
   → Modify template → Save
   → Return to /admin/templates

4. DELETE:
   /admin/templates → Click trash icon
   → Confirm → Template deleted
   → List refreshes
```

### **📋 EXPECTED BEHAVIOR**

#### **✅ On Page Load:**
```
1. Fetch all templates from database
2. Fetch all categories for display
3. Display in table sorted by created_at DESC
4. Show loading state while fetching
5. Display template count
```

#### **✅ On Search:**
```
1. Filter templates by name or category
2. Update display in real-time
3. Show filtered count
4. Clear search shows all templates
```

#### **✅ On Create:**
```
1. Redirect to /certificates/editor
2. User creates template
3. Save redirects back to /admin/templates
4. New template appears at top of list
```

#### **✅ On Edit:**
```
1. Load template in editor
2. User modifies template
3. Save updates database
4. Return to /admin/templates
5. Changes reflected in list
```

#### **✅ On Delete:**
```
1. Show confirmation dialog
2. Delete certificate_designs (CASCADE)
3. Delete certificate_templates
4. Refresh list
5. Show success toast
```

### **🔍 CONSOLE OUTPUT**

#### **✅ On Load:**
```
📥 Fetching templates and categories...
✅ Fetched 5 templates
✅ Fetched 3 categories
```

#### **✅ On Delete:**
```
🗑️ Deleting template: abc-123-def
⚠️ Design delete warning: ... (if any)
✅ Template deleted successfully
📥 Fetching templates and categories...
```

### **🗄️ DATABASE QUERIES**

#### **✅ Fetch Templates:**
```sql
SELECT *
FROM certificate_templates
ORDER BY created_at DESC;
```

#### **✅ Fetch Categories:**
```sql
SELECT id, name
FROM certificate_categories
ORDER BY name;
```

#### **✅ Delete Template:**
```sql
-- Delete designs first (or CASCADE)
DELETE FROM certificate_designs
WHERE template_id = 'abc-123';

-- Delete template
DELETE FROM certificate_templates
WHERE id = 'abc-123';
```

### **🎯 INTEGRATION POINTS**

#### **✅ Links to Other Pages:**
```
1. /certificates/editor
   - Create new template
   - Edit existing template

2. /admin/categories
   - Manage categories shown in template list

3. /certificates
   - Use templates to create certificates
```

#### **✅ Data Flow:**
```
Editor → Save → Templates Page → View
                     ↓
                  Edit → Editor → Save → Templates Page
                     ↓
                  Delete → Database → Refresh List
```

### **🚨 ERROR HANDLING**

#### **✅ Fetch Error:**
```typescript
try {
  // Fetch templates
} catch (error) {
  console.error("Error fetching data:", error)
  toast.error("Failed to fetch templates")
}
```

#### **✅ Delete Error:**
```typescript
try {
  // Delete template
} catch (error) {
  console.error("Error deleting template:", error)
  toast.error(error.message || "Failed to delete template")
}
```

### **📱 RESPONSIVE DESIGN**

#### **✅ Desktop:**
```
- Full table view
- All columns visible
- Preview thumbnails
- Action buttons
```

#### **✅ Mobile:**
```
- Table scrollable horizontally
- Compact view
- Essential columns prioritized
- Touch-friendly buttons
```

## ✅ **TEMPLATES PAGE READY!**

**Features yang tersedia:**

- ✅ **View all templates** dalam table format
- ✅ **Search templates** by name or category
- ✅ **Preview thumbnails** untuk quick identification
- ✅ **Create template** via editor
- ✅ **Edit template** dengan load existing
- ✅ **Delete template** dengan confirmation
- ✅ **Template count** display
- ✅ **Category integration**
- ✅ **Console logging** untuk debug
- ✅ **Toast notifications** untuk feedback

**Navigate ke `/admin/templates` untuk melihat semua templates yang sudah dibuat!** 🎨✅
