import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { buildAdminRoute } from '../utils/articleApiClient';
import {
  BookOpen,
  FileText,
  GraduationCap,
  HelpCircle,
  BarChart2,
  Globe,
  Download,
  WifiOff,
  PlusCircle,
  CheckCircle2,
  ArrowLeft,
  Shield,
  Eye,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'editor' | 'articles' | 'courses' | 'quizzes' | 'analytics';
  setActiveTab: (tab: 'editor' | 'articles' | 'courses' | 'quizzes' | 'analytics') => void;
  onNewArticle: () => void;
  onOpenExport: () => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  lastAutoSavedTime?: string;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isReaderViewMode?: boolean;
  setIsReaderViewMode?: (val: boolean) => void;
  activeArticleTitle?: string;
  activeArticleId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewArticle,
  onOpenExport,
  saveStatus,
  lastAutoSavedTime,
  currentLanguage,
  setLanguage,
  isReaderViewMode = false,
  setIsReaderViewMode,
  activeArticleTitle,
  activeArticleId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(true);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const isEditorRoute =
    activeTab === 'editor' ||
    location.pathname.startsWith('/admin/articles/create') ||
    location.pathname.startsWith('/admin/articles/edit') ||
    location.pathname.startsWith('/admin/articles/editor');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNavigateTab = (
    tab: 'editor' | 'articles' | 'courses' | 'quizzes' | 'analytics'
  ) => {
    setActiveTab(tab);
    switch (tab) {
      case 'articles':
        navigate(buildAdminRoute('articles'));
        break;
      case 'editor':
        navigate(
          activeArticleId
            ? buildAdminRoute('edit', activeArticleId)
            : buildAdminRoute('editor')
        );
        break;
      case 'courses':
        navigate(buildAdminRoute('courses'));
        break;
      case 'quizzes':
        navigate(buildAdminRoute('quizzes'));
        break;
      case 'analytics':
        navigate(buildAdminRoute('analytics'));
        break;
    }
  };

  const handleBackToArticlesClick = () => {
    setActiveTab('articles');
    navigate(buildAdminRoute('articles'));
  };

  const handleNewArticleClick = () => {
    onNewArticle();
    setActiveTab('editor');
    navigate(buildAdminRoute('create'));
  };

  const getBreadcrumbLabel = () => {
    if (location.pathname.startsWith('/admin/articles/create')) {
      return 'Creating New Article';
    }
    if (isEditorRoute) {
      return activeArticleTitle ? `Editing: ${activeArticleTitle}` : 'Article Editor';
    }
    switch (activeTab) {
      case 'articles':
        return 'Articles & Theory Notes';
      case 'courses':
        return 'Courses & Test Series';
      case 'quizzes':
        return 'Practice Quizzes';
      case 'analytics':
        return 'Analytics & Traffic';
      default:
        return 'Portal';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs w-full flex-shrink-0">
      {/* Offline Toast Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs py-1 px-4 flex items-center justify-center gap-2 font-medium min-w-0">
          <WifiOff className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
          <span className="min-w-0 break-words">
            Offline Mode Active — Content changes will auto-sync to local storage until
            reconnected.
          </span>
        </div>
      )}

      {/* TIER 1: Brand Identity, Save Status & Primary Portal Actions */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 min-w-0">
        {/* Left: Back Button, Brand Wordmark & Auto-Save Status */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 min-w-0 flex-1">
          {isEditorRoute && (
            <button
              onClick={handleBackToArticlesClick}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0 flex-shrink-0 whitespace-nowrap border border-slate-200/80"
              title="Return back to /admin/articles List View"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
              <span>Back to Articles</span>
            </button>
          )}

          <div
            onClick={handleBackToArticlesClick}
            className="flex items-center gap-2 cursor-pointer group shrink-0 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs group-hover:bg-indigo-700 transition-colors shrink-0 flex-shrink-0">
              TP
            </div>
            <div className="flex flex-col min-w-0">
              <div className="text-sm font-extrabold text-slate-900 leading-tight whitespace-nowrap flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                <span>TestPrime Portal</span>
                {isReaderViewMode ? (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 flex-shrink-0 whitespace-nowrap">
                    Student View
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1 shrink-0 flex-shrink-0 whitespace-nowrap">
                    <Shield className="w-2.5 h-2.5 shrink-0 flex-shrink-0" /> Admin Backend
                  </span>
                )}
              </div>
              <div className="text-[9px] text-slate-400 font-semibold tracking-wider whitespace-nowrap uppercase">
                Modern EdTech & Publishing Hub
              </div>
            </div>
          </div>

          {/* Save Status Indicator */}
          {!isReaderViewMode && (
            <span
              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-medium shrink-0 flex-shrink-0 whitespace-nowrap"
              title="Periodic local storage & backend sync status"
            >
              {saveStatus === 'saving' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0 flex-shrink-0" />
                  <span>Auto-saving...</span>
                </>
              ) : saveStatus === 'unsaved' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 flex-shrink-0" />
                  <span>Editing</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 flex-shrink-0" />
                  <span>
                    Auto-saved {lastAutoSavedTime ? `at ${lastAutoSavedTime}` : ''}
                  </span>
                </>
              )}
            </span>
          )}

          {/* Active Breadcrumb Inline on Desktop */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2.5 border-l border-slate-200 min-w-0 flex-1 text-xs text-slate-500 overflow-hidden">
            <span className="font-bold text-slate-700 shrink-0 whitespace-nowrap">
              Admin
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span
              className="text-indigo-600 font-semibold truncate min-w-0"
              title={getBreadcrumbLabel()}
            >
              {getBreadcrumbLabel()}
            </span>
          </div>
        </div>

        {/* Right: Primary Action Buttons & Language Selector */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0">
          {setIsReaderViewMode && (
            <button
              onClick={() => setIsReaderViewMode(!isReaderViewMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 flex-shrink-0 whitespace-nowrap ${
                isReaderViewMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Switch between Admin Controls and Student Reader View"
            >
              {isReaderViewMode ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-indigo-200 shrink-0 flex-shrink-0" />
                  <span>Switch to Admin Mode</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0 flex-shrink-0" />
                  <span>Student Reader View</span>
                </>
              )}
            </button>
          )}

          {/* Language Selector */}
          <div className="relative shrink-0 flex-shrink-0">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0 flex-shrink-0" />
              <span>{currentLanguage}</span>
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                {['English', 'Hindi (हिंदी)'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs whitespace-nowrap ${
                      currentLanguage === lang
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export File Trigger Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
            title="Export Article to PDF / DOCX"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 shrink-0 flex-shrink-0" />
            <span>Export</span>
          </button>

          {/* New Article Button (Admin Only) */}
          {!isReaderViewMode && (
            <button
              onClick={handleNewArticleClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-xs transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
              <span>New Article</span>
            </button>
          )}
        </div>
      </div>

      {/* TIER 2: Shown on non-editor views or mobile/tablet screens */}
      <div
        className={`${
          isEditorRoute && !isReaderViewMode ? 'lg:hidden' : ''
        } bg-slate-50/90 border-t border-slate-200/80 px-3 sm:px-6 py-1.5`}
      >
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2 min-w-0">
          {/* Active Breadcrumb */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0 text-xs text-slate-500">
            <span className="font-bold text-slate-700 shrink-0 whitespace-nowrap">
              TestPrime Admin
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-indigo-600 font-semibold break-words min-w-0 line-clamp-1">
              {getBreadcrumbLabel()}
            </span>
          </div>

          {/* Main Navigation Tabs */}
          {!isReaderViewMode && (
            <nav className="flex flex-wrap items-center gap-1.5 min-w-0">
              <button
                onClick={() => handleNavigateTab('editor')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                  isEditorRoute
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Article Editor</span>
              </button>

              <button
                onClick={() => handleNavigateTab('articles')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeTab === 'articles' && !isEditorRoute
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Articles & Notes</span>
              </button>

              <button
                onClick={() => handleNavigateTab('courses')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeTab === 'courses'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span>Courses & Test Series</span>
              </button>

              <button
                onClick={() => handleNavigateTab('quizzes')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeTab === 'quizzes'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Quizzes</span>
              </button>

              <button
                onClick={() => handleNavigateTab('analytics')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 shrink-0" />
                <span>Analytics</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
