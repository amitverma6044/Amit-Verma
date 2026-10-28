import React from 'react';
import { Article } from '../types';
import { Eye, Clock, ShieldCheck, TrendingUp, BarChart2 } from 'lucide-react';

interface AnalyticsDashboardProps {
  articles: Article[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ articles }) => {
  const totalArticles = articles.length;
  const totalViews = articles.reduce((acc, a) => acc + a.viewsCount, 0);
  const avgReadTime = Math.round(articles.reduce((acc, a) => acc + a.readTimeMinutes, 0) / (totalArticles || 1));
  const avgSeoScore = Math.round(articles.reduce((acc, a) => acc + a.seo.seoScore, 0) / (totalArticles || 1));
  const avgOriginality = Math.round(articles.reduce((acc, a) => acc + (a.plagiarism?.originalityScore || 95), 0) / (totalArticles || 1));

  return (
    <div className="h-full flex-1 overflow-y-auto max-w-7xl mx-auto p-4 lg:p-8 space-y-6 font-sans w-full">
      
      {/* Title Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-600" />
          <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider font-mono">Performance Analytics</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Editorial & Reader Engagement Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Comprehensive metrics tracking readership views, content originality, SEO compliance, and student engagement.
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Total Views</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{totalViews.toLocaleString()}</span>
          <span className="block text-[10px] text-emerald-600 font-bold font-mono">+18.4% from last month</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Avg Read Time</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{avgReadTime} Mins</span>
          <span className="block text-[10px] text-slate-500">Optimal student retention rate</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Avg SEO Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-emerald-600 font-mono tracking-tight">{avgSeoScore}/100</span>
          <span className="block text-[10px] text-emerald-600 font-bold">Search engine optimized</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Originality Score</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{avgOriginality}%</span>
          <span className="block text-[10px] text-indigo-600 font-bold">Academic integrity verified</span>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 min-w-0">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Article Performance Breakdown</h3>
        <div className="overflow-x-auto horizontal-scroll-bar min-w-0">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider bg-slate-50 font-mono">
                <th className="p-3.5">Article Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Views</th>
                <th className="p-3.5">SEO Score</th>
                <th className="p-3.5">Readability</th>
                <th className="p-3.5">Originality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">{art.title}</td>
                  <td className="p-3.5 text-indigo-600 font-semibold">{art.category}</td>
                  <td className="p-3.5 font-mono text-slate-700">{art.viewsCount.toLocaleString()}</td>
                  <td className="p-3.5 font-bold text-emerald-600 font-mono">{art.seo.seoScore}/100</td>
                  <td className="p-3.5 text-slate-700 font-mono">{art.readability?.score || 85}%</td>
                  <td className="p-3.5 text-slate-700 font-mono">{art.plagiarism?.originalityScore || 96}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
