# Deploying ThermalVisionAI to Render

This guide walks you through deploying the full-stack ThermalVisionAI application to Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- A Git repository (GitHub, GitLab, or Bitbucket)
- The thermal image detection model (`best.pt`) committed to the repo

## Deployment Steps

### 1. Prepare Your Repository

Make sure all these files are committed to your git repository:
- `package.json` - Frontend dependencies
- `requirements.txt` - Python dependencies
- `server.py` - Flask backend
- `vite.config.ts` - Vite configuration
- `Procfile` - Process file for Render
- `runtime.txt` - Python version specification
- `best.pt` - Your trained YOLO model (make sure it's tracked by Git LFS if large)
- All source code files

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Handle Large Files (best.pt)

If `best.pt` is larger than 100MB, you need to use Git LFS:

```bash
# Install Git LFS
git lfs install

# Track the model file
git lfs track "best.pt"
git add .gitattributes

# Commit and push
git add best.pt .gitattributes
git commit -m "Add model file with Git LFS"
git push origin main
```

### 3. Create Render Services

#### Option A: Using Render Dashboard (Recommended for beginners)

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Sign in or create an account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the Backend Service:
   - **Name**: `thermal-vision-backend`
   - **Root Directory**: `/` (or leave blank)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --workers 1 --worker-class sync --bind 0.0.0.0:$PORT server:app`
   - **Plan**: Free (or Starter)

6. Add Environment Variables for Backend:
   - `FLASK_ENV` = `production`
   - `FLASK_DEBUG` = `false`

7. Deploy the backend service

8. Create another Web Service for Frontend:
   - **Name**: `thermal-vision-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` or use a simple HTTP server
   - **Root Directory**: `/dist`

9. Add Environment Variables for Frontend:
   - Create a `.env` file at the root of your project:
   ```
   VITE_API_URL=https://your-backend-service.onrender.com
   ```

#### Option B: Using render.yaml (Automated)

1. Push the `render.yaml` file to your repository
2. In Render Dashboard, select "Infrastructure as Code"
3. Connect your repository
4. Render will automatically read `render.yaml` and create both services

### 4. Configure API Communication

Update your frontend to call the backend API. Create or update `.env`:

```bash
VITE_API_URL=https://your-backend-service.onrender.com
```

In your React components that call the Flask backend:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Example API call
const response = await fetch(`${API_URL}/detect`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: imageData })
});
```

### 5. Access Your Deployed App

Once both services are deployed:
- Frontend: `https://thermal-vision-frontend.onrender.com`
- Backend API: `https://thermal-vision-backend.onrender.com/detect`

### 6. Troubleshooting

**Build fails with "requirements.txt not found"**
- Ensure requirements.txt is in the root directory
- Check that you've specified the correct Root Directory in Render settings

**Model file too large**
- Use Git LFS to track the `.pt` file
- Check Render build logs for Git LFS installation errors

**CORS errors**
- Backend already has `CORS(app)` configured
- Ensure the frontend's VITE_API_URL is correct

**Cold starts/Timeouts**
- Free tier services go to sleep after 15 minutes of inactivity
- First request may take 30+ seconds to respond
- Consider upgrading to paid plan for production use

**Python version compatibility**
- Modify `runtime.txt` if you need a different Python version
- Check that your dependencies work with the specified version

### 7. Monitor Your Deployment

In Render Dashboard:
1. Click on your service
2. View **Logs** to debug issues
3. Check **Metrics** for performance
4. Use **Environment** tab to update variables

### 8. Continuous Deployment

Once connected, Render automatically deploys when you push to your main branch:
```bash
git push origin main  # Automatically triggers deployment
```

### 9. Scale Your Application

For production use:
- Upgrade from Free tier to Starter ($7/month per service)
- Increase **Build Timeout** in service settings if builds fail
- Consider using a managed database for future features
- Add caching layer with Redis for image processing

## Key Files for Deployment

- `Procfile` - Defines how to start the Flask app
- `runtime.txt` - Specifies Python version
- `requirements.txt` - Python dependencies
- `package.json` - Node dependencies
- `.env` - Environment variables (frontend)

## Support

- [Render Documentation](https://render.com/docs)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/latest/deploying/)
- Check service logs in Render Dashboard for error messages

---

**Note**: The free tier will put your app to sleep after 15 minutes of inactivity. For consistent uptime, consider upgrading to a paid plan.
