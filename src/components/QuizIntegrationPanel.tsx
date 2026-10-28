import React, { useState } from 'react';
import { Quiz } from '../types';
import { HelpCircle, Sparkles, Search, Layers, CheckCircle2, ArrowDownToLine, Move, ChevronDown, ChevronUp, Palette } from 'lucide-react';
import { AiQuizGeneratorPanel } from './AiQuizGeneratorPanel';
import { LUCID_THEMES, getLucidThemeById } from '../utils/lucidThemes';

interface QuizIntegrationPanelProps {
  articleTitle: string;
  articleContent: string;
  availableQuizzes: Quiz[];
  onInsertQuizToArticle: (quizHtml: string) => void;
  onAddQuizToPortal?: (quiz: Quiz) => void;
}

export const QuizIntegrationPanel: React.FC<QuizIntegrationPanelProps> = ({
  articleTitle,
  articleContent,
  availableQuizzes,
  onInsertQuizToArticle,
  onAddQuizToPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'repository' | 'ai_generator'>('repository');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('indigo');
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Filter repository quizzes
  const filteredQuizzes = availableQuizzes.filter((q) => {
    const qText = `${q.title} ${q.subject} ${q.id}`.toLowerCase();
    return qText.includes(searchQuery.toLowerCase());
  });

  // Helper to generate interactive quiz HTML block for article flow
  const generateInteractiveQuizHtml = (quiz: Quiz) => {
    const uniqueId = `embed-quiz-${Date.now()}`;
    const theme = getLucidThemeById(selectedThemeId);
    
    let html = `
      <div id="${uniqueId}" style="margin: 2rem 0; padding: 1.5rem; background-color: ${theme.inlineStyle.backgroundColor}; border: 1.5px solid ${theme.inlineStyle.borderColor}; border-radius: 1rem; font-family: Inter, system-ui, sans-serif; transition: all 0.3s ease;" class="lucid-quiz-widget ${theme.hoverClass}" data-quiz-id="${quiz.id}">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid ${theme.inlineStyle.borderColor}; padding-bottom: 0.75rem; margin-bottom: 1rem; font-family: Inter, system-ui, sans-serif;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="padding: 0.25rem 0.5rem; background-color: ${theme.inlineStyle.accentColor}; color: #ffffff; border-radius: 0.5rem; font-weight: bold; font-size: 0.75rem;">📝 QUIZ</span>
            <div>
              <h3 style="font-family: Inter, system-ui, sans-serif; font-weight: bold; font-size: 1rem; color: ${theme.inlineStyle.color}; margin: 0;">${quiz.title}</h3>
              <p style="font-size: 0.75rem; color: #475569; margin: 0; font-family: Inter, system-ui, sans-serif;">${quiz.subject} • ${quiz.questions.length} Questions • ${quiz.timeLimitMinutes} Mins • ${theme.name}</p>
            </div>
          </div>
          <span style="font-size: 0.7rem; font-family: monospace; font-weight: bold; background-color: ${theme.inlineStyle.borderColor}; color: ${theme.inlineStyle.color}; padding: 0.25rem 0.6rem; border-radius: 0.5rem;">ID: ${quiz.id}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
    `;

    quiz.questions.forEach((q, idx) => {
      html += `
        <div style="padding: 1rem; background-color: #ffffff; border: 1px solid ${theme.inlineStyle.borderColor}; border-radius: 0.75rem;">
          <p style="font-weight: bold; font-size: 0.9rem; color: #0f172a; margin: 0 0 0.5rem 0;">Q${idx + 1}. ${q.question}</p>
          <div style="display: flex; flex-direction: column; gap: 0.375rem; font-family: Inter, system-ui, sans-serif; font-size: 0.8rem;">
      `;

      q.options.forEach((opt, oIdx) => {
        const isCorrect = oIdx === q.correctAnswerIndex;
        html += `
            <div style="padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background-color: #f8fafc; display: flex; align-items: center; justify-content: space-between;">
              <span style="${isCorrect ? `font-weight: bold; color: ${theme.inlineStyle.accentColor};` : 'color: #334155;'}">
                (${String.fromCharCode(65 + oIdx)}) ${opt}
              </span>
              ${isCorrect ? `<span style="font-size: 0.65rem; font-weight: bold; color: #047857; background-color: #ecfdf5; padding: 0.125rem 0.375rem; border-radius: 0.25rem; border: 1px solid #a7f3d0;">✓ Correct Choice</span>` : ''}
            </div>
        `;
      });

      html += `
          </div>
          <div style="padding: 0.6rem 0.75rem; background-color: ${theme.inlineStyle.backgroundColor}; border: 1px solid ${theme.inlineStyle.borderColor}; border-radius: 0.5rem; font-size: 0.75rem; font-family: Inter, system-ui, sans-serif; color: ${theme.inlineStyle.color}; margin-top: 0.6rem; border-left: 3px solid ${theme.inlineStyle.accentColor};">
            💡 <strong>Explanation:</strong> ${q.explanation}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
      <p><br/></p>
    `;

    return html;
  };

  // Embed a selected quiz into the article
  const handleEmbedQuiz = (quiz: Quiz) => {
    const quizHtml = generateInteractiveQuizHtml(quiz);
    onInsertQuizToArticle(quizHtml);
    setNotificationMsg(`Embedded "${quiz.title}" (ID: ${quiz.id}) into article flow!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Drag and drop handler
  const handleDragStart = (e: React.DragEvent, quiz: Quiz) => {
    const quizHtml = generateInteractiveQuizHtml(quiz);
    e.dataTransfer.setData('text/html', quizHtml);
    e.dataTransfer.setData('text/plain', `[quiz:${quiz.id}]`);
  };

  return (
    <div className="space-y-4 text-slate-800 font-sans min-w-0">
      
      {/* Header & Mode Switcher */}
      <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xs space-y-3 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <h3 className="font-bold text-sm text-white truncate">Quiz Integration</h3>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 shrink-0 whitespace-nowrap">
            {availableQuizzes.length} Quizzes Available
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Manage interactive practice quizzes. Drag and drop quiz blocks or click to embed quiz widgets into your article flow for student testing.
        </p>

        {/* Tab Selector (Organized Vertical / 2-Column Stack, Zero Horizontal Scroll) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-800 p-1.5 rounded-xl min-w-0">
          <button
            onClick={() => setActiveTab('repository')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 flex-shrink-0 whitespace-nowrap ${
              activeTab === 'repository'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white bg-slate-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
            <span>Repository ({availableQuizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_generator')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 flex-shrink-0 whitespace-nowrap ${
              activeTab === 'ai_generator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white bg-slate-800/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 shrink-0 flex-shrink-0" />
            <span>AI Generator</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 flex-shrink-0" />
          <span className="min-w-0 break-words">{notificationMsg}</span>
        </div>
      )}

      {/* TAB 1: QUIZ REPOSITORY & DRAG-AND-DROP EMBEDDER */}
      {activeTab === 'repository' && (
        <div className="space-y-3 min-w-0">
          
          {/* Search bar & Lucid Theme selector stacked cleanly */}
          <div className="space-y-2 min-w-0">
            <div className="relative w-full min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search quizzes by title, subject, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-500 min-w-0"
              />
            </div>

            <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0 flex-shrink-0">
                <Palette className="w-3.5 h-3.5 text-indigo-600 shrink-0 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">Quiz Theme:</span>
              </div>
              <select
                value={selectedThemeId}
                onChange={(e) => setSelectedThemeId(e.target.value)}
                className="bg-transparent text-xs font-bold text-indigo-700 outline-none cursor-pointer text-right min-w-0 truncate"
                title="Select Lucid Theme for embedded quiz widget"
              >
                {LUCID_THEMES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between gap-2 overflow-x-auto horizontal-scroll-bar py-0.5 flex-nowrap min-w-0">
            <span className="flex items-center gap-1 shrink-0 flex-shrink-0 whitespace-nowrap">
              <Move className="w-3 h-3 text-indigo-600 shrink-0 flex-shrink-0" />
              <span>Drag or click <strong>Embed Widget</strong></span>
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200 font-mono shrink-0 flex-shrink-0 whitespace-nowrap">
              {getLucidThemeById(selectedThemeId).name}
            </span>
          </div>

          {/* Quizzes list */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 min-w-0">
            {filteredQuizzes.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500 min-w-0">
                No quizzes match "{searchQuery}". Use AI Generator to create one!
              </div>
            ) : (
              filteredQuizzes.map((quiz) => {
                const isExpanded = expandedQuizId === quiz.id;
                return (
                  <div
                    key={quiz.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, quiz)}
                    className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-4 shadow-xs space-y-3 transition-all cursor-grab active:cursor-grabbing group min-w-0"
                  >
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-mono shrink-0 flex-shrink-0">
                            {quiz.subject}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold shrink-0 flex-shrink-0">
                            ID: {quiz.id}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1.5 group-hover:text-indigo-600 transition-colors min-w-0 break-words">
                          {quiz.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5 min-w-0 break-words">
                          {quiz.questions.length} Questions • {quiz.timeLimitMinutes} Mins Limit
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedQuizId(isExpanded ? null : quiz.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors shrink-0 flex-shrink-0"
                        title="Toggle questions preview"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Questions Preview */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">
                          Question Snippets & Solutions:
                        </span>
                        {quiz.questions.map((q, idx) => (
                          <div key={q.id || idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                            <p className="font-semibold text-slate-800">Q{idx + 1}. {q.question}</p>
                            <p className="text-[11px] text-indigo-900 italic bg-indigo-50/80 p-1.5 rounded-lg border border-indigo-100">
                              Explanation: {q.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Embed Button */}
                    <button
                      onClick={() => handleEmbedQuiz(quiz)}
                      className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Embed Quiz Widget into Article</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* TAB 2: AI QUIZ GENERATOR */}
      {activeTab === 'ai_generator' && (
        <AiQuizGeneratorPanel
          articleTitle={articleTitle}
          articleContent={articleContent}
          onInsertQuizToArticle={onInsertQuizToArticle}
          onAddQuizToPortal={onAddQuizToPortal}
        />
      )}

    </div>
  );
};
