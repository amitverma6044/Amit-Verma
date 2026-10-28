import React, { useState } from 'react';
import { SeoData } from '../types';
import { Sparkles, Tag, Globe, FolderPlus, Layers, Bookmark, Plus, X } from 'lucide-react';

interface SeoSidePanelProps {
  seo: SeoData;
  onChange: (updatedSeo: SeoData) => void;
  articleTitle: string;
  articleContent: string;
  articleCategory: string;
}

// Common academic subject taxonomy presets
const PRESET_TAXONOMIES = [
  'Polity & Constitution',
  'GS Paper 2',
  'Indian Economy',
  'Current Affairs',
  'Science & Technology',
  'Environment & Ecology',
  'Ethics & GS-4',
  'World History',
  'CSAT & Aptitude',
  'Prelims Rapid Revision'
];

export const SeoSidePanel: React.FC<SeoSidePanelProps> = ({
  seo,
  onChange,
  articleTitle,
  articleContent,
  articleCategory,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newCustomCategory, setNewCustomCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  const activeCategories = seo.customCategories || [articleCategory];
  const activeTags = seo.tags || seo.keywords || [];

  const handleGenerateAiSeo = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          category: articleCategory,
          targetAudience: seo.targetAudience,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onChange({
          ...seo,
          metaDescription: data.metaDescription || seo.metaDescription,
          keywords: data.keywords && Array.isArray(data.keywords) ? data.keywords : seo.keywords,
          metaTitle: data.suggestedTitle || seo.metaTitle || articleTitle,
          seoScore: data.seoScore || 88,
          tips: data.tips || seo.tips,
          tags: data.keywords && Array.isArray(data.keywords) ? data.keywords : seo.tags,
        });
      }
    } catch (err) {
      console.error('Failed to generate SEO with AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add custom category / taxonomy
  const addCustomCategory = (catName: string) => {
    const trimmed = catName.trim();
    if (trimmed && !activeCategories.includes(trimmed)) {
      onChange({
        ...seo,
        customCategories: [...activeCategories, trimmed],
      });
      setNewCustomCategory('');
    }
  };

  // Remove custom category
  const removeCustomCategory = (catToRemove: string) => {
    onChange({
      ...seo,
      customCategories: activeCategories.filter((c) => c !== catToRemove),
    });
  };

  // Add keyword / tag
  const addTag = () => {
    const trimmed = newTag.trim() || newKeyword.trim();
    if (trimmed && !activeTags.includes(trimmed)) {
      const updated = [...activeTags, trimmed];
      onChange({
        ...seo,
        keywords: updated,
        tags: updated,
      });
      setNewTag('');
      setNewKeyword('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    const updated = activeTags.filter((t) => t !== tagToRemove);
    onChange({
      ...seo,
      keywords: updated,
      tags: updated,
    });
  };

  const metaDescLength = seo.metaDescription.length;
  const isMetaDescOptimal = metaDescLength >= 120 && metaDescLength <= 160;

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      
      {/* AI Generator Action Header */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-sm text-slate-900">AI SEO & Taxonomy Assistant</h4>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
            Score: {seo.seoScore}/100
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Automatically extract optimized meta descriptions, keywords, and custom taxonomies using Gemini AI.
        </p>
        <button
          onClick={handleGenerateAiSeo}
          disabled={isGenerating}
          className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGenerating ? 'Analyzing Article & Generating...' : 'Auto-Generate Metadata & Tags'}</span>
        </button>
      </div>

      {/* CUSTOM TAXONOMY & CATEGORY MANAGER */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 font-mono">
            Custom Taxonomies & Categories
          </h4>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug">
          Define multiple subject taxonomies to organize articles for students:
        </p>

        {/* Input + Add Button */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newCustomCategory}
            onChange={(e) => setNewCustomCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory(newCustomCategory))}
            placeholder="Type custom category (e.g. GS-2 Polity)..."
            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => addCustomCategory(newCustomCategory)}
            className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 shadow-xs transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Selected Taxonomies Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {activeCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-200 shadow-xs"
            >
              <Bookmark className="w-3 h-3 text-indigo-600" />
              <span>{cat}</span>
              <button
                onClick={() => removeCustomCategory(cat)}
                className="text-indigo-500 hover:text-red-600 ml-0.5"
                title="Remove Taxonomy"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Preset Taxonomy Chips */}
        <div className="pt-2 border-t border-slate-200/80">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
            Quick Add Subject Taxonomies:
          </span>
          <div className="flex flex-wrap gap-1">
            {PRESET_TAXONOMIES.map((preset) => {
              const isSelected = activeCategories.includes(preset);
              return (
                <button
                  key={preset}
                  onClick={() => isSelected ? removeCustomCategory(preset) : addCustomCategory(preset)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meta Title Field */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          Meta Title / Search Headline
        </label>
        <input
          type="text"
          value={seo.metaTitle}
          onChange={(e) => onChange({ ...seo, metaTitle: e.target.value })}
          placeholder="SEO headline shown in Google results"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 bg-white"
        />
      </div>

      {/* Meta Description Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Meta Description
          </label>
          <span className={`text-[10px] font-mono ${isMetaDescOptimal ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
            {metaDescLength} / 160 chars
          </span>
        </div>
        <textarea
          rows={3}
          value={seo.metaDescription}
          onChange={(e) => onChange({ ...seo, metaDescription: e.target.value })}
          placeholder="Concise summary that triggers search clicks..."
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 bg-white resize-none"
        />
      </div>

      {/* TOPIC TAGS & KEYWORDS MANAGER */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          Topic Tags & Keywords
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add topic tag..."
            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 bg-white"
          />
          <button
            onClick={addTag}
            className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tag Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {activeTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg font-mono"
            >
              <Tag className="w-3 h-3 text-indigo-600" />
              <span>{tag}</span>
              <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-600 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Target Audience & Canonical Slug */}
      <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-200">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">Target Audience</label>
          <input
            type="text"
            value={seo.targetAudience}
            onChange={(e) => onChange({ ...seo, targetAudience: e.target.value })}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none bg-white"
            placeholder="e.g. UPSC & Engineering Students"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">URL Slug</label>
          <input
            type="text"
            value={seo.canonicalSlug}
            onChange={(e) => onChange({ ...seo, canonicalSlug: e.target.value })}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none font-mono text-slate-600 bg-white"
            placeholder="article-url-slug"
          />
        </div>
      </div>

      {/* Google Search Live Preview Card */}
      <div className="pt-2 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span>Google Search Snippet Preview</span>
        </h4>
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs font-sans">
          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mb-0.5 font-mono">
            <span>edublog-portal.org</span>
            <span className="text-slate-300">›</span>
            <span>article</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-700">{seo.canonicalSlug || 'article-slug'}</span>
          </div>
          <h5 className="text-sm font-semibold text-indigo-600 hover:underline cursor-pointer line-clamp-1">
            {seo.metaTitle || articleTitle || 'Untitled Article'}
          </h5>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
            {seo.metaDescription || 'No meta description provided yet. Use AI generator above to craft an engaging summary.'}
          </p>
        </div>
      </div>

    </div>
  );
};
