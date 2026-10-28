import React, { useState } from 'react';
import { ReadabilityResult } from '../types';
import { Sparkles, Activity, Lightbulb } from 'lucide-react';

interface ReadabilitySidePanelProps {
  readability?: ReadabilityResult;
  onUpdate: (result: ReadabilityResult) => void;
  articleContent: string;
}

export const ReadabilitySidePanel: React.FC<ReadabilitySidePanelProps> = ({
  readability,
  onUpdate,
  articleContent,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/readability-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent }),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate({
          ...data,
          lastAnalyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (err) {
      console.error('Readability analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const score = readability?.score ?? 85;

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Readability Header Action Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-sm text-slate-900">Readability & Clarity</h4>
          </div>
          {readability?.lastAnalyzedAt && (
            <span className="text-[10px] text-slate-500 font-mono">Analyzed {readability.lastAnalyzedAt}</span>
          )}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Evaluate sentence length, vocabulary density, Flesch reading ease, and student comprehension grade level.
        </p>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Calculating Metrics...' : 'Calculate Readability Metrics'}</span>
        </button>
      </div>

      {/* Main Readability Indicator Gauge */}
      <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Target Level</span>
            <h5 className="font-bold text-sm text-slate-900">
              {readability?.readingLevel || 'Grade 9-10 (Standard Educational)'}
            </h5>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-indigo-600 tracking-tight">{score}/100</span>
            <span className="block text-[10px] text-slate-500 font-medium">Clarity Rating</span>
          </div>
        </div>

        {/* Breakdown Metric Tiles */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 font-mono">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="block text-[10px] text-slate-500 font-bold uppercase">Flesch Ease</span>
            <span className="text-sm font-bold text-slate-900">{readability?.fleschReadingEase || 68.5}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="block text-[10px] text-slate-500 font-bold uppercase">Avg Sentence</span>
            <span className="text-sm font-bold text-slate-900">{readability?.avgSentenceLength || '14 words'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="block text-[10px] text-slate-500 font-bold uppercase">Passive Voice</span>
            <span className="text-sm font-bold text-emerald-600">{readability?.passiveVoicePercentage || '6%'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="block text-[10px] text-slate-500 font-bold uppercase">Est. Read Time</span>
            <span className="text-sm font-bold text-slate-900">{readability?.readingTimeMinutes || 5} mins</span>
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-mono">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Pacing & Clarity Suggestions</span>
        </h4>
        <div className="space-y-2">
          {(readability?.suggestions || [
            'Maintain current paragraph measuring (65-75 chars).',
            'Use bold formatting for key legal/scientific terms to aid student skimming.',
            'Include key takeaways callout box at the start of each section.'
          ]).map((sug, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{sug}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
