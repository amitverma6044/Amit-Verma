import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Feather, Check, ArrowRight, Zap } from 'lucide-react';

export interface WritingSuggestion {
  id: string;
  type: 'grammar' | 'tone' | 'conciseness' | 'clarity';
  originalText: string;
  suggestedText: string;
  explanation: string;
}

interface WritingAssistantPanelProps {
  articleContentText: string;
  articleContentHtml: string;
  onApplyFix: (originalSnippet: string, replacementSnippet: string) => void;
}

export const WritingAssistantPanel: React.FC<WritingAssistantPanelProps> = ({
  articleContentText,
  articleContentHtml,
  onApplyFix,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  
  // State for AI Analysis Results
  const [analysisResult, setAnalysisResult] = useState<{
    overallQualityScore: number;
    tone: string;
    concisenessScore: number;
    grammarScore: number;
    suggestions: WritingSuggestion[];
  } | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'grammar' | 'tone' | 'conciseness'>('all');

  const handleRunAssistant = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/writing-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContentText }),
      });

      if (!response.ok) {
        throw new Error(`Writing assistant request failed with status ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      setAppliedIds([]);
    } catch (err: any) {
      console.error('Failed writing assistant analysis:', err);
      setErrorMsg(err.message || 'Proofreading analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFix = (suggestion: WritingSuggestion) => {
    onApplyFix(suggestion.originalText, suggestion.suggestedText);
    setAppliedIds((prev) => [...prev, suggestion.id]);
  };

  const filteredSuggestions = (analysisResult?.suggestions || []).filter((s) => {
    if (activeFilter === 'all') return true;
    return s.type === activeFilter;
  });

  return (
    <div className="space-y-5 text-slate-800 font-sans">
      
      {/* Header & Trigger Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Feather className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">AI Writing & Proofreading Assistant</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Real-time analysis of grammar correctness, editorial tone consistency, and conciseness for high-impact educational articles.
        </p>

        <button
          onClick={handleRunAssistant}
          disabled={isAnalyzing || !articleContentText || articleContentText.trim().length < 15}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isAnalyzing
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : !articleContentText || articleContentText.trim().length < 15
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Grammar, Tone & Conciseness...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Analyze Article Text with AI</span>
            </>
          )}
        </button>

        {(!articleContentText || articleContentText.trim().length < 15) && (
          <p className="text-[11px] text-amber-700 mt-2 italic flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            Write some article content in the editor to run the proofreader.
          </p>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis Scores Dashboard */}
      {analysisResult && (
        <div className="space-y-4">
          
          {/* Quality Score Cards */}
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Overall Quality</span>
              <span className="font-bold text-xl text-indigo-600">{analysisResult.overallQualityScore}/100</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Editorial Tone</span>
              <span className="font-sans font-bold text-xs text-slate-800 mt-1 block truncate">{analysisResult.tone}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Grammar Score</span>
              <span className="font-bold text-sm text-emerald-600">{analysisResult.grammarScore}%</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Conciseness</span>
              <span className="font-bold text-sm text-indigo-600">{analysisResult.concisenessScore}%</span>
            </div>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto horizontal-scroll-bar flex-nowrap min-w-0">
            {[
              { id: 'all', label: 'All Suggestions' },
              { id: 'grammar', label: 'Grammar' },
              { id: 'tone', label: 'Tone' },
              { id: 'conciseness', label: 'Conciseness' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 flex-shrink-0 transition-all ${
                  activeFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Suggestions List */}
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1 min-w-0">
            {filteredSuggestions.length === 0 ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1 min-w-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">No issues found in this category!</p>
                <p className="text-[11px] text-emerald-700">Your writing adheres to high academic editorial standards.</p>
              </div>
            ) : (
              filteredSuggestions.map((s) => {
                const isApplied = appliedIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className={`p-3.5 rounded-2xl border transition-all min-w-0 ${
                      isApplied
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-white border-slate-200 shadow-xs hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 min-w-0 gap-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full font-mono shrink-0 flex-shrink-0 ${
                        s.type === 'grammar'
                          ? 'bg-red-100 text-red-800'
                          : s.type === 'tone'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {s.type}
                      </span>

                      {isApplied && (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 font-mono shrink-0 flex-shrink-0">
                          <Check className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
                          <span>Applied Fix</span>
                        </span>
                      )}
                    </div>

                    {/* Original vs Suggested */}
                    <div className="space-y-2 text-xs font-sans">
                      <div className="p-2 bg-red-50/70 border border-red-100 rounded-xl text-red-900">
                        <span className="block text-[9px] uppercase font-bold text-red-600 mb-0.5 font-mono">Original Snippet:</span>
                        <p className="line-through">{s.originalText}</p>
                      </div>

                      <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950 font-medium">
                        <span className="block text-[9px] uppercase font-bold text-emerald-700 mb-0.5 font-mono">Suggested Improvement:</span>
                        <p>{s.suggestedText}</p>
                      </div>

                      <p className="text-[11px] text-slate-600 italic">
                        💡 {s.explanation}
                      </p>
                    </div>

                    {/* Apply Button */}
                    {!isApplied && (
                      <button
                        onClick={() => handleApplyFix(s)}
                        className="w-full mt-3 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Apply Suggestion</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
};
