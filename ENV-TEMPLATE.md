# Environment Variables Template

## Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Translate API (for multi-language feature)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
```

## How to Get Google Translate API Key

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Create or Select a Project:**
   - Click "Select a project" → "New Project"
   - Enter project name (e.g., "Certificate Manager")
   - Click "Create"

3. **Enable Cloud Translation API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"

4. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

5. **Restrict API Key (Recommended):**
   - Click on the API key to edit
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose "Cloud Translation API"
   - Under "Application restrictions":
     - Select "HTTP referrers"
     - Add your domain (e.g., `localhost:3000/*`, `yourdomain.com/*`)
   - Click "Save"

6. **Add to .env.local:**
   ```env
   GOOGLE_TRANSLATE_API_KEY=AIzaSy...your_key_here
   ```

## Security Notes

- ✅ **DO NOT** commit `.env.local` to Git
- ✅ `.env.local` is already in `.gitignore`
- ✅ API key is only used server-side (in `/api/translate` route)
- ✅ Rate limiting is implemented (100 requests per hour per IP)
- ✅ Translation results are cached in localStorage

## Testing API Key

After setting up, test the API:

```bash
# Start dev server
npm run dev

# Check API status
curl http://localhost:3000/api/translate

# Expected response:
{
  "status": "ok",
  "configured": true,
  "rateLimit": {
    "limit": 100,
    "window": "60 minutes"
  }
}
```

## Pricing

Google Translate API pricing (as of 2024):
- **Free tier:** $0 (no free tier)
- **Pay as you go:** $20 per 1 million characters
- **First 500,000 characters per month:** Free

**Cost estimation:**
- Average translation: 50 characters
- 100 translations = 5,000 characters = $0.10
- 1,000 translations = 50,000 characters = $1.00

**With caching:**
- Same text translated multiple times = 1 API call only
- Significant cost savings!

## Alternative: Disable Google Translate

If you don't want to use Google Translate:

1. **Don't set `GOOGLE_TRANSLATE_API_KEY`**
2. **Only manual translations will work** (English ↔ Indonesian)
3. **Other languages will fallback to English**

The app will still work, but only with manual translations in `src/lib/i18n/translations.ts`.
