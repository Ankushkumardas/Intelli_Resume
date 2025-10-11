// Fix: Implement the DashboardPage component and export it as default to resolve the module error.
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from './FileUpload';
import { AnalysisResults } from './AnalysisResults';
import { parseFile } from '../lib/fileParser';
import { analyzeResume } from '../services/geminiService';
import { LoaderIcon } from './icons/LoaderIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import type { User, AnalysisHistoryItem, AnalysisResult } from '../types.ts';

interface DashboardPageProps {
  user: User;
  history: AnalysisHistoryItem[];
  selectedHistoryItem: AnalysisHistoryItem | null;
  onAnalysisComplete: (resumeText: string, jobDescription: string, analysisResult: AnalysisResult, resumeFileName: string, jobTitle: string) => void;
  onSelectHistoryItem: (item: AnalysisHistoryItem) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ selectedHistoryItem, onAnalysisComplete }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  
  const [isParsing, setIsParsing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  useEffect(() => {
    if (selectedHistoryItem) {
      setResumeFile(null); // Can't reconstruct the file, so we clear it
      setResumeText(selectedHistoryItem.resumeText);
      setJobDescription(selectedHistoryItem.jobDescription);
      setAnalysisResult(selectedHistoryItem.analysisResult);
      setJobTitle(selectedHistoryItem.jobTitle);
      window.scrollTo(0, 0);
    }
  }, [selectedHistoryItem]);

  const handleFileSelect = useCallback(async (file: File | null) => {
    setResumeFile(file);
    setError(null);
    setAnalysisResult(null);
    if (file) {
      setIsParsing(true);
      try {
        const text = await parseFile(file);
        setResumeText(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file.');
        setResumeFile(null);
        setResumeText('');
      } finally {
        setIsParsing(false);
      }
    } else {
      setResumeText('');
    }
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription || !jobTitle) {
      setError("Please provide a resume, job title, and job description.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
      onAnalysisComplete(resumeText, jobDescription, result, resumeFile?.name || 'Pasted Text', jobTitle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isFormSubmittable = resumeText && jobDescription && jobTitle && !isAnalyzing && !isParsing;

  const renderInitialState = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Inputs */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">1. Upload Your Resume</label>
          <FileUpload
            onFileSelect={handleFileSelect}
            fileName={resumeFile?.name || ''}
            hasFile={!!resumeFile}
            isParsing={isParsing}
          />
        </div>
        <div>
          <label htmlFor="resume-text" className="block text-sm font-medium text-slate-700 mb-2">Or Paste Resume Text</label>
          <textarea
            id="resume-text"
            rows={10}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => {
                setResumeText(e.target.value);
                if (resumeFile) setResumeFile(null);
            }}
          />
        </div>
        <div>
          <label htmlFor="job-title" className="block text-sm font-medium text-slate-700 mb-2">2. Enter Job Title</label>
          <input
            id="job-title"
            type="text"
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Senior Product Manager"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
         <div>
          <label htmlFor="job-description" className="block text-sm font-medium text-slate-700 mb-2">3. Paste Job Description</label>
          <textarea
            id="job-description"
            rows={10}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
        <button
          onClick={handleAnalyze}
          disabled={!isFormSubmittable}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <>
              <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
             <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Analyze Resume
            </>
          )}
        </button>
      </div>
      
      {/* Right Column: Placeholder/Welcome */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-slate-100 rounded-xl p-8 border-2 border-dashed border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h7.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path><path d="M15 2v5h5"></path><path d="M10 16s.5-1 2-1 2 1 2 1"></path><path d="M10 12h4"></path></svg>
          <h3 className="text-xl font-bold text-slate-700">Ready to Optimize?</h3>
          <p className="text-slate-500 text-center mt-2">
            Upload your resume and the job description to get instant, AI-powered feedback.
          </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
            {analysisResult ? (
                <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnalysisResults
                        result={analysisResult}
                        resumeText={resumeText}
                        jobTitle={jobTitle}
                        onReset={() => {
                            setAnalysisResult(null);
                            setResumeFile(null);
                            setResumeText('');
                            setJobDescription('');
                            setJobTitle('');
                            setError(null);
                        }}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    {renderInitialState()}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
