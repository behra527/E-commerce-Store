// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDytB5L8B5cnBrVvQ2kPjgvwf5gkG6Vd_8',
  authDomain: 'dexter-e4919.firebaseapp.com',
  projectId: 'dexter-e4919',
  storageBucket: 'dexter-e4919.appspot.com',
  messagingSenderId: '531045133969',
  appId: '1:531045133969:web:f5d5bdd3b5d302748d5930',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Configure Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account' // Forces account selection even when one account is available
});

export { auth, provider };

// IMPORTANT: To fix "unauthorized domain" error when deploying to Hostinger:
// 1. Go to Firebase Console > Authentication > Settings > Authorized domains
// 2. Add your Hostinger domain (e.g., yourdomain.com, www.yourdomain.com)
// 3. Wait a few minutes for changes to propagate
