import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Article, RelatedCourse, Quiz } from './types';
import { initialArticles, initialCourses, initialQuizzes } from './data/initialData';
import { Navbar } from './components/Navbar';
import { ArticleEditor } from './pages/admin/ArticleEditor';
import { ArticleList } from './components/ArticleList';
import { CoursesAndQuizzes } from './components/CoursesAndQuizzes';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ExportModal } from './components/ExportModal';
import { ArticleCommentsSection } from './components/ArticleCommentsSection';
import { createDefaultArticleDraft } from './utils/articleApiClient';

function AppShell() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<
    'editor' | 'articles' | 'courses' | 'quizzes' | 'analytics'
  >('articles');

  // Keep activeTab synchronized with the current URL path
  useEffect(() => {
    const path = location.pathname;
    if (
      path.startsWith('/admin/articles/create') ||
      path.startsWith('/admin/articles/edit') ||
      path.startsWith('/admin/articles/editor')
    ) {
      setActiveTab('editor');
    } else if (path.startsWith('/admin/courses')) {
      setActiveTab('courses');
    } else if (path.startsWith('/admin/quizzes')) {
      setActiveTab('quizzes');
    } else if (path.startsWith('/admin/analytics')) {
      setActiveTab('analytics');
    } else if (path.startsWith('/admin/articles')) {
      setActiveTab('articles');
    }
  }, [location.pathname]);

  // Articles state with localStorage persistence + backend hydration
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('edublog_articles_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((art: Article) => ({
            ...art,
            lucidThemeId: art.lucidThemeId || 'indigo',
            attachedCourseIds: art.attachedCourseIds || [],
            versionHistory: art.versionHistory || [],
          }));
        }
      } catch (e) {
        console.error('Failed to parse saved articles from localStorage', e);
      }
    }
    return initialArticles;
  });

  // Courses state with localStorage persistence
  const [courses, setCourses] = useState<RelatedCourse[]>(() => {
    const saved = localStorage.getItem('edublog_courses_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved courses from localStorage', e);
      }
    }
    return initialCourses;
  });

  // Quizzes state with localStorage persistence
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('edublog_quizzes_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved quizzes from localStorage', e);
      }
    }
    return initialQuizzes;
  });

  const [activeArticleId, setActiveArticleId] = useState<string>(initialArticles[0].id);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string>(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  );
  const [currentLanguage, setLanguage] = useState<string>('English');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isReaderViewMode, setIsReaderViewMode] = useState<boolean>(false);

  // Sync to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('edublog_articles_v3', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('edublog_courses_v3', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edublog_quizzes_v3', JSON.stringify(quizzes));
  }, [quizzes]);

  // Periodic 30-second auto-save timer
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      localStorage.setItem('edublog_articles_v3', JSON.stringify(articles));
      const formattedTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastAutoSavedTime(formattedTime);
      setSaveStatus('saving');

      const timer = setTimeout(() => {
        setSaveStatus('saved');
      }, 500);

      return () => clearTimeout(timer);
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [articles]);

  // Resolve active article from URL `/admin/articles/edit/:id` if present
  const editMatch = location.pathname.match(/^\/admin\/articles\/edit\/([^/]+)/);
  const routeEditId = editMatch ? decodeURIComponent(editMatch[1]) : undefined;
  const activeArticle =
    articles.find((a) => a.id === (routeEditId || activeArticleId)) || articles[0];

  // Upsert or Update Active Article
  const handleUpdateArticle = (updatedArticle: Article) => {
    setSaveStatus('unsaved');
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === updatedArticle.id);
      if (exists) {
        return prev.map((a) =>
          a.id === updatedArticle.id
            ? {
                ...updatedArticle,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : a
        );
      }
      return [
        {
          ...updatedArticle,
          updatedAt: new Date().toISOString().split('T')[0],
        },
        ...prev,
      ];
    });
    setActiveArticleId(updatedArticle.id);
    setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
  };

  // Register newly created article into state
  const handleCreateArticleFromEditor = (createdArticle: Article) => {
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === createdArticle.id);
      if (exists) {
        return prev.map((a) => (a.id === createdArticle.id ? createdArticle : a));
      }
      return [createdArticle, ...prev];
    });
    setActiveArticleId(createdArticle.id);
    setLastAutoSavedTime(
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    setSaveStatus('saved');
  };

  // Triggered when clicking 'Write New Article' or 'New Article'
  const handlePrepareNewArticle = () => {
    const draft = createDefaultArticleDraft(currentLanguage);
    setActiveArticleId(draft.id);
    setActiveTab('editor');
  };

  // Delete Article (also syncs with DELETE /api/articles/:id)
  const handleDeleteArticle = (id: string) => {
    if (articles.length <= 1) {
      return;
    }
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    if (activeArticleId === id) {
      setActiveArticleId(updated[0].id);
    }
    fetch(`/api/articles/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(
      () => {}
    );
  };

  const handleSavedCallback = (savedArt?: Article) => {
    if (savedArt) {
      handleCreateArticleFromEditor(savedArt);
    }
    setLastAutoSavedTime(
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    setSaveStatus('saved');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden max-w-full min-w-0 scroll-smooth">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewArticle={handlePrepareNewArticle}
        onOpenExport={() => setShowExportModal(true)}
        saveStatus={saveStatus}
        lastAutoSavedTime={lastAutoSavedTime}
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
        isReaderViewMode={isReaderViewMode}
        setIsReaderViewMode={setIsReaderViewMode}
        activeArticleTitle={activeArticle?.title}
        activeArticleId={activeArticle?.id}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 scroll-smooth">
        {isReaderViewMode && activeArticle ? (
          <div className="h-full flex-1 overflow-y-auto scroll-smooth max-w-4xl mx-auto w-full p-4 lg:p-8 space-y-6 font-sans min-w-0">
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 min-w-0 scroll-smooth">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider flex-shrink-0">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-slate-500 font-medium min-w-0 break-words">
                  {activeArticle.readTimeMinutes} min read • Published by{' '}
                  {activeArticle.author}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight min-w-0 break-words">
                {activeArticle.title}
              </h1>

              {activeArticle.subtitle && (
                <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-indigo-600 pl-4 py-1 italic min-w-0 break-words">
                  {activeArticle.subtitle}
                </p>
              )}

              {activeArticle.coverImage && (
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full max-h-[360px] object-cover rounded-2xl border border-slate-200"
                />
              )}

              <div
                className="prose prose-indigo max-w-none text-slate-800 leading-relaxed text-base min-w-0 break-words"
                style={{
                  fontFamily:
                    activeArticle.typographySettings?.bodyFontFamily ||
                    'Inter, sans-serif',
                  fontSize:
                    activeArticle.typographySettings?.globalFontSize || '16px',
                  lineHeight:
                    activeArticle.typographySettings?.lineHeight || '1.7',
                }}
                dangerouslySetInnerHTML={{ __html: activeArticle.contentHtml }}
              />
            </div>

            <ArticleCommentsSection
              comments={activeArticle.comments}
              rating={activeArticle.rating}
              onAddComment={(newC: {
                authorName: string;
                text: string;
                rating: number;
              }) => {
                const commentObj = {
                  id: `comment-${Date.now()}`,
                  authorName: newC.authorName,
                  text: newC.text,
                  rating: newC.rating,
                  timestamp: 'Just now',
                  likes: 0,
                  approved: true,
                };
                const updatedComments = [
                  commentObj,
                  ...(activeArticle.comments || []),
                ];
                handleUpdateArticle({
                  ...activeArticle,
                  comments: updatedComments,
                });
              }}
              onLikeComment={(cId: string) => {
                const updated = (activeArticle.comments || []).map((c) =>
                  c.id === cId ? { ...c, likes: c.likes + 1 } : c
                );
                handleUpdateArticle({ ...activeArticle, comments: updated });
              }}
              isAdmin={false}
            />
          </div>
        ) : (
          <Routes>
            {/* Main Website Articles Dashboard List View */}
            <Route
              path="/admin/articles"
              element={
                <ArticleList
                  articles={articles}
                  onSelectArticle={(art) => {
                    setActiveArticleId(art.id);
                    setActiveTab('editor');
                  }}
                  onNewArticle={handlePrepareNewArticle}
                  onDeleteArticle={handleDeleteArticle}
                />
              }
            />

            {/* Create New Article Route */}
            <Route
              path="/admin/articles/create"
              element={
                <ArticleEditor
                  mode="create"
                  articles={articles}
                  article={activeArticle}
                  onUpdateArticle={handleUpdateArticle}
                  onCreateArticle={handleCreateArticleFromEditor}
                  onSave={handleSavedCallback}
                  onPublish={handleSavedCallback}
                  onOpenExport={() => setShowExportModal(true)}
                  availableCourses={courses}
                  availableQuizzes={quizzes}
                  onAddQuizToPortal={(newQuiz) =>
                    setQuizzes((prev) => [newQuiz, ...prev])
                  }
                  lastAutoSavedTime={lastAutoSavedTime}
                  activePortalTab="editor"
                  setActivePortalTab={setActiveTab}
                  currentLanguage={currentLanguage}
                />
              }
            />

            {/* Direct Blog Editor Route */}
            <Route
              path="/admin/articles/editor"
              element={
                <ArticleEditor
                  mode="editor"
                  articles={articles}
                  article={activeArticle}
                  onUpdateArticle={handleUpdateArticle}
                  onCreateArticle={handleCreateArticleFromEditor}
                  onSave={handleSavedCallback}
                  onPublish={handleSavedCallback}
                  onOpenExport={() => setShowExportModal(true)}
                  availableCourses={courses}
                  availableQuizzes={quizzes}
                  onAddQuizToPortal={(newQuiz) =>
                    setQuizzes((prev) => [newQuiz, ...prev])
                  }
                  lastAutoSavedTime={lastAutoSavedTime}
                  activePortalTab="editor"
                  setActivePortalTab={setActiveTab}
                  currentLanguage={currentLanguage}
                />
              }
            />

            {/* Edit Existing Article by ID Route */}
            <Route
              path="/admin/articles/edit/:id"
              element={
                <ArticleEditor
                  mode="edit"
                  articles={articles}
                  article={activeArticle}
                  onUpdateArticle={handleUpdateArticle}
                  onCreateArticle={handleCreateArticleFromEditor}
                  onSave={handleSavedCallback}
                  onPublish={handleSavedCallback}
                  onOpenExport={() => setShowExportModal(true)}
                  availableCourses={courses}
                  availableQuizzes={quizzes}
                  onAddQuizToPortal={(newQuiz) =>
                    setQuizzes((prev) => [newQuiz, ...prev])
                  }
                  lastAutoSavedTime={lastAutoSavedTime}
                  activePortalTab="editor"
                  setActivePortalTab={setActiveTab}
                  currentLanguage={currentLanguage}
                />
              }
            />

            {/* Portal Courses, Quizzes & Analytics Routes */}
            <Route
              path="/admin/courses"
              element={
                <CoursesAndQuizzes
                  courses={courses}
                  quizzes={quizzes}
                  onUpdateCourses={setCourses}
                  onUpdateQuizzes={setQuizzes}
                  initialTab="courses"
                />
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <CoursesAndQuizzes
                  courses={courses}
                  quizzes={quizzes}
                  onUpdateCourses={setCourses}
                  onUpdateQuizzes={setQuizzes}
                  initialTab="quizzes"
                />
              }
            />
            <Route
              path="/admin/analytics"
              element={<AnalyticsDashboard articles={articles} />}
            />

            {/* Default Redirect to /admin/articles */}
            <Route path="/" element={<Navigate to="/admin/articles" replace />} />
            <Route path="*" element={<Navigate to="/admin/articles" replace />} />
          </Routes>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-sans flex-shrink-0 min-w-0 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 min-w-0 scroll-smooth">
          <div className="flex items-center gap-2 min-w-0 flex-wrap justify-center">
            <span className="font-extrabold text-slate-900 flex-shrink-0">
              TestPrime Portal
            </span>
            <span className="flex-shrink-0">·</span>
            <span className="min-w-0 break-words">
              SEO Optimized Article Management & Academic Publishing
            </span>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 flex-wrap justify-center">
            <span className="text-emerald-600 font-medium flex-shrink-0">
              Cloud Sync Active
            </span>
            <span className="flex-shrink-0">Offline Support (PWA)</span>
            <span className="flex-shrink-0">End-to-End Privacy</span>
          </div>
        </div>
      </footer>

      {/* Export File Modal */}
      {showExportModal && activeArticle && (
        <ExportModal
          article={activeArticle}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
