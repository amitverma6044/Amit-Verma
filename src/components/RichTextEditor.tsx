import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  FileCode,
  Eye,
  PlusCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Trash2,
  Maximize2,
  Minimize2,
  Check,
  FolderOpen,
  Type,
  Maximize,
  Sliders,
  Palette,
  Highlighter,
  Indent,
  Outdent,
  CaseSensitive,
  Sparkles,
  Subscript as SubIcon,
  Superscript as SupIcon,
  RotateCcw
} from 'lucide-react';
import { RelatedCourse, Quiz } from '../types';
import { AssetManagerModal } from './AssetManagerModal';
import { ImageEditorModal, ImageEditingConfig } from './ImageEditorModal';
import { ColorfulSectionModal } from './ColorfulSectionModal';
import { MathFormulaModal } from './MathFormulaModal';
import { getLucidThemeById } from '../utils/lucidThemes';
import { Sigma } from 'lucide-react';

const FONT_FAMILIES = [
  { name: 'Inter (Clean Modern Sans)', value: 'Inter, sans-serif' },
  { name: 'Plus Jakarta Sans (SaaS Sans)', value: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Outfit (Modern Geometry)', value: "'Outfit', sans-serif" },
  { name: 'Poppins (Modern Clean)', value: "'Poppins', sans-serif" },
  { name: 'Montserrat (Bold EdTech)', value: "'Montserrat', sans-serif" },
  { name: 'Space Grotesk (Tech Monospaced Sans)', value: "'Space Grotesk', sans-serif" },
  { name: 'Urbanist (Minimalist Sans)', value: "'Urbanist', sans-serif" },
  { name: 'Roboto (EdTech Sans)', value: 'Roboto, sans-serif' },
  { name: 'Playfair Display (Luxury Serif)', value: "'Playfair Display', serif" },
  { name: 'Merriweather (Editorial Serif)', value: 'Merriweather, serif' },
  { name: 'Lora (Warm Serif)', value: "'Lora', serif" },
  { name: 'Cormorant Garamond (Classical Academic)', value: "'Cormorant Garamond', serif" },
  { name: 'Noto Sans Devanagari (हिंदी Modern Sans)', value: "'Noto Sans Devanagari', sans-serif" },
  { name: 'Noto Serif Devanagari (हिंदी Academic Serif)', value: "'Noto Serif Devanagari', serif" },
  { name: 'Mukta (हिंदी Clean Sans)', value: "'Mukta', sans-serif" },
  { name: 'JetBrains Mono (Code & Stats)', value: "'JetBrains Mono', monospace" },
  { name: 'Fira Code (Technical Code)', value: "'Fira Code', monospace" },
  { name: 'Oswald (Display Headlines)', value: "'Oswald', sans-serif" },
];

const FONT_SIZES = [
  { name: '12px (Small Note)', value: '12px' },
  { name: '14px (Compact Body)', value: '14px' },
  { name: '16px (Standard Body)', value: '16px' },
  { name: '18px (Lead Paragraph)', value: '18px' },
  { name: '20px (Subheading)', value: '20px' },
  { name: '24px (Section Heading)', value: '24px' },
  { name: '28px (Chapter Title)', value: '28px' },
  { name: '32px (Display Headline)', value: '32px' },
];

const LINE_HEIGHTS = [
  { name: 'Line: 1.2 (Compact)', value: '1.2' },
  { name: 'Line: 1.5 (Academic)', value: '1.5' },
  { name: 'Line: 1.8 (Spaced)', value: '1.8' },
  { name: 'Line: 2.0 (Double)', value: '2.0' },
];

const LETTER_SPACINGS = [
  { name: 'Track: Normal', value: 'normal' },
  { name: 'Track: Tight', value: '-0.5px' },
  { name: 'Track: Wide', value: '0.05em' },
  { name: 'Track: Widest', value: '0.1em' },
];

const TEXT_COLORS = [
  { name: 'Slate Dark (Default)', value: '#0f172a' },
  { name: 'Indigo Accent', value: '#4f46e5' },
  { name: 'Emerald Green', value: '#059669' },
  { name: 'Amber Gold', value: '#d97706' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Violet Purple', value: '#7c3aed' },
];

const HIGHLIGHT_COLORS = [
  { name: 'No Marker', value: 'transparent' },
  { name: 'Yellow Highlighter', value: '#fef08a' },
  { name: 'Mint Green', value: '#a7f3d0' },
  { name: 'Soft Coral Pink', value: '#fecdd3' },
  { name: 'Sky Blue Marker', value: '#bae6fd' },
];

interface RichTextEditorProps {
  contentHtml: string;
  onChange: (html: string, text: string) => void;
  availableCourses: RelatedCourse[];
  availableQuizzes: Quiz[];
  onToggleFocusReader?: () => void;
  isFocusReader?: boolean;
  showParagraphMetadata?: boolean;
  lucidThemeId?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  contentHtml,
  onChange,
  availableCourses,
  availableQuizzes,
  onToggleFocusReader,
  isFocusReader,
  showParagraphMetadata = false,
  lucidThemeId = 'indigo',
}) => {
  const activeTheme = getLucidThemeById(lucidThemeId);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [viewMode, setViewMode] = useState<'wysiwyg' | 'html' | 'preview'>('wysiwyg');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlSource, setHtmlSource] = useState(contentHtml);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageEditorModal, setShowImageEditorModal] = useState(false);
  const [editingImageConfig, setEditingImageConfig] = useState<Partial<ImageEditingConfig>>({});

  const [showAssetManagerModal, setShowAssetManagerModal] = useState(false);
  const [showColorfulSectionModal, setShowColorfulSectionModal] = useState(false);
  const [showMathFormulaModal, setShowMathFormulaModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [selectedFontFamily, setSelectedFontFamily] = useState('Georgia, serif');
  const [selectedFontSize, setSelectedFontSize] = useState('18px');
  const [selectedLineHeight, setSelectedLineHeight] = useState('1.8');
  const [selectedLetterSpacing, setSelectedLetterSpacing] = useState('normal');

  // Callback ref guarantees innerHTML is set immediately when DOM node mounts
  const setEditorRef = (node: HTMLDivElement | null) => {
    (editorRef as any).current = node;
    if (node && (!node.innerHTML || node.innerHTML === '<br>')) {
      node.innerHTML = contentHtml || '<p>Start typing your article content here...</p>';
    }
  };

  // Sync content when external prop changes (e.g., initial article load or switching articles)
  useEffect(() => {
    if (editorRef.current && viewMode === 'wysiwyg') {
      if (editorRef.current.innerHTML !== contentHtml) {
        editorRef.current.innerHTML = contentHtml || '<p>Start typing your article content here...</p>';
      }
    }
    setHtmlSource(contentHtml);
  }, [contentHtml, viewMode]);

  // Double-click on images in editor to open Image Editor Studio
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        const figure = img.closest('figure');
        const figcaption = figure?.querySelector('figcaption');
        
        setEditingImageConfig({
          src: img.src,
          alt: img.alt || '',
          caption: figcaption ? figcaption.innerText.replace(/^Fig:\s*/i, '') : '',
          alignment: (figure?.getAttribute('data-align') as any) || 'center',
          widthPreset: (figure?.getAttribute('data-width') as any) || '100',
        });
        setShowImageEditorModal(true);
      }
    };

    el.addEventListener('dblclick', handleDblClick);
    return () => {
      el.removeEventListener('dblclick', handleDblClick);
    };
  }, [viewMode]);

  // Execute DOM execCommand formatting
  const executeCommand = (command: string, value: string = '') => {
    if (viewMode !== 'wysiwyg') return;
    document.execCommand(command, false, value);
    handleEditorInput();
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    setSelectedFontFamily(fontFamily);
    executeCommand('fontName', fontFamily);
  };

  const handleFontSizeChange = (sizePx: string) => {
    setSelectedFontSize(sizePx);
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (editorRef.current) {
        editorRef.current.style.fontSize = sizePx;
      }
      return;
    }
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = sizePx;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    } catch (e) {
      executeCommand('fontSize', '4');
    }
    handleEditorInput();
  };

  const handleLineHeightChange = (lh: string) => {
    setSelectedLineHeight(lh);
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.style.lineHeight = lh;
      }
      return;
    }
    
    // Apply line-height to target block or wrapped selection
    let node: Node | null = selection.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE && ['P', 'DIV', 'H1', 'H2', 'H3', 'BLOCKQUOTE', 'LI'].includes((node as HTMLElement).tagName)) {
        (node as HTMLElement).style.lineHeight = lh;
        handleEditorInput();
        return;
      }
      node = node.parentNode;
    }

    if (editorRef.current) {
      editorRef.current.style.lineHeight = lh;
    }
    handleEditorInput();
  };

  const handleLetterSpacingChange = (spacing: string) => {
    setSelectedLetterSpacing(spacing);
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (editorRef.current) {
        editorRef.current.style.letterSpacing = spacing;
      }
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.letterSpacing = spacing;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
    } catch (e) {
      // Fallback
    }
    handleEditorInput();
  };

  const handleTextTransform = (transform: 'uppercase' | 'lowercase' | 'capitalize') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    let convertedText = selectedText;
    if (transform === 'uppercase') convertedText = selectedText.toUpperCase();
    else if (transform === 'lowercase') convertedText = selectedText.toLowerCase();
    else if (transform === 'capitalize') {
      convertedText = selectedText.replace(/\b\w/g, l => l.toUpperCase());
    }

    const span = document.createElement('span');
    span.innerText = convertedText;
    range.deleteContents();
    range.insertNode(span);
    handleEditorInput();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || '';
      setHtmlSource(html);
      onChange(html, text);
    }
  };

  const handleHtmlSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlSource(newHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = newHtml;
    }
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newHtml;
    onChange(newHtml, tempDiv.innerText || '');
  };

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setEditingImageConfig({
          src: base64,
          alt: file.name,
          caption: '',
          alignment: 'center',
          widthPreset: '100',
        });
        setShowImageModal(false);
        setShowImageEditorModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageHtml = (url: string, altText: string) => {
    setEditingImageConfig({
      src: url,
      alt: altText,
      caption: imageCaption,
      alignment: 'center',
      widthPreset: '100',
    });
    setShowImageModal(false);
    setShowImageEditorModal(true);
  };

  // Insert Callout Box
  const insertCalloutBox = (type: 'takeaway' | 'warning' | 'info') => {
    let boxHtml = '';
    if (type === 'takeaway') {
      boxHtml = `
        <div class="callout-box bg-amber-50/80 border-l-4 border-amber-600 p-4 my-6 rounded-r-xl shadow-xs">
          <h4 class="font-bold text-amber-900 text-base mb-1">📌 Key Takeaway for Students</h4>
          <p class="text-amber-900/90 text-sm leading-relaxed">Enter your important concept or exam summary point here...</p>
        </div>
        <p><br></p>
      `;
    } else if (type === 'info') {
      boxHtml = `
        <div class="callout-box bg-blue-50/80 border-l-4 border-blue-600 p-4 my-6 rounded-r-xl shadow-xs">
          <h4 class="font-bold text-blue-900 text-base mb-1">💡 Historical / Theoretical Context</h4>
          <p class="text-blue-900/90 text-sm leading-relaxed">Add contextual notes, reference books, or case studies...</p>
        </div>
        <p><br></p>
      `;
    }
    executeCommand('insertHTML', boxHtml);
  };

  // Insert Integrated Course / Test Series Card directly into text
  const insertCourseBanner = (course: RelatedCourse) => {
    const courseHtml = `
      <div class="embedded-course-card my-6 p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md font-sans" contenteditable="false">
        <div class="flex items-center gap-3.5">
          <img src="${course.thumbnail}" alt="${course.title}" class="w-16 h-16 rounded-xl object-cover shrink-0" />
          <div>
            <span class="text-[10px] uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-mono font-bold">Recommended Test Series</span>
            <h4 class="text-base font-bold text-white mt-1">${course.title}</h4>
            <p class="text-xs text-slate-300">${course.category} • ⭐ ${course.rating} (${course.studentsCount.toLocaleString()} Students)</p>
          </div>
        </div>
        <a href="${course.linkUrl}" target="_blank" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-xs">
          Enroll / Attempt Now (${course.price})
        </a>
      </div>
      <p><br></p>
    `;
    executeCommand('insertHTML', courseHtml);
    setShowCoursePicker(false);
  };

  // Calculate live text analytics
  const rawText = editorRef.current?.innerText || '';
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const charCount = rawText.length;
  const paragraphCount = rawText.split(/\n+/).filter(p => p.trim().length > 0).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div 
      className={`flex flex-col border-2 rounded-2xl shadow-xs transition-all ${activeTheme.borderClass} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full'
      }`}
      style={{
        '--editor-bg': activeTheme.inlineStyle.backgroundColor,
        '--editor-border': activeTheme.inlineStyle.borderColor,
        '--editor-text': activeTheme.inlineStyle.color,
        '--editor-accent': activeTheme.inlineStyle.accentColor,
      } as React.CSSProperties}
    >
      
      {/* Editor Main Toolbar (Wrapped Multi-Row Vertical Arrangement, Zero Horizontal Scroll) */}
      <div className="flex flex-col bg-slate-100 border-b border-slate-200 rounded-t-xl shrink-0 flex-shrink-0 p-2.5 gap-2.5 font-sans min-w-0">
        
        {/* Top Control Bar: View Switcher & Primary Action Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
          
          {/* View Mode Segmented Controls */}
          <div className="flex items-center bg-slate-200 p-0.5 rounded-lg shrink-0 flex-shrink-0">
            <button
              onClick={() => setViewMode('wysiwyg')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shrink-0 flex-shrink-0 whitespace-nowrap ${
                viewMode === 'wysiwyg' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => setViewMode('html')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shrink-0 flex-shrink-0 whitespace-nowrap ${
                viewMode === 'html' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HTML Code
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shrink-0 flex-shrink-0 whitespace-nowrap ${
                viewMode === 'preview' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reader View
            </button>
          </div>

          {/* Quick Media & Asset Actions */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <button
              onClick={() => setShowMathFormulaModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition-all shadow-xs shrink-0 flex-shrink-0 whitespace-nowrap"
              title="Insert LaTeX Math / Science Formula with KaTeX Rendering"
            >
              <Sigma className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
              <span>+ Formula ($f(x)$)</span>
            </button>

            <button
              onClick={() => {
                setEditingImageConfig({ src: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80', caption: 'Sample Academic Illustration' });
                setShowImageEditorModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-md text-xs font-semibold transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
              title="Open Image & Diagram Studio for custom filters, cropping, shadows, and borders"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600 shrink-0 flex-shrink-0" />
              <span>Image Studio</span>
            </button>

            <button
              onClick={() => setShowAssetManagerModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 rounded-md text-xs font-semibold transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
              title="Browse previously uploaded diagrams from Asset Manager"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0 flex-shrink-0" />
              <span>Asset Library</span>
            </button>

            <button
              onClick={() => setShowImageModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-xs font-medium transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
              title="Upload or Embed Image"
            >
              <ImageIcon className="w-3.5 h-3.5 text-slate-600 shrink-0 flex-shrink-0" />
              <span>Add Image</span>
            </button>

            {onToggleFocusReader && (
              <button
                onClick={onToggleFocusReader}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 flex-shrink-0 whitespace-nowrap ${
                  isFocusReader
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
                title="Toggle Focus Reader Mode (Distraction-free editing environment)"
              >
                <Eye className="w-3.5 h-3.5 shrink-0 flex-shrink-0" />
                <span className="hidden sm:inline">Focus Reader</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-md transition-colors shrink-0 flex-shrink-0"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Focus Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Formatting Toolbar (Active when in WYSIWYG mode — Organized Multi-Row Vertical Wrap) */}
        {viewMode === 'wysiwyg' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 pb-1 border-t border-slate-200 min-w-0">
            
            {/* Font Family & Size Dropdowns */}
            <div className="flex items-center border-r border-slate-300 pr-2 gap-1 shrink-0 flex-shrink-0">
              <div className="flex items-center gap-1 shrink-0 flex-shrink-0">
                <Type className="w-3.5 h-3.5 text-slate-500 shrink-0 flex-shrink-0" />
                <select
                  value={selectedFontFamily}
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 max-w-[130px] truncate shrink-0 flex-shrink-0"
                  title="Select Academic Font Family"
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedFontSize}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 shrink-0 flex-shrink-0"
                title="Select Font Size"
              >
                {FONT_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Line Height & Letter Spacing Dropdowns */}
            <div className="flex items-center border-r border-slate-300 pr-2 gap-1 shrink-0 flex-shrink-0">
              <select
                value={selectedLineHeight}
                onChange={(e) => handleLineHeightChange(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 shrink-0 flex-shrink-0"
                title="Line Spacing Height"
              >
                {LINE_HEIGHTS.map((lh) => (
                  <option key={lh.value} value={lh.value}>
                    {lh.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedLetterSpacing}
                onChange={(e) => handleLetterSpacingChange(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800 outline-none focus:border-indigo-600 shrink-0 flex-shrink-0"
                title="Letter Spacing / Tracking"
              >
                {LETTER_SPACINGS.map((ls) => (
                  <option key={ls.value} value={ls.value}>
                    {ls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Headings */}
            <div className="flex items-center border-r border-slate-300 pr-2 gap-0.5 shrink-0 flex-shrink-0">
              <button
                onClick={() => executeCommand('formatBlock', '<h1>')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('formatBlock', '<h2>')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('formatBlock', '<h3>')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            {/* Inline Formatting */}
            <div className="flex items-center border-r border-slate-300 pr-2 gap-0.5 shrink-0 flex-shrink-0">
              <button
                onClick={() => executeCommand('bold')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 font-bold transition-colors shrink-0 flex-shrink-0"
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('italic')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 italic transition-colors shrink-0 flex-shrink-0"
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('underline')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 underline transition-colors shrink-0 flex-shrink-0"
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('strikeThrough')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 line-through transition-colors shrink-0 flex-shrink-0"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('subscript')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors font-mono text-xs shrink-0 flex-shrink-0"
                title="Subscript (e.g. H₂O)"
              >
                <SubIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('superscript')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors font-mono text-xs shrink-0 flex-shrink-0"
                title="Superscript (e.g. x²)"
              >
                <SupIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Text Color & Highlight Marker Controls */}
            <div className="flex items-center border-r border-slate-300 pr-2 gap-1 shrink-0 flex-shrink-0">
              <div className="flex items-center gap-1 shrink-0 flex-shrink-0" title="Font Text Color">
                <Palette className="w-3.5 h-3.5 text-slate-600 shrink-0 flex-shrink-0" />
                <select
                  onChange={(e) => executeCommand('foreColor', e.target.value)}
                  className="px-1.5 py-1 bg-white border border-slate-300 rounded-md text-xs outline-none focus:border-indigo-600 shrink-0 flex-shrink-0"
                >
                  {TEXT_COLORS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 shrink-0 flex-shrink-0" title="Text Highlight Marker">
                <Highlighter className="w-3.5 h-3.5 text-amber-500 shrink-0 flex-shrink-0" />
                <select
                  onChange={(e) => executeCommand('hiliteColor', e.target.value)}
                  className="px-1.5 py-1 bg-white border border-slate-300 rounded-md text-xs outline-none focus:border-indigo-600 shrink-0 flex-shrink-0"
                >
                  {HIGHLIGHT_COLORS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Paragraph Indent & Text Case Transformations */}
            <div className="flex items-center border-r border-slate-300 pr-2 gap-0.5 shrink-0 flex-shrink-0">
              <button
                onClick={() => executeCommand('indent')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Increase Paragraph Indent"
              >
                <Indent className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('outdent')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Decrease Paragraph Indent"
              >
                <Outdent className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-0.5 ml-1 shrink-0 flex-shrink-0">
                <button
                  onClick={() => handleTextTransform('uppercase')}
                  className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-[11px] font-bold text-slate-700 transition-colors border border-slate-300 bg-white shrink-0 flex-shrink-0"
                  title="Transform Selected Text to UPPERCASE"
                >
                  AA
                </button>
                <button
                  onClick={() => handleTextTransform('lowercase')}
                  className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-[11px] font-medium text-slate-700 transition-colors border border-slate-300 bg-white shrink-0 flex-shrink-0"
                  title="Transform Selected Text to lowercase"
                >
                  aa
                </button>
                <button
                  onClick={() => handleTextTransform('capitalize')}
                  className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-[11px] font-semibold text-slate-700 transition-colors border border-slate-300 bg-white shrink-0 flex-shrink-0"
                  title="Transform Selected Text to Title Case"
                >
                  Aa
                </button>
              </div>
            </div>

            {/* Lists, Alignment & Callouts */}
            <div className="flex items-center gap-0.5 shrink-0 flex-shrink-0">
              <button
                onClick={() => executeCommand('justifyLeft')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyCenter')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('justifyRight')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors ml-1 shrink-0 flex-shrink-0"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => executeCommand('insertOrderedList')}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-700 transition-colors shrink-0 flex-shrink-0"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <button
                onClick={() => executeCommand('removeFormat')}
                className="p-1.5 hover:bg-rose-100 rounded-md text-rose-700 transition-colors ml-1 shrink-0 flex-shrink-0"
                title="Clear Formatting for Selected Text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => insertCalloutBox('takeaway')}
                className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md text-[11px] font-semibold transition-colors ml-1 shrink-0 flex-shrink-0 whitespace-nowrap"
                title="Insert Key Takeaway Callout Box"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 flex-shrink-0" />
                <span>Callout Box</span>
              </button>

              <button
                onClick={() => setShowColorfulSectionModal(true)}
                className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold shadow-2xs transition-all hover:scale-105 shrink-0 flex-shrink-0 whitespace-nowrap"
                title="Insert Colorful Lucid Light Section (Recommended Articles Grid, Educator Card, Theory Notes with Hover Effects)"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200 shrink-0 flex-shrink-0" />
                <span>+ Colorful Section</span>
              </button>

              <button
                onClick={() => setShowCoursePicker(true)}
                className="flex items-center gap-1 px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-md text-[11px] font-semibold transition-colors shrink-0 flex-shrink-0 whitespace-nowrap"
                title="Insert Test Series Banner"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0 flex-shrink-0" />
                <span>Course Banner</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Main Large Article Box (Editing Canvas) */}
      <div className="relative flex-1 bg-white overflow-y-auto min-w-0">
        {viewMode === 'wysiwyg' && (
          <div
            ref={setEditorRef}
            contentEditable
            onInput={handleEditorInput}
            className="w-full min-h-[550px] p-6 lg:p-8 outline-none prose prose-slate max-w-none focus:prose-slate font-sans text-base lg:text-lg leading-relaxed text-slate-900 selection:bg-indigo-100 min-w-0 break-words"
          />
        )}

        {viewMode === 'html' && (
          <textarea
            value={htmlSource}
            onChange={handleHtmlSourceChange}
            className="w-full min-h-[550px] p-6 font-mono text-sm bg-slate-900 text-slate-100 outline-none resize-none leading-normal min-w-0"
          />
        )}

        {viewMode === 'preview' && (
          <div 
            className="w-full min-h-[550px] p-6 lg:p-10 prose prose-slate max-w-4xl mx-auto font-sans text-base lg:text-lg leading-relaxed bg-slate-50/50 min-w-0 break-words"
            dangerouslySetInnerHTML={{ __html: htmlSource || '<p class="text-slate-400 italic">No content written yet.</p>' }}
          />
        )}
      </div>

      {/* Bottom Article Stats & Live Paragraph Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 border-t border-slate-200 rounded-b-xl text-xs text-slate-500 font-sans font-medium min-w-0">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <span className="min-w-0">Words: <strong className="text-slate-800">{wordCount}</strong></span>
          <span className="min-w-0">Characters: <strong className="text-slate-800">{charCount}</strong></span>
          <span className="min-w-0">Paragraphs: <strong className="text-slate-800">{paragraphCount}</strong></span>
          <span className="min-w-0">Reading Time: <strong className="text-slate-800">~{readTime} min</strong></span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 flex-shrink-0" />
          <span className="min-w-0 break-words">Double-click any image to open Image Studio • High Contrast Academic Editor</span>
        </div>
      </div>

      {/* Image Upload / Basic Embed Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">Insert Image</h3>
              <button onClick={() => setShowImageModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            {/* File Upload Button */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-stone-700 mb-1">Upload Local Image File</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#9A3412] file:text-white hover:file:bg-[#782508]"
              />
            </div>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-stone-200"></div>
              <span className="shrink-0 mx-3 text-xs text-stone-400 uppercase">Or Image URL</span>
              <div className="grow border-t border-stone-200"></div>
            </div>

            {/* URL Input */}
            <div className="space-y-3 mt-2">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Image Web Address (URL)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs outline-none focus:border-[#9A3412]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Image Caption / Alt Text</label>
                <input
                  type="text"
                  placeholder="e.g. Fig 1: Diagram of Fundamental Rights"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs outline-none focus:border-[#9A3412]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  disabled={!imageUrl.trim()}
                  onClick={() => insertImageHtml(imageUrl, imageCaption)}
                  className="px-4 py-2 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#782508] rounded-lg disabled:opacity-50"
                >
                  Customize in Image Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Image Studio Modal */}
      <ImageEditorModal
        isOpen={showImageEditorModal}
        initialConfig={editingImageConfig}
        onClose={() => setShowImageEditorModal(false)}
        onApply={(html) => {
          if (editorRef.current) {
            editorRef.current.focus();
            executeCommand('insertHTML', html);
          }
        }}
      />

      {/* Course Integration Picker Modal */}
      {showCoursePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">Attach Test Series / Course</h3>
                <p className="text-xs text-stone-500">Pick a course to embed directly inside the article body for readers.</p>
              </div>
              <button onClick={() => setShowCoursePicker(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {availableCourses.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => insertCourseBanner(course)}
                  className="p-3 border border-stone-200 rounded-xl hover:border-[#9A3412] cursor-pointer bg-stone-50 hover:bg-amber-50/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div>
                      <h4 className="text-sm font-serif font-bold text-stone-900">{course.title}</h4>
                      <p className="text-xs text-stone-500">{course.category} • {course.price}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-[#9A3412] text-white text-xs font-semibold rounded-lg shrink-0">
                    Insert
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Asset Manager Modal */}
      <AssetManagerModal
        isOpen={showAssetManagerModal}
        onClose={() => setShowAssetManagerModal(false)}
        onSelectImage={(url, title) => {
          setEditingImageConfig({
            src: url,
            alt: title || 'Asset Manager Diagram',
            caption: title || '',
            alignment: 'center',
            widthPreset: '100',
          });
          setShowImageEditorModal(true);
        }}
      />

      {/* Colorful Lucid Section Modal */}
      <ColorfulSectionModal
        isOpen={showColorfulSectionModal}
        onClose={() => setShowColorfulSectionModal(false)}
        onInsertSection={(html) => {
          if (editorRef.current) {
            editorRef.current.focus();
            executeCommand('insertHTML', html);
          }
        }}
      />

      {/* Math & Science Formula Modal */}
      <MathFormulaModal
        isOpen={showMathFormulaModal}
        onClose={() => setShowMathFormulaModal(false)}
        onInsert={(renderedHtml) => {
          if (editorRef.current) {
            editorRef.current.focus();
            executeCommand('insertHTML', renderedHtml);
          }
        }}
      />

    </div>
  );
};
