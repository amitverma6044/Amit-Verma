import React, { useState } from 'react';
import { QuizQuestion, Quiz } from '../types';
import { Sparkles, CheckCircle2, Plus, Trash2, ArrowDownToLine, Save, RefreshCw, AlertCircle, Palette } from 'lucide-react';
import { LUCID_THEMES, getLucidThemeById } from '../utils/lucidThemes';

interface AiQuizGeneratorPanelProps {
  articleTitle: string;
  articleContent: string;
  onInsertQuizToArticle: (quizHtml: string) => void;
  onAddQuizToPortal?: (quiz: Quiz) => void;
}

export const AiQuizGeneratorPanel: React.FC<AiQuizGeneratorPanelProps> = ({
  articleTitle,
  articleContent,
  onInsertQuizToArticle,
  onAddQuizToPortal,
}) => {
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('indigo');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedQuizTitle, setGeneratedQuizTitle] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [insertSuccessMsg, setInsertSuccessMsg] = useState<string | null>(null);

  // Generate Quiz using Gemini AI Endpoint
  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setInsertSuccessMsg(null);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          count: questionCount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setGeneratedQuizTitle(data.quizTitle || `${articleTitle} Quiz`);
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error('Quiz generation failed:', err);
      setErrorMsg(err.message || 'Failed to generate quiz questions. Please check your network and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add a manual question
  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'New custom question based on article content?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0,
      explanation: 'Educational explanation for students.',
    };
    setQuestions([...questions, newQ]);
  };

  // Delete a question
  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update a question field
  const handleUpdateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  // Update option choice
  const handleUpdateOption = (qId: string, optIdx: number, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const newOpts = [...q.options];
          newOpts[optIdx] = text;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  // Insert quiz directly into rich text content as HTML
  const handleInsertIntoArticle = () => {
    if (questions.length === 0) return;

    const theme = getLucidThemeById(selectedThemeId);

    let html = `
      <div style="margin: 2rem 0; padding: 1.5rem; background-color: ${theme.inlineStyle.backgroundColor}; border: 1.5px solid ${theme.inlineStyle.borderColor}; border-radius: 1rem; font-family: Inter, system-ui, sans-serif; transition: all 0.3s ease;" class="lucid-quiz-box ${theme.hoverClass}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid ${theme.inlineStyle.borderColor}; padding-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">📝</span>
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: bold; color: ${theme.inlineStyle.color}; font-family: Inter, system-ui, sans-serif;">${generatedQuizTitle || articleTitle + ' Practice Quiz'}</h3>
          </div>
          <span style="font-size: 0.7rem; font-weight: bold; font-family: monospace; background-color: ${theme.inlineStyle.borderColor}; color: ${theme.inlineStyle.color}; padding: 0.25rem 0.6rem; border-radius: 0.5rem;">
            ${theme.name} • ${questions.length} MCQs
          </span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
    `;

    questions.forEach((q, idx) => {
      html += `
        <div style="background-color: #FFFFFF; padding: 1rem; border-radius: 0.75rem; border: 1px solid ${theme.inlineStyle.borderColor}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; color: #0F172A; font-size: 0.95rem;">Q${idx + 1}. ${q.question}</p>
          <ul style="margin: 0; padding-left: 1.25rem; list-style-type: lower-alpha; color: #334155; font-size: 0.85rem;">
      `;
      q.options.forEach((opt, oIdx) => {
        const isCorrect = oIdx === q.correctAnswerIndex;
        html += `<li style="${isCorrect ? `font-weight: bold; color: ${theme.inlineStyle.accentColor};` : ''}">${opt} ${isCorrect ? '✓ (Correct)' : ''}</li>`;
      });
      html += `
          </ul>
          <p style="margin: 0.6rem 0 0 0; font-size: 0.8rem; color: ${theme.inlineStyle.color}; background-color: ${theme.inlineStyle.backgroundColor}; padding: 0.5rem 0.75rem; border-radius: 0.375rem; border-left: 3px solid ${theme.inlineStyle.accentColor}; font-family: Inter, system-ui, sans-serif;">
            💡 <strong>Explanation:</strong> ${q.explanation}
          </p>
        </div>
      `;
    });

    html += `
        </div>
      </div>
      <p><br/></p>
    `;

    onInsertQuizToArticle(html);
    setInsertSuccessMsg(`Quiz block (${theme.name}) successfully inserted into article content!`);
    setTimeout(() => setInsertSuccessMsg(null), 4000);
  };

  // Save quiz to portal
  const handleSaveToPortal = () => {
    if (questions.length === 0) return;

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: generatedQuizTitle || `${articleTitle} Quiz`,
      subject: 'Article Revision',
      timeLimitMinutes: Math.max(5, questions.length * 2),
      totalQuestions: questions.length,
      questions,
    };

    if (onAddQuizToPortal) {
      onAddQuizToPortal(newQuiz);
      setInsertSuccessMsg('Quiz saved to Interactive Quizzes portal!');
      setTimeout(() => setInsertSuccessMsg(null), 4000);
    } else {
      alert('Quiz added to article quizzes!');
    }
  };

  return (
    <div className="space-y-5 text-slate-800 font-sans">
      
      {/* Header & Controls */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-900">AI Quiz & MCQ Generator</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Automatically analyze your article's key concepts to create high-yield multiple choice questions for teachers and students.
        </p>

        {/* Questions Count Options */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block font-mono">Questions Count (Editor's Choice):</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value={5}>5 MCQs (Editor's Choice ⭐ Recommended)</option>
            <option value={3}>3 MCQs (Short Revision)</option>
            <option value={8}>8 MCQs (In-Depth Test)</option>
            <option value={10}>10 MCQs (Comprehensive Exam)</option>
          </select>
        </div>

        {/* Lucid Light Color Theme Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1 font-mono">
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quiz Lucid Light Color Theme:</span>
          </label>
          <select
            value={selectedThemeId}
            onChange={(e) => setSelectedThemeId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
          >
            {LUCID_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name} ({theme.colorName})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={isGenerating || !articleContent || articleContent.trim().length < 20}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isGenerating
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : !articleContent || articleContent.trim().length < 20
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Article & Generating MCQs...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Quiz with AI</span>
            </>
          )}
        </button>

        {(!articleContent || articleContent.trim().length < 20) && (
          <p className="text-[11px] text-amber-700 mt-2 italic flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            Write some article content first to generate relevant MCQs.
          </p>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Notification */}
      {insertSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{insertSuccessMsg}</span>
        </div>
      )}

      {/* Generated Questions List */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <input
              type="text"
              value={generatedQuizTitle}
              onChange={(e) => setGeneratedQuizTitle(e.target.value)}
              placeholder="Quiz Title"
              className="font-bold text-sm text-slate-900 border-b border-transparent focus:border-indigo-500 bg-transparent outline-none w-full"
            />
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 font-mono shrink-0">
              {questions.length} Questions
            </span>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono shrink-0">
                    Q{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(q.id, 'question', e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors shrink-0"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-1.5 pl-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">
                    Answer Options (Select correct answer radio):
                  </label>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctAnswerIndex === oIdx}
                        onChange={() => handleUpdateQuestion(q.id, 'correctAnswerIndex', oIdx)}
                        className="accent-indigo-600 cursor-pointer"
                        title="Mark as Correct Answer"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateOption(q.id, oIdx, e.target.value)}
                        className={`w-full text-xs px-2.5 py-1 rounded-xl border outline-none ${
                          q.correctAnswerIndex === oIdx
                            ? 'bg-indigo-50/80 border-indigo-300 font-semibold text-indigo-950'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5 font-mono">
                    Explanation / Solution:
                  </label>
                  <textarea
                    value={q.explanation}
                    onChange={(e) => handleUpdateQuestion(q.id, 'explanation', e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddQuestion}
            className="w-full py-2 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom MCQ Question</span>
          </button>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleInsertIntoArticle}
              className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-200" />
              <span>Insert Quiz Block into Article Content</span>
            </button>

            {onAddQuizToPortal && (
              <button
                onClick={handleSaveToPortal}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-slate-600" />
                <span>Save to Interactive Quizzes Section</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
