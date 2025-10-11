
import React from 'react';
import type { Suggestion } from '../types.ts';

interface HighlightedTextProps {
  text: string;
  suggestions: Suggestion[];
}

const HIGHLIGHT_COLORS: Record<Suggestion['type'], string> = {
    IMPROVE_BULLET: 'bg-yellow-200/70',
    QUANTIFY_ACHIEVEMENT: 'bg-blue-200/70',
    GRAMMAR: 'bg-red-200/70',
    FORMATTING: 'bg-purple-200/70',
    MISSING_KEYWORD: '',
    GENERAL: '',
};

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, suggestions }) => {
  const highlights = suggestions
    .filter(s => s.originalText)
    .map(s => ({
      text: s.originalText!,
      type: s.type,
      message: s.message,
    }))
    .sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text));

  if (highlights.length === 0) {
    return <pre className="whitespace-pre-wrap font-sans">{text}</pre>;
  }

  let lastIndex = 0;
  const parts: (string | React.ReactNode)[] = [];

  highlights.forEach((highlight, i) => {
    const startIndex = text.indexOf(highlight.text, lastIndex);
    if (startIndex === -1) return;

    // Add the text before the highlight
    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }

    // Add the highlighted text
    parts.push(
      <span key={i} className={`${HIGHLIGHT_COLORS[highlight.type]} rounded px-1 py-0.5`} title={highlight.message}>
        {highlight.text}
      </span>
    );

    lastIndex = startIndex + highlight.text.length;
  });

  // Add the remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <pre className="whitespace-pre-wrap font-sans">{parts}</pre>;
};
