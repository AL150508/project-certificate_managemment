# Setup Email Sending

## ✅ **SETUP REAL EMAIL SENDING**

Panduan lengkap untuk mengaktifkan fitur Send Email yang benar-benar mengirim ke real email address.

### **📧 EMAIL PROVIDERS**

Anda bisa menggunakan salah satu provider berikut:

#### **Option 1: Gmail (Recommended for Testing)**
```
✅ Free
✅ Easy setup
✅ Good for development/testing
⚠️ Limited to 500 emails/day
⚠️ Requires App Password
```

#### **Option 2: SendGrid**
```
✅ Free tier: 100 emails/day
✅ Professional
✅ Good deliverability
✅ Easy API
```

#### **Option 3: Mailgun**
```
✅ Free tier: 5,000 emails/month
✅ Professional
✅ Good for production
```

#### **Option 4: SMTP Custom**
```
✅ Any SMTP server
✅ Full control
⚠️ Requires SMTP credentials
```

---

## 🚀 **SETUP GMAIL (EASIEST)**

### **STEP 1: Enable 2-Factor Authentication**

```
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow steps to enable 2FA
4. Verify with phone number
```

### **STEP 2: Generate App Password**

```
1. Go to: https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter name: "Certificate Manager"
5. Click "Generate"
6. Copy the 16-character password
   Example: "abcd efgh ijkl mnop"
```

### **STEP 3: Add to .env.local**

```env
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=Certificate Manager <your-email@gmail.com>
```

**Important:**
- Remove spaces from App Password: `abcd efgh ijkl mnop` → `abcdefghijklmnop`
- Use your actual Gmail address
- Don't use your regular Gmail password, use App Password!

---

## 🚀 **SETUP SENDGRID**

### **STEP 1: Create SendGrid Account**

```
1. Go to: https://sendgrid.com/
2. Sign up for free account
3. Verify email address
4. Complete account setup
```

### **STEP 2: Create API Key**

```
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: "Certificate Manager"
4. Permissions: "Full Access" or "Mail Send"
5. Click "Create & View"
6. Copy API Key (starts with "SG.")
```

### **STEP 3: Verify Sender Identity**

```
1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in your email and details
4. Check email for verification link
5. Click link to verify
```

### **STEP 4: Add to .env.local**

```env
# Email Configuration (SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.your-api-key-here
EMAIL_FROM=Certificate Manager <verified-email@yourdomain.com>
```

---

## 🚀 **SETUP MAILGUN**

### **STEP 1: Create Mailgun Account**

```
1. Go to: https://www.mailgun.com/
2. Sign up for free account
3. Verify email and phone
4. Complete account setup
```

### **STEP 2: Get SMTP Credentials**

```
1. Go to Sending → Domain Settings
2. Select your domain (or use sandbox domain for testing)
3. Click "SMTP Credentials"
4. Note the SMTP hostname and credentials
```

### **STEP 3: Add to .env.local**

```env
# Email Configuration (Mailgun)
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASS=your-mailgun-password
EMAIL_FROM=Certificate Manager <noreply@your-domain.com>
```

---

## ⚙️ **CONFIGURATION**

### **✅ Environment Variables**

Add these to your `.env.local` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Certificate Manager <your-email@gmail.com>

# Base URL for verification links
NEXT_PUBLIC_PUBLIC_BASE_URL=http://localhost:3000
```

### **✅ For Production (Vercel):**

```
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - EMAIL_HOST
   - EMAIL_PORT
   - EMAIL_USER
   - EMAIL_PASS
   - EMAIL_FROM
   - NEXT_PUBLIC_PUBLIC_BASE_URL
5. Redeploy
```

---

## 🧪 **TESTING**

### **✅ Test Email Sending:**

```
1. Restart dev server: npm run dev
2. Go to /certificates
3. Find a certificate with member email
4. Click "Send Email" button
5. Check console for logs
6. Check recipient inbox
7. Verify email received
```

### **✅ Expected Console Output:**

```
POST /api/certificates/[id]/email
Status: 200 OK
Response: {ok: true}
```

### **✅ Expected Email:**

```
From: Certificate Manager <your-email@gmail.com>
To: member-email@example.com
Subject: [Certificate] Sertifikat Achievement - John Doe

Body:
Halo John Doe,

Selamat! Anda telah menerima sertifikat pelatihan Achievement.

Klik tautan berikut untuk melihat sertifikat Anda:
http://localhost:3000/cek/ABC123XYZ

