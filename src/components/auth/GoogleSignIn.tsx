import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAuthStore } from '../../store/authStore';

interface GoogleSignInProps {
  onError?: (error: string) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onError }) => {
  const { signInWithGoogle } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      if (Capacitor.getPlatform() === 'android') {
        // Use native Google Sign-In
        const GoogleAuth = (window as any).plugins?.GoogleAuth;
        if (!GoogleAuth) {
          throw new Error('Google Auth plugin not available');
        }

        const result = await GoogleAuth.signIn();
        if (!result?.idToken) {
          throw new Error('Failed to get ID token');
        }
        
        // Use the ID token to sign in with Supabase
        await signInWithGoogle(result.idToken);
      } else {
        // Use Supabase OAuth flow for web
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      onError?.(error instanceof Error ? error.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center space-x-2 
        border rounded-lg px-6 py-3 transition-colors
        bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
        text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-600 dark:border-gray-300 
          border-t-transparent rounded-full animate-spin" />
      ) : (
        <img 
          src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
          alt="Google"
          className="w-5 h-5"
        />
      )}
      <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
    </button>
  );
};

export default GoogleSignIn;