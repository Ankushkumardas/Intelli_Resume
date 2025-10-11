export interface Suggestion {
  type: 'MISSING_KEYWORD' | 'IMPROVE_BULLET' | 'GRAMMAR' | 'QUANTIFY_ACHIEVEMENT' | 'FORMATTING' | 'GENERAL';
  message: string;
  originalText: string | null;
  suggestedText?: string;
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  suggestions: Suggestion[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  // This is for simulation only. In a real app, never store passwords or hashes on the client.
  passwordHash: string; 
}

export interface AnalysisHistoryItem {
  id: string;
  resumeFileName: string;
  jobTitle: string;
  analysisResult: AnalysisResult;
  resumeText: string;
  jobDescription: string;
  analyzedAt: string; // ISO string date
}
