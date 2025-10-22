# Certificate Flow Diagram

## Complete Certificate Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CERTIFICATE EDITOR                           │
│                  /certificates/editor                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User designs certificate
                              │ - Select template
                              │ - Add text elements
                              │ - Select category (optional)
                              │ - Select member (optional)
                              │
                              ▼
                    ┌─────────────────┐
                    │ Click "Save"    │
                    └─────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │     handleSaveTemplate() Function       │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│   STEP 1: Save   │                    │  Validation      │
│   to Templates   │                    │  - User auth     │
│                  │                    │  - Template      │
│ certificate_     │                    │  - Elements      │
│ templates        │                    └──────────────────┘
│                  │
│ Stores:          │
│ - Template name  │
│ - Background URL │
│ - Orientation    │
│ - Fields         │
│ - Metadata       │
│                  │
│ Returns:         │
│ templateResult.id│
└──────────────────┘
        │
        ▼
┌──────────────────┐
│   STEP 2: Save   │
│   to Designs     │
│                  │
│ certificate_     │
│ designs          │
│                  │
│ Stores:          │
│ - template_id    │
│ - layout_data    │
│ - orientation    │
│ - member_id      │
│ - metadata       │
│                  │
│ Returns:         │
│ designResult.id  │
└──────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│   STEP 3: Save to Certificates ✅ NEW    │
│                                          │
│ certificates                             │
│                                          │
│ Generates:                               │
│ - certificate_number                     │
│   Format: CERT-{YEAR}-{MONTH}-{RANDOM}  │
│   Example: CERT-2025-10-3847            │
│                                          │
│ - verification_code ✅ NEW               │
│   Format: VER-{YEARMONTH}-{RANDOM8}     │
│   Example: VER-202510-ABC123XY          │
│                                          │
│ Stores:                                  │
│ - certificate_number                     │
│ - verification_code ✅                   │
│ - template_id (from Step 1)             │
│ - member_id (if selected)               │
│ - category_id (if selected)             │
│ - recipient_name ✅                      │
│ - issue_date (today)                    │
│ - status: 'issued' ✅                    │
│ - created_by (current user)             │
│ - certificate_data (elements)           │
│ - metadata (designId, etc.)             │
│                                          │
│ Returns:                                 │
│ certResult.id                            │
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│         Success Message                  │
│                                          │
│ ✅ Certificate saved successfully!       │
│                                          │
│ Certificate Number: CERT-2025-10-3847   │
│ Verification Code: VER-202510-ABC123XY  │
│ Recipient: John Doe                     │
│ Category: Achievement                   │
│ Status: Issued                          │
│                                          │
│ You can view it in the Certificates     │
│ page.                                   │
└──────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│      CERTIFICATES LIST PAGE             │
│      /certificates                      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Certificate Number │ Member │ ... │ │
│  ├───────────────────────────────────┤ │
│  │ CERT-2025-10-3847 │ John D │ ... │ │ ✅ Appears here!
│  │ CERT-2025-10-3846 │ Jane S │ ... │ │
│  │ CERT-2025-10-3845 │ Bob M  │ ... │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Data Flow Between Tables

```
┌──────────────────────────┐
│  certificate_templates   │
│  (Template Definition)   │
│                          │
│  - id (UUID)            │◄─────┐
│  - name                  │      │
│  - orientation           │      │
│  - background_url        │      │
│  - fields                │      │
│  - metadata              │      │
└──────────────────────────┘      │
                                  │
                                  │ template_id
                                  │
┌──────────────────────────┐      │
│  certificate_designs     │      │
│  (Layout Data)           │      │
│                          │      │
│  - id (UUID)            │      │
│  - template_id ─────────┼──────┘
│  - layout_data           │
│  - orientation           │
│  - member_id             │
│  - metadata              │
└──────────────────────────┘
        │
        │ design_id (in metadata)
        │
        ▼
┌──────────────────────────────────────┐
│  certificates ✅                     │
│  (Main Certificate Records)          │
│                                      │
│  - id (UUID)                        │
│  - certificate_number ✅             │
│  - verification_code ✅ NEW          │
│  - template_id ──────────────────┐  │
│  - member_id                      │  │
│  - category_id                    │  │
│  - recipient_name ✅              │  │
│  - issue_date                     │  │
│  - status: 'issued' ✅            │  │
│  - pdf_url                        │  │
│  - png_url                        │  │
│  - created_by                     │  │
│  - certificate_data               │  │
│  - metadata { designId }          │  │
└──────────────────────────────────────┘
                                      │
                                      │
        ┌─────────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  certificate_templates   │
│  (Referenced)            │
└──────────────────────────┘
```