Anda juga dapat mengunduh PDF sertifikat melalui tautan berikut:
[PDF Download Link]

Salam hangat,
Tim Certificate Manager

Attachment: CERT-2025-10-0001.pdf
```

---

## 🔍 **TROUBLESHOOTING**

### **❌ Error: "Invalid login"**

```
Problem: Gmail credentials rejected
Solutions:
  1. Verify 2FA enabled
  2. Use App Password (not regular password)
  3. Remove spaces from App Password
  4. Check EMAIL_USER is correct Gmail address
```

### **❌ Error: "Recipient email not found"**

```
Problem: Member doesn't have email
Solutions:
  1. Go to /admin/members
  2. Edit member
  3. Add email address
  4. Save
  5. Try send email again
```

### **❌ Error: "Connection timeout"**

```
Problem: Cannot connect to SMTP server
Solutions:
  1. Check internet connection
  2. Verify EMAIL_HOST correct
  3. Verify EMAIL_PORT correct (587 for TLS, 465 for SSL)
  4. Check firewall not blocking SMTP
  5. Try different port
```

### **❌ Error: "PDF attachment failed"**

```
Problem: PDF not generated or not accessible
Solutions:
  1. Generate PDF first (click "Generate" button)
  2. Verify PDF URL in database
  3. Check Supabase storage permissions
  4. Email will still send without attachment
```

### **❌ Email sent but not received**

```
Problem: Email in spam or not delivered
Solutions:
  1. Check spam/junk folder
  2. Add sender to contacts
  3. Verify sender email verified (SendGrid/Mailgun)
  4. Check email logs in database
  5. Use professional email provider for production
```

---

## 📊 **EMAIL LOGS**

### **✅ Check Email Status:**

```sql
-- View recent email logs
SELECT 
  id,
  certificate_id,
  recipient_email,
  subject,
  status,
  sent_at,
  error_message,
  created_at
FROM email_logs
ORDER BY created_at DESC
LIMIT 10;

-- Check failed emails
SELECT *
FROM email_logs
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### **✅ Email Statuses:**

```
- queued: Email queued for sending
- sent: Email sent successfully
- failed: Email failed to send (check error_message)
```

---

## 🎯 **PRODUCTION RECOMMENDATIONS**

### **✅ For Production Use:**

```
1. ✅ Use professional email service (SendGrid/Mailgun)
2. ✅ Verify sender domain (SPF, DKIM, DMARC)
3. ✅ Use custom domain email
4. ✅ Monitor email logs
5. ✅ Handle bounces and complaints
6. ✅ Implement rate limiting
7. ✅ Add unsubscribe link
8. ✅ Use email templates
9. ✅ Test thoroughly before launch
10. ✅ Monitor deliverability
```

### **✅ Best Practices:**

```
1. Always include unsubscribe option
2. Use clear subject lines
3. Include text version of email
4. Test on multiple email clients
5. Monitor bounce rates
6. Keep email lists clean
7. Respect user preferences
8. Follow CAN-SPAM Act / GDPR
```

---

## 📝 **EMAIL TEMPLATE CUSTOMIZATION**

### **✅ Customize Email Content:**

Edit `/src/app/api/certificates/[id]/email/route.ts`:

```typescript
const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #f9f9f9; }
      .button { background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Certificate Manager</h1>
      </div>
      <div class="content">
        <h2>Selamat, ${member?.name ?? ''}!</h2>
        <p>Anda telah menerima sertifikat pelatihan <strong>${category?.name ?? ''}</strong>.</p>
        <p>
          <a href="${verifyLink}" class="button">Lihat Sertifikat</a>
        </p>
        <p>Atau klik tautan berikut:<br/>
        <a href="${verifyLink}">${verifyLink}</a></p>
      </div>
      <div class="footer">
        <p>Email ini dikirim secara otomatis oleh Certificate Manager</p>
        <p>&copy; 2025 Certificate Manager. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`
```

---

## ✅ **QUICK START CHECKLIST**

```
1. ✅ Choose email provider (Gmail recommended for testing)
2. ✅ Get SMTP credentials
3. ✅ Add to .env.local
4. ✅ Restart dev server
5. ✅ Add email to member
6. ✅ Generate certificate PDF
7. ✅ Click "Send Email"
8. ✅ Check recipient inbox
9. ✅ Verify email received
10. ✅ Check email logs in database
```

## 🎉 **READY TO SEND EMAILS!**

**Setup complete! Fitur Send Email sekarang bisa mengirim ke real email addresses!** 📧✅
