# Static Site Deployment - Render Configuration

## ✅ Frontend Deployed as Static Site

**Frontend URL**: https://thermalvisionai-2.onrender.com  
**Backend URL**: https://thermalvisionai-xhcc.onrender.com

## 🔧 What Was Updated for Static Site

### 1. Vite Configuration
- ✅ Added `build` output settings
- ✅ Optimized for production (minified, no sourcemaps)
- ✅ Added your frontend URL to allowed hosts

### 2. Routing Configuration
- ✅ Created `_redirects` file for URL rewriting
- ✅ Created `netlify.toml` for static site config
- ✅ All routes redirect to `/index.html` (React Router compatibility)

### 3. Environment Variables
- ✅ `VITE_API_URL` set to backend URL
- ✅ Supabase credentials configured
- ✅ No dynamic environment variable loading (static site)

### 4. Build Output
- ✅ Frontend builds to `frontend/dist/`
- ✅ Static files optimized for fast delivery
- ✅ Ready for Render's static site hosting

## 📋 Render Static Site Configuration

### On Render Dashboard - Frontend Service

If you need to modify the static site settings:

1. Go to https://dashboard.render.com
2. Select your **thermal-vision-frontend** service
3. Go to Settings
4. **Build & Deploy**:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Root Directory**: Leave empty or `/`

5. **Environment** (if not using render.yaml):
   - Not needed for static site (vars are built-in)

## 🧪 Testing the Static Site

### Test Frontend Loads
```bash
curl https://thermalvisionai-2.onrender.com
```

Should return HTML with React app embedded.

### Test React Router Works
```bash
# Test the /detect route loads (should serve index.html)
curl -I https://thermalvisionai-2.onrender.com/detect
```

Expected: HTTP 200 OK (not 404)

### Test API Communication
1. Visit https://thermalvisionai-2.onrender.com
2. Open browser console (F12)
3. Go to `/login` page
4. Check Network tab for API calls to `thermalvisionai-xhcc.onrender.com`

## 🔄 How It Works

```
User visits: https://thermalvisionai-2.onrender.com/detect
       ↓
Render serves: index.html (static file)
       ↓
React Router loads in browser
       ↓
React renders /detect page component
       ↓
Frontend calls: https://thermalvisionai-xhcc.onrender.com/detect (API)
       ↓
Backend processes image and returns result
```

## 📁 Frontend Folder Structure

```
frontend/
├── src/                   # React source
├── public/
│   └── _redirects         # URL routing config
├── dist/                  # Build output (created by build)
├── package.json
├── vite.config.ts         # Vite configuration (optimized)
├── netlify.toml           # Alternative config
├── .env.development       # Dev environment
├── .env.production        # Production environment
└── Dockerfile             # For local Docker testing
```

## ⚙️ Build Process

When Render builds your frontend:

1. Runs: `npm install && npm run build`
2. Vite compiles React code → `dist/` folder
3. Vite includes environment variables (VITE_*)
4. `dist/` contents uploaded to Render's CDN
5. `_redirects` file tells Render to serve `index.html` for all routes

## 🚀 Deployment Workflow

```
git push → GitHub → Render detects change
  ↓
Render pulls latest code
  ↓
Runs: npm install && npm run build
  ↓
Creates optimized dist/ folder
  ↓
Uploads to Render's static server
  ↓
https://thermalvisionai-2.onrender.com updated
```

## ✨ Key Files for Static Site

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build configuration |
| `frontend/public/_redirects` | Route all paths to index.html |
| `frontend/netlify.toml` | Netlify config (backup) |
| `frontend/.env.production` | Production environment variables |
| `frontend/dist/` | Built static files (created on build) |

## 🔍 Troubleshooting Static Site

### "Cannot GET /detect" error
- Make sure `_redirects` file exists in `frontend/public/`
- Check that Publish Directory is set to `dist`
- Rebuild: Go to Render dashboard → Redeploy

### 404 on routes
- React Router isn't loading
- Check browser console for JavaScript errors
- Verify `index.html` is being served for all routes

### API calls fail
- Check `VITE_API_URL` is set to backend URL
- Check backend is running
- Check browser console Network tab for CORS errors

### Blank page loads
- Check browser console (F12) for errors
- Check Render build logs for compilation errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Build takes too long
- Node modules might be cached - clear and rebuild
- Large dependencies slow down build
- Check Render logs for specific slow steps

## 📊 Performance Tips

1. **Caching**: Render's CDN caches static files
2. **Compression**: Vite automatically minifies everything
3. **Bundle Size**: Keep images out of source, use public/ folder
4. **API Calls**: Backend handles heavy processing

## 🔐 Security Note

- Environment variables are baked into the build
- No secrets are exposed to the client
- API calls go directly to backend (no CORS issues with proper config)

## 🎯 Current Setup

- **Frontend**: Static site on Render (CDN served)
- **Backend**: Web service on Render (API server)
- **Database**: Supabase (authentication + data)
- **Version Control**: GitHub (auto-deploy on push)

## ✅ Ready to Test!

Your static site frontend is configured and deployed. Visit:
- **https://thermalvisionai-2.onrender.com** - Your frontend
- Sign in with Supabase
- Upload thermal image on `/detect` page
- Should communicate with backend automatically

---

**Need to rebuild?** Go to Render dashboard → Frontend service → Click "Redeploy"

**Need to change something?** Edit files locally, `git push`, Render auto-rebuilds
