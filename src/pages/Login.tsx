import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <Bot size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Code Canvas
          </h1>
          <p className="text-blue-100">
            {isSignUp 
              ? 'Create your account to get started' 
              : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {isSignUp ? (
          <SignUp onToggleMode={() => setIsSignUp(false)} />
        ) : (
          <SignIn onToggleMode={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
};

export default Login;