import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Email,
  Visibility,
  VisibilityOff,
  VpnKey,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

import '../styles/Login.css';
import google_icon from '../assets/google.png';
import image from '../assets/login.png';
import { auth, provider } from '../firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Robust navigation function for production compatibility
  const navigateToSignup = () => {
    console.log('Attempting to navigate to signup...');
    
    try {
      // Method 1: Try React Router navigation
      console.log('Method 1: React Router navigation');
      navigate('/signup');
      
      // Method 2: Update hash for HashRouter compatibility
      setTimeout(() => {
        console.log('Method 2: Hash update');
        if (window.location.hash !== '#/signup') {
          window.location.hash = '/signup';
        }
      }, 100);
      
      // Method 3: Force hash update if needed
      setTimeout(() => {
        console.log('Method 3: Force hash update');
        if (window.location.hash !== '#/signup') {
          try {
            window.location.hash = '/signup';
          } catch (error) {
            console.error('Hash update failed:', error);
            // Method 4: Last resort - reload with hash
            console.log('Method 4: Reload with hash');
            window.location.href = `#/signup`;
          }
        }
      }, 200);
      
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to direct hash navigation
      try {
        console.log('Fallback: Direct hash navigation');
        window.location.hash = '/signup';
      } catch (hashError) {
        console.error('Hash navigation failed:', hashError);
        // Final fallback
        console.log('Final fallback: Reload with hash');
        window.location.href = `#/signup`;
      }
    }
  };

  // Check for redirect result when component mounts
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          handleGoogleLoginSuccess(result);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };

    checkRedirectResult();
  }, []);

  const handleGoogleLoginSuccess = async (result) => {
    setLoading(true);
    try {
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axios.post(`${API_BASE_URL}/auth/google-login`, { idToken });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('userId', res.data.uid);
      localStorage.setItem('email', res.data.email);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome, ${res.data.name}!`,
      }).then(() => {
        // Use hash-based navigation for better Hostinger compatibility
        if (window.location.hash) {
          window.location.hash = '/';
        } else {
          navigate('/');
        }
      });

    } catch (err) {
      console.error('Google Login Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Something went wrong with the login process.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Try popup first, fallback to redirect
      const result = await signInWithPopup(auth, provider);
      await handleGoogleLoginSuccess(result);
    } catch (err) {
      console.error('Popup failed, trying redirect:', err);
      
      // If popup fails, use redirect method
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        try {
          // Store current location for redirect return
          localStorage.setItem('redirectAfterLogin', window.location.hash || '/');
          await signInWithRedirect(auth, provider);
          // User will be redirected, result will be handled in useEffect
        } catch (redirectError) {
          console.error('Redirect also failed:', redirectError);
          Swal.fire({
            icon: 'error',
            title: 'Google Login Failed',
            text: 'Please try again or contact support.',
          });
          setLoading(false);
        }
      } else {
        // Handle other errors
        let errorMessage = 'Google login failed. Please try again.';
        
        if (err.code === 'auth/unauthorized-domain') {
          errorMessage = 'This domain is not authorized for Google login. Please contact support.';
          
          // Show detailed instructions for domain authorization
          Swal.fire({
            icon: 'warning',
            title: 'Domain Not Authorized',
            html: `
              <div style="text-align: left;">
                <p><strong>Google login is not working because this domain is not authorized.</strong></p>
                <p>To fix this:</p>
                <ol style="text-align: left; margin: 10px 0;">
                  <li>Go to <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a></li>
                  <li>Select project: <strong>dexter-e4919</strong></li>
                  <li>Go to <strong>Authentication</strong> > <strong>Settings</strong></li>
                  <li>Add your domain to <strong>Authorized domains</strong></li>
                  <li>Wait 5-10 minutes</li>
                </ol>
                <p><em>This is a one-time setup required for production deployment.</em></p>
              </div>
            `,
            confirmButtonText: 'I Understand',
            showCancelButton: true,
            cancelButtonText: 'Try Again',
            footer: 'Contact support if you need help with this setup.',
          });
        } else if (err.message) {
          errorMessage = err.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: errorMessage,
          footer: 'If this problem persists, please contact support.',
        });
        setLoading(false);
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill all fields' });
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

      const { token, userId, name } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome, ${name}!`,
      }).then(() => {
        const redirectTo = new URLSearchParams(location.search).get("redirectTo") || "/";
        // Use hash-based navigation for better Hostinger compatibility
        if (window.location.hash) {
          window.location.hash = redirectTo;
        } else {
          navigate(redirectTo, { replace: true });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="vh-100 position-relative">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      <div className="row h-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <img
            src={image}
            alt="Login"
            className="img-fluid"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 px-4" style={{ maxWidth: '400px' }}>
            <Typography variant="h6" className="text-muted">
              Welcome to
            </Typography>
            <Typography variant="h4" className="fw-bold mb-4 brand__name" color="primary">
              Dexter Leather
            </Typography>

            <div className="d-grid gap-2 mb-3">
              <Button
                variant="outlined"
                onClick={handleGoogleLogin}
                fullWidth
                startIcon={<img src={google_icon} alt="Google" style={{ width: 20, height: 20 }} />}
                className="text-capitalize"
              >
                Login with Google
              </Button>
              
            </div>

            <div className="or-separator mb-3">
              <span>OR</span>
            </div>

            <div className="position-relative mb-3">
              <Email className="input-icon-start" />
              <TextField
                fullWidth
                placeholder="example@gmail.com"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="position-relative mb-3">
              <VpnKey className="input-icon-start" />
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <IconButton
                className="input-icon-end"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember me"
              />
              <a href="#" className="text-primary small">
                Forgot Password?
              </a>
            </div>

            <Button variant="contained" fullWidth className="mb-3" onClick={handleLogin}>
              Login
            </Button>

            <Typography variant="body2" className="text-center text-muted">
              Don't have an account?{' '}
              <button 
                onClick={navigateToSignup}
                className="text-primary fw-semibold border-0 bg-transparent text-decoration-underline"
                style={{ cursor: 'pointer' }}
              >
                Register
              </button>
            </Typography>
            
            {/* Debug button for production testing */}
            {process.env.NODE_ENV === 'production' && (
              <div className="text-center mt-2">
                <button 
                  onClick={() => {
                    console.log('Current hash:', window.location.hash);
                    console.log('Current pathname:', window.location.pathname);
                    console.log('Attempting direct hash navigation...');
                    window.location.hash = '/signup';
                  }}
                  className="btn btn-sm btn-outline-secondary"
                  style={{ fontSize: '12px' }}
                >
                  Debug: Test Hash Navigation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
