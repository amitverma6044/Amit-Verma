import React, { useState } from 'react';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Eye,
  Clock,
  Share2,
  Bookmark,
  HelpCircle,
  GraduationCap,
  ArrowRight,
  Tag
} from 'lucide-react';
import { Article, RelatedCourse, Quiz } from '../types';
import { renderMathInText } from '../utils/mathRenderer';

interface LiveReaderPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Partial<Article>;
  courses?: RelatedCourse[];
  quizzes?: Quiz[];
  onConfirmPublish: () => void;
}

export const LiveReaderPreviewModal: React.FC<LiveReaderPreviewModalProps> = ({
  isOpen,
  onClose,
  article,
  courses = [],
  quizzes = [],
  onConfirmPublish,
}) => {
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  // Process HTML content to render KaTeX math formulas
  const renderedContent = renderMathInText(article.contentHtml || article.contentText || '<p>No content written yet.</p>');

  const getViewportWidth = () => {
    switch (deviceViewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-[1000px]';
    }
  };

  const handleQuizOptionSelect = (quizId: string, optionIdx: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [quizId]: optionIdx }));
  };

  const tags = article.seo?.keywords || ['Academic', 'Education'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      {/* Top Admin Control Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">Student Reader Mode Preview</h2>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                Unpublished Draft
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inspect how students will experience this article with rendered formulas & interactive widgets.
            </p>
          </div>
        </div>

        {/* Viewport Switchers */}
        <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setDeviceViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceViewport === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop (1200px)
          </button>
          <button
            onClick={() => setDeviceViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceViewport === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            Tablet (768px)
          </button>
          <button
            onClick={() => setDeviceViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deviceViewport === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile (375px)
          </button>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            Back to Editor
          </button>
          <button
            onClick={onConfirmPublish}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Publish Article Now
          </button>
        </div>
      </div>

      {/* Reader Device Frame Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/40">
        <div
          className={`w-full ${getViewportWidth()} bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col my-auto min-h-[85vh]`}
        >
          {/* Article Header Banner */}
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-b from-indigo-50/40 to-white">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                {article.category || 'Educational'}
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTimeMinutes || 5} min read
              </span>
              <span className="text-xs font-medium text-slate-400">•</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                SEO Score: {article.seo?.seoScore || 92}/100
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {article.title || 'Untitled Article'}
            </h1>

            {article.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-6">
                {article.subtitle}
              </p>
            )}

            {/* Author Meta */}
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {article.author ? article.author[0].toUpperCase() : 'T'}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {article.author || 'TestPrime Editorial Team'}
                    <span className="p-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px]">✓</span>
                  </div>
                  <div className="text-xs text-slate-500">Verified Educator • Published Today</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.coverImage && (
            <div className="w-full max-h-[380px] overflow-hidden bg-slate-100 border-b border-slate-100">
              <img
                src={article.coverImage}
                alt="Article Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Main Body Content */}
          <div className="p-6 sm:p-10 space-y-6 text-slate-800 leading-relaxed text-base sm:text-lg">
            <div
              className="prose prose-indigo max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-indigo-600 hover:prose-a:underline prose-img:rounded-2xl prose-pre:bg-slate-900 prose-pre:text-slate-100"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Embedded Recommended Courses Section Preview */}
            {courses.length > 0 && (
              <div className="my-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
                  <GraduationCap className="w-5 h-5" />
                  Recommended Related Courses on TestPrime
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courses.slice(0, 2).map((course) => (
                    <div key={course.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                          {course.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-2">{course.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.price}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-500">⭐ {course.rating}</span>
                        <button className="text-indigo-600 font-bold flex items-center gap-1 hover:text-indigo-700">
                          Enroll / Attempt <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded Interactive Quiz Section Preview */}
            {quizzes.length > 0 && quizzes[0].questions.length > 0 && (
              <div className="my-10 p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 font-bold text-base text-indigo-300">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    Article Knowledge Check (Interactive Quiz)
                  </div>
                  <span className="text-xs text-indigo-200 bg-indigo-800/60 px-3 py-1 rounded-full font-mono">
                    {quizzes[0].title}
                  </span>
                </div>

                {quizzes[0].questions.slice(0, 2).map((qItem) => (
                  <div key={qItem.id} className="space-y-4 pt-2">
                    <h4 className="font-semibold text-base text-white">{qItem.question}</h4>
                    <div className="space-y-2">
                      {qItem.options.map((option, oIdx) => {
                        const isSelected = selectedQuizAnswers[qItem.id] === oIdx;
                        const isCorrect = oIdx === qItem.correctAnswerIndex;
                        const showResult = selectedQuizAnswers[qItem.id] !== undefined;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleQuizOptionSelect(qItem.id, oIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                              showResult && isSelected
                                ? isCorrect
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
                                : 'bg-slate-800/80 border-slate-700 hover:border-indigo-400 text-slate-200'
                            }`}
                          >
                            <span>{option}</span>
                            {showResult && isSelected && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded">
                                {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {selectedQuizAnswers[qItem.id] !== undefined && qItem.explanation && (
                      <div className="p-3 bg-indigo-950/60 border border-indigo-800/80 rounded-xl text-xs text-indigo-200 mt-3">
                        <strong>Explanation:</strong> {qItem.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tags Footer */}
            {tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-2">
                  <Tag className="w-3.5 h-3.5" />
                  Related Keywords:
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Footer Branding */}
          <div className="mt-auto px-6 py-6 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">TestPrime Educational Article Portal</p>
            <p>Empowering learners worldwide with interactive tech & academic insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