## Recipient Name Resolution

```
┌─────────────────────────────────────────┐
│  When saving certificate in editor:     │
└─────────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Member        │
        │ selected?     │
        └───────────────┘
                │
        ┌───────┴───────┐
        │               │
       YES             NO
        │               │
        ▼               ▼
┌──────────────┐  ┌─────────────────────┐
│ Use member   │  │ Use descriptive     │
│ name from    │  │ name:               │
│ members      │  │ "Certificate from   │
│ table        │  │  {templateName}"    │
│              │  │                     │
│ Example:     │  │ Example:            │
│ "John Doe"   │  │ "Certificate from   │
│              │  │  Achievement"       │
└──────────────┘  └─────────────────────┘
        │               │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Save as       │
        │ recipient_name│
        └───────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  When displaying in certificates list:  │
└─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  member_name = recipient_name ||        │
│    (member_id ? membersMap.get() : null)│
└─────────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Display in    │
        │ table column  │
        └───────────────┘
```

## Status Flow

```
┌─────────────────────────────────────────┐
│  Certificate created in editor          │
└─────────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ status:       │
        │ 'issued' ✅   │
        └───────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Appears in certificates list           │
│  (filtered by status if needed)         │
└─────────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ User can:     │
        │ - View        │
        │ - Edit        │
        │ - Generate PDF│
        │ - Send Email  │
        │ - Delete      │
        └───────────────┘
```

## Verification Code Usage

```
┌─────────────────────────────────────────┐
│  Certificate saved with verification    │
│  code: VER-202510-ABC123XY              │
└─────────────────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
┌──────────────┐  ┌─────────────────┐
│ Stored in    │  │ Stored in       │
│ verification_│  │ metadata.       │
│ code field   │  │ verificationCode│
└──────────────┘  └─────────────────┘
        │               │
        └───────┬───────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Can be used for:                       │
│                                         │
│  1. Public verification                 │
│     /cek/VER-202510-ABC123XY           │
│                                         │
│  2. QR code generation                  │
│     QR → /cek/VER-202510-ABC123XY      │
│                                         │
│  3. Email verification link             │
│     Click here to verify:               │
│     /cek/VER-202510-ABC123XY           │
└─────────────────────────────────────────┘
```

## Complete User Journey

```
1. User Login
   │
   ▼
2. Navigate to /certificates/editor
   │
   ▼
3. Select Template
   │
   ▼
4. Add Elements (text, images, etc.)
   │
   ▼
5. Select Category (optional)
   │
   ▼
6. Select Member (optional)
   │
   ▼
7. Click "Save Template"
   │
   ├─ Validation
   │  ├─ User authenticated? ✅
   │  ├─ Template selected? ✅
   │  └─ Elements added? ✅
   │
   ├─ Save to certificate_templates ✅
   │
   ├─ Save to certificate_designs ✅
   │
   └─ Save to certificates ✅ NEW
      │
      ├─ Generate certificate_number
      ├─ Generate verification_code ✅
      ├─ Set recipient_name
      ├─ Set status: 'issued'
      └─ Save all data
   │
   ▼
8. Success Message
   │
   ├─ Certificate Number: CERT-2025-10-3847
   ├─ Verification Code: VER-202510-ABC123XY ✅
   ├─ Recipient: John Doe
   ├─ Category: Achievement
   └─ Status: Issued
   │
   ▼
9. Navigate to /certificates
   │
   ▼
10. Certificate appears in list ✅
    │
    ├─ Certificate Number
    ├─ Recipient Name
    ├─ Category
    ├─ Issue Date
    └─ Status: issued
    │
    ▼
11. User can:
    ├─ View details
    ├─ Generate PDF
    ├─ Send email
    ├─ Edit
    └─ Delete
```

---

**Created:** October 22, 2025  
**Purpose:** Visual documentation of certificate creation flow
