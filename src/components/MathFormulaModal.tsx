import React, { useState } from 'react';
import { X, Sigma, Sparkles, Check, Copy, Code2, BookOpen } from 'lucide-react';
import { MATH_FORMULA_TEMPLATES, renderSingleFormula } from '../utils/mathRenderer';

interface MathFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (renderedHtml: string, rawLatex: string) => void;
}

export const MathFormulaModal: React.FC<MathFormulaModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [latexInput, setLatexInput] = useState<string>('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
  const [displayMode, setDisplayMode] = useState<boolean>(true); // Block by default
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = ['All', 'Algebra', 'Physics', 'Calculus', 'Chemistry', 'Statistics', 'Geometry', 'Linear Algebra'];

  const filteredTemplates = MATH_FORMULA_TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.latex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (latex: string) => {
    setLatexInput(latex);
  };

  const handleInsertShortcut = (snippet: string) => {
    setLatexInput((prev) => prev + snippet);
  };

  const handleInsert = () => {
    if (!latexInput.trim()) return;

    let renderedHtml = '';
    if (displayMode) {
      const mathContent = renderSingleFormula(latexInput, true);
      renderedHtml = `<div class="katex-block-formula my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center overflow-x-auto selection:bg-indigo-100" contenteditable="false" data-latex="${encodeURIComponent(latexInput)}">${mathContent}</div>`;
    } else {
      const mathContent = renderSingleFormula(latexInput, false);
      renderedHtml = `<span class="katex-inline-formula inline-block px-1.5 py-0.5 bg-indigo-50/80 rounded border border-indigo-100 text-slate-900 font-normal" contenteditable="false" data-latex="${encodeURIComponent(latexInput)}">${mathContent}</span>`;
    }

    onInsert(renderedHtml, latexInput);
    onClose();
  };

  const symbolShortcuts = [
    { label: 'Fraction', snippet: '\\frac{a}{b}' },
    { label: 'Square Root', snippet: '\\sqrt{x}' },
    { label: 'Exponent', snippet: 'x^{2}' },
    { label: 'Subscript', snippet: 'x_{n}' },
    { label: 'Integral', snippet: '\\int_{a}^{b} f(x)dx' },
    { label: 'Summation', snippet: '\\sum_{i=1}^{n}' },
    { label: 'Limit', snippet: '\\lim_{x \\to \\infty}' },
    { label: 'Pi (π)', snippet: '\\pi' },
    { label: 'Theta (θ)', snippet: '\\theta' },
    { label: 'Alpha (α)', snippet: '\\alpha' },
    { label: 'Beta (β)', snippet: '\\beta' },
    { label: 'Infinity (∞)', snippet: '\\infty' },
    { label: 'Plus/Minus', snippet: '\\pm' },
    { label: 'Arrow (→)', snippet: '\\rightarrow' },
    { label: 'Matrix 2x2', snippet: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Sigma className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Math & LaTeX Formula Studio
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                  KaTeX Enabled
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Insert mathematical equations, scientific formulas, and LaTeX expressions with real-time rendering.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Section: Live Editor & Live KaTeX Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  LaTeX Expression Input
                </label>
                {/* Format Toggle */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setDisplayMode(true)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      displayMode ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Block ($$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayMode(false)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      !displayMode ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Inline ($)
                  </button>
                </div>
              </div>

              <textarea
                value={latexInput}
                onChange={(e) => setLatexInput(e.target.value)}
                placeholder="Type or paste LaTeX formula e.g. E = mc^2 or \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
                rows={4}
                className="w-full font-mono text-sm p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 shadow-inner resize-none"
              />

              {/* Quick Symbol Shortcuts */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Quick Shortcuts & Symbols:</p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-xl">
                  {symbolShortcuts.map((sc) => (
                    <button
                      key={sc.label}
                      type="button"
                      onClick={() => handleInsertShortcut(sc.snippet)}
                      className="px-2 py-1 text-xs bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 text-slate-700 rounded-lg transition-colors font-mono"
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="flex flex-col justify-between bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-md">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Live Rendered Formula
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {displayMode ? 'Display Mode (Centered)' : 'Inline Mode'}
                  </span>
                </div>

                <div className="my-6 py-6 px-4 bg-slate-950/80 rounded-xl border border-slate-800 text-center min-h-[100px] flex items-center justify-center overflow-x-auto">
                  {latexInput.trim() ? (
                    <div
                      className="text-lg text-white font-serif"
                      dangerouslySetInnerHTML={{
                        __html: renderSingleFormula(latexInput, displayMode),
                      }}
                    />
                  ) : (
                    <span className="text-slate-500 text-xs italic">Enter LaTeX code above to view preview</span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span>Supports standard TeX / LaTeX syntax</span>
                <span className="text-indigo-400 font-medium">Powered by KaTeX</span>
              </div>
            </div>
          </div>

          {/* Preset Formulas Library */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Popular Formula Templates & Presets
              </h3>
              <input
                type="text"
                placeholder="Search formulas by name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 text-slate-800"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
              {filteredTemplates.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectTemplate(item.latex)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    latexInput === item.latex
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">{item.description}</p>
                  </div>
                  <div
                    className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center text-xs text-slate-800 overflow-x-auto font-serif"
                    dangerouslySetInnerHTML={{
                      __html: renderSingleFormula(item.latex, false),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Formulas can also be typed inline in editor as <code className="bg-slate-200 px-1 py-0.5 rounded">$formula$</code> or <code className="bg-slate-200 px-1 py-0.5 rounded">$$block$$</code>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!latexInput.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Insert Formula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
