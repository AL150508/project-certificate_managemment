# Supabase Client Fix - Environment Variables & Server/Client Separation

**Date:** October 22, 2025  
**Status:** ✅ FIXED

## Problem

Build error occurred:
```
Error: @supabase/ssr: Your project's URL and API key are missing
[Error: Failed to collect page data for /api/certificates]
```

## Root Cause

1. **Missing environment variable validation** in `src/lib/supabase.ts`
2. **Wrong Supabase client used in API routes** - using `createBrowserClient` (client-side) in server-side API routes

## Solution

### 1. Added Environment Variable Validation

**File:** `src/lib/supabase.ts`

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    'Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}
```

### 2. Created Separate Server-Side Supabase Client

**File:** `src/lib/supabase-server.ts` (NEW)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables for server-side client.\n' +
    'Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)'
  )
}

// Create Supabase server client for API routes and server components
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

### 3. Updated API Routes to Use Server Client

**Files Updated:**
- `src/app/api/certificates/[id]/email/route.ts`
- `src/app/api/certificates/[id]/generate/route.ts`
- `src/app/api/certificates/bulk-email/route.ts`

Changed from:
```typescript
import { supabase } from "@/lib/supabase"
```

To:
```typescript
import { supabaseServer as supabase } from "@/lib/supabase-server"
```

### 4. Fixed Test Scripts

**Files:**
- `test-database-connection.js` → `test-database-connection.mjs`
- `test-navigation.js` → `test-navigation.mjs`

Changed from CommonJS `require()` to ES6 `import`:
```javascript
// Before
const { createClient } = require('@supabase/supabase-js')

// After
import { createClient } from '@supabase/supabase-js'
```

## Client vs Server Usage

### Client-Side (Browser)
Use `src/lib/supabase.ts`:
```typescript
import { supabase } from '@/lib/supabase'
```

**Use in:**
- React components
- Client-side hooks
- Browser-only code

### Server-Side (API Routes, Server Components)
Use `src/lib/supabase-server.ts`:
```typescript
import { supabaseServer } from '@/lib/supabase-server'
```

**Use in:**
- API routes (`/api/*`)
- Server components
- Server actions
- Middleware (if needed)

## Environment Variables Required

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Build & Lint Results

✅ **Lint:** 0 errors, 41 warnings (all safe to ignore)  
✅ **Build:** Success - all 32 pages compiled  
✅ **No runtime errors**

## Testing

Run these commands to verify:
```bash
npm run lint    # Should pass with 0 errors
npm run build   # Should complete successfully
npm run dev     # Should start without errors
```

## Notes

- The server client bypasses RLS (Row Level Security) - use carefully
- Always validate environment variables at build time
- Keep client and server Supabase instances separate
- Test scripts now use `.mjs` extension for ES6 modules
