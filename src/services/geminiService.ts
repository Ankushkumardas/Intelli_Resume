

import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';
// In the browser (Vite), environment variables should be accessed via import.meta.env
// Variables exposed to the client must be prefixed with VITE_. Do NOT store secrets in client-side env vars.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | 'AIzaSyCI8F4PZPvC08FvwJ2zWGUd1ydxvYi2kkI';
if (!apiKey) {
    // Provide a helpful error for development; in production, handle this on the server instead.
    throw new Error('Missing VITE_GEMINI_API_KEY. Set it in your .env and restart the dev server, or move API calls to a secure backend.');
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
                        enum: ['MISSING_KEYWORD', 'IMPROVE_BULLET', 'GRAMMAR', 'QUANTIFY_ACHIEVEMENT', 'FORMATTING', 'GENERAL']
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
        const result: AnalysisResult = JSON.parse(jsonText);
        
        // Basic validation
        if (typeof result.overallScore !== 'number' || !result.summary || !Array.isArray(result.suggestions)) {
            throw new Error("Invalid analysis format received from API.");
        }
        
        return result;

    } catch (error) {
        console.error("Error analyzing resume with Gemini API:", error);
        throw new Error("Failed to analyze the resume. The AI service may be temporarily unavailable. Please try again later.");
    }
}
