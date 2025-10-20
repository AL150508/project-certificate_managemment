# Quick Email Setup Guide

## 🚀 **5-MINUTE GMAIL SETUP**

Setup paling cepat untuk testing email sending menggunakan Gmail.

### **STEP 1: Enable 2FA (2 minutes)**

```
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow prompts to enable
4. Verify with phone
```

### **STEP 2: Generate App Password (1 minute)**

```
1. Go to: https://myaccount.google.com/apppasswords
2. App: "Mail"
3. Device: "Other" → type "Certificate Manager"
4. Click "Generate"
5. Copy 16-character password (e.g., "abcd efgh ijkl mnop")
```

### **STEP 3: Add to .env.local (1 minute)**

Create or edit `.env.local` in project root:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=Certificate Manager <your-email@gmail.com>

# Base URL
NEXT_PUBLIC_PUBLIC_BASE_URL=http://localhost:3000
```

**Important:**
- Remove spaces from App Password
- Use your actual Gmail address
- Don't commit .env.local to git!

### **STEP 4: Restart Server (30 seconds)**

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### **STEP 5: Test Email (30 seconds)**

```
1. Go to /certificates
2. Find certificate with member email
3. Click "Send Email"
4. Check inbox
5. Email should arrive in ~5 seconds
```

---

## ✅ **VERIFICATION**

### **Check Email Received:**

```
From: Certificate Manager <your-email@gmail.com>
To: member-email@example.com
Subject: [Certificate] Sertifikat Achievement - John Doe

✅ Email body with greeting
✅ Verification link
✅ PDF download link
✅ PDF attachment
```

### **Check Console:**

```
POST /api/certificates/[id]/email
Status: 200 OK
Response: {ok: true}
```

### **Check Database:**

```sql
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 1;
-- Should show status: 'sent'
```

---

## 🔍 **TROUBLESHOOTING**

### **❌ "Invalid login"**

```
Problem: Wrong credentials
Fix:
  1. Verify 2FA enabled
  2. Use App Password (not regular password)
  3. Remove spaces from password
  4. Check EMAIL_USER is correct
```

### **❌ "Recipient email not found"**

```
Problem: Member has no email
Fix:
  1. Go to /admin/members
  2. Edit member
  3. Add email address
  4. Save
  5. Try again
```

### **❌ Email not received**

```
Problem: In spam or not sent
Fix:
  1. Check spam folder
  2. Check console for errors
  3. Check email_logs table
  4. Verify EMAIL_FROM matches EMAIL_USER
```

---

## 📋 **CHECKLIST**

```
✅ 2FA enabled on Gmail
✅ App Password generated
✅ .env.local created with credentials
✅ Server restarted
✅ Member has email address
✅ Certificate generated (PDF exists)
✅ Click "Send Email"
✅ Email received
```

---

## 🎯 **NEXT STEPS**

### **For Production:**

```
1. Use SendGrid or Mailgun (more reliable)
2. Verify sender domain
3. Use custom domain email
4. Monitor email logs
5. Handle bounces
```

### **For Testing:**

```
Gmail is perfect!
- Free
- Easy setup
- 500 emails/day limit
- Good for development
```

---

## 📧 **EXAMPLE EMAIL**

```
From: Certificate Manager <your-email@gmail.com>
To: john.doe@example.com
Subject: [Certificate] Sertifikat Achievement - John Doe

Halo John Doe,

Selamat! Anda telah menerima sertifikat pelatihan Achievement.

Klik tautan berikut untuk melihat sertifikat Anda:
http://localhost:3000/cek/ABC123XYZ

Anda juga dapat mengunduh PDF sertifikat melalui tautan berikut:
[PDF URL]

Salam hangat,
Tim Certificate Manager

📎 Attachment: CERT-2025-10-0001.pdf
```

---

## ✅ **DONE!**

**Email sending sekarang aktif dan bisa mengirim ke real email addresses!** 📧✅

**Total setup time: ~5 minutes**
