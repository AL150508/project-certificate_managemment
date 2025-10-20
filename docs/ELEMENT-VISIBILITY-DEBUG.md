# Element Visibility Debug Guide

## ❌ **MASALAH: Element Name dan lainnya tidak muncul di certificate preview**

### **🔍 Debugging Steps:**

#### **1. Check Console Logs**
Buka browser console (F12) dan lihat logs berikut saat klik element buttons:

```
Expected Logs:
✅ Element button clicked: name
✅ Element added: {id: "...", type: "name", value: "Sample Name", visible: true}
✅ CertificatePreview - elements: [{...}]
✅ Rendering element: {id: "...", type: "name", ...}
✅ Element position: {x: 100, y: 100} ScaleFactor: 0.5
✅ Calculated position: {left: "50px", top: "50px"}
```

#### **2. Test Element Addition**
1. Pilih template
2. Klik button "Name"
3. Check console untuk logs di atas
4. Lihat apakah element muncul dengan background kuning dan border merah (debug styling)

#### **3. Check Element Properties**
Setelah klik element button, check di Element Properties form:
- ✅ Name Value: "Sample Name" (atau value lain)
- ✅ Position X: 100
- ✅ Position Y: 100
- ✅ Font Size: 16
- ✅ Color: #000000

### **🚀 Possible Issues & Solutions:**

#### **Issue 1: Elements Array Empty**
**Symptom**: Console shows `CertificatePreview - elements: []`
**Solution**: 
```typescript
// Check handleElementAdd in page.tsx
// Ensure setElements is called properly
setElements(prev => [...prev, newElement])
```

#### **Issue 2: Element Not Visible**
**Symptom**: Console shows `Element not visible: element_id`
**Solution**:
```typescript
// Ensure visible: true in handleElementAdd
const newElement = {
  // ...
  visible: true  // ← This must be true
}
```

#### **Issue 3: Position Outside Container**
**Symptom**: Element exists but not visible on screen
**Solution**:
```typescript
// Check calculated position in console
// Ensure position is within container bounds
position: {
  x: 100, // Should be > 0 and < container width
  y: 100  // Should be > 0 and < container height
}
```

#### **Issue 4: Scale Factor Issues**
**Symptom**: Element position calculated incorrectly
**Solution**:
```typescript
// Check scaleFactor in console
// Should be between 0.1 and 1.0
console.log('ScaleFactor:', scaleFactor)
```

#### **Issue 5: Z-Index Issues**
**Symptom**: Element behind template background
**Solution**:
```css
/* Element should have higher z-index */
style={{
  zIndex: 10, // Higher than template background
  position: 'absolute'
}}
```

### **🔧 Debug Styling Added:**

Elements now have debug styling to make them visible:
```css
backgroundColor: 'rgba(255, 255, 0, 0.1)', // Yellow background
border: '1px solid rgba(255, 0, 0, 0.3)',  // Red border
padding: '2px',
zIndex: 10,
overflow: 'visible'
```

### **📋 Testing Checklist:**

#### **Step 1: Template Selection**
- [ ] Template selected and visible in preview
- [ ] Console: Template config loaded

#### **Step 2: Element Addition**
- [ ] Click "Name" button
- [ ] Console: "Element button clicked: name"
- [ ] Console: "Element added: {...}"
- [ ] Toast: "Name element added"

#### **Step 3: Element Rendering**
- [ ] Console: "CertificatePreview - elements: [...]"
- [ ] Console: "Rendering element: {...}"
- [ ] Console: "Element position: {...}"
- [ ] Console: "Calculated position: {...}"

#### **Step 4: Visual Verification**
- [ ] Element visible with yellow background
- [ ] Element has red border
- [ ] Element shows text content
- [ ] Element positioned correctly

#### **Step 5: Properties Form**
- [ ] Element Properties form appears
- [ ] Form shows correct values
- [ ] Changes in form update preview

### **🎯 Quick Fix Commands:**

#### **Reset Elements (in browser console):**
```javascript
// Clear all elements
window.location.reload()
```

#### **Manual Element Test (in browser console):**
```javascript
// Add element manually for testing
const testElement = {
  id: 'test-123',
  type: 'name',
  label: 'Name',
  value: 'TEST NAME',
  position: { x: 200, y: 200 },
  style: {
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#ff0000',
    alignment: 'left'
  },
  visible: true
}

// This would need to be added through React state
console.log('Test element:', testElement)
```

### **🔍 Common Problems:**

#### **1. Element Added But Not Visible**
- Check `visible: true` property
- Check position is within bounds
- Check z-index and overflow styles
- Check console for rendering logs

#### **2. Element Properties Not Working**
- Check selectedElementId matches element.id
- Check updateElement function is called
- Check state updates properly

#### **3. Position Controls Not Working**
- Check updatePosition function
- Check scaleFactor calculation
- Check position values are numbers

#### **4. Style Changes Not Applied**
- Check updateStyle function
- Check style object structure
- Check CSS properties are valid

### **✅ Success Indicators:**

**Element Addition Success:**
- ✅ Console: "Element added: {...}"
- ✅ Yellow background visible on certificate
- ✅ Red border around element
- ✅ Text content displayed
- ✅ Element Properties form appears

**Element Positioning Success:**
- ✅ Console: "Calculated position: {left: 'Xpx', top: 'Ypx'}"
- ✅ Element moves when Position X/Y changed
- ✅ Position values match form inputs

**Element Styling Success:**
- ✅ Font changes when Font Family changed
- ✅ Size changes when Font Size changed
- ✅ Color changes when Color changed
- ✅ Alignment changes when Alignment changed

### **🚨 If Still Not Working:**

1. **Check React DevTools**: Verify elements state in React DevTools
2. **Check Network Tab**: Ensure no JavaScript errors
3. **Check Element Inspector**: Verify DOM elements are created
4. **Clear Cache**: Hard refresh (Ctrl+Shift+R)
5. **Check Browser Compatibility**: Test in different browser

**After debugging, elements should be visible with yellow background and red border for easy identification!**
