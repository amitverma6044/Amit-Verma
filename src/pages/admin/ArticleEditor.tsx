import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Article, ArticleCategory, RelatedCourse, Quiz, ArticleVersion } from '../../types';
import { RichTextEditor } from '../../components/RichTextEditor';
import { SeoSidePanel } from '../../components/SeoSidePanel';
import { PlagiarismSidePanel } from '../../components/PlagiarismSidePanel';
import { ReadabilitySidePanel } from '../../components/ReadabilitySidePanel';
import { CourseIntegrationPanel } from '../../components/CourseIntegrationPanel';
import { VersionHistoryPanel } from '../../components/VersionHistoryPanel';
import { TableOfContentsPanel } from '../../components/TableOfContentsPanel';
import { QuizIntegrationPanel } from '../../components/QuizIntegrationPanel';
import { VersionDiffModal } from '../../components/VersionDiffModal';
import { WritingAssistantPanel } from '../../components/WritingAssistantPanel';
import {
  EditorLayoutManagerModal,
  LayoutManagerSettings,
  DEFAULT_LAYOUT_SETTINGS,
} from '../../components/EditorLayoutManagerModal';
import { LiveReaderPreviewModal } from '../../components/LiveReaderPreviewModal';
import { TypographyManagerModal } from '../../components/TypographyManagerModal';
import { ArticleCommentsSection } from '../../components/ArticleCommentsSection';
import { LUCID_THEMES, getLucidThemeById } from '../../utils/lucidThemes';
import {
  buildAdminRoute,
  createDefaultArticleDraft,
  saveOrUpdateArticleApi,
} from '../../utils/articleApiClient';
import {
  Search,
  ShieldCheck,
  Activity,
  GraduationCap,
  History,
  Save,
  Send,
  Printer,
  ChevronRight,
  ChevronLeft,
  ListTree,
  HelpCircle,
  Feather,
  Users,
  Eye,
  Palette,
  Layout,
  Type,
  BookOpen,
  FileText,
  BarChart2,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export interface ArticleEditorProps {
  mode?: 'create' | 'edit' | 'editor';
  articles?: Article[];
  article?: Article;
  onUpdateArticle: (updated: Article) => void;
  onCreateArticle?: (created: Article) => void;
  onSave?: (savedArticle?: Article) => void;
  onPublish?: (publishedArticle?: Article) => void;
  onOpenExport: () => void;
  availableCourses: RelatedCourse[];
  availableQuizzes: Quiz[];
  onAddQuizToPortal?: (quiz: Quiz) => void;
  lastAutoSavedTime?: string;
  activePortalTab?: 'editor' | 'articles' | 'courses' | 'quizzes' | 'analytics';
  setActivePortalTab?: (tab: 'editor' | 'articles' | 'courses' | 'quizzes' | 'analytics') => void;
  currentLanguage?: string;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  mode = 'editor',
  articles = [],
  article: propArticle,
  onUpdateArticle,
  onCreateArticle,
  onSave,
  onPublish,
  onOpenExport,
  availableCourses,
  availableQuizzes,
  onAddQuizToPortal,
  activePortalTab = 'editor',
  setActivePortalTab,
  currentLanguage = 'English',
}) => {
  const { id: routeArticleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isCreateRoute =
    mode === 'create' || location.pathname.endsWith('/admin/articles/create');

  // Draft state for `/admin/articles/create` before first save, or resolved article from `:id`
  const [draftArticle, setDraftArticle] = useState<Article>(() =>
    createDefaultArticleDraft(currentLanguage)
  );

  // Reset draft when entering `/admin/articles/create`
  useEffect(() => {
    if (isCreateRoute) {
      const freshDraft = createDefaultArticleDraft(currentLanguage);
      setDraftArticle(freshDraft);
    }
  }, [isCreateRoute, location.key, currentLanguage]);

  // Resolve the active article from route param `:id`, create draft, or fallback prop
  const resolvedArticle: Article = React.useMemo(() => {
    if (routeArticleId && articles.length > 0) {
      const found = articles.find((a) => a.id === routeArticleId);
      if (found) return found;
    }
    if (isCreateRoute) {
      const existingCreated = articles.find((a) => a.id === draftArticle.id);
      return existingCreated || draftArticle;
    }
    return propArticle || articles[0] || draftArticle;
  }, [routeArticleId, articles, isCreateRoute, draftArticle, propArticle]);

  const article = resolvedArticle;

  // Sync changes to local draft and parent state
  const commitArticleChange = (updated: Article) => {
    if (isCreateRoute) {
      setDraftArticle(updated);
    }
    onUpdateArticle(updated);
  };

  // Backend API (/api/articles) state
  const [apiSavingState, setApiSavingState] = useState<'idle' | 'saving' | 'updating'>('idle');
  const [apiToast, setApiToast] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const triggerToast = (type: 'success' | 'error', text: string) => {
    setApiToast({ type, text });
    setTimeout(() => {
      setApiToast((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Standard fetch handler for 'Save' button -> POST /api/articles or PUT /api/articles/:id
  const handleSaveToBackendApi = async () => {
    setApiSavingState('saving');
    try {
      const result = await saveOrUpdateArticleApi(article, {
        isCreateMode: isCreateRoute,
        publishUpdate: false,
      });

      if (isCreateRoute && onCreateArticle) {
        onCreateArticle(result.article);
      } else {
        commitArticleChange(result.article);
      }

      if (onSave) {
        onSave(result.article);
      }

      triggerToast('success', result.message);

      if (isCreateRoute) {
        navigate(buildAdminRoute('edit', result.article.id), { replace: true });
      }
    } catch (err: any) {
      commitArticleChange(article);
      if (onSave) onSave(article);
      triggerToast('error', err?.message || 'Saved locally (Backend API unreachable)');
    } finally {
      setApiSavingState('idle');
    }
  };

  // Standard fetch handler for 'Update' / 'Publish' button -> PUT /api/articles/:id (or POST /api/articles)
  const handleUpdatePublishedBackendApi = async () => {
    setApiSavingState('updating');
    try {
      const result = await saveOrUpdateArticleApi(article, {
        isCreateMode: isCreateRoute,
        publishUpdate: true,
      });

      if (isCreateRoute && onCreateArticle) {
        onCreateArticle(result.article);
      } else {
        commitArticleChange(result.article);
      }

      if (onPublish) {
        onPublish(result.article);
      }

      triggerToast('success', result.message);

      if (isCreateRoute) {
        navigate(buildAdminRoute('edit', result.article.id), { replace: true });
      }
    } catch (err: any) {
      const fallbackPublished: Article = { ...article, status: 'Published' };
      commitArticleChange(fallbackPublished);
      if (onPublish) onPublish(fallbackPublished);
      triggerToast('error', err?.message || 'Updated locally');
    } finally {
      setApiSavingState('idle');
    }
  };

  // Navigate back to `/admin/articles` list view
  const handleBackToArticles = () => {
    if (setActivePortalTab) {
      setActivePortalTab('articles');
    }
    navigate(buildAdminRoute('articles'));
  };

  // Portal Navigation helper with React Router integration
  const handlePortalNavigate = (
    tab: 'editor' | 'articles' | 'courses' | 'quizzes' | 'analytics'
  ) => {
    if (setActivePortalTab) {
      setActivePortalTab(tab);
    }
    if (tab === 'articles') {
      navigate(buildAdminRoute('articles'));
    } else if (tab === 'editor') {
      navigate(
        article?.id ? buildAdminRoute('edit', article.id) : buildAdminRoute('editor')
      );
    } else if (tab === 'courses') {
      navigate(buildAdminRoute('courses'));
    } else if (tab === 'quizzes') {
      navigate(buildAdminRoute('quizzes'));
    } else if (tab === 'analytics') {
      navigate(buildAdminRoute('analytics'));
    }
  };

  const [activeSideTab, setActiveSideTab] = useState<
    'toc' | 'assistant' | 'quiz' | 'seo' | 'plagiarism' | 'readability' | 'courses' | 'history'
  >('toc');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isFocusReader, setIsFocusReader] = useState(false);
  const [showParagraphMetadata, setShowParagraphMetadata] = useState(true);
  const [showVersionDiffModal, setShowVersionDiffModal] = useState(false);
  const [showLayoutManagerModal, setShowLayoutManagerModal] = useState(false);
  const [showLiveReaderPreviewModal, setShowLiveReaderPreviewModal] = useState(false);
  const [showTypographyManagerModal, setShowTypographyManagerModal] = useState(false);
  const [layoutSettings, setLayoutSettings] =
    useState<LayoutManagerSettings>(DEFAULT_LAYOUT_SETTINGS);
  const [articleLucidThemeId, setArticleLucidThemeId] = useState<string>(
    article.lucidThemeId || 'indigo'
  );
  const activeTheme = getLucidThemeById(
    article.lucidThemeId || articleLucidThemeId || 'indigo'
  );

  const typographySettings = article.typographySettings || {
    bodyFontFamily: 'Inter, sans-serif',
    headingFontFamily: "'Outfit', sans-serif",
    globalFontSize: '16px',
    lineHeight: '1.7',
  };

  const articleComments = article.comments || [
    {
      id: 'c1',
      authorName: 'Aarav Sharma (B.Tech Aspirant)',
      text: 'The explanation of the formulas and step-by-step mathematical concepts is super clear! Thanks TestPrime team.',
      rating: 5,
      timestamp: '2 hours ago',
      likes: 12,
      educatorReply:
        'Thank you Aarav! Keep practicing the practice quiz questions attached below.',
      approved: true,
    },
    {
      id: 'c2',
      authorName: 'Dr. Meenakshi Sundaram',
      text: 'Extremely well organized theory notes. Perfect reference material for my engineering classroom lectures.',
      rating: 5,
      timestamp: 'Yesterday',
      likes: 8,
      approved: true,
    },
  ];

  const handleAddComment = (newComment: {
    authorName: string;
    text: string;
    rating: number;
  }) => {
    const commentObj = {
      id: `comment-${Date.now()}`,
      authorName: newComment.authorName,
      text: newComment.text,
      rating: newComment.rating,
      timestamp: 'Just now',
      likes: 0,
      approved: true,
    };
    const updatedComments = [commentObj, ...articleComments];
    const totalVotes = updatedComments.length;
    const sumRatings = updatedComments.reduce((sum, c) => sum + c.rating, 0);
    const avgRating = totalVotes > 0 ? sumRatings / totalVotes : 5.0;

    commitArticleChange({
      ...article,
      comments: updatedComments,
      rating: {
        averageRating: Number(avgRating.toFixed(1)),
        totalVotes,
        breakdown: {
          5: updatedComments.filter((c) => c.rating === 5).length,
          4: updatedComments.filter((c) => c.rating === 4).length,
          3: updatedComments.filter((c) => c.rating === 3).length,
          2: updatedComments.filter((c) => c.rating === 2).length,
          1: updatedComments.filter((c) => c.rating === 1).length,
        },
      },
    });
  };

  const handleLikeComment = (commentId: string) => {
    const updated = articleComments.map((c) =>
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    );
    commitArticleChange({ ...article, comments: updated });
  };

  const handleAdminReply = (commentId: string, replyText: string) => {
    const updated = articleComments.map((c) =>
      c.id === commentId ? { ...c, educatorReply: replyText } : c
    );
    commitArticleChange({ ...article, comments: updated });
  };

  const handleAdminDeleteComment = (commentId: string) => {
    const updated = articleComments.filter((c) => c.id !== commentId);
    commitArticleChange({ ...article, comments: updated });
  };

  const handleAdminToggleApprove = (commentId: string) => {
    const updated = articleComments.map((c) =>
      c.id === commentId ? { ...c, approved: !c.approved } : c
    );
    commitArticleChange({ ...article, comments: updated });
  };

  const [activeCollaborators] = useState([
    {
      id: 'u1',
      name: 'Dr. A. Sharma',
      role: 'Senior Editor',
      status: 'Editing Sec 2',
      avatarBg: 'bg-emerald-600',
    },
    {
      id: 'u2',
      name: 'Ankit V.',
      role: 'Curator',
      status: 'Reviewing MCQs',
      avatarBg: 'bg-indigo-600',
    },
    {
      id: 'u3',
      name: 'Priya S.',
      role: 'Fact Checker',
      status: 'Active now',
      avatarBg: 'bg-purple-600',
    },
  ]);

  const handleTitleChange = (newTitle: string) => {
    commitArticleChange({
      ...article,
      title: newTitle,
      seo: {
        ...article.seo,
        metaTitle: article.seo.metaTitle || newTitle,
        canonicalSlug:
          article.seo.canonicalSlug ||
          newTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
      },
    });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    commitArticleChange({
      ...article,
      subtitle: newSubtitle,
    });
  };

  const handleContentChange = (contentHtml: string, contentText: string) => {
    commitArticleChange({
      ...article,
      contentHtml,
      contentText,
      readTimeMinutes: Math.max(
        1,
        Math.ceil(contentText.split(/\s+/).filter(Boolean).length / 200)
      ),
    });
  };

  const handleToggleCourse = (courseId: string) => {
    const isAttached = article.attachedCourseIds.includes(courseId);
    const updatedIds = isAttached
      ? article.attachedCourseIds.filter((id) => id !== courseId)
      : [...article.attachedCourseIds, courseId];
    commitArticleChange({
      ...article,
      attachedCourseIds: updatedIds,
    });
  };

  const handleSaveSnapshot = () => {
    const wordCount = article.contentText.split(/\s+/).filter(Boolean).length;
    const newVersion: ArticleVersion = {
      id: `ver-${Date.now()}`,
      timestamp: new Date().toLocaleString([], {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      title: article.title || 'Untitled Draft',
      wordCount,
      summary: `Saved revision with ${wordCount} words and ${article.seo.keywords.length} keywords.`,
      savedBy: article.author || 'Editor',
      contentSnapshot: article.contentHtml,
    };
    commitArticleChange({
      ...article,
      versionHistory: [newVersion, ...article.versionHistory],
    });
  };

  const handleRestoreVersion = (ver: ArticleVersion) => {
    commitArticleChange({
      ...article,
      contentHtml: ver.contentSnapshot,
    });
  };

  const handleInsertQuizToArticleContent = (quizHtml: string) => {
    commitArticleChange({
      ...article,
      contentHtml: article.contentHtml + quizHtml,
    });
  };

  const handleApplyWritingFix = (
    originalSnippet: string,
    replacementSnippet: string
  ) => {
    let updatedHtml = article.contentHtml;
    if (updatedHtml.includes(originalSnippet)) {
      updatedHtml = updatedHtml.replace(originalSnippet, replacementSnippet);
    } else {
      updatedHtml =
        updatedHtml + `<p><em>Suggestion Applied:</em> ${replacementSnippet}</p>`;
    }
    const updatedText = updatedHtml.replace(/<[^>]*>/g, '');
    commitArticleChange({
      ...article,
      contentHtml: updatedHtml,
      contentText: updatedText,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusReader) {
        setIsFocusReader(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusReader]);

  if (isFocusReader) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md p-6 lg:p-12 overflow-y-auto max-w-5xl mx-auto shadow-2xl flex flex-col font-sans antialiased min-w-0">
        <div className="bg-slate-800 text-white p-3 px-5 rounded-2xl shadow-xl flex items-center justify-between gap-4 mb-6 sticky top-2 z-50 font-sans border border-slate-700 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Eye className="w-4 h-4 text-indigo-400 shrink-0 flex-shrink-0" />
            <span className="font-bold text-sm shrink-0">Focus Reader Mode</span>
            <span className="hidden sm:inline text-xs text-slate-400 min-w-0 truncate">
              · Distraction-free deep writing
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-shrink-0">
            <span className="text-xs text-slate-300 font-mono shrink-0">
              {article.contentText.split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              onClick={() => setIsFocusReader(false)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 flex-shrink-0"
            >
              <span>Exit Focus Reader [Esc]</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-8 lg:p-12 rounded-2xl border border-slate-200 shadow-lg space-y-6 flex-1 min-w-0">
          <input
            type="text"
            value={article.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter Article Title..."
            className="w-full text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 outline-none min-w-0"
          />
          <input
            type="text"
            value={article.subtitle || ''}
            onChange={(e) => handleSubtitleChange(e.target.value)}
            placeholder="Subtitle..."
            className="w-full text-base text-slate-600 outline-none border-t border-slate-100 pt-2 font-normal min-w-0"
          />
          <RichTextEditor
            contentHtml={article.contentHtml}
            onChange={handleContentChange}
            availableCourses={availableCourses}
            availableQuizzes={availableQuizzes}
            onToggleFocusReader={() => setIsFocusReader(false)}
            isFocusReader={true}
            showParagraphMetadata={showParagraphMetadata}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col bg-[#f8fafc] font-sans max-w-full min-w-0">
      {/* API Feedback Toast Banner */}
      {apiToast && (
        <div
          role="status"
          className={`mx-4 mt-3 px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 shadow-xs transition-all ${
            apiToast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="break-words min-w-0">{apiToast.text}</span>
          </div>
          <button
            onClick={() => setApiToast(null)}
            className="text-xs font-bold px-2 py-0.5 rounded hover:bg-black/5 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN WORKSPACE: 3-COLUMN VERTICAL STUDIO GRID */}
      <div
        className={`w-full max-w-[1600px] mx-auto p-4 md:p-5 grid grid-cols-1 ${
          isLeftPanelOpen && isSidePanelOpen
            ? 'lg:grid-cols-[250px_1fr_430px]'
            : isLeftPanelOpen && !isSidePanelOpen
            ? 'lg:grid-cols-[250px_1fr_116px]'
            : !isLeftPanelOpen && isSidePanelOpen
            ? 'lg:grid-cols-[76px_1fr_430px]'
            : 'lg:grid-cols-[76px_1fr_116px]'
        } gap-5 items-start min-w-0 ${
          layoutSettings.editorCanvasSection.textAlign || 'text-left'
        }`}
        style={{ maxWidth: `${layoutSettings.editorCanvasSection.widthPercent}%` }}
      >
        {/* LEFT COLUMN: VERTICAL SCROLLABLE NAVIGATION, METADATA & ACTIONS SIDEBAR */}
        <aside className="w-full lg:h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-2rem)] min-w-0 flex flex-col sticky top-4 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="sticky top-0 z-10 px-3 py-2.5 bg-white/95 backdrop-blur-xs border-b border-slate-200 flex items-center justify-between gap-2 min-w-0 shrink-0">
            {isLeftPanelOpen && (
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider truncate">
                  Navigation & Controls
                </span>
              </div>
            )}
            <button
              onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg hidden lg:flex items-center justify-center shrink-0 flex-shrink-0 ml-auto border border-slate-200/70"
              title={
                isLeftPanelOpen
                  ? 'Collapse Left Control Panel'
                  : 'Expand Left Control Panel'
              }
            >
              {isLeftPanelOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {isLeftPanelOpen ? (
            <div className="flex-1 overflow-y-auto vertical-scroll-bar scroll-smooth p-3.5 flex flex-col gap-4 min-h-0 min-w-0">
              {/* SECTION 1: PORTAL NAVIGATION (Vertical Stack) */}
              <div className="flex flex-col gap-1.5 pb-3.5 border-b border-slate-200/80 min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  Portal Navigation
                </span>
                <button
                  onClick={handleBackToArticles}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-left transition-all shrink-0 min-w-0 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0 text-slate-700" />
                  <span className="truncate min-w-0">Back to Articles</span>
                </button>
                {[
                  { id: 'editor', label: 'Article Editor', icon: FileText },
                  { id: 'articles', label: 'Articles & Notes', icon: BookOpen },
                  { id: 'courses', label: 'Courses & Test Series', icon: GraduationCap },
                  { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
                  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                ].map((navItem) => {
                  const NavIcon = navItem.icon;
                  const isCurrent = activePortalTab === navItem.id;
                  return (
                    <button
                      key={navItem.id}
                      onClick={() => handlePortalNavigate(navItem.id as any)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-left transition-all shrink-0 min-w-0 ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
                      }`}
                    >
                      <NavIcon
                        className={`w-4 h-4 shrink-0 ${
                          isCurrent ? 'text-white' : 'text-indigo-600'
                        }`}
                      />
                      <span className="truncate min-w-0">{navItem.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SECTION 2: PUBLISHING & WORKSPACE ACTIONS (Connected to /api/articles) */}
              <div className="flex flex-col gap-2 pb-3.5 border-b border-slate-200/80 min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  Publishing & Workspace
                </span>

                <button
                  onClick={handleUpdatePublishedBackendApi}
                  disabled={apiSavingState !== 'idle'}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  {apiSavingState === 'updating' ? (
                    <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>
                    {article.status === 'Published' ? 'Update' : 'Publish Article'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-1.5 min-w-0">
                  <button
                    onClick={handleSaveToBackendApi}
                    disabled={apiSavingState !== 'idle'}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-60 rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    {apiSavingState === 'saving' ? (
                      <Loader2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span>Save</span>
                  </button>

                  <button
                    onClick={() => setShowLiveReaderPreviewModal(true)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors shrink-0"
                    title="Inspect exact student reader view before publishing"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => setShowTypographyManagerModal(true)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-colors shrink-0"
                    title="Open Typography Manager"
                  >
                    <Type className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Typography</span>
                  </button>

                  <button
                    onClick={() => setShowLayoutManagerModal(true)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition-colors shrink-0"
                    title="Open Section Layout Manager"
                  >
                    <Layout className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                    <span>Layout</span>
                  </button>

                  <button
                    onClick={() => setIsFocusReader(true)}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
                    title="Open Focus Reader Mode"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Focus</span>
                  </button>

                  <button
                    onClick={onOpenExport}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold transition-colors shrink-0"
                    title="Print article or save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>PDF / Print</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: ARTICLE METADATA (Vertical Form Stack) */}
              <div className="flex flex-col gap-3 pb-3.5 border-b border-slate-200/80 min-w-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  Article Metadata
                </span>

                <div className="flex flex-col gap-1 min-w-0">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={article.category}
                    onChange={(e) =>
                      commitArticleChange({
                        ...article,
                        category: e.target.value as ArticleCategory,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Theory Notes">Theory Notes</option>
                    <option value="Editorial">Editorial</option>
                    <option value="News Article">News Article</option>
                    <option value="Quiz Article">Quiz Article</option>
                    <option value="Exam Strategy">Exam Strategy</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 whitespace-nowrap ${
                      article.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        article.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{article.status}</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Author
                  </label>
                  <input
                    type="text"
                    value={article.author}
                    onChange={(e) =>
                      commitArticleChange({ ...article, author: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium bg-slate-50/70 text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                    placeholder="Author Name"
                  />
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Palette className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span>Lucid Theme</span>
                  </label>
                  <select
                    value={article.lucidThemeId || articleLucidThemeId}
                    onChange={(e) => {
                      const newThemeId = e.target.value;
                      setArticleLucidThemeId(newThemeId);
                      commitArticleChange({ ...article, lucidThemeId: newThemeId });
                    }}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                    title="Select Article & Quiz Lucid Light Color Theme"
                  >
                    {LUCID_THEMES.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 4: COLLABORATORS & PRESENCE */}
              <div className="flex flex-col gap-2.5 bg-slate-50/90 p-3 rounded-xl border border-slate-200/80 min-w-0">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex -space-x-2 overflow-hidden shrink-0">
                    {activeCollaborators.map((user) => (
                      <div
                        key={user.id}
                        className={`relative inline-block w-7 h-7 rounded-full ${user.avatarBg} text-white font-bold text-[11px] flex items-center justify-center ring-2 ring-white cursor-pointer shrink-0`}
                        title={`${user.name} (${user.role}) — ${user.status}`}
                      >
                        {user.name.slice(0, 2)}
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col text-[11px] min-w-0">
                    <span className="font-bold text-slate-800 flex items-center gap-1 truncate">
                      <Users className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>3 Active Editors</span>
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">
                      Dr. Sharma editing...
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowParagraphMetadata(!showParagraphMetadata)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors text-center ${
                    showParagraphMetadata
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {showParagraphMetadata ? '✓ Author Badges On' : '+ Show Author Badges'}
                </button>
              </div>
            </div>
          ) : (
            /* Collapsed Left Vertical Rail */
            <div className="flex-1 overflow-y-auto vertical-scroll-bar p-2 flex flex-col items-center gap-2 min-h-0">
              <button
                onClick={handleUpdatePublishedBackendApi}
                title={article.status === 'Published' ? 'Update Article' : 'Publish Article'}
                className="w-full py-2.5 px-1 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center gap-1 text-[10px] font-bold shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{article.status === 'Published' ? 'Update' : 'Publish'}</span>
              </button>
              <button
                onClick={handleSaveToBackendApi}
                title="Save Draft"
                className="w-full py-2 px-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold"
              >
                <Save className="w-4 h-4 text-slate-600" />
                <span>Save</span>
              </button>
              <button
                onClick={() => setShowLiveReaderPreviewModal(true)}
                title="Preview"
                className="w-full py-2 px-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold"
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setShowTypographyManagerModal(true)}
                title="Typography"
                className="w-full py-2 px-1 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold"
              >
                <Type className="w-4 h-4 text-indigo-600" />
                <span>Type</span>
              </button>
              <button
                onClick={() => setShowLayoutManagerModal(true)}
                title="Layout"
                className="w-full py-2 px-1 rounded-xl bg-slate-800 text-white flex flex-col items-center justify-center gap-1 text-[10px] font-semibold"
              >
                <Layout className="w-4 h-4 text-indigo-300" />
                <span>Layout</span>
              </button>
              <button
                onClick={() => setIsFocusReader(true)}
                title="Focus Mode"
                className="w-full py-2 px-1 rounded-xl bg-white text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold"
              >
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Focus</span>
              </button>
              <button
                onClick={onOpenExport}
                title="PDF / Print"
                className="w-full py-2 px-1 rounded-xl bg-white text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>Print</span>
              </button>
            </div>
          )}
        </aside>

        {layoutSettings.editorCanvasSection.isVisible && (
          <section className="flex flex-col gap-4 min-w-0 w-full">
            {/* Paragraph Author Metadata Info Banner */}
            {showParagraphMetadata && (
              <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between gap-2 font-sans min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0 flex-shrink-0" />
                  <span className="min-w-0 break-words">
                    <strong>Multi-User Presence Active:</strong> Paragraph author badges
                    and active collaborator cursor timestamps enabled.
                  </span>
                </div>
                <button
                  onClick={() => setShowParagraphMetadata(false)}
                  className="text-indigo-400 hover:text-indigo-700 text-xs font-bold shrink-0 flex-shrink-0 px-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Main Title Heading Card: Fully Wrapped and Breakable */}
            <div
              className="bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 w-full min-w-0"
              style={{ padding: `${layoutSettings.editorCanvasSection.paddingPx}px` }}
            >
              <div className="w-full min-w-0 space-y-2">
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleTitleChange(e.currentTarget.textContent || '')}
                  className={`w-full min-w-0 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight whitespace-normal break-words outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-1 -mx-1 ${
                    layoutSettings.editorCanvasSection.textAlign || 'text-left'
                  }`}
                >
                  {article.title}
                </h1>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleSubtitleChange(e.currentTarget.textContent || '')}
                  className={`w-full min-w-0 text-sm text-slate-500 font-normal leading-relaxed whitespace-normal break-words border-t border-slate-100 pt-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-1 -mx-1 ${
                    layoutSettings.editorCanvasSection.textAlign || 'text-left'
                  }`}
                >
                  {article.subtitle ||
                    'Add a brief summary or subtitle for your students...'}
                </p>
              </div>
            </div>

            {/* Large Rich Text Editor Component */}
            <RichTextEditor
              contentHtml={article.contentHtml}
              onChange={handleContentChange}
              availableCourses={availableCourses}
              availableQuizzes={availableQuizzes}
              onToggleFocusReader={() => setIsFocusReader(!isFocusReader)}
              isFocusReader={isFocusReader}
              showParagraphMetadata={showParagraphMetadata}
              lucidThemeId={activeTheme.id}
            />
          </section>
        )}

        {/* RIGHT COLUMN: SIDEBAR (Sticky Header + Left Vertical flex-col Tab Stack + Encapsulated flex-1 overflow-y-auto vertical-scroll-bar Content Panel) */}
        <aside className="w-full lg:h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-2rem)] min-w-0 flex flex-col sticky top-4 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="sticky top-0 z-10 px-3.5 py-2.5 bg-white/95 backdrop-blur-xs border-b border-slate-200 flex items-center justify-between gap-2 min-w-0 shrink-0">
            {isSidePanelOpen ? (
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider truncate">
                  Editor Tools & Suite
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[10px] font-bold uppercase tracking-wide shrink-0">
                  {activeSideTab}
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider truncate">
                Tools
              </span>
            )}
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg hidden lg:flex items-center justify-center shrink-0 flex-shrink-0 ml-auto border border-slate-200/70"
              title={isSidePanelOpen ? 'Collapse Side Panel' : 'Expand Side Panel'}
            >
              {isSidePanelOpen ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex-1 flex flex-row min-h-0 min-w-0 overflow-hidden">
            {/* LEFT VERTICAL FLEX-COL STACK OF FULL-WIDTH TAB TRIGGERS */}
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label="Editor tools navigation"
              className={`${
                isSidePanelOpen ? 'w-32 border-r border-slate-200' : 'w-full'
              } shrink-0 flex-shrink-0 bg-slate-50/90 p-2 flex flex-col gap-1.5 overflow-y-auto vertical-scroll-bar min-h-0`}
            >
              {[
                {
                  id: 'toc',
                  label: 'TOC',
                  icon: ListTree,
                  title: 'Table of Contents (Heading Jump)',
                },
                {
                  id: 'assistant',
                  label: 'Assistant',
                  icon: Feather,
                  title: 'AI Writing & Proofreading Assistant',
                },
                {
                  id: 'quiz',
                  label: 'Quiz Gen',
                  icon: HelpCircle,
                  title: 'AI MCQ Quiz Generator',
                },
                {
                  id: 'seo',
                  label: 'SEO',
                  icon: Search,
                  title: 'SEO Settings & Meta Generator',
                },
                {
                  id: 'plagiarism',
                  label: 'Plagiarism',
                  icon: ShieldCheck,
                  title: 'Plagiarism Audit',
                },
                {
                  id: 'readability',
                  label: 'Readability',
                  icon: Activity,
                  title: 'Readability Score',
                },
                {
                  id: 'courses',
                  label: 'Courses',
                  icon: GraduationCap,
                  title: 'Course Linkage',
                },
                {
                  id: 'history',
                  label: 'History',
                  icon: History,
                  title: 'Version History Timeline',
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSideTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveSideTab(tab.id as any);
                      if (!isSidePanelOpen) {
                        setIsSidePanelOpen(true);
                      }
                    }}
                    title={tab.title}
                    className={`w-full px-2.5 py-2.5 rounded-xl text-xs font-semibold shrink-0 flex-shrink-0 flex items-center gap-2 text-left transition-all min-w-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-indigo-600'
                      }`}
                    />
                    <span className="truncate min-w-0">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ENCAPSULATED CONTENT CONTAINER */}
            {isSidePanelOpen && (
              <div className="flex-1 overflow-y-auto vertical-scroll-bar scroll-smooth p-4 min-h-0 min-w-0">
                {activeSideTab === 'toc' && (
                  <TableOfContentsPanel
                    contentHtml={article.contentHtml}
                    onReorderContent={handleContentChange}
                  />
                )}

                {activeSideTab === 'assistant' && (
                  <WritingAssistantPanel
                    articleContentText={article.contentText}
                    articleContentHtml={article.contentHtml}
                    onApplyFix={handleApplyWritingFix}
                  />
                )}

                {activeSideTab === 'quiz' && (
                  <QuizIntegrationPanel
                    articleTitle={article.title}
                    articleContent={article.contentText}
                    availableQuizzes={availableQuizzes}
                    onInsertQuizToArticle={handleInsertQuizToArticleContent}
                    onAddQuizToPortal={onAddQuizToPortal}
                  />
                )}

                {activeSideTab === 'seo' && (
                  <SeoSidePanel
                    seo={article.seo}
                    onChange={(seo) => commitArticleChange({ ...article, seo })}
                    articleTitle={article.title}
                    articleContent={article.contentText}
                    articleCategory={article.category}
                  />
                )}

                {activeSideTab === 'plagiarism' && (
                  <PlagiarismSidePanel
                    plagiarism={article.plagiarism}
                    onUpdate={(plagiarism) =>
                      commitArticleChange({ ...article, plagiarism })
                    }
                    articleTitle={article.title}
                    articleContent={article.contentText}
                  />
                )}

                {activeSideTab === 'readability' && (
                  <ReadabilitySidePanel
                    readability={article.readability}
                    onUpdate={(readability) =>
                      commitArticleChange({ ...article, readability })
                    }
                    articleContent={article.contentText}
                  />
                )}

                {activeSideTab === 'courses' && (
                  <CourseIntegrationPanel
                    availableCourses={availableCourses}
                    attachedCourseIds={article.attachedCourseIds}
                    onToggleAttach={handleToggleCourse}
                  />
                )}

                {activeSideTab === 'history' && (
                  <VersionHistoryPanel
                    versionHistory={article.versionHistory}
                    onRestoreVersion={handleRestoreVersion}
                    onSaveCurrentSnapshot={handleSaveSnapshot}
                    onOpenDiffViewer={() => setShowVersionDiffModal(true)}
                  />
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Student Reviews & Comments Moderation Section */}
      <div
        className="w-full mx-auto px-4 lg:px-6"
        style={{ maxWidth: `${layoutSettings.editorCanvasSection.widthPercent}%` }}
      >
        <ArticleCommentsSection
          comments={articleComments}
          rating={
            article.rating || {
              averageRating: 4.8,
              totalVotes: articleComments.length,
              breakdown: { 5: 2, 4: 0, 3: 0, 2: 0, 1: 0 },
            }
          }
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onAdminReply={handleAdminReply}
          onAdminDeleteComment={handleAdminDeleteComment}
          onAdminToggleApprove={handleAdminToggleApprove}
          isAdmin={true}
        />
      </div>

      <VersionDiffModal
        isOpen={showVersionDiffModal}
        onClose={() => setShowVersionDiffModal(false)}
        versionHistory={article.versionHistory}
        currentContentHtml={article.contentHtml}
        currentTitle={article.title}
        onRestoreVersion={handleRestoreVersion}
      />

      <EditorLayoutManagerModal
        isOpen={showLayoutManagerModal}
        onClose={() => setShowLayoutManagerModal(false)}
        settings={layoutSettings}
        onUpdateSettings={setLayoutSettings}
      />

      <TypographyManagerModal
        isOpen={showTypographyManagerModal}
        onClose={() => setShowTypographyManagerModal(false)}
        settings={typographySettings}
        onUpdateSettings={(newSettings) => {
          commitArticleChange({
            ...article,
            typographySettings: newSettings,
          });
        }}
      />

      <LiveReaderPreviewModal
        isOpen={showLiveReaderPreviewModal}
        onClose={() => setShowLiveReaderPreviewModal(false)}
        article={article}
        courses={availableCourses}
        quizzes={availableQuizzes}
        onConfirmPublish={() => {
          setShowLiveReaderPreviewModal(false);
          handleUpdatePublishedBackendApi();
        }}
      />
    </div>
  );
};

export default ArticleEditor;
