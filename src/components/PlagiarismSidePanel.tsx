import React, { useState } from 'react';
import { PlagiarismResult } from '../types';
import { ShieldCheck, Sparkles, ExternalLink, CheckCircle } from 'lucide-react';

interface PlagiarismSidePanelProps {
  plagiarism?: PlagiarismResult;
  onUpdate: (result: PlagiarismResult) => void;
  articleTitle: string;
  articleContent: string;
}

export const PlagiarismSidePanel: React.FC<PlagiarismSidePanelProps> = ({
  plagiarism,
  onUpdate,
  articleTitle,
  articleContent,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleRunCheck = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/ai/check-plagiarism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate({
          ...data,
          lastCheckedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    } catch (err) {
      console.error('Plagiarism check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const score = plagiarism?.originalityScore ?? 96;

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* Plagiarism Check Trigger Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-sm text-white">Plagiarism & Originality</h4>
          </div>
          {plagiarism?.lastCheckedAt && (
            <span className="text-[10px] text-slate-400 font-mono">Checked {plagiarism.lastCheckedAt}</span>
          )}
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Verify academic originality, scan against web/textbook sources, and check AI probability before publishing.
        </p>

        <button
          onClick={handleRunCheck}
          disabled={isChecking}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isChecking ? 'Scanning Content & Sources...' : 'Run Plagiarism & AI Check'}</span>
        </button>
      </div>

      {/* Main Originality Score Meter */}
      <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Originality Score</span>
          <span className={`text-2xl font-bold font-mono tracking-tight ${
            score >= 90 ? 'text-emerald-600' : score >= 75 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {score}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${
              score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-slate-50">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Academic Tone</span>
            <span className="text-sm font-bold text-slate-900">{plagiarism?.academicToneScore ?? 94}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50">
            <span className="block text-[10px] uppercase font-bold text-slate-500">AI Content Risk</span>
            <span className="text-sm font-bold text-emerald-600">{plagiarism?.aiProbabilityScore ?? 10}%</span>
          </div>
        </div>
      </div>

      {/* Editorial Feedback Summary */}
      {plagiarism?.feedback && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 space-y-1">
          <h5 className="font-bold flex items-center gap-1.5 text-emerald-900">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Audit Feedback</span>
          </h5>
          <p className="leading-relaxed text-emerald-900/90">{plagiarism.feedback}</p>
        </div>
      )}

      {/* Matched Sources Breakdown */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between font-mono">
          <span>Matched Sources ({plagiarism?.matchedSources.length || 0})</span>
        </h4>
        {(!plagiarism?.matchedSources || plagiarism.matchedSources.length === 0) ? (
          <div className="p-4 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
            No plagiarism matched across verified academic web databases.
          </div>
        ) : (
          <div className="space-y-2">
            {plagiarism.matchedSources.map((src, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-800 font-semibold">
                  <span className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                    <span>{src.domain}</span>
                  </span>
                  <span className="text-amber-600 font-mono text-[11px]">{src.similarity} match</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"{src.excerpt}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
