# 🚀 SalesforceLearnHub - Deployment Guide

## 📋 Prerequisites

- Git installed on your computer
- GitHub account
- Vercel account (free)
- Command prompt/terminal access

## 🔧 Step 1: Initialize Git Repository

Open Command Prompt in your project directory (`C:\Users\BakkaiahMadipalli\Cursor\Web-apps\Learning_Hub`) and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SalesforceLearnHub MVP"

# Add remote repository
git remote add origin git@github.com:bakkaiahsf/Learning_Hub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔗 Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `learning-hub` or keep default
   - In which directory is your code located? `./`
   - Want to override settings? `N`

### Option B: Using Vercel Dashboard

1. **Go to:** https://vercel.com/dashboard
2. **Click:** "Add New..." → "Project"
3. **Import from GitHub:** Select `bakkaiahsf/Learning_Hub`
4. **Configure:**
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Click:** "Deploy"

## 🔑 Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. **Go to your project** in Vercel dashboard
2. **Navigate to:** Settings → Environment Variables
3. **Add these variables:**

```
NEXT_PUBLIC_SUPABASE_URL = https://zkqbdwlvwwbdgeossgni.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcWJkd2x2d3diZGdlb3NzZ25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDI0OTYsImV4cCI6MjA2OTExODQ5Nn0.cTvFROv4foFFvfZhAhKpzh8cvcvEqUEFhCMMPl-l840
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcWJkd2x2d3diZGdlb3NzZ25pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzU0MjQ5NiwiZXhwIjoyMDY5MTE4NDk2fQ.SvzRii9QwmJ8ZZ3kXnwJqTOknBeM4_VKNbVmGudJ8JU
REACT_EDITOR = none
```

4. **Set Environment:** Production, Preview, Development (select all)
5. **Click:** "Save"

## 🔄 Step 4: Redeploy (if needed)

After adding environment variables:

1. **Go to:** Deployments tab
2. **Click:** "Redeploy" on the latest deployment
3. **Wait** for deployment to complete

## ✅ Step 5: Test Your Deployed Application

### 🌐 Basic Functionality Test

Your app will be deployed to a URL like: `https://learning-hub-xyz.vercel.app`

**Test these features:**

1. **Homepage Loading**
   - [ ] Page loads within 3 seconds
   - [ ] All sections visible (Hero, Learning Paths, AI Features)
   - [ ] No console errors

2. **Search Functionality**
   - [ ] Hero search bar is functional
   - [ ] Popular search pills are clickable
   - [ ] Search redirects to `/search` page
   - [ ] Search results display properly

3. **Navigation**
   - [ ] "Browse Learning Paths" button works
   - [ ] Header navigation links work
   - [ ] All pages load correctly:
     - `/learning-paths`
     - `/search`
     - `/library`
     - `/certifications`
     - `/community`
     - `/dashboard`

4. **Interactive Elements**
   - [ ] "Get Free Access" opens subscription modal
   - [ ] "Subscribe" button in header opens modal
   - [ ] "Contact" button opens contact modal
   - [ ] Learning path cards are clickable
   - [ ] Forms work (subscription/contact)

5. **Mobile Responsiveness**
   - [ ] Test on mobile device or browser dev tools
   - [ ] All buttons are tappable
   - [ ] Layout looks good on small screens

### 🛠️ Advanced Testing

**Performance Test:**
```bash
# Use Lighthouse or PageSpeed Insights
https://pagespeed.web.dev/
```

**API Endpoints Test:**
- Visit: `https://your-app.vercel.app/api/learning-paths`
- Should return JSON data

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Run `npm run build` locally first

2. **Environment Variables Not Working:**
   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding variables
   - Check variable names match exactly

3. **404 Errors:**
   - Ensure file paths are correct
   - Check Next.js routing configuration

4. **API Errors:**
   - Check Supabase connection in Vercel logs
   - Verify environment variables are set correctly

## 📱 Custom Domain (Optional)

1. **Go to:** Project Settings → Domains
2. **Add domain:** your-domain.com
3. **Configure DNS** as instructed by Vercel
4. **Wait** for propagation

## 🔄 Future Updates

To update your deployed app:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically deploy the new version!

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first with `npm run build`
4. Check the Vercel documentation: https://vercel.com/docs