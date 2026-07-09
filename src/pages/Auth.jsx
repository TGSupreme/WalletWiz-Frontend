import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Auth() {
  const { isAuthenticated, login, register, loginGoogle } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [btnWidth, setBtnWidth] = useState(280);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Poll for window.google to handle script loading async race conditions
  useEffect(() => {
    if (window.google) {
      setGoogleLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.google) {
        setGoogleLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 6000); // 6s timeout

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Measure and update Google button width responsively
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('google-btn-container');
      if (container) {
        // Google button width must be between 200 and 400 pixels
        const width = Math.max(200, Math.min(400, container.offsetWidth));
        setBtnWidth(width);
      }
    };

    // Delay slightly to ensure DOM has fully painted
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [isLogin, theme]);

  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);

  // 1. Initialize Google Identity once
  useEffect(() => {
    if (window.google && googleLoaded && !isGoogleInitialized) {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';
      
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          setErrorMsg('');
          setLoading(true);
          try {
            await loginGoogle(response.credential);
          } catch (err) {
            setErrorMsg(err.message || 'Google Sign-In failed.');
          } finally {
            setLoading(false);
          }
        },
      });
      
      setIsGoogleInitialized(true);
    }
  }, [googleLoaded, isGoogleInitialized]);

  // 2. Render Google Identity Button when layout changes
  useEffect(() => {
    if (window.google && isGoogleInitialized && btnWidth) {
      // Clear previous buttons to prevent duplicate rendering
      const container = document.getElementById('google-btn-container');
      if (container) {
        container.innerHTML = '';
      }

      window.google.accounts.id.renderButton(
        document.getElementById('google-btn-container'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: btnWidth.toString(), 
          shape: 'rectangular', 
          text: 'continue_with',
          mode: theme === 'dark' ? 'dark' : 'light'
        }
      );
    }
  }, [isLogin, theme, btnWidth, isGoogleInitialized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !firstName.trim()) {
      setErrorMsg('Please enter your first name.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, firstName);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-slate-50 dark:bg-bg-dark transition-colors duration-300 animate-page-entry">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 select-none">
        <img src={logoImg} alt="WalletWiz Logo" className="w-22 h-22 object-contain select-none mb-3" />
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
          WalletWiz
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isLogin ? 'Welcome back! Sign in to continue' : 'Create an account to get started'}
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-sm bg-white dark:bg-card-dark rounded-3xl border border-slate-100 dark:border-border-dark px-6 py-8 sm:px-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name (Register Only) */}
          {!isLogin && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-sm focus:outline-none transition-colors duration-200"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-sm focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-sm focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center text-xs text-slate-400">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100 dark:border-border-dark"></div>
          </div>
          <span className="relative px-3 bg-white dark:bg-card-dark transition-colors duration-300">
            or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <div className="flex justify-center min-h-[44px]">
          <div id="google-btn-container" className="w-full"></div>
        </div>

        {/* Auth Toggle */}
        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="text-violet-600 dark:text-violet-400 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
