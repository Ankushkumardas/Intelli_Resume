import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../types.ts';
import { UserIcon } from './icons/UserIcon';
import { LogOutIcon } from './icons/LogOutIcon';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'profile' | 'login' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate(user ? 'dashboard' : 'login')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h7.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path><path d="M15 2v5h5"></path><path d="M10 16s.5-1 2-1 2 1 2 1"></path><path d="M10 12h4"></path></svg>
            <h1 className="text-xl font-bold text-slate-800">IntelliResume</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                <motion.button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center justify-center h-10 w-10 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                </motion.button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-4 py-2 text-sm text-slate-700 border-b">
                        Signed in as <span className="font-medium">{user.name}</span>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onNavigate('profile'); setMenuOpen(false); }}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        My Profile
                      </a>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onLogout(); setMenuOpen(false); }}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Logout
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button onClick={() => onNavigate('login')} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
                  Login
                </button>
                <button onClick={() => onNavigate('signup')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};