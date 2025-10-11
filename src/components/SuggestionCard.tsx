// Fix: Implement the SuggestionCard component to display a single suggestion.
import React from 'react';
import { motion } from 'framer-motion';
import type { Suggestion } from '../types.ts';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { PenToolIcon } from './icons/PenToolIcon';
import { TargetIcon } from './icons/TargetIcon';
import { AlertCircleIcon } from './icons/AlertCircleIcon';


interface SuggestionCardProps {
  suggestion: Suggestion;
}

const suggestionMeta: Record<Suggestion['type'], { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; title: string; }> = {
    MISSING_KEYWORD: { icon: TargetIcon, color: 'text-blue-500', title: 'Missing Keyword' },
    IMPROVE_BULLET: { icon: PenToolIcon, color: 'text-yellow-500', title: 'Improve Bullet Point' },
    QUANTIFY_ACHIEVEMENT: { icon: CheckCircleIcon, color: 'text-green-500', title: 'Quantify Achievement' },
    GRAMMAR: { icon: AlertTriangleIcon, color: 'text-red-500', title: 'Grammar & Wording' },
    FORMATTING: { icon: LightbulbIcon, color: 'text-purple-500', title: 'Formatting Suggestion' },
    GENERAL: { icon: AlertCircleIcon, color: 'text-slate-500', title: 'General Advice' },
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const meta = suggestionMeta[suggestion.type] || suggestionMeta.GENERAL;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50"
      variants={itemVariants}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center`}>
          <meta.icon className={`w-5 h-5 ${meta.color}`} />
      </div>
      <div className="flex-1 text-sm">
        <p className="font-semibold text-slate-800">{meta.title}</p>
        <p className="text-slate-600 mt-1">{suggestion.message}</p>
        {suggestion.originalText && (
          <div className="mt-2 p-2 bg-red-100/50 border-l-4 border-red-300 rounded-r-md">
            <p className="text-xs font-mono text-red-800 break-words">"{suggestion.originalText}"</p>
          </div>
        )}
        {suggestion.suggestedText && (
          <div className="mt-2 p-2 bg-green-100/50 border-l-4 border-green-300 rounded-r-md">
            <p className="text-xs font-semibold text-green-800 mb-1">Suggestion:</p>
            <p className="text-xs font-mono text-green-900 break-words">"{suggestion.suggestedText}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
