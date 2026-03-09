# Git Setup and GitHub Push Guide

## Step 1: Create a GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon in the top right
3. Click **"New repository"**
4. Fill in:
   - **Repository name**: `github-profile-analyzer`
   - **Description**: "GitHub Profile Analyzer with PDF export"
   - **Public** or **Private** (your choice)
   - **DO NOT** check "Initialize with README" (we already have files)
5. Click **"Create repository"**
6. **Copy the repository URL** (it will look like):
   - HTTPS: `https://github.com/YOUR_USERNAME/github-profile-analyzer.git`
   - SSH: `git@github.com:YOUR_USERNAME/github-profile-analyzer.git`

## Step 2: Run Git Commands

Open your terminal/command prompt in your project folder and run these commands **ONE BY ONE**:

### Command 1: Initialize Git
```bash
git init
```
This creates a new Git repository in your folder.

### Command 2: Add All Files
```bash
git add .
```
This stages all your files for commit.

### Command 3: Commit Files
```bash
git commit -m "Initial commit - GitHub Profile Analyzer"
```
This saves your files with a message.

### Command 4: Rename Branch to Main
```bash
git branch -M main
```
This renames your branch to "main".

### Command 5: Add Remote Repository
```bash
git remote add origin YOUR_GITHUB_REPO_URL
```
**IMPORTANT**: Replace `YOUR_GITHUB_REPO_URL` with the URL you copied from GitHub!

Example:
```bash
git remote add origin https://github.com/yourusername/github-profile-analyzer.git
```

### Command 6: Push to GitHub
```bash
git push -u origin main
```
This uploads your code to GitHub.

## Complete Example

If your GitHub username is "john" and repo is "github-profile-analyzer":

```bash
git init
git add .
git commit -m "Initial commit - GitHub Profile Analyzer"
git branch -M main
git remote add origin https://github.com/john/github-profile-analyzer.git
git push -u origin main
```

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Error: "Authentication failed"
You need to set up GitHub authentication:
- Use a Personal Access Token instead of password
- Or set up SSH keys

### Error: "Permission denied"
Make sure you're logged into GitHub and have access to the repository.

## Next Steps

After successfully pushing to GitHub:
1. Go to https://render.com
2. Follow the deployment steps in `DEPLOYMENT.md`
3. Your app will be live in 2-3 minutes!

---

**Need help?** Check the full deployment guide in `DEPLOYMENT.md`
