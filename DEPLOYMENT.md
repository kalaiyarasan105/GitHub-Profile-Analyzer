# Deployment Guide for Render

## Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)

## Step-by-Step Deployment Instructions

### 1. Push Your Code to GitHub

First, initialize a git repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit - GitHub Profile Analyzer"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign in with your GitHub account

2. **Create a New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Your Repository**
   - Choose "Connect a repository"
   - Select your GitHub repository
   - Click "Connect"

4. **Configure Your Service**
   - **Name**: `github-profile-analyzer` (or your preferred name)
   - **Region**: Choose closest to your location
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free"

5. **Advanced Settings (Optional)**
   - **Auto-Deploy**: Enable (recommended)
   - This will automatically deploy when you push to GitHub

6. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-5 minutes)

### 3. Access Your Application

Once deployed, Render will provide you with a URL like:
```
https://github-profile-analyzer-xxxx.onrender.com
```

Your application is now live! 🎉

## Important Notes

### Free Tier Limitations
- The free tier spins down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds to wake up
- This is normal for free tier services

### Custom Domain (Optional)
If you want a custom domain:
1. Go to your service settings
2. Click "Custom Domain"
3. Follow the instructions to add your domain

### Environment Variables
This project doesn't require any environment variables as it uses the public GitHub API.

## Troubleshooting

### Build Fails
- Check that `package.json` is in the root directory
- Verify Node version compatibility
- Check Render logs for specific errors

### Application Not Loading
- Check if the service is running in Render dashboard
- Verify the start command is correct
- Check browser console for errors

### API Rate Limiting
- GitHub API has rate limits (60 requests/hour for unauthenticated)
- For higher limits, you can add a GitHub token (optional)

## Updating Your Application

To update your deployed application:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the changes and redeploy (if auto-deploy is enabled).

## Support

If you encounter issues:
- Check Render logs in the dashboard
- Review GitHub API status: https://www.githubstatus.com
- Open an issue in your repository

---

**Built by Kalaiyarasan | Powered by GitHub**
