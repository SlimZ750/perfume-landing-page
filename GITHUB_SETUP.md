# 🚀 Push Your Perfume Store to GitHub

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account (create one if needed)
3. **Click "New Repository"**
4. **Repository settings**:
   - **Name**: `perfume-landing-page`
   - **Description**: `Premium Arabic RTL perfume store with Google Sheets order management`
   - **Visibility**: Choose Public or Private
   - **DON'T** check "Add a README file" (we already have one)
5. **Click "Create repository"**

## Step 2: Initialize Git in Your Project

Open **PowerShell** in your project folder and run:

```powershell
# Navigate to your project (if not already there)
cd "C:\Users\BT\Documents\Perfume Landing"

# Initialize git repository
git init

# Add all files to git
git add .

# Create your first commit
git commit -m "Initial commit: Premium Arabic perfume store with Google Sheets integration"
```

## Step 3: Connect to GitHub

Replace `YOUR-USERNAME` with your actual GitHub username:

```powershell
# Add GitHub as remote repository
git remote add origin https://github.com/YOUR-USERNAME/perfume-landing-page.git

# Set the main branch name
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Verify Upload

1. **Go to your GitHub repository**
2. **Check that all files are uploaded**
3. **Verify the README.md shows correctly**

## 🔐 Security Check - IMPORTANT!

### ✅ What's SAFE to commit (already protected):
- All React code
- Configuration files
- README and documentation
- `.env.example` (template only)
- Netlify functions code (without credentials)

### ❌ What's PROTECTED (won't be committed):
- `.env.local` (your actual credentials)
- `node_modules/` (dependencies)
- `/build` (compiled files)
- Google service account keys

### 🛡️ Your credentials are SECURE because:
- ✅ `.gitignore` prevents sensitive files from being committed
- ✅ Environment variables are stored in `.env.example` as templates only
- ✅ Real credentials go in `.env.local` (which is ignored)
- ✅ Netlify functions use `process.env` (server-side only)

## Step 5: Clone on Another Computer (Optional)

To work on the project from another computer:

```powershell
# Clone the repository
git clone https://github.com/YOUR-USERNAME/perfume-landing-page.git

# Navigate to project
cd perfume-landing-page

# Install dependencies
npm install

# Copy environment template and fill your credentials
copy .env.example .env.local
# Then edit .env.local with your actual Google Sheets credentials
```

## 🔄 Making Future Changes

When you make changes to your project:

```powershell
# Check what files changed
git status

# Add specific files or all files
git add .

# Commit with a descriptive message
git commit -m "Add new product images and update prices"

# Push to GitHub
git push
```

## 📱 Deploy to Netlify from GitHub

1. **Go to Netlify**: https://app.netlify.com
2. **Click "New site from Git"**
3. **Choose GitHub** and authorize access
4. **Select your repository**: `perfume-landing-page`
5. **Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. **Deploy site**

### Add Environment Variables to Netlify:
1. **Go to Site Settings** → **Environment Variables**
2. **Add the 3 variables**:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` 
   - `GOOGLE_PRIVATE_KEY`
3. **Redeploy** your site

## 🎉 You're Done!

Your perfume store is now:
- ✅ **Safely stored** on GitHub
- ✅ **Version controlled** for easy updates
- ✅ **Secure** - no credentials exposed
- ✅ **Ready to deploy** to Netlify/Vercel
- ✅ **Collaborative** - team members can contribute
- ✅ **Backed up** automatically

## 🔧 Troubleshooting

### Problem: "git: command not found"
**Solution**: Install Git for Windows from https://git-scm.com/download/win

### Problem: Authentication failed
**Solution**: Use GitHub token instead of password:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with repo permissions
3. Use token as password when prompted

### Problem: "Permission denied"
**Solution**: Check repository URL and your GitHub username

### Problem: Files won't upload
**Solution**: Check `.gitignore` - ensure important files aren't being ignored

Your perfume store is now professional, secure, and ready for the world! 🌟