import React, { useState } from 'react';
import { Article, PrintWatermarkConfig, PrintLayoutConfig } from '../types';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  Layers, 
  Eye, 
  X,
  Settings2
} from 'lucide-react';

interface ExportModalProps {
  article: Article;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ article, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pdf_print' | 'file_exports'>('pdf_print');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Watermark State
  const [watermark, setWatermark] = useState<PrintWatermarkConfig>({
    enabled: true,
    text: 'DRAFT - TESTPRIME',
    pattern: 'diagonal_grid',
    opacity: 0.15,
    fontSize: 28,
    color: '#4f46e5', // Indigo
    rotation: -35,
    fontFamily: 'sans-serif',
    density: 'normal',
  });

  // Print Layout State
  const [layout, setLayout] = useState<PrintLayoutConfig>({
    printFont: 'sans',
    fontSizeScale: 'normal',
    breakBeforeH2: false,
    includeMetaHeader: true,
    includeSeoTags: true,
    includeFooterDisclaimer: true,
    customHeaderNote: 'TestPrime Academic Publishing Portal',
    customFooterNote: 'Confidential & Proprietary Educational Content - TestPrime Portal',
    pageSelection: 'all',
    customPageRange: '',
  });

  // Presets
  const watermarkPresets = [
    { label: 'DRAFT', text: 'DRAFT - NOT FOR DISTRIBUTION', color: '#4f46e5' },
    { label: 'CONFIDENTIAL', text: 'CONFIDENTIAL & PROPRIETARY', color: '#e11d48' },
    { label: 'CLASSROOM COPY', text: 'CLASSROOM STUDY MATERIAL', color: '#0284c7' },
    { label: 'SAMPLE', text: 'SAMPLE PREVIEW COPY', color: '#475569' },
    { label: 'FINAL APPROVED', text: 'APPROVED - TESTPRIME ACADEMIC', color: '#059669' },
  ];

  // Quick Preset Setter
  const applyPreset = (preset: { label: string; text: string; color: string }) => {
    setWatermark((prev) => ({
      ...prev,
      enabled: true,
      text: preset.text,
      color: preset.color,
    }));
  };

