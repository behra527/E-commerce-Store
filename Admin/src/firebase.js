// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // ✅ Import Firebase Storage

const firebaseConfig = {
  apiKey: 'AIzaSyDytB5L8B5cnBrVvQ2kPjgvwf5gkG6Vd_8',
  authDomain: 'dexter-e4919.firebaseapp.com',
  projectId: 'dexter-e4919',
  storageBucket: 'dexter-e4919.appspot.com',
  messagingSenderId: '531045133969',
  appId: '1:531045133969:web:f5d5bdd3b5d302748d5930',
};

// 🔧 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔐 Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// 🗂️ Firebase Storage
const storage = getStorage(app);

// 📤 Export everything needed
export { auth, provider, facebookProvider, storage };
