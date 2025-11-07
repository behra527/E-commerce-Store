# 🚀 Hostinger Deployment Guide for Dexter Leather

## ✅ **Pre-Deployment Checklist**

### 1. Firebase Domain Authorization
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select project: `dexter-e4919`
- [ ] Go to **Authentication** > **Settings**
- [ ] Add your Hostinger domain to **Authorized domains**
- [ ] Wait 5-10 minutes for changes to propagate

### 2. Build Production App
```bash
cd Client
npm run build
```

### 3. Files to Upload
- [ ] `dist/` folder contents (all files)
- [ ] `.htaccess` file (in root directory)

## 📁 **File Structure on Hostinger**

```
public_html/
├── .htaccess
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other build files]
```

## 🔧 **Key Changes Made for Hostinger**

### 1. **HashRouter Implementation**
- Changed from `BrowserRouter` to `HashRouter`
- Better compatibility with shared hosting
- No server-side routing configuration needed

### 2. **Navigation Optimization**
- Improved hash-based navigation
- Better error handling for redirects
- Fallback navigation mechanisms

### 3. **Build Optimization**
- Chunk splitting for better performance
- Disabled sourcemaps for production
- Optimized asset loading

## 🚀 **Deployment Steps**

### Step 1: Build the App
```bash
cd Client
npm run build
```

### Step 2: Upload to Hostinger
1. Go to Hostinger File Manager
2. Navigate to `public_html/`
3. Upload all contents from `dist/` folder
4. Upload `.htaccess` file to root directory

### Step 3: Configure Domain
1. Ensure your domain points to Hostinger
2. Wait for DNS propagation (24-48 hours)
3. Test your app at `yourdomain.com`

## 🔍 **Testing After Deployment**

### 1. **Basic Navigation**
- [ ] Home page loads correctly
- [ ] Navigation between pages works
- [ ] URLs show hash format (e.g., `#/catalogue`)

### 2. **Authentication**
- [ ] Google Sign-In works
- [ ] Regular login works
- [ ] Redirects work properly

### 3. **Performance**
- [ ] Pages load quickly
- [ ] Images load properly
- [ ] No console errors

## 🐛 **Common Issues & Solutions**

### Issue: "Unauthorized Domain"
**Solution**: Add domain to Firebase Console > Authentication > Settings > Authorized domains

### Issue: Navigation not working
**Solution**: Ensure `.htaccess` file is uploaded to root directory

### Issue: Assets not loading
**Solution**: Check if all files from `dist/` folder are uploaded

### Issue: Hash routing not working
**Solution**: Clear browser cache and test again

## 📱 **Mobile Testing**
- [ ] Test on mobile devices
- [ ] Check responsive design
- [ ] Verify touch interactions

## 🔒 **Security Considerations**
- [ ] `.env` files are not uploaded
- [ ] API keys are secure
- [ ] HTTPS is enabled (if available)

## 📊 **Performance Monitoring**
- [ ] Use Google PageSpeed Insights
- [ ] Monitor Core Web Vitals
- [ ] Check loading times

## 🆘 **Support**
If issues persist:
1. Check browser console for errors
2. Verify Firebase domain authorization
3. Test with different browsers
4. Contact Hostinger support if needed

---

**Note**: This deployment uses HashRouter for better Hostinger compatibility. URLs will show as `yourdomain.com/#/page` instead of `yourdomain.com/page`.

