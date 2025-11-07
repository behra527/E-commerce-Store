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
  Facebook,
  VpnKey,
  Person,
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import Swal from 'sweetalert2';

import '../styles/Login.css';
import google_icon from '../assets/google.png';
import image from '../assets/login.png';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Robust navigation function for production compatibility
  const navigateToLogin = () => {
    console.log('Attempting to navigate to login...');
    
    try {
      // Method 1: Try React Router navigation
      console.log('Method 1: React Router navigation');
      navigate('/login');
      
      // Method 2: Update hash for HashRouter compatibility
      setTimeout(() => {
        console.log('Method 2: Hash update');
        if (window.location.hash !== '#/login') {
          window.location.hash = '/login';
        }
      }, 100);
      
      // Method 3: Force hash update if needed
      setTimeout(() => {
        console.log('Method 3: Force hash update');
        if (window.location.hash !== '#/login') {
          try {
            window.location.hash = '/login';
          } catch (error) {
            console.error('Hash update failed:', error);
            // Method 4: Last resort - reload with hash
            console.log('Method 4: Reload with hash');
            window.location.href = `#/login`;
          }
        }
      }, 200);
      
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback to direct hash navigation
      try {
        console.log('Fallback: Direct hash navigation');
        window.location.hash = '/login';
      } catch (hashError) {
        console.error('Hash navigation failed:', hashError);
        // Final fallback
        console.log('Final fallback: Reload with hash');
        window.location.href = `#/login`;
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agree) newErrors.agree = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Fix the errors in form',
      });
    }

    setLoading(true); // ⏳ start loader
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Check your inbox to confirm your email address.',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          // Use robust navigation function for production compatibility
          navigateToLogin();
        }
      });

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgree(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  return (
    <div className="vh-100 position-relative">
      {/* 🔁 Loader Overlay */}
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      <div className="row h-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <img
            src={image}
            alt="Signup"
            className="img-fluid"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 px-4" style={{ maxWidth: '400px' }}>
            <Typography variant="h6" className="text-muted">
              Join us at
            </Typography>
            <Typography variant="h4" className="fw-bold mb-4 brand__name" color="primary">
              Dexter Leather
            </Typography>

            <div className="position-relative mb-3">
              <Person className="input-icon-start" />
              <TextField
                fullWidth
                placeholder="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>

            <div className="position-relative mb-3">
              <Email className="input-icon-start" />
              <TextField
                fullWidth
                placeholder="example@gmail.com"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>

            <div className="position-relative mb-3">
              <VpnKey className="input-icon-start" />
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
              <IconButton
                className="input-icon-end"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>

            <div className="position-relative mb-3">
              <VpnKey className="input-icon-start" />
              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <IconButton
                className="input-icon-end"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>

            <FormControlLabel
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  color="primary"
                />
              }
              label="I agree to terms & conditions"
            />
            {errors.agree && (
              <div className="text-danger ms-1 mb-2" style={{ fontSize: '0.85rem' }}>
                {errors.agree}
              </div>
            )}

            <Button variant="contained" fullWidth className="mb-3" onClick={handleSubmit}>
              Create Account
            </Button>

            <Typography variant="body2" className="text-center text-muted">
              Already have an account?{' '}
              <button 
                onClick={navigateToLogin}
                className="text-primary fw-semibold border-0 bg-transparent text-decoration-underline"
                style={{ cursor: 'pointer' }}
              >
                Login
              </button>
            </Typography>
            
            {/* Debug button for production testing */}
            {process.env.NODE_ENV === 'production' && (
              <div className="text-center mt-2">
                <button 
                  onClick={() => {
                    console.log('Current hash:', window.location.hash);
                    console.log('Current pathname:', window.location.pathname);
                    console.log('Attempting direct hash navigation to login...');
                    window.location.hash = '/login';
                  }}
                  className="btn btn-sm btn-outline-secondary"
                  style={{ fontSize: '12px' }}
                >
                  Debug: Test Login Navigation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
