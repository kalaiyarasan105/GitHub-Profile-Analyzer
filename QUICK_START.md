# Quick Start - Deploy to Render in 5 Minutes

## Files Created for Deployment ✅

- `package.json` - Node.js dependencies and scripts
- `server.js` - Express server to serve the application
- `render.yaml` - Render configuration (optional)
- `.gitignore` - Files to ignore in git
- `README.md` - Project documentation
- `DEPLOYMENT.md` - Detailed deployment guide

## Quick Deploy Steps

### Option 1: One-Click Deploy (Easiest)

1. Push your code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Render will auto-detect settings from `render.yaml`
6. Click "Create Web Service"
7. Done! 🎉

### Option 2: Manual Setup

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to https://dashboard.render.com
   - New + → Web Service
   - Connect repository
   - Settings:
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Create Web Service

3. **Wait 2-3 minutes** for deployment

4. **Access your app** at the provided URL!

## Your Application URL

After deployment, you'll get a URL like:
```
https://github-profile-analyzer-xxxx.onrender.com
```

## Test Your Deployment

1. Open the URL
2. Enter a GitHub username (e.g., "torvalds")
3. Click "Analyze Profile"
4. Download PDF report

## Features Working

✅ GitHub profile search
✅ Statistics dashboard
✅ Interactive charts
✅ PDF report generation
✅ Responsive design
✅ Glassmorphism UI

## Free Tier Notes

- App sleeps after 15 min of inactivity
- First request may take 30-60 seconds
- Upgrade to paid plan for always-on service

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

**Your GitHub Profile Analyzer is ready to deploy! 🚀**
