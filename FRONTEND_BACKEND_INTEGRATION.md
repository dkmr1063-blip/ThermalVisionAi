# Frontend-Backend Integration Guide

## ✅ Configuration Complete

Your frontend is now configured to connect to your backend at:
- **Backend URL**: https://thermalvisionai-xhcc.onrender.com
- **Frontend will call**: `https://thermalvisionai-xhcc.onrender.com/detect`

## 📋 What Was Updated

### 1. Environment Variables
- ✅ `frontend/.env.production` - Set to backend URL
- ✅ `frontend/.env.development` - Set to localhost:5000 for local testing
- ✅ Root `.env.production` and `.env.development`

### 2. CORS Configuration
- ✅ Backend `server.py` updated to accept requests from:
  - Render frontend domains (`*.onrender.com`)
  - Localhost development (`localhost:3000`, `localhost:8080`)

### 3. Git Changes Committed
- All configuration files pushed to GitHub
- Render will automatically redeploy both services

## 🚀 Next Steps

### On Render Dashboard:

1. **Update Frontend Service Environment Variables**:
   - Go to your frontend service → Settings → Environment
   - Add/Update:
     ```
     VITE_API_URL=https://thermalvisionai-xhcc.onrender.com
     VITE_SUPABASE_URL=https://cajemieaeqkynlxkzkjw.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhamVtaWVhZXFreW5seGt6a2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzI2ODAsImV4cCI6MjA3OTMwODY4MH0.nSrcFRGqiodYjTPOWRhtnxT1CiNu7sfP2EQabLIcgt8
     ```
   - Click "Save" to redeploy

2. **Verify Backend Still Has Settings**:
   - Go to backend service → Settings → Environment
   - Should have:
     ```
     FLASK_ENV=production
     FLASK_DEBUG=false
     ```

3. **Wait for Deployments**:
   - Frontend will redeploy automatically
   - Backend already has CORS configuration
   - Check "Deployments" tab for status

## 🧪 Testing the Connection

### Option 1: Test Backend Health (No Frontend Needed)
```bash
curl https://thermalvisionai-xhcc.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "model_loaded": true/false,
  "model_mode": "pytorch"
}
```

### Option 2: Test Full Integration (Via Frontend)

1. Visit your **frontend URL** on Render (e.g., `https://thermal-vision-frontend-xxx.onrender.com`)
2. Go to `/login` page
3. Sign in with Supabase credentials
4. Go to `/detect` page
5. Upload a thermal image
6. Click "Run Detection"
7. Check browser console (F12) for any errors

### Option 3: Test API Directly with curl
```bash
curl -X POST https://thermalvisionai-xhcc.onrender.com/detect \
  -F "image=@thermal_image.jpg"
```

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Check backend status |
| GET | `/model-info` | Get model information |
| POST | `/detect` | Send image for detection |

## 🔍 Troubleshooting

### "Cannot reach backend" error in frontend
1. Verify backend URL in env var: `https://thermalvisionai-xhcc.onrender.com`
2. Check backend is running: Visit `https://thermalvisionai-xhcc.onrender.com/health`
3. Check browser console for CORS errors (F12)
4. Check backend logs in Render dashboard

### CORS Error in Browser Console
- Should be resolved by updated CORS config in `server.py`
- If still seeing errors, backend may need to redeploy
- Check backend logs: Render dashboard → Backend service → Logs

### Model Won't Load
- Backend needs time to load the model on first request
- First request may timeout - try again after 60 seconds
- Check backend logs for model loading errors

### Frontend Showing Localhost URL
- Make sure `VITE_API_URL` environment variable is set in Render
- Check it's not still using `.env.development`
- Clear browser cache and refresh

## 📝 File Changes Made

```
Modified:
  - server.py (CORS configuration)
  - frontend/.env.production (API URL)
  - frontend/.env.development (local API URL)
  - .env.production (production settings)
  - .env.development (development settings)

Committed to Git: ✅
Pushed to GitHub: ✅
Render Deployment: ⏳ In progress (automatic)
```

## ✨ Ready to Test!

Your deployment is configured and ready to test. The frontend should now successfully connect to the backend API for thermal image detection.

**Key URLs:**
- Backend: `https://thermalvisionai-xhcc.onrender.com`
- Backend Health: `https://thermalvisionai-xhcc.onrender.com/health`
- Frontend: Check your Render dashboard for the frontend URL

---

If you encounter any issues, check:
1. Render dashboard logs for both services
2. Browser console (F12) for JavaScript errors
3. Network tab (F12) to see API requests/responses
