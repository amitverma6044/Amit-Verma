import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Article } from '../types';
import { buildAdminRoute } from '../utils/articleApiClient';
import {
  Search,
  Plus,
  Clock,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Settings,
  BookOpen,
} from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNewArticle: () => void;
  onDeleteArticle: (id: string) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  onSelectArticle,
  onNewArticle,
  onDeleteArticle,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Article Container Management State
  const [gridCols, setGridCols] = useState<number>(2);
  const [displayLimit, setDisplayLimit] = useState<number>(0); // 0 = show all
  const [kickerText, setKickerText] = useState<string>('TestPrime Knowledge Hub');
  const [titleText, setTitleText] = useState<string>('Articles & Tech Guides');
  const [subtitleText, setSubtitleText] = useState<string>(
    'Manage long-form technical guides, editorials, theory notes, and practice articles with built-in SEO & readability scoring.'
  );
  const [isContainerHidden, setIsContainerHidden] = useState<boolean>(false);
  const [hiddenArticleIds, setHiddenArticleIds] = useState<string[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const filteredArticles = articles.filter((a) => {
    const customCats = a.seo.customCategories || [];
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.subtitle && a.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.seo.keywords.some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customCats.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      a.category === selectedCategory ||
      customCats.includes(selectedCategory);
    const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const visibleArticles = filteredArticles.slice(
    0,
    displayLimit > 0 ? displayLimit : undefined
  );

  const toggleHideArticle = (id: string) => {
    if (hiddenArticleIds.includes(id)) {
      setHiddenArticleIds(hiddenArticleIds.filter((hId) => hId !== id));
    } else {
      setHiddenArticleIds([...hiddenArticleIds, id]);
    }
  };

  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  const handleWriteNewArticle = () => {
    onNewArticle();
    navigate(buildAdminRoute('create'));
  };

  const handleOpenArticleInEditor = (article: Article) => {
    onSelectArticle(article);
    navigate(buildAdminRoute('edit', article.id));
  };

  return (
    <div className="h-full flex-1 overflow-y-auto max-w-7xl mx-auto p-4 lg:p-8 space-y-6 font-sans w-full">
      {/* Top Banner & Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-xs min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 flex-shrink-0" />
            <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider font-mono min-w-0 truncate">
              {kickerText}
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 mt-1 min-w-0 break-words">
            {titleText}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl min-w-0 break-words">
            {subtitleText}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-shrink-0 flex-wrap">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
            title="Manage Article Container Layout, Display Limits, Text & Visibility Settings"
          >
            <Settings className="w-4 h-4 text-indigo-600 shrink-0 flex-shrink-0" />
            <span>Container Settings</span>
          </button>

          <Link
            to={buildAdminRoute('create')}
            onClick={onNewArticle}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 flex-shrink-0 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0 flex-shrink-0" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Container Hidden Notice */}
      {isContainerHidden && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <EyeOff className="w-4 h-4 text-amber-600 shrink-0 flex-shrink-0" />
            <span className="min-w-0 break-words">
              <strong>Container Hidden:</strong> The Articles container is currently set
              to hidden for readers.
            </span>
          </div>
          <button
            onClick={() => setIsContainerHidden(false)}
            className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors text-[11px] shrink-0 flex-shrink-0"
          >
            Unhide Container
          </button>
        </div>
      )}

      {!isContainerHidden && (
        <>
          {/* Filter & Instant Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles, topics or keywords..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 bg-slate-50/50"
              />
            </div>

            {/* Category & Status Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 outline-none focus:border-indigo-600"
              >
                <option value="All">All Categories</option>
                <option value="Theory Notes">Theory Notes</option>
                <option value="Editorial">Editorial</option>
                <option value="News Article">News Article</option>
                <option value="Quiz Article">Quiz Article</option>
                <option value="Exam Strategy">Exam Strategy</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 outline-none focus:border-indigo-600"
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Article Cards Grid */}
          <div className={`grid ${getGridColsClass(gridCols)} gap-6`}>
            {visibleArticles.map((article) => {
              const isHidden = hiddenArticleIds.includes(article.id);
              return (
                <div
                  key={article.id}
                  className={`bg-white border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${
                    isHidden
                      ? 'opacity-60 border-dashed border-amber-300 bg-amber-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Category, Status & Read Time */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-indigo-600 tracking-wider uppercase text-[10px] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                          {article.category}
                        </span>
                        {article.seo.customCategories &&
                          article.seo.customCategories.map((cat) => (
                            <span
                              key={cat}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium text-[10px] rounded-full border border-slate-200"
                            >
                              {cat}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {isHidden && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-mono font-bold rounded">
                            Hidden
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            article.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {article.status}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{article.readTimeMinutes} min read</span>
                        </span>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3
                        onClick={() => handleOpenArticleInEditor(article)}
                        className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors leading-snug line-clamp-2"
                      >
                        {article.title}
                      </h3>
                      {article.subtitle && (
                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                          {article.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Keyword Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {article.seo.keywords.slice(0, 4).map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Actions & Scores */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-wrap">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600 shrink-0 flex-shrink-0">
                        <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0 flex-shrink-0" />
                        <span>{article.viewsCount.toLocaleString()} views</span>
                      </span>
                      <span className="text-emerald-600 font-bold font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 flex-shrink-0">
                        SEO: {article.seo.seoScore}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 flex-shrink-0">
                      <button
                        onClick={() => toggleHideArticle(article.id)}
                        className={`p-1.5 rounded-lg transition-colors shrink-0 flex-shrink-0 ${
                          isHidden
                            ? 'bg-amber-100 text-amber-700'
                            : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                        }`}
                        title={
                          isHidden
                            ? 'Unhide Article for Readers'
                            : 'Hide Article from Readers'
                        }
                      >
                        {isHidden ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteArticle(article.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0 flex-shrink-0"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenArticleInEditor(article)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0 flex-shrink-0 whitespace-nowrap"
                      >
                        <Edit3 className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
                        <span>Open Editor</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CONTAINER SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 font-sans space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  Manage Articles Container
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Grid Layout Size */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                Container Grid Layout (Columns):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      gridCols === cols
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>
                      {cols} {cols === 1 ? 'Column' : 'Cols'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Limit Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                Maximum Articles to Display:
              </label>
              <div className="flex flex-wrap gap-2">
                {[2, 4, 6, 8, 0].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => setDisplayLimit(limit)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      displayLimit === limit
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {limit === 0 ? 'Show All Articles' : `Max ${limit} Articles`}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Customization */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-mono">
                Edit Container Text & Headings:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Section Main Title
                  </label>
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kicker Badge Tag
                  </label>
                  <input
                    type="text"
                    value={kickerText}
                    onChange={(e) => setKickerText(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Container Visibility */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 block">
                  Container Visibility
                </label>
                <span className="text-[11px] text-slate-500">
                  Show or hide this entire container in portal
                </span>
              </div>
              <button
                onClick={() => setIsContainerHidden(!isContainerHidden)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isContainerHidden
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isContainerHidden ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>
                  {isContainerHidden ? 'Container Hidden' : 'Container Visible'}
                </span>
              </button>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
