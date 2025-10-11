
import React, { useState, useEffect, useCallback } from 'react';
// Fix: Import Transition type from framer-motion to resolve type inference issue.
import { motion, AnimatePresence } from 'framer-motion';
import type { Transition } from 'framer-motion';
import type { User, AnalysisHistoryItem, AnalysisResult } from './types.ts';
import * as storage from './lib/storage';
import { Header } from './components/Header';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import { LoaderIcon } from './components/icons/LoaderIcon';

type Page = 'login' | 'signup' | 'dashboard' | 'profile';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

// Fix: Add explicit Transition type to prevent TypeScript from inferring 'type' as a generic string.
const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<AnalysisHistoryItem | null>(null);

  useEffect(() => {
    const checkSession = () => {
      const loggedInUser = storage.getCurrentUser();
      if (loggedInUser) {
        setUser(loggedInUser);
        setHistory(storage.getHistoryForUser(loggedInUser.id));
        setPage('dashboard');
      } else {
        setPage('login');
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setHistory(storage.getHistoryForUser(loggedInUser.id));
    setPage('dashboard');
  };

  const handleSignup = (newUser: User) => {
    setUser(newUser);
    setHistory([]);
    setPage('dashboard');
  };

  const handleLogout = () => {
    storage.logoutUser();
    setUser(null);
    setHistory([]);
    setPage('login');
  };

  const handleNavigate = (targetPage: Page) => {
    setSelectedHistoryItem(null); // Clear any selected history when navigating
    setPage(targetPage);
  };

  const handleAnalysisComplete = useCallback((
    resumeText: string, 
    jobDescription: string, 
    analysisResult: AnalysisResult,
    resumeFileName: string,
    jobTitle: string
  ) => {
    if (user) {
      const newHistoryItem = storage.addHistoryForUser(user.id, {
        resumeText,
        jobDescription,
        analysisResult,
        resumeFileName,
        jobTitle
      });
      setHistory(prev => [newHistoryItem, ...prev]);
    }
  }, [user]);

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setSelectedHistoryItem(item);
    setPage('dashboard');
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoaderIcon className="w-12 h-12 animate-spin text-indigo-600" />
        </div>
      );
    }
    
    const key = user ? `${page}-${user.id}` : page;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {(() => {
            switch (page) {
              case 'login':
                return <LoginPage onLogin={handleLogin} onNavigate={() => handleNavigate('signup')} />;
              case 'signup':
                return <SignupPage onSignup={handleSignup} onNavigate={() => handleNavigate('login')} />;
              case 'dashboard':
                if (!user) {
                  handleLogout();
                  return null;
                }
                return <DashboardPage 
                  user={user} 
                  history={history}
                  selectedHistoryItem={selectedHistoryItem}
                  onAnalysisComplete={handleAnalysisComplete}
                  onSelectHistoryItem={handleSelectHistoryItem}
                />;
              case 'profile':
                if (!user) {
                  handleLogout();
                  return null;
                }
                return <ProfilePage user={user} history={history} onSelectHistoryItem={handleSelectHistoryItem} />;
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
