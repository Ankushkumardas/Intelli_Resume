

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Suggestion } from '../types';

// Use Vite's env (frontend-safe) prefix VITE_ for environment variables.
// Note: Putting API keys in frontend env is NOT secure. Prefer a backend.
const apiKey = 'AIzaSyCI8F4PZPvC08FvwJ2zWGUd1ydxvYi2kkI';
if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not set. Gemini calls will likely fail. Consider moving API calls to a secure backend.');
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: {
            type: Type.INTEGER,
            description: "An overall score from 0 to 100 representing how well the resume matches the job description. Higher is better."
        },
        summary: {
            type: Type.STRING,
            description: "A brief, 2-3 sentence summary of the resume's strengths and weaknesses in relation to the job description."
        },
        suggestions: {
            type: Type.ARRAY,
            description: "A list of specific, actionable suggestions for improving the resume.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        description: "The category of the suggestion.",
                        enum: [
                            'MISSING_KEYWORD',
                            'IMPROVE_BULLET',
                            'GRAMMAR',
                            'QUANTIFY_ACHIEVEMENT',
                            'FORMATTING',
                            'GENERAL',
                            'ADD_SECTION',
                            'REMOVE_REDUNDANCY',
                            'UPDATE_CONTACT',
                            'REORDER_SECTIONS',
                            'ADD_PROJECT',
                            'IMPROVE_SUMMARY'
                        ]
                    },
                    message: {
                        type: Type.STRING,
                        description: "A clear and concise message explaining the suggestion."
                    },
                    originalText: {
                        type: Type.STRING,
                        description: "The exact text from the resume that the suggestion applies to. This should be a small snippet. If the suggestion is general or about something missing, this can be null."
                    },
                    suggestedText: {
                        type: Type.STRING,
                        description: "Optional. A concrete example of how to rewrite the original text."
                    },
                    improvement: {
                        type: Type.STRING,
                        description: "Optional. A brief description of the improvement made or suggested."
                    },
                    newData: {
                        type: Type.STRING,
                        description: "Optional. New data or content to be added to the resume, if applicable."
                    }
                },
                required: ["type", "message"]
            }
        }
    },
    required: ["overallScore", "summary", "suggestions"]
};


export async function analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
  const prompt = `
    Analyze the following resume against the provided job description. Act as an expert career coach and resume writer.

    **Resume:**
    ---
    ${resumeText}
    ---

    **Job Description:**
    ---
    ${jobDescription}
    ---

    Provide a detailed analysis in JSON format. The analysis should include:
    1.  An 'overallScore' from 0-100, where 100 is a perfect match.
    2.  A concise 'summary' of the resume's fit for the role.
    3.  A list of 'suggestions' for improvement. Each suggestion must include:
        - 'type': The category of the suggestion (e.g., 'MISSING_KEYWORD', 'IMPROVE_BULLET', 'GRAMMAR', 'QUANTIFY_ACHIEVEMENT', 'FORMATTING', 'GENERAL').
        - 'message': A clear, actionable piece of advice.
        - 'originalText': The exact text from the resume that needs improvement. If the suggestion is general (like adding a new section) or about a missing keyword, set 'originalText' to null.
        - 'suggestedText': (Optional) An improved version of the original text.

    Focus on identifying missing keywords from the job description, quantifying achievements with numbers, improving action verbs, and correcting grammatical errors. The goal is to make the resume as compelling as possible for this specific job.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        if (!response.text) {
            throw new Error("No response text received from Gemini API.");
        }
        const jsonText = response.text.trim();
        let parsed: any;
        try {
            parsed = JSON.parse(jsonText);
        } catch (e) {
            console.warn('Failed to parse JSON from Gemini response, returning safe defaults.', e);
            parsed = {};
        }

        // Normalize overallScore
        let overallScore = 0;
        if (typeof parsed.overallScore === 'number' && !Number.isNaN(parsed.overallScore)) {
            overallScore = Math.max(0, Math.min(100, Math.round(parsed.overallScore)));
        } else if (typeof parsed.overallScore === 'string') {
            const n = Number(parsed.overallScore);
            if (!Number.isNaN(n)) overallScore = Math.max(0, Math.min(100, Math.round(n)));
        }

        // Normalize summary
        const summary = (typeof parsed.summary === 'string' && parsed.summary.trim()) ? parsed.summary.trim() : 'No summary available.';

        // Normalize suggestions array
        const rawSuggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
        const suggestions: Suggestion[] = rawSuggestions.map((s: any) => {
            // If suggestion isn't an object or missing required fields, skip it by returning null to filter later
            if (!s || typeof s !== 'object') return null;
            const type = typeof s.type === 'string' && s.type ? s.type : 'GENERAL';
            const message = typeof s.message === 'string' && s.message.trim() ? s.message.trim() : '';
            if (!message) return null; // message is required

            const originalText = (s.originalText === null || s.originalText === undefined) ? null : String(s.originalText);
            const suggestedText = (s.suggestedText === null || s.suggestedText === undefined) ? undefined : String(s.suggestedText);
            const improvement = (s.improvement === null || s.improvement === undefined) ? undefined : String(s.improvement);
            const newData = (s.newData === null || s.newData === undefined) ? undefined : String(s.newData);

            return {
                type: type as any,
                message,
                originalText,
                suggestedText,
                // @ts-ignore allow extra fields for now
                improvement,
                newData,
            } as Suggestion;
        }).filter(Boolean) as Suggestion[];

        const result: AnalysisResult = {
            overallScore,
            summary,
            suggestions,
        };

        return result;

    } catch (error) {
        console.error("Error analyzing resume with Gemini API:", error);
        throw new Error("Failed to analyze the resume. The AI service may be temporarily unavailable. Please try again later.");
    }
}
