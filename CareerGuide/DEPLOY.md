# 🚀 Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Firebase configured and tested
- [x] All console.logs removed
- [x] Code cleaned and optimized
- [x] SEO meta tags added
- [x] Privacy Policy & Terms pages created
- [x] FAQ section added
- [x] Form validation working
- [x] Admin password secured (SHA-256)

## 📝 Before Deploying - Update Domain URLs

**After you get your Netlify URL, replace in index.html:**

Find and replace `https://yourwebsite.netlify.app/` with your actual Netlify URL in:
- Line 10: canonical link
- Line 16: og:image
- Line 17: og:url
- Line 24: twitter:image
- Line 47: JSON-LD url

## 🌐 Deploy to Netlify

### Method 1: Drag & Drop (Easiest)

1. Go to https://app.netlify.com/
2. Sign in with GitHub/Email
3. Click "Add new site" → "Deploy manually"
4. Drag your entire `sessiom` folder onto the upload area
5. Wait 30 seconds - Done!
6. Your site will be live at: `https://random-name-12345.netlify.app`

### Method 2: GitHub (Recommended)

1. Create GitHub repository
2. Push your code:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. Go to Netlify → "Add new site" → "Import from Git"
4. Select your repository
5. Build settings: Leave empty (static site)
6. Click "Deploy site"

## 🔧 After Deployment

### 1. Get Your URL
- Netlify will give you: `https://something-random-12345.netlify.app`

### 2. Update Domain in Files
- Open `index.html`
- Replace all 5 instances of `https://yourwebsite.netlify.app/` with your actual URL
- Re-deploy (drag & drop again or git push)

### 3. Custom Domain (Optional)
- In Netlify dashboard → Domain settings
- Click "Add custom domain"
- Buy domain or use existing one
- Follow Netlify's DNS instructions

### 4. Create Social Image
- Create `images/og-image.jpg` (1200x630px)
- Use Canva or any design tool
- Include your brand name and tagline
- Re-deploy after adding

### 5. Test Everything
- Submit a test booking
- Check Firebase for data
- Test admin login: `/admin.html`
- Test on mobile device
- Share on WhatsApp/LinkedIn to see preview

## 🔐 Security Notes

- Admin password hash: `37e769a9d71a262c9acfa7b3d5e6183e756ff05c8c4e3fb6fe6338c87336eeb0`
- Current password: `Muskan123`
- To change: Use `change-password.html` to generate new hash

## 📊 Firebase Rules

Make sure your Firebase Realtime Database rules are set to:

```json
{
  "rules": {
    "bookings": {
      ".read": false,
      ".write": true,
      "$bookingId": {
        ".validate": "newData.hasChildren(['name', 'email', 'phone', 'sessionType', 'date', 'time', 'message']) && newData.child('name').isString() && newData.child('email').isString() && newData.child('phone').isString()"
      }
    },
    "blockedSlots": {
      ".read": true,
      ".write": false
    }
  }
}
```

## 🎯 Post-Deployment

1. Update personal info when ready:
   - Email in contact section
   - LinkedIn URL
   - Phone number
   - Location

2. Add real testimonials

3. Monitor bookings in Firebase Console

4. Check analytics (optional - add Google Analytics)

## 🆘 Troubleshooting

**Bookings not saving?**
- Check Firebase rules are published
- Check browser console for errors
- Verify Firebase config in firebase-db.js

**Admin page not loading?**
- Check password hash matches in admin.html
- Use change-password.html to verify

**Site not updating?**
- Clear browser cache (Ctrl + Shift + R)
- Check Netlify deployment logs

---

**Your site is ready to go live! 🎉**
