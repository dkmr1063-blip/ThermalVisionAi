# Supabase Configuration for Render Deployment

## ⚠️ IMPORTANT: Configure Supabase Settings

Your frontend is deployed at: **https://thermalvisionai-2.onrender.com**

To enable login/signup, you MUST configure Supabase to accept this URL.

## Step 1: Add Redirect URLs to Supabase

1. Go to: https://app.supabase.com
2. Select your project: **cajemieaeqkynlxkzkjw**
3. Go to **Authentication → URL Configuration**
4. Under **Redirect URLs**, add:
   ```
   https://thermalvisionai-2.onrender.com/detect
   https://thermalvisionai-2.onrender.com
   https://thermalvisionai-2.onrender.com/login
   http://localhost:8080
   http://localhost:8080/detect
   http://localhost:5173
   http://localhost:5173/detect
   ```
5. Click **Save**

## Step 2: Verify Site URL

1. Still in **URL Configuration**
2. Check **Site URL** is set to:
   ```
   https://thermalvisionai-2.onrender.com
   ```
3. If not, update it

## Step 3: Verify Environment Variables on Render

Go to your **Frontend Service** on Render dashboard:
1. Settings → Environment
2. Verify these are set:
   ```
   VITE_API_URL=https://thermalvisionai-xhcc.onrender.com
   VITE_SUPABASE_URL=https://cajemieaeqkynlxkzkjw.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhamVtaWVhZXFreW5seGt6a2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzI2ODAsImV4cCI6MjA3OTMwODY4MH0.nSrcFRGqiodYjTPOWRhtnxT1CiNu7sfP2EQabLIcgt8
   ```

## Step 4: Test Authentication Flow

1. **Clear browser cache**: Press Ctrl+Shift+Delete, clear all
2. **Visit**: https://thermalvisionai-2.onrender.com
3. **Click**: Go to Login page
4. **Try**: Sign up with email
5. **Should see**: Confirmation email (check spam folder)
6. **Click**: Link in email to confirm
7. **Should redirect**: To /detect page

## Step 5: If Login Still Fails

### Check Browser Console:
1. Go to https://thermalvisionai-2.onrender.com/login
2. Press **F12** (Developer Tools)
3. Click **Console** tab
4. Look for error messages
5. Share the errors

### Common Errors:

**"Invalid API key"**
- Your VITE_SUPABASE_PUBLISHABLE_KEY is wrong
- Re-copy from Supabase dashboard

**"Redirect URL not allowed"**
- You haven't added https://thermalvisionai-2.onrender.com to Supabase
- Go to Step 1 above

**"Network error"**
- Supabase service may be down
- Try again in 5 minutes

**"localStorage is not defined"**
- Render is caching old build
- Go to frontend service → Manual Deploy

## Configuration Files Updated

✅ Frontend Auth component fixed (`Auth.tsx`)
✅ Environment variables configured
✅ Supabase client ready to use

## What Happens During Login

1. User enters email/password
2. Frontend sends to Supabase via HTTPS
3. Supabase sends confirmation email
4. User clicks link in email
5. Redirects to: `https://thermalvisionai-2.onrender.com/detect`
6. Frontend checks session
7. Shows Detect page

## Local Testing (Before Render)

If you want to test locally first:

```bash
cd frontend
npm install
npm run dev
```

Then:
1. Visit http://localhost:5173
2. Go to /login
3. Sign up with test email
4. Should work (redirects to http://localhost:5173/detect)

## After Login Works

Once authentication is working:
1. Go to `/detect` page
2. Upload thermal image
3. Click "Run Detection"
4. Should call backend at: https://thermalvisionai-xhcc.onrender.com/detect
5. Should see results!

## Supabase Project Details

- **Project URL**: https://cajemieaeqkynlxkzkjw.supabase.co
- **Public Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhamVtaWVhZXFreW5seGt6a2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzI2ODAsImV4cCI6MjA3OTMwODY4MH0.nSrcFRGqiodYjTPOWRhtnxT1CiNu7sfP2EQabLIcgt8
- **Dashboard**: https://app.supabase.com/projects

## Checklist

- [ ] Added Render frontend URLs to Supabase redirect list
- [ ] Site URL set to https://thermalvisionai-2.onrender.com
- [ ] Render frontend environment variables verified
- [ ] Cleared browser cache
- [ ] Tried signing up again
- [ ] Check browser console for errors
- [ ] Check email (including spam) for confirmation

---

**Next**: Follow the steps above to enable authentication, then test the full detection flow!