  // Perform Print / Save as PDF operation
  const handleTriggerPrint = () => {
    setExportSuccess(null);

    // Remove existing print container if present
    const existing = document.getElementById('printable-article-root');
    if (existing) existing.remove();

    // Create printable container at body root
    const printContainer = document.createElement('div');
    printContainer.id = 'printable-article-root';
    printContainer.className = 'printable-document hidden print:block';

    // Construct Watermark Overlay HTML for Print
    let watermarkHtml = '';
    if (watermark.enabled) {
      if (watermark.pattern === 'diagonal_grid') {
        const tiles = Array(12).fill(watermark.text);
        watermarkHtml = `
          <div class="print-watermark-overlay">
            <div class="watermark-pattern-grid" style="opacity: ${watermark.opacity}; color: ${watermark.color}; font-family: ${watermark.fontFamily};">
              ${tiles
                .map(
                  (t) =>
                    `<div style="font-size: ${watermark.fontSize}px; font-weight: 800; transform: rotate(${watermark.rotation}deg); white-space: nowrap; user-select: none;">${t}</div>`
                )
                .join('')}
            </div>
          </div>
        `;
      } else if (watermark.pattern === 'center_single') {
        watermarkHtml = `
          <div class="print-watermark-overlay">
            <div class="watermark-pattern-single" style="opacity: ${watermark.opacity}; color: ${watermark.color}; font-family: ${watermark.fontFamily};">
              <div style="font-size: ${watermark.fontSize * 1.8}px; font-weight: 900; transform: rotate(${watermark.rotation}deg); text-align: center; line-height: 1.2; user-select: none;">
                ${watermark.text}
              </div>
            </div>
          </div>
        `;
      } else {
        watermarkHtml = `
          <div class="print-watermark-overlay">
            <div class="watermark-pattern-header-footer" style="opacity: ${watermark.opacity}; color: ${watermark.color}; font-family: ${watermark.fontFamily};">
              <div style="font-size: ${watermark.fontSize}px; font-weight: 800; border-bottom: 2px solid currentColor; padding-bottom: 4px; text-transform: uppercase;">
                STAMP: ${watermark.text}
              </div>
              <div style="font-size: ${watermark.fontSize}px; font-weight: 800; border-top: 2px solid currentColor; padding-top: 4px; text-transform: uppercase; text-align: right;">
                STAMP: ${watermark.text}
              </div>
            </div>
          </div>
        `;
      }
    }

    // Article Meta & Header HTML
    const fontClass = layout.printFont === 'serif' ? 'font-serif' : layout.printFont === 'sans' ? 'font-sans' : 'font-mono';
    const breakClass = layout.breakBeforeH2 ? 'break-before-h2' : '';

    const keywordsList = article.seo.keywords?.length 
      ? article.seo.keywords.join(', ')
      : 'Educational Article, Study Notes';

    const tagsList = article.seo.tags?.length
      ? article.seo.tags.join(' · ')
      : article.category;

    printContainer.innerHTML = `
      ${watermarkHtml}
      <div class="${fontClass} ${breakClass}" style="padding: 10px; max-width: 100%;">
        ${
          layout.includeMetaHeader
            ? `
          <div style="border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
            ${layout.customHeaderNote ? `<div style="font-size: 9pt; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px; font-family: monospace;">${layout.customHeaderNote}</div>` : ''}
            <h1 style="font-size: 24pt; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.2;">${article.title}</h1>
            ${article.subtitle ? `<p style="font-size: 13pt; color: #334155; margin: 0 0 12px 0; font-style: italic;">${article.subtitle}</p>` : ''}
            <div style="font-size: 9.5pt; color: #475569; display: flex; gap: 16px; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
              <span><strong>Author:</strong> ${article.author}</span>
              <span><strong>Category:</strong> ${article.category}</span>
              <span><strong>Published:</strong> ${article.createdAt}</span>
              <span><strong>Language:</strong> ${article.language || 'English'}</span>
            </div>
          </div>
        `
            : ''
        }

        <div class="article-print-body" style="font-size: ${layout.fontSizeScale === 'large' ? '12pt' : layout.fontSizeScale === 'compact' ? '10pt' : '11pt'}; line-height: 1.7; color: #0f172a;">
          ${article.contentHtml}
        </div>

        ${
          layout.includeSeoTags
            ? `
          <div style="margin-top: 30px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 9pt; color: #64748b;">
            <p><strong>SEO Keywords:</strong> ${keywordsList}</p>
            <p style="margin-top: 4px;"><strong>Taxonomies:</strong> ${tagsList}</p>
          </div>
        `
            : ''
        }

        ${
          layout.includeFooterDisclaimer
            ? `
          <div style="margin-top: 20px; font-size: 8.5pt; color: #94a3b8; text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 8px;">
            ${layout.customFooterNote || 'Generated via EduBlog Academic Portal · All Rights Reserved'}
          </div>
        `
            : ''
        }
      </div>
    `;

    document.body.appendChild(printContainer);

    // Call window.print()
    setTimeout(() => {
      window.print();
      setExportSuccess('Print dialog launched successfully! Select "Save as PDF" in printer destinations to export as PDF.');
    }, 150);
  };

