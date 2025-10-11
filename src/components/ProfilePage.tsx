import React from 'react';
import { motion } from 'framer-motion';
import type { User, AnalysisHistoryItem } from '../types.ts';

interface ProfilePageProps {
  user: User;
  history: AnalysisHistoryItem[];
  onSelectHistoryItem: (item: AnalysisHistoryItem) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, history, onSelectHistoryItem }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500 mt-1">View and manage your saved resume analyses.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-700 border-b border-slate-200 pb-4 mb-4">
          Analysis History
        </h3>
        
        {history.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {history.map(item => (
              <motion.div 
                key={item.id} 
                className="bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                variants={itemVariants}
              >
                <div className="p-5">
                  <p className="font-bold text-slate-800 truncate">{item.jobTitle}</p>
                  <p className="text-sm text-slate-500 mt-1 truncate">Original file: {item.resumeFileName}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-500">{new Date(item.analyzedAt).toLocaleString()}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.analysisResult.overallScore > 75 ? 'bg-green-100 text-green-800' :
                      item.analysisResult.overallScore > 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Score: {item.analysisResult.overallScore}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 border-t border-slate-200 px-5 py-3">
                   <button 
                     onClick={() => onSelectHistoryItem(item)}
                     className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                   >
                     View Analysis
                   </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No history found</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by analyzing a resume on the dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;