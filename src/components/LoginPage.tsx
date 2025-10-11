import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as storage from '../lib/storage';
import { LoaderIcon } from './icons/LoaderIcon';
import type { User } from '../types.ts';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigate: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = storage.loginUser(email, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 px-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600 mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h7.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path><path d="M15 2v5h5"></path><path d="M10 16s.5-1 2-1 2 1 2 1"></path><path d="M10 12h4"></path></svg>
            <h2 className="mt-4 text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="mt-2 text-slate-500">Sign in to continue to IntelliResume.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400"
              >
                {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Not a member?{' '}
            <button onClick={onNavigate} className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up now
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;