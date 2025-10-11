// Fix: Implement the AnalysisResults component to display the analysis from the Gemini API.
import React from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { AnalysisResult } from '../types.ts';
import { SuggestionCard } from './SuggestionCard';
import { HighlightedText } from './HighlightedText';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalysisResultsProps {
  result: AnalysisResult;
  resumeText: string;
  jobTitle: string;
  onReset: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, resumeText, jobTitle, onReset }) => {
  const { overallScore, summary, suggestions } = result;

  const scoreColor = overallScore > 75 ? '#10B981' : overallScore > 50 ? '#F59E0B' : '#EF4444';

  const chartData = {
    datasets: [
      {
        data: [overallScore, 100 - overallScore],
        backgroundColor: [scoreColor, '#E5E7EB'],
        borderColor: ['#FFFFFF', '#FFFFFF'],
        borderWidth: 2,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: '80%',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Analysis for <span className="text-indigo-600">{jobTitle}</span></h2>
          <p className="text-slate-500 mt-1">Here's how your resume stacks up. Review the suggestions to improve your score.</p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200"
        >
          Analyze Another
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Score and Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 text-center">Overall Match Score</h3>
            <div className="relative w-full h-40 mx-auto mt-4">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center -translate-y-4">
                <span className="text-4xl font-bold" style={{ color: scoreColor }}>
                  {overallScore}
                </span>
                <span className="text-lg font-medium text-slate-500 mt-2">%</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">AI Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
          </div>
        </div>

        {/* Right Column: Resume and Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
             <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Highlighted Resume</h3>
                <div className="max-h-[400px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                    <HighlightedText text={resumeText} suggestions={suggestions} />
                </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Actionable Suggestions</h3>
             <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
             >
                {suggestions.length > 0 ? suggestions.map((suggestion, index) => (
                    <SuggestionCard key={index} suggestion={suggestion} />
                )) : <p className="text-sm text-slate-500">No specific suggestions. Looks great!</p>}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
