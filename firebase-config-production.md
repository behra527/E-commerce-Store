# Firebase Production Configuration for Hostinger

## Important Steps to Fix "Unauthorized Domain" Error

### 1. Firebase Console Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `dexter-e4919`
3. Navigate to **Authentication** > **Settings** tab
4. Scroll down to **Authorized domains**
5. Click **Add domain**
6. Add your Hostinger domain:
   - `yourdomain.com`
   - `www.yourdomain.com`
   - `subdomain.yourdomain.com` (if using subdomains)

### 2. Current Firebase Config
```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyDytB5L8B5cnBrVvQ2kPjgvwf5gkG6Vd_8',
  authDomain: 'dexter-e4919.firebaseapp.com',
  projectId: 'dexter-e4919',
  storageBucket: 'dexter-e4919.appspot.com',
  messagingSenderId: '531045133969',
  appId: '1:531045133969:web:f5d5bdd3b5d302748d5930',
};
```

### 3. Production Environment Variables
Create a `.env.production` file in your Client directory:
```env
VITE_FIREBASE_API_KEY=AIzaSyDytB5L8B5cnBrVvQ2kPjgvwf5gkG6Vd_8
VITE_FIREBASE_AUTH_DOMAIN=dexter-e4919.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dexter-e4919
VITE_FIREBASE_STORAGE_BUCKET=dexter-e4919.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=531045133969
VITE_FIREBASE_APP_ID=1:531045133969:web:f5d5bdd3b5d302748d5930
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### 4. Common Issues and Solutions

#### Issue: "Unauthorized Domain"
- **Solution**: Add your domain to Firebase Console > Authentication > Settings > Authorized domains
- **Wait Time**: Changes may take 5-10 minutes to propagate

#### Issue: "Popup Blocked"
- **Solution**: Ensure popups are allowed for your domain
- **Alternative**: Use redirect-based authentication

#### Issue: "Network Error"
- **Solution**: Check if your backend API is accessible from your Hostinger domain

### 5. Testing After Deployment
1. Clear browser cache and cookies
2. Test Google Sign-In on your Hostinger domain
3. Check browser console for any errors
4. Verify Firebase Console shows successful authentication attempts

### 6. Security Considerations
- Keep your Firebase config secure
- Use environment variables in production
- Regularly monitor Firebase Console for suspicious activity
- Consider implementing additional security measures like email verification

