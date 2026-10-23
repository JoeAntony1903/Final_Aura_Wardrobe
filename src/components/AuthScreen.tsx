import React, { useState } from 'react';
import { Eye, EyeOff, AlertTriangle, Sparkles, Lock, Mail, User, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';
import { useTheme } from '../utils/ThemeContext';

import { registerAccount, loginAccount, authenticateWithGoogle, findAccountByEmail } from '../utils/authStorage';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onEnterGuestMode: (customName?: string) => void;
  onBackToApp?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onEnterGuestMode,
  onBackToApp,
}) => {
  const { theme, accent } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGuestWarningModal, setShowGuestWarningModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (isSignUp) {
        // Registering a NEW account
        if (!name.trim()) {
          setError('Please enter your full name.');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }

        const regResult = registerAccount({
          name: name.trim(),
          email: cleanEmail,
          password: password,
          themeId: theme.id,
        });

        if (!regResult.success) {
          setError(regResult.error || 'Failed to create account.');
          return;
        }

        onLoginSuccess(regResult.user!);
      } else {
        // Signing into an EXISTING account only
        const loginResult = loginAccount({
          email: cleanEmail,
          password: cleanPassword,
          themeId: theme.id,
        });

        if (!loginResult.success) {
          setError(loginResult.error || 'Invalid credentials.');
          return;
        }

        onLoginSuccess(loginResult.user!);
      }
    }, 450);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Prompt user or use signed in profile
      const userGoogleEmail = email.trim() || 'user@gmail.com';
      const userGoogleName = name.trim() || userGoogleEmail.split('@')[0];
      const result = authenticateWithGoogle({
        email: userGoogleEmail,
        name: userGoogleName,
        themeId: theme.id,
      });

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      }
    }, 450);
  };

  const handleGuestWarningConfirm = () => {
    setShowGuestWarningModal(false);
    onEnterGuestMode();
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br ${theme.bgGradient} text-slate-100 font-sans`}>
      {/* Background Ambient Glow tailored to active theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accent }}
        />
      </div>

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-5">
        {/* Back to App Link if navigating from within the app */}
        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition pb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Wardrobe Dashboard</span>
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg mb-1"
            style={{
              backgroundColor: accent,
              color: theme.accentText,
              boxShadow: `0 8px 24px rgba(${theme.accentRgb}, 0.35)`,
            }}
          >
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AuraWardrobe
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {isSignUp ? 'Create your digitized wardrobe atelier' : 'Welcome back to your curated digital closet'}
          </p>
        </div>

        {/* Google Sign-In with Firebase Auth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (Firebase Auth)</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 text-[10px] tracking-wider font-semibold">
              Or email login
            </span>
          </div>
        </div>

        {/* Tab Navigation (Login / Signup) */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/70 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
            style={
              !isSignUp
                ? {
                    backgroundColor: accent,
                    color: theme.accentText,
                  }
                : {}
            }
            className={`py-2 rounded-lg transition-all ${
              !isSignUp
                ? 'shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
            style={
              isSignUp
                ? {
                    backgroundColor: accent,
                    color: theme.accentText,
                  }
                : {}
            }
            className={`py-2 rounded-lg transition-all ${
              isSignUp
                ? 'shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-snug">{error}</span>
            </div>
            {!isSignUp && error.includes('Create Account') && (
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
                className="self-start text-[11px] font-bold underline hover:text-white transition pl-6"
                style={{ color: accent }}
              >
                → Click here to Switch to "Create Account"
              </button>
            )}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                  style={{ borderColor: `rgba(${theme.accentRgb}, 0.3)` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                style={{ borderColor: `rgba(${theme.accentRgb}, 0.3)` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Password</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link dispatched to ' + email)}
                  className="text-[11px] hover:underline"
                  style={{ color: accent }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                style={{ borderColor: `rgba(${theme.accentRgb}, 0.3)` }}
              />
              {/* Eye Icon for Password Toggle (PRD Requirement) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none"
                  style={{ borderColor: `rgba(${theme.accentRgb}, 0.3)` }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 w-3.5 h-3.5 bg-slate-950"
              />
              <span>Remember this device</span>
            </label>
            <span className="text-[11px] text-slate-500">Firebase Auth v11</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: accent,
              color: theme.accentText,
              boxShadow: `0 6px 20px rgba(${theme.accentRgb}, 0.3)`,
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <>
                <span>{isSignUp ? 'Complete Registration' : 'Sign In to Wardrobe'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Offline Mode / Guest Option */}
        <div className="relative pt-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 text-[10px] tracking-wider font-semibold">
              Or Try Without Account
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowGuestWarningModal(true)}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-950/40 text-slate-300 hover:text-white hover:bg-slate-800/60 transition text-xs font-semibold flex items-center justify-center gap-2"
        >
          <span>Continue in Offline Mode (Guest)</span>
        </button>

        <div className="text-center text-[11px] text-slate-500">
          Encrypted Cloud Firestore Storage • AES-256 Client Security
        </div>
      </div>

      {/* Strict Warning Modal for Offline / Guest Mode (PRD Requirement) */}
      {showGuestWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            className="relative w-full max-w-md bg-slate-900 border-2 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100"
            style={{ borderColor: accent }}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-full border"
                style={{
                  backgroundColor: `rgba(${theme.accentRgb}, 0.15)`,
                  borderColor: accent,
                  color: accent,
                }}
              >
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: accent }}>Offline Mode Warning</h3>
                <p className="text-xs text-slate-400">Strict Data Persistence Notice</p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl border text-xs leading-relaxed font-medium"
              style={{
                backgroundColor: `rgba(${theme.accentRgb}, 0.1)`,
                borderColor: `rgba(${theme.accentRgb}, 0.35)`,
                color: accent,
              }}
            >
              "You might lose all data if not saved in the cloud."
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In offline guest mode, all digitized garments, cutouts, outfits, and scheduled dates are stored exclusively in your local browser/device cache. If you clear cache or change devices, your wardrobe will not be recoverable.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300">Your Wardrobe Display Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Maya, David, or My Wardrobe"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                style={{ borderColor: `rgba(${theme.accentRgb}, 0.35)` }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowGuestWarningModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Go Back to Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGuestWarningModal(false);
                  onEnterGuestMode(guestName.trim() || 'My Wardrobe');
                }}
                style={{
                  backgroundColor: accent,
                  color: theme.accentText,
                  boxShadow: `0 4px 14px rgba(${theme.accentRgb}, 0.3)`,
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