  // DOCX Download Trigger
  const handleExportDocx = () => {
    const docxHeader = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${article.title}</title></head>
    <body style="font-family: Inter, system-ui, sans-serif; padding: 40px;">
      <h1>${article.title}</h1>
      ${article.subtitle ? `<p><em>${article.subtitle}</em></p>` : ''}
      <p><strong>Author:</strong> ${article.author} | <strong>Category:</strong> ${article.category} | <strong>Date:</strong> ${article.createdAt}</p>
      <hr/>
      ${article.contentHtml}
    </body></html>`;

    const blob = new Blob(['\ufeff', docxHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess('DOCX file created and downloaded to your device!');
  };

  // HTML Download Trigger
  const handleExportHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${article.title}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #0f172a; }
    h1 { color: #4f46e5; font-size: 32px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    .meta { font-family: monospace; font-size: 14px; color: #64748b; margin-bottom: 30px; }
  </style>
</head>
<body>
  <h1>${article.title}</h1>
  ${article.subtitle ? `<h2>${article.subtitle}</h2>` : ''}
  <div class="meta">By <strong>${article.author}</strong> · ${article.category} · ${article.createdAt}</div>
  ${article.contentHtml}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess('HTML file saved successfully!');
  };

  // Markdown Download Trigger
  const handleExportMarkdown = () => {
    const markdownText = `# ${article.title}
${article.subtitle ? `*${article.subtitle}*\n` : ''}
**Author:** ${article.author}  
**Category:** ${article.category}  
**Date:** ${article.createdAt}  

---

${article.contentText}
`;

    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess('Markdown (.md) file saved successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] font-sans">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-slate-100 p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Print & Save-as-PDF Studio
                <span className="text-[10px] uppercase font-mono tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-500/30">
                  With Custom Watermark
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Customize page breaks, typography, and watermark branding for "{article.title}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center text-xs font-sans">
              <button
                onClick={() => setActiveTab('pdf_print')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'pdf_print' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setActiveTab('file_exports')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'file_exports' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                File Downloads
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {exportSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-3 text-xs text-emerald-900 flex items-center justify-between shrink-0 font-sans">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{exportSuccess}</span>
            </div>
            <button onClick={() => setExportSuccess(null)} className="text-emerald-700 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Main Body */}
        {activeTab === 'pdf_print' ? (
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left Column: Watermark & Print Configuration Controls */}
            <div className="lg:col-span-5 p-5 overflow-y-auto space-y-6 bg-slate-50/50 font-sans text-xs">
              
              {/* Primary Print Action Banner */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xs border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Printer className="w-5 h-5 text-indigo-400" />
                    <span className="font-bold text-sm">Ready to Export / Print</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">A4 / Letter</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Clicking below will launch your browser's print dialog. Choose <strong>"Save as PDF"</strong> to download a PDF document with your custom watermark.
                </p>

                {/* Page Selection Controls for Print / Save as PDF */}
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
                    Page Selection / Page Range (PDF Export):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLayout({ ...layout, pageSelection: 'all' })}
                      className={`py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
                        layout.pageSelection === 'all' || !layout.pageSelection
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      All Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayout({ ...layout, pageSelection: 'first_only' })}
                      className={`py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
                        layout.pageSelection === 'first_only'
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Page 1 Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayout({ ...layout, pageSelection: 'custom' })}
                      className={`py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
                        layout.pageSelection === 'custom'
                          ? 'bg-indigo-600 text-white shadow-xs font-bold'
                          : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Custom Range
                    </button>
                  </div>

                  {layout.pageSelection === 'custom' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="e.g. 1, 3-5 or 2"
                        value={layout.customPageRange || ''}
                        onChange={(e) => setLayout({ ...layout, customPageRange: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-xs outline-none focus:border-indigo-400 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Specify page numbers or ranges separated by commas (e.g. "1, 2-3").
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleTriggerPrint}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print or Save as PDF Now</span>
                </button>
              </div>

              {/* Watermark Configuration Section */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Watermark Settings</h4>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watermark.enabled}
                      onChange={(e) => setWatermark({ ...watermark, enabled: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-600 w-4 h-4"
                    />
                    <span className="text-slate-700 font-semibold">Enable Watermark</span>
                  </label>
                </div>

                {watermark.enabled && (
                  <div className="space-y-4">
                    
                    {/* Presets */}
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1.5 font-mono">Quick Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {watermarkPresets.map((p) => (
                          <button
                            key={p.label}
                            onClick={() => applyPreset(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Watermark Text Input */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 font-mono">Watermark Text:</label>
                      <input
                        type="text"
                        value={watermark.text}
                        onChange={(e) => setWatermark({ ...watermark, text: e.target.value })}
                        placeholder="e.g. DRAFT, CONFIDENTIAL, SAMPLE"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Pattern Selector */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 font-mono">Pattern Style:</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => setWatermark({ ...watermark, pattern: 'diagonal_grid' })}
                          className={`py-1.5 px-2 rounded-xl border text-[11px] font-medium transition-all ${
                            watermark.pattern === 'diagonal_grid'
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Diagonal Grid
                        </button>
                        <button
                          onClick={() => setWatermark({ ...watermark, pattern: 'center_single' })}
                          className={`py-1.5 px-2 rounded-xl border text-[11px] font-medium transition-all ${
                            watermark.pattern === 'center_single'
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Center Emblem
                        </button>
                        <button
                          onClick={() => setWatermark({ ...watermark, pattern: 'header_footer' })}
                          className={`py-1.5 px-2 rounded-xl border text-[11px] font-medium transition-all ${
                            watermark.pattern === 'header_footer'
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Header Stamp
                        </button>
                      </div>
                    </div>

                    {/* Opacity & Rotation Sliders */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Opacity:</span>
                          <span className="text-slate-500 font-mono">{Math.round(watermark.opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.5"
                          step="0.01"
                          value={watermark.opacity}
                          onChange={(e) => setWatermark({ ...watermark, opacity: parseFloat(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Rotation:</span>
                          <span className="text-slate-500 font-mono">{watermark.rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="-90"
                          max="90"
                          step="5"
                          value={watermark.rotation}
                          onChange={(e) => setWatermark({ ...watermark, rotation: parseInt(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </div>

                    {/* Font Size & Color */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between font-semibold text-slate-700 mb-1">
                          <span>Font Size:</span>
                          <span className="text-slate-500 font-mono">{watermark.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="64"
                          step="2"
                          value={watermark.fontSize}
                          onChange={(e) => setWatermark({ ...watermark, fontSize: parseInt(e.target.value) })}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <span className="block font-semibold text-slate-700 mb-1 font-mono">Color:</span>
                        <div className="flex items-center gap-1.5">
                          {['#4f46e5', '#e11d48', '#0284c7', '#059669', '#475569', '#0f172a'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setWatermark({ ...watermark, color: c })}
                              style={{ backgroundColor: c }}
                              className={`w-6 h-6 rounded-full border transition-transform ${
                                watermark.color === c ? 'scale-125 border-slate-900 ring-2 ring-indigo-500' : 'border-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Page Layout & Typography Settings */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Settings2 className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Print Page Setup</h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 font-mono">Font Family:</label>
                    <select
                      value={layout.printFont}
                      onChange={(e) => setLayout({ ...layout, printFont: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none"
                    >
                      <option value="sans">Modern Sans (Inter)</option>
                      <option value="mono">Technical Monospace</option>
                      <option value="serif">Classic Serif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 font-mono">Font Scale:</label>
                    <select
                      value={layout.fontSizeScale}
                      onChange={(e) => setLayout({ ...layout, fontSizeScale: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none"
                    >
                      <option value="normal">Normal (11pt)</option>
                      <option value="large">Large / Readable (12pt)</option>
                      <option value="compact">Compact (10pt)</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layout.includeMetaHeader}
                      onChange={(e) => setLayout({ ...layout, includeMetaHeader: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-600 w-4 h-4"
                    />
                    <span className="text-slate-700 font-medium">Include Title & Author Header</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layout.breakBeforeH2}
                      onChange={(e) => setLayout({ ...layout, breakBeforeH2: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-600 w-4 h-4"
                    />
                    <span className="text-slate-700 font-medium">Page break before Heading 2 (H2)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layout.includeSeoTags}
                      onChange={(e) => setLayout({ ...layout, includeSeoTags: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-600 w-4 h-4"
                    />
                    <span className="text-slate-700 font-medium">Include SEO Keywords & Tags Footer</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layout.includeFooterDisclaimer}
                      onChange={(e) => setLayout({ ...layout, includeFooterDisclaimer: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-600 w-4 h-4"
                    />
                    <span className="text-slate-700 font-medium">Include Confidentiality Footer Note</span>
                  </label>
                </div>

                {layout.includeFooterDisclaimer && (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5 font-mono">Footer Note Text:</label>
                    <input
                      type="text"
                      value={layout.customFooterNote || ''}
                      onChange={(e) => setLayout({ ...layout, customFooterNote: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-slate-800 text-[11px]"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Live Printable Sheet Preview */}
            <div className="lg:col-span-7 p-6 overflow-y-auto bg-slate-100 flex flex-col items-center justify-start">
              
              <div className="w-full max-w-xl flex items-center justify-between text-xs text-slate-600 mb-3 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  Live Printable Page Preview (A4 Sheet)
                </span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono">
                  Scale: 100%
                </span>
              </div>

              {/* Realistic A4 Printed Page Container */}
              <div className="w-full max-w-xl bg-white shadow-2xl rounded-sm border border-slate-300 p-8 min-h-[700px] relative overflow-hidden select-none">
                
                {/* Live Watermark Canvas Overlay */}
                {watermark.enabled && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    {watermark.pattern === 'diagonal_grid' && (
                      <div
                        className="watermark-pattern-grid"
                        style={{
                          opacity: watermark.opacity,
                          color: watermark.color,
                          fontFamily: watermark.fontFamily,
                        }}
                      >
                        {Array(12)
                          .fill(watermark.text)
                          .map((t, idx) => (
                            <div
                              key={idx}
                              style={{
                                fontSize: `${watermark.fontSize * 0.75}px`,
                                fontWeight: 800,
                                transform: `rotate(${watermark.rotation}deg)`,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t}
                            </div>
                          ))}
                      </div>
                    )}

                    {watermark.pattern === 'center_single' && (
                      <div
                        className="watermark-pattern-single"
                        style={{
                          opacity: watermark.opacity,
                          color: watermark.color,
                          fontFamily: watermark.fontFamily,
                        }}
                      >
                        <div
                          style={{
                            fontSize: `${watermark.fontSize * 1.3}px`,
                            fontWeight: 900,
                            transform: `rotate(${watermark.rotation}deg)`,
                            textAlign: 'center',
                            lineHeight: 1.2,
                          }}
                        >
                          {watermark.text}
                        </div>
                      </div>
                    )}

                    {watermark.pattern === 'header_footer' && (
                      <div
                        className="watermark-pattern-header-footer"
                        style={{
                          opacity: watermark.opacity,
                          color: watermark.color,
                          fontFamily: watermark.fontFamily,
                        }}
                      >
                        <div style={{ fontSize: `${watermark.fontSize * 0.8}px`, fontWeight: 800, borderBottom: '2px solid currentColor', paddingBottom: '2px', textTransform: 'uppercase' }}>
                          STAMP: {watermark.text}
                        </div>
                        <div style={{ fontSize: `${watermark.fontSize * 0.8}px`, fontWeight: 800, borderTop: '2px solid currentColor', paddingTop: '2px', textTransform: 'uppercase', textAlign: 'right' }}>
                          STAMP: {watermark.text}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Document Content */}
                <div
                  className={`relative z-10 ${
                    layout.printFont === 'serif' ? 'font-serif' : layout.printFont === 'sans' ? 'font-sans' : 'font-mono'
                  }`}
                >
                  {/* Title & Metadata Header */}
                  {layout.includeMetaHeader && (
                    <div className="border-b-2 border-slate-900 pb-3 mb-5">
                      {layout.customHeaderNote && (
                        <div className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-semibold mb-1">
                          {layout.customHeaderNote}
                        </div>
                      )}
                      <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">
                        {article.title}
                      </h1>
                      {article.subtitle && (
                        <p className="text-xs text-slate-600 italic mb-2">{article.subtitle}</p>
                      )}
                      <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 pt-2 font-mono">
                        <span><strong>Author:</strong> {article.author}</span>
                        <span><strong>Category:</strong> {article.category}</span>
                        <span><strong>Date:</strong> {article.createdAt}</span>
                      </div>
                    </div>
                  )}

                  {/* Body HTML */}
                  <div
                    className={`prose prose-slate max-w-none leading-relaxed text-slate-900 ${
                      layout.fontSizeScale === 'large'
                        ? 'text-sm'
                        : layout.fontSizeScale === 'compact'
                        ? 'text-[11px]'
                        : 'text-xs'
                    }`}
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                  />

                  {/* SEO & Tags Footer */}
                  {layout.includeSeoTags && (
                    <div className="mt-8 pt-3 border-t border-slate-300 text-[10px] text-slate-500 font-mono">
                      <p>
                        <strong>SEO Keywords:</strong>{' '}
                        {article.seo.keywords?.length ? article.seo.keywords.join(', ') : 'Educational Article, Study Notes'}
                      </p>
                      <p className="mt-0.5">
                        <strong>Taxonomies:</strong> {article.category}
                      </p>
                    </div>
                  )}

                  {/* Footer Disclaimer */}
                  {layout.includeFooterDisclaimer && (
                    <div className="mt-6 text-[9px] text-slate-400 text-center border-t border-dashed border-slate-200 pt-2 font-mono">
                      {layout.customFooterNote || 'Generated via EduBlog Academic Portal · All Rights Reserved'}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* File Downloads Tab */
          <div className="p-8 max-w-2xl mx-auto w-full space-y-4 font-sans">
            <h4 className="text-sm font-bold text-slate-900 mb-2 font-mono">Select Digital Document Export Format:</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* DOCX */}
              <button
                onClick={handleExportDocx}
                className="p-5 border border-slate-200 hover:border-indigo-500 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 flex flex-col items-center text-center gap-3 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform font-mono">
                  DOCX
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Microsoft Word</h5>
                  <p className="text-[11px] text-slate-500 mt-1">Editable Word format (.docx) for offline editing.</p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>

              {/* HTML */}
              <button
                onClick={handleExportHtml}
                className="p-5 border border-slate-200 hover:border-emerald-500 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 flex flex-col items-center text-center gap-3 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform font-mono">
                  HTML
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Web Document</h5>
                  <p className="text-[11px] text-slate-500 mt-1">Standalone web page (.html) with CSS formatting.</p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              {/* Markdown */}
              <button
                onClick={handleExportMarkdown}
                className="p-5 border border-slate-200 hover:border-indigo-500 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 flex flex-col items-center text-center gap-3 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform font-mono">
                  MD
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Markdown Note</h5>
                  <p className="text-[11px] text-slate-500 mt-1">Clean plain markdown (.md) for note takers.</p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0 font-sans">
          <span className="font-mono">EduBlog Print Engine v2.4 · Real-time CSS Vector Watermarks</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Studio
          </button>
        </div>

      </div>
    </div>
  );
};
